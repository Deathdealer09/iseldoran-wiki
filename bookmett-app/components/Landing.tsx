"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service, Business } from "@/lib/types";
import { FEATURES, AI_ASSISTANTS, PLANS, money } from "@/lib/content";
import { LogoMark, Wordmark } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { BookingModal } from "./BookingModal";
import { ChatWidget } from "./ChatWidget";

export function Landing({ services, business }: { services: Service[]; business: Business }) {
  const [booking, setBooking] = useState(false);

  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <Link href="/" className="brand" aria-label="BookMeTT home">
            <LogoMark /> <Wordmark />
          </Link>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#ai">AI Assistants</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="nav-right">
            <ThemeToggle />
            <Link className="btn btn-ghost btn-sm" href="/dashboard">Go to Dashboard →</Link>
            <button className="btn btn-primary btn-sm" onClick={() => setBooking(true)}>Start free trial</button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">🇹🇹 Caribbean&apos;s first fully AI-powered booking platform</span>
              <h1>The easiest way to <span className="mark">manage bookings</span></h1>
              <p className="lede">
                BookMeTT helps service-based businesses in Trinidad &amp; Tobago grow — effortless bookings,
                AI assistants, WhatsApp &amp; voice, automatic reminders, and a built-in customer database, all in one place.
              </p>
              <div className="hero-cta">
                <button className="btn btn-primary" onClick={() => setBooking(true)}>Start free trial →</button>
                <button className="btn btn-ghost" onClick={() => setBooking(true)}>View demo</button>
              </div>
              <div className="trust">
                <div className="avstack"><span>KF</span><span>AR</span><span>NB</span><span>+</span></div>
                <span className="shield">🛡️</span> Trusted by businesses across Trinidad &amp; Tobago
              </div>
            </div>

            {/* phone mockup */}
            <div className="phone" aria-hidden="true">
              <div className="notch" />
              <div className="screen">
                <div className="screen-top"><span>9:41</span><span>BookMeTT</span></div>
                <div className="screen-body">
                  <div className="logo-row"><LogoMark size={18} /> <Wordmark /></div>
                  <h3 style={{ marginTop: 14 }}>The easiest<br />way to <span className="g">manage</span><br /><span className="gr">bookings</span></h3>
                  <p>BookMeTT makes it easy for service-based businesses to grow — effortless bookings, reminders, and an AI assistant, all in one place.</p>
                  <div className="pbtn">Start free trial →</div>
                  <div className="pbtn sec">View demo</div>
                  <div className="badge">🛡️ Trusted by businesses across Trinidad &amp; Tobago</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="band" id="features">
          <div className="wrap">
            <div className="sec-head">
              <h2>More than a booking app</h2>
              <p>Everything a service business needs to book, confirm, remind, and grow — powered by AI.</p>
            </div>
            <div className="feat">
              {FEATURES.map((f) => (
                <div className="card" key={f.title}>
                  <div className="ic">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI ASSISTANTS */}
        <section className="band alt" id="ai">
          <div className="wrap">
            <div className="sec-head">
              <h2>5 built-in AI assistants</h2>
              <p>One intelligent team working around the clock — booking, messaging, reminding, and growing your business.</p>
            </div>
            <div className="ai-grid">
              {AI_ASSISTANTS.map((a) => (
                <div className="ai-card" key={a.n}>
                  <div className="n">{a.n}</div>
                  <div className="em">{a.em}</div>
                  <h4>{a.title}</h4>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="band" id="pricing">
          <div className="wrap">
            <div className="sec-head">
              <h2>Simple pricing, in TT$</h2>
              <p>Start with a 15-day free trial. No card required. Cancel anytime.</p>
            </div>
            <div className="price-grid">
              {PLANS.map((p) => (
                <div className={"plan" + (p.popular ? " pop" : "")} key={p.name}>
                  <h3>{p.name}</h3>
                  <div className="amt">{money(p.price)} <small>/mo</small></div>
                  <div className="per">Billed monthly · 15-day free trial</div>
                  <ul>
                    {p.features.map((f) => (
                      <li key={f}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={"btn " + (p.popular ? "btn-primary" : "btn-ghost")} onClick={() => setBooking(true)}>Start free trial</button>
                </div>
              ))}
            </div>
            <p className="center-note">Prices in Trinidad &amp; Tobago dollars (TT$). USD ≈ TT$6.8 · <em>illustrative — real plans to be confirmed.</em></p>
          </div>
        </section>

        <footer>
          <div className="wrap foot-in">
            <div>
              <div className="brand" style={{ cursor: "default", fontSize: 17 }}><Wordmark /></div>
              <div style={{ marginTop: 6 }}>Book it. Meet it. Never miss it.</div>
            </div>
            <div className="foot-links">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <button className="linkbtn" onClick={() => setBooking(true)}>Book a demo</button>
              <a href="https://instagram.com/book.mett" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
          <div className="wrap" style={{ marginTop: 20, fontSize: 12.5, opacity: 0.8 }}>
            Prototype rebuild for evaluation — not affiliated with the original bookmett.com.
          </div>
        </footer>
      </main>

      {booking && <BookingModal services={services} business={business} onClose={() => setBooking(false)} onBooked={() => {}} />}
      <ChatWidget />
    </>
  );
}
