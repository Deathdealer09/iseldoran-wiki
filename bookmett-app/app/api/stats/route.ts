import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { money } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  const active = store.bookings.filter((b) => b.status !== "cancelled");
  const today = active.filter((b) => b.day === "Today");
  const revenueToday = today.reduce((s, b) => s + b.price, 0);
  const aiHandled = active.filter((b) => b.channel !== "web").length;
  const aiPct = active.length ? Math.round((aiHandled / active.length) * 100) : 0;

  const kpis = [
    { label: "Today's bookings", value: String(today.length), change: "+2 vs yesterday", up: true },
    { label: "Revenue (today)", value: money(revenueToday), change: "+18% this week", up: true },
    { label: "No-show rate", value: "4%", change: "−9% since reminders", up: true },
    { label: "AI-handled", value: aiPct + "%", change: "of all bookings", up: true },
  ];

  return NextResponse.json({
    business: store.business,
    kpis,
    bookings: store.bookings,
    customers: store.customers,
    assistants: store.assistants,
    aiHandledCount: aiHandled,
  });
}
