import type { Store, Service } from "./types";

export const DAYS = ["Today", "Tomorrow", "Wed", "Thu"];

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Human 12h label, e.g. "2:30 PM". */
export function label12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ap}`;
}

interface Slot {
  time: string; // "14:30"
  label: string; // "2:30 PM"
  available: boolean;
}

/**
 * Compute bookable slots for a service on a given day.
 * A slot is unavailable if booking it (for the service's duration) would
 * overlap any existing non-cancelled booking, or run past closing time.
 */
export function slotsFor(store: Store, service: Service, day: string): Slot[] {
  const { openHour, closeHour, slotMins } = store.business;
  const closeM = closeHour * 60;

  const busy = store.bookings
    .filter((b) => b.day === day && b.status !== "cancelled")
    .map((b) => {
      const start = toMinutes(b.time);
      const svc = store.services.find((s) => s.id === b.serviceId);
      const dur = svc ? svc.durationMins : 45;
      return { start, end: start + dur };
    });

  const slots: Slot[] = [];
  for (let t = openHour * 60; t + service.durationMins <= closeM; t += slotMins) {
    const start = t;
    const end = t + service.durationMins;
    const overlaps = busy.some((b) => start < b.end && end > b.start);
    slots.push({
      time: fromMinutes(t),
      label: label12(fromMinutes(t)),
      available: !overlaps,
    });
  }
  return slots;
}
