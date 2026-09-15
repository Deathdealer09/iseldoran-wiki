"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Booking, Customer, Assistant, Service, Business } from "@/lib/types";
import { money } from "@/lib/content";
import { label12, toMinutes } from "@/lib/availability";
import { LogoMark, Wordmark } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { BookingModal } from "./BookingModal";

interface Kpi { label: string; value: string; change: string; up: boolean; }
interface Stats {
  business: Business;
  kpis: Kpi[];
  bookings: Booking[];
  customers: Customer[];
  assistants: Assistant[];
  aiHandledCount: number;
}

const AVA_COLORS = ["#E8620E", "#5b3fd1", "#0d9488", "#d24545", "#b26a00", "#2FA35A"];
const DAY_ORDER: Record<string, number> = { Today: 0, Tomorrow: 1, Wed: 2, Thu: 3 };

export function Dashboard({ services }: { services: Service[] }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [booking, setBooking] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/stats", { cache: "no-store" });
    const data: Stats = await res.json();
    setStats(data);
    setAssistants(data.assistants);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function cancel(id: string) {
    await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
    load();
  }

  function toggleAssistant(id: string) {
    setAssistants((a) => a.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));
  }

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const sortedBookings = stats
    ? [...stats.bookings].sort(
        (a, b) => (DAY_ORDER[a.day] - DAY_ORDER[b.day]) || toMinutes(a.time) - toMinutes(b.time),
      )
    : [];

  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <Link href="/" className="brand"><LogoMark /> <Wordmark /></Link>
          <div className="nav-right">
            <ThemeToggle />
            <Link className="btn btn-ghost btn-sm" href="/">← Marketing site</Link>
            <button className="btn btn-primary btn-sm" onClick={() => setBooking(true)}>+ New booking</button>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="dash-head">
          <div>
            <h1>Good afternoon, Kelly 👋</h1>
            <p>Here&apos;s what&apos;s happening at <b>{stats?.business.name || "your studio"}</b> today · <span className="tnum">{today}</span></p>
          </div>
        </div>

        {stats && (
          <div className="banner">✨ Your AI assistants handled <b style={{ margin: "0 4px" }}>{stats.aiHandledCount}</b> of your bookings automatically.</div>
        )}

        <div className="kpis">
          {(stats?.kpis || []).map((k) => (
            <div className="kpi" key={k.label}>
              <div className="lab">{k.label}</div>
              <div className="big tnum">{k.value}</div>
              <div className={"chg " + (k.up ? "up" : "down")}>{k.change}</div>
            </div>
          ))}
        </div>

        <div className="dash-cols">
          <div className="panel">
            <div className="panel-h">
              <h3>Upcoming bookings</h3>
              <span className="cnt">{sortedBookings.filter((b) => b.status !== "cancelled").length} active</span>
            </div>
            {sortedBookings.map((b) => (
              <div className={"brow" + (b.status === "cancelled" ? " cancelled" : "")} key={b.id}>
                <div className="when">
                  <div className="d">{b.day}</div>
                  <div className="t tnum">{label12(b.time)}</div>
                </div>
                <div className="cust">
                  <div className="nm">{b.customerName}</div>
                  <div className="sv">{b.serviceName} · {money(b.price)}</div>
                </div>
                <span className={"chan " + b.channel}>{b.channel}</span>
                <span className={"pill " + b.status}>{b.status}</span>
                {b.status !== "cancelled" && (
                  <button className="linkbtn" onClick={() => cancel(b.id)} title="Cancel booking">cancel</button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="panel">
              <div className="panel-h"><h3>AI assistants</h3><span className="cnt">{assistants.filter((a) => a.enabled).length} active</span></div>
              {assistants.map((a) => (
                <div className="assist-row" key={a.id}>
                  <div className="em">{a.emoji}</div>
                  <div>
                    <div className="nm">{a.name}</div>
                    <div className="ds">{a.role}</div>
                  </div>
                  <button
                    className={"toggle" + (a.enabled ? "" : " off")}
                    onClick={() => toggleAssistant(a.id)}
                    aria-label={`Toggle ${a.name}`}
                  />
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-h"><h3>Customers (CRM)</h3><span className="cnt">{stats?.customers.length || 0} clients</span></div>
              {(stats?.customers || []).slice(0, 5).map((c, i) => (
                <div className="crm-row" key={c.id}>
                  <div className="ava" style={{ background: AVA_COLORS[i % AVA_COLORS.length] }}>{initials(c.name)}</div>
                  <div>
                    <div className="nm">{c.name}</div>
                    <div className="meta">{c.phone} · {c.tag}</div>
                  </div>
                  <div className="visits">
                    <div className="v tnum">{c.visits}</div>
                    <div className="l">{c.lastVisit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 40 }} />
      </div>

      {booking && stats && (
        <BookingModal services={services} business={stats.business} onClose={() => setBooking(false)} onBooked={load} />
      )}
    </>
  );
}

function initials(n: string): string {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
