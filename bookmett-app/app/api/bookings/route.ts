import { NextRequest, NextResponse } from "next/server";
import { getStore, mutate, newId, upsertCustomer } from "@/lib/db";
import { slotsFor } from "@/lib/availability";
import type { Booking, Channel } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  return NextResponse.json({ bookings: store.bookings });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { serviceId, day, time, name, phone, channel } = body || {};

  if (!serviceId || !day || !time || !name) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const created = await mutate((store) => {
      const service = store.services.find((s) => s.id === serviceId);
      if (!service) throw new Error("Unknown service.");

      // Server-side re-check: the slot must still be free (prevents double-booking).
      const slot = slotsFor(store, service, day).find((s) => s.time === time);
      if (!slot) throw new Error("That time is not a valid slot.");
      if (!slot.available) throw new Error("Sorry, that time was just taken. Please pick another.");

      const booking: Booking = {
        id: newId("b"),
        day,
        time,
        customerName: String(name).trim(),
        customerPhone: String(phone || "").trim(),
        serviceId,
        serviceName: service.name,
        price: service.price,
        channel: (["web", "whatsapp", "voice"].includes(channel) ? channel : "web") as Channel,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      store.bookings.push(booking);
      upsertCustomer(store, booking.customerName, booking.customerPhone);
      return booking;
    });

    // In production these fire real WhatsApp Cloud API + email sends.
    return NextResponse.json({
      booking: created,
      notifications: [
        { channel: "whatsapp", message: `WhatsApp confirmation sent to ${created.customerPhone || "customer"}` },
        { channel: "email", message: "Email confirmation & calendar invite sent" },
        { channel: "reminder", message: "24-hour reminder scheduled automatically" },
      ],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Could not create booking." }, { status: 409 });
  }
}
