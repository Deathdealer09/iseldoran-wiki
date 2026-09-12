import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await mutate((store) => {
    const b = store.bookings.find((x) => x.id === params.id);
    if (!b) return null;
    b.status = "cancelled";
    return b;
  });
  if (!result) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  return NextResponse.json({ booking: result });
}
