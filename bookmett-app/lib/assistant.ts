import type { Store, Service } from "./types";
import { slotsFor, DAYS, label12 } from "./availability";
import { money } from "./content";

export interface ChatState {
  serviceId?: string | null;
  day?: string | null;
  time?: string | null;
  stage?: "idle" | "needtime" | "confirm";
}

export interface Intent {
  serviceId?: string | null;
  day?: string | null;
  wantsTimes?: boolean;
  wantsCancel?: boolean;
  affirm?: boolean;
}

export interface AssistantResult {
  message: string;
  state: ChatState;
  /** Set when the assistant has enough info and the user confirmed. */
  book?: { serviceId: string; day: string; time: string };
  engine: "rules" | "llm";
}

/* ------------ intent parsing ------------ */

export function parseIntentRules(text: string, services: Service[]): Intent {
  const t = text.toLowerCase();
  let serviceId: string | null = null;
  if (/\b(hair|cut|trim up|haircut)\b/.test(t)) serviceId = "haircut";
  else if (/\b(colou?r|dye|highlight|treatment)\b/.test(t)) serviceId = "color";
  else if (/\bbeard\b/.test(t)) serviceId = "beard";
  else if (/\b(facial|face|skin)\b/.test(t)) serviceId = "facial";
  else {
    const hit = services.find((s) => t.includes(s.name.toLowerCase().split(" ")[0]));
    if (hit) serviceId = hit.id;
  }
  const day = /tomorrow/.test(t) ? "Tomorrow" : /today|now/.test(t) ? "Today" : null;
  return {
    serviceId,
    day,
    wantsTimes: /\b(free|available|open|what times?|when)\b/.test(t),
    wantsCancel: /\b(cancel|reschedule)\b/.test(t),
    affirm: /\b(yes|yep|yeah|confirm|ok|okay|sure|book it|please do|go ahead)\b/.test(t),
  };
}

/** Optional LLM-backed parser (Anthropic). Returns null on any failure so the caller falls back to rules. */
export async function parseIntentLLM(text: string, services: Service[]): Promise<Intent | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
  const sys =
    "You extract booking intent for a salon assistant. " +
    "Return ONLY compact JSON: {serviceId, day, wantsTimes, wantsCancel, affirm}. " +
    `serviceId is one of ${services.map((s) => s.id).join("|")} or null. ` +
    "day is 'Today', 'Tomorrow', or null. Booleans default false.";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 200,
        system: sys,
        messages: [{ role: "user", content: text }],
      }),
      // Never let a slow/blocked network hang the request.
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    const raw = data?.content?.[0]?.text ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    return {
      serviceId: parsed.serviceId ?? null,
      day: parsed.day ?? null,
      wantsTimes: !!parsed.wantsTimes,
      wantsCancel: !!parsed.wantsCancel,
      affirm: !!parsed.affirm,
    };
  } catch {
    return null;
  }
}

/* ------------ deterministic executor ------------ */

function firstOpen(store: Store, svc: Service, day: string): string | null {
  const s = slotsFor(store, svc, day).find((x) => x.available);
  return s ? s.time : null;
}

export function execute(store: Store, intent: Intent, prev: ChatState): AssistantResult {
  const state: ChatState = { ...prev };
  const svc = (id?: string | null) => store.services.find((s) => s.id === id) || null;

  if (intent.wantsCancel) {
    return {
      engine: "rules",
      state,
      message:
        "No problem — I can cancel or reschedule any booking. Which appointment? " +
        "(In this demo your confirmed bookings show on the dashboard.)",
    };
  }

  // carry forward a previously chosen service
  const service = svc(intent.serviceId) || svc(state.serviceId);
  if (service) state.serviceId = service.id;
  if (intent.day) state.day = intent.day;

  if (intent.wantsTimes) {
    const day = state.day || "Today";
    const openList = service
      ? slotsFor(store, service, day).filter((s) => s.available).slice(0, 4)
      : slotsFor(store, store.services[0], day).filter((s) => s.available).slice(0, 4);
    return {
      engine: "rules",
      state,
      message: `Here's what's open ${day}: <b>${openList.map((s) => s.label).join(", ")}</b>. Want me to grab one?`,
    };
  }

  // affirm → book if we have service + day + time
  if (intent.affirm && state.stage === "confirm" && state.serviceId && state.day && state.time) {
    return {
      engine: "rules",
      state: { ...state, stage: "idle" },
      message: "",
      book: { serviceId: state.serviceId, day: state.day, time: state.time },
    };
  }

  if (service) {
    const day = state.day || "Tomorrow";
    const time = firstOpen(store, service, day);
    if (!time) {
      return { engine: "rules", state, message: `We're fully booked ${day} for ${service.name}. Want to try another day?` };
    }
    state.day = day;
    state.time = time;
    state.stage = "confirm";
    return {
      engine: "rules",
      state,
      message:
        `Perfect — <b>${service.name}</b> (${money(service.price)}) ${day} at <b>${label12(time)}</b>. ` +
        "Shall I confirm? Reply <b>yes</b> and I'll send the WhatsApp + email confirmation.",
    };
  }

  return {
    engine: "rules",
    state,
    message:
      "I can book haircuts, colour, beard grooming or facials. " +
      'Try: <i>"Book a haircut tomorrow at 2pm"</i> — or tap a suggestion below. 👇',
  };
}

export const QUICK_REPLIES = [
  "Book a haircut tomorrow",
  "What times are free?",
  "Do you do facials?",
  "Cancel my booking",
];
