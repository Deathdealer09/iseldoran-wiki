"use client";

import { useEffect, useState } from "react";
import type { Service, Business } from "@/lib/types";
import { money } from "@/lib/content";

interface Slot { time: string; label: string; available: boolean; }

export function BookingModal({
  services,
  business,
  onClose,
  onBooked,
}: {
  services: Service[];
  business: Business;
  onClose: () => void;
  onBooked: () => void;
}) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [day, setDay] = useState("Today");
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState("web");
  const [days, setDays] = useState<string[]>(["Today", "Tomorrow", "Wed", "Thu"]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notifs, setNotifs] = useState<{ channel: string; message: string }[]>([]);

  const service = services.find((s) => s.id === serviceId) || null;

  useEffect(() => {
    if (step === 2 && serviceId) {
      setLoading(true);
      setError("");
      fetch(`/api/availability?serviceId=${serviceId}&day=${encodeURIComponent(day)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.days) setDays(d.days);
          setSlots(d.slots || []);
        })
        .catch(() => setError("Couldn't load times. Try again."))
        .finally(() => setLoading(false));
    }
  }, [step, serviceId, day]);

  async function confirm() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ serviceId, day, time, name, phone, channel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not complete booking.");
        setStep(2); // let them pick a new time
        return;
      }
      setNotifs(data.notifications || []);
      setStep(4);
      onBooked();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Book an appointment">
        <div className="modal-h">
          <strong>{step === 4 ? "You're booked!" : "Book an appointment"}</strong>
          <div className="steps">
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className={"dot" + (s <= step ? " on" : "")} />
            ))}
          </div>
        </div>

        <div className="modal-b">
          {error && <div className="err">{error}</div>}

          {step === 1 && (
            <>
              <h3>Choose a service</h3>
              <div className="sub">{business.name} · {business.location}</div>
              {services.map((s) => (
                <button
                  key={s.id}
                  className={"opt" + (serviceId === s.id ? " sel" : "")}
                  onClick={() => setServiceId(s.id)}
                >
                  <span>
                    <span className="t">{s.name}</span>
                    <br />
                    <span className="d">{s.description} · {s.durationMins} min</span>
                  </span>
                  <span className="pr">{money(s.price)}</span>
                </button>
              ))}
            </>
          )}

          {step === 2 && service && (
            <>
              <h3>Pick a time</h3>
              <div className="sub">{service.name} · {service.durationMins} min</div>
              <div className="daytabs">
                {days.map((d) => (
                  <button
                    key={d}
                    className={"daytab" + (day === d ? " sel" : "")}
                    onClick={() => { setDay(d); setTime(null); }}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {loading ? (
                <div className="sub">Loading times…</div>
              ) : (
                <div className="slotgrid">
                  {slots.map((sl) => (
                    <button
                      key={sl.time}
                      className={"slot" + (time === sl.time ? " sel" : "")}
                      disabled={!sl.available}
                      title={sl.available ? "" : "Booked"}
                      onClick={() => setTime(sl.time)}
                    >
                      {sl.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && service && (
            <>
              <h3>Your details</h3>
              <div className="sub">We&apos;ll confirm by WhatsApp &amp; email</div>
              <div className="summary">
                <div><span>{service.name}</span><span>{money(service.price)}</span></div>
                <div><span>{day} at {slots.find((s) => s.time === time)?.label || time}</span><span>{service.durationMins} min</span></div>
              </div>
              <div className="field">
                <label>Full name</label>
                <input value={name} placeholder="e.g. Anita Boodram" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label>WhatsApp number</label>
                <input value={phone} placeholder="868-XXX-XXXX" onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="field">
                <label>How did you book?</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                  <option value="web">Website</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="voice">Voice</option>
                </select>
              </div>
            </>
          )}

          {step === 4 && service && (
            <div>
              <div style={{ textAlign: "center" }}>
                <div className="confirm-ic">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h3>Booking confirmed 🎉</h3>
                <div className="sub">{name}, you&apos;re booked for <b>{service.name}</b> on <b>{day} at {slots.find((s) => s.time === time)?.label || time}</b>.</div>
              </div>
              {notifs.map((n, i) => (
                <div key={i} className={"sent " + (n.channel === "email" ? "em" : "wa")}>
                  {n.channel === "email" ? "✉️" : n.channel === "reminder" ? "⏰" : "💬"} {n.message}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-f">
          {step === 1 && (
            <>
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={!serviceId} onClick={() => setStep(2)}>Continue</button>
            </>
          )}
          {step === 2 && (
            <>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" disabled={!time} onClick={() => setStep(3)}>Continue</button>
            </>
          )}
          {step === 3 && (
            <>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" disabled={!name || !phone || loading} onClick={confirm}>
                {loading ? "Booking…" : "Confirm booking"}
              </button>
            </>
          )}
          {step === 4 && (
            <>
              <button className="btn btn-ghost" onClick={onClose}>Done</button>
              <a className="btn btn-primary" href="/dashboard" style={{ justifyContent: "center" }}>See it on the dashboard →</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
