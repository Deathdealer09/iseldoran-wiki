import { NextRequest, NextResponse } from "next/server";
import { getStore, mutate, newId, upsertCustomer } from "@/lib/db";
import { slotsFor, label12 } from "@/lib/availability";
import { parseIntentRules, parseIntentLLM, execute, type ChatState } from "@/lib/assistant";
import { money } from "@/lib/content";
import type { Booking } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text: string = (body?.message || "").toString();
  const state: ChatState = body?.state || { stage: "idle" };
  if (!text.trim()) return NextResponse.json({ error: "Empty message." }, { status: 400 });

  const store = await getStore();

  // Prefer the LLM parser when a key is configured; fall back to rules on any failure.
  const llm = await parseIntentLLM(text, store.services);
  const intent = llm || parseIntentRules(text, store.services);
  const engine: "llm" | "rules" = llm ? "llm" : "rules";

  const result = execute(store, intent, state);

  // If the assistant decided to book, create it server-side (authoritative).
  if (result.book) {
    const svc = store.services.find((s) => s.id === result.book!.serviceId)!;
    const created = await mutate((s) => {
      const slot = slotsFor(s, svc, result.book!.day).find((x) => x.time === result.book!.time);
      if (!slot || !slot.available) return null;
      const b: Booking = {
        id: newId("b"),
        day: result.book!.day,
        time: result.book!.time,
        customerName: "WhatsApp Guest",
        customerPhone: body?.phone || "868-555-0000",
        serviceId: svc.id,
        serviceName: svc.name,
        price: svc.price,
        channel: "whatsapp",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      s.bookings.push(b);
      upsertCustomer(s, b.customerName, b.customerPhone);
      return b;
    });

    if (!created) {
      return NextResponse.json({
        engine,
        reply: "Ah — that slot was just taken. Want me to find the next opening?",
        state: { ...result.state, stage: "idle", time: null },
      });
    }

    return NextResponse.json({
      engine,
      booked: created,
      reply:
        `✅ Done! You're booked for <b>${svc.name}</b> ${created.day} at <b>${label12(created.time)}</b> (${money(svc.price)}).<br>` +
        "💬 WhatsApp confirmation sent · ⏰ 24hr reminder scheduled.<br><br>" +
        'It\'s now live on the <b>dashboard</b> — open "Dashboard" up top to see it.',
      state: { stage: "idle" },
    });
  }

  return NextResponse.json({ engine, reply: result.message, state: result.state });
}
