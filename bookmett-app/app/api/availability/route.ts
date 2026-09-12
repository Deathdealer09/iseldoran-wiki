import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { slotsFor, DAYS } from "@/lib/availability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const store = await getStore();
  const serviceId = req.nextUrl.searchParams.get("serviceId") || "";
  const day = req.nextUrl.searchParams.get("day") || "Today";
  const service = store.services.find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }
  return NextResponse.json({ days: DAYS, day, slots: slotsFor(store, service, day) });
}
