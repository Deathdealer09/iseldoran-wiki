# BookMeTT — Reverse-Engineering Blueprint

A complete specification for rebuilding **BookMeTT** (brand: *BookMe*), the AI-powered
booking platform marketed on Instagram [@book.mett](https://instagram.com/book.mett)
and hosted at [bookmett.com](https://www.bookmett.com).

This document is written so an engineering team (or a no-code builder) can construct a
functionally identical product from scratch.

---

## 0. Source & confidence notes

Facts here come from three places, and each claim is tagged so you know how much to trust it:

- **[OBSERVED]** — read directly off the three Instagram screenshots provided (landing-page
  copy, feature graphics, profile bio). High confidence for *what the product advertises*.
- **[VERIFIED]** — confirmed through public web search.
- **[INFERRED]** — a reasoned assumption for the rebuild, **not** a fact about the real app.

> **Access caveat:** the research environment's network policy blocked all outbound traffic
> to `bookmett.com` (and its `app.`/`book.` subdomains), the Wayback Machine, and the press
> site — every request was rejected `403` at the egress proxy. So the live HTML, served
> JS/CSS assets, `__NEXT_DATA__`, HTTP headers, pricing page, and dashboard were **not**
> inspectable. Anything about the exact tech stack, precise pricing, and exact brand hex/fonts
> is therefore **[INFERRED]** and must be confirmed by opening the site from an unrestricted
> browser. See [§10 Open items](#10-open-items-confirm-from-an-unrestricted-browser).

---

## 1. What the product is

**[OBSERVED]** BookMeTT is a SaaS booking & scheduling platform for **service-based
businesses in Trinidad & Tobago** (barbers, salons, spas, clinics, consultants, tutors,
tradespeople, etc.). It positions itself as **"Caribbean's First Fully AI-Powered Booking
Platform"** and **"More Than a Booking App — AI-Powered. Growth-Driven."**

The core promise: a business signs up, publishes a booking page, and lets AI assistants
(voice + WhatsApp) capture and manage appointments, while the platform handles reminders,
confirmations, rescheduling, and a built-in customer database (CRM).

- **[VERIFIED]** Founder: **Kelly French** (Trinidad & Tobago). Featured by TTT News
  (national broadcaster) in a segment on *"digital transformation for Caribbean businesses."*
- **[VERIFIED]** No iOS App Store or Google Play listing was found → the product is
  **web-based / PWA**, not a native mobile app.

### Taglines & hero copy **[OBSERVED]**
- *"Book it. Meet it. Never Miss it."* (profile logo tagline)
- *"Book. Grow. Succeed."* (dashboard header lockup)
- Hero: **"The easiest way to manage bookings"**
- Sub: *"BookMeTT makes it easy for service-based businesses in Trinidad and Tobago to grow —
  effortless bookings, automatic reminders, and an AI assistant, all in one place."*
- CTAs: **"Start free trial →"** and **"View demo"**
- Trust badge: *"Trusted by businesses across Trinidad & Tobago"*
- Offer: **15-Day Free Trial**

---

## 2. Brand & visual identity

| Element | Spec | Confidence |
|---|---|---|
| Primary accent | Orange, ≈ `#E8620E` (warm burnt-orange) | [INFERRED] from screenshots — eyedrop the live logo to confirm |
| Secondary accent | A green used on the word *"bookings"* and trust-badge shield, ≈ `#3A9E4B` | [INFERRED] |
| Background | Dark charcoal / near-black (`#0E0E10`-ish) for app & IG creatives; **white** for the marketing landing hero | [OBSERVED] |
| Logo | Calendar glyph with a **checkmark** inside, in orange; wordmark "BookMe" / "BookMe**TT**" (the "TT" in orange = Trinidad & Tobago) | [OBSERVED] |
| Logo tagline | "Book it. Meet it. Never miss it." | [OBSERVED] |
| Typography | Bold geometric/grotesque sans for headlines (heavy weight), clean sans for body | [INFERRED] — confirm via served fonts |
| Tone | Confident, outcome-oriented, locally proud, AI-forward | [OBSERVED] |

Design the UI in **two surfaces**: a **light** marketing site (white hero, orange CTAs) and
a **dark** product/dashboard theme (charcoal, orange accents) — both are visible in the creatives.

---

## 3. Feature inventory

All **[OBSERVED]** from the "More Than a Booking App" feature graphic and the profile bio,
unless noted. Grouped for implementation.

### 3.1 Booking core
- Public booking page per business (service list, availability, book in seconds)
- Appointment scheduling with availability/calendar management
- **Reschedule & Cancel** (self-service by the customer)
- "View demo" flow (interactive sample booking)

### 3.2 AI features — the "5 AI Assistants" **[OBSERVED headline; roster INFERRED]**
The bio advertises **"5 built-in AI's."** The site never publicly enumerates them, so this
mapping is **[INFERRED]** — a sensible 5-assistant architecture to rebuild against:
1. **Booking Assistant** — conversational/voice appointment capture ("AI Voice Command").
2. **WhatsApp AI Agent** — handles inbound WhatsApp chats → checks availability → books → confirms.
3. **Reminder / No-show Assistant** — 24 hr reminders, reschedule nudges, no-show reduction.
4. **CRM / Customer-Insights Assistant** — summarizes customer history, tags repeat clients.
5. **Growth / Marketing Assistant** — re-engagement campaigns, promos, review requests
   (ties to "Grow. Succeed.").
- **Voice Booking / "AI Voice Command"** is a **[OBSERVED]** headline feature (a dedicated
  IG post titled *"AI Voice Command — Feature Highlight"*).

### 3.3 Communications
- **WhatsApp** booking confirmations **[OBSERVED]**
- **Email** booking confirmations **[OBSERVED]**
- **24-hour reminders** **[OBSERVED]**

### 3.4 CRM
- Built-in **Customer Database** **[OBSERVED]** — store customers, history, contact details.

### 3.5 Account / app shell
- Authenticated **Dashboard** (UI shows "Go to Dashboard" + "Sign out") **[OBSERVED]**
- User signup/login; 15-day trial gating **[OBSERVED]**

---

## 4. Information architecture (route map)

**[OBSERVED]** routes (proven to exist by the UI): `/` home, a **demo** view, **Start free
trial** (signup), authenticated **Dashboard**, and a **login/sign-out** flow.

**[INFERRED]** full route map to build against:

```
Public marketing (light theme)
  /                     Landing / hero
  /features             Feature detail
  /pricing              Plans & prices
  /demo                 Interactive demo booking
  /about                Story / founder
  /contact              Contact
  /privacy  /terms      Legal (footer)

Auth
  /signup  (/start, /trial)   Create business account → 15-day trial
  /login
  /forgot-password

Product (dark theme, auth-gated)  — app.bookmett.com [INFERRED subdomain]
  /dashboard            Overview: upcoming bookings, stats
  /calendar            Availability & schedule
  /bookings            List / manage appointments
  /customers           CRM
  /services            Services, durations, prices
  /assistants          Configure the 5 AI assistants + WhatsApp/voice
  /messages            WhatsApp/email comms log
  /settings            Business profile, hours, branding, billing

Public per-business booking page
  book.bookmett.com/{business-slug}   [INFERRED] customer-facing booking
```

---

## 5. Suggested data model

**[INFERRED]** — a minimal relational schema that supports every observed feature.

```
Business        id, name, slug, ownerUserId, phone, whatsappNumber, timezone,
                logoUrl, brandColor, plan, trialEndsAt, createdAt
User            id, email, passwordHash, role(owner|staff), businessId
Service         id, businessId, name, description, durationMins, price, active
StaffMember     id, businessId, name, workingHours(JSON)
Availability    id, businessId | staffId, weekday, startTime, endTime, overrides(JSON)
Customer        id, businessId, name, phone, email, tags[], notes, createdAt   (← CRM)
Booking         id, businessId, customerId, serviceId, staffId, startsAt, endsAt,
                status(pending|confirmed|cancelled|completed|no_show),
                channel(web|whatsapp|voice), createdAt
MessageLog      id, businessId, bookingId, channel(whatsapp|email), type(confirmation|
                reminder|reschedule|marketing), status, sentAt
AiAssistant     id, businessId, type(booking|whatsapp|reminder|crm|growth),
                enabled, config(JSON)
Subscription    id, businessId, plan, status, currentPeriodEnd, provider
```

---

## 6. AI architecture (how to reproduce the "AI-powered" claims)

**[INFERRED]** — a reference design that yields the observed behavior.

- **LLM layer**: an LLM (Claude / GPT-class) with **function/tool calling**. Expose booking
  tools to it: `check_availability(service, date_range)`, `create_booking(...)`,
  `reschedule(...)`, `cancel(...)`, `lookup_customer(phone)`. This single tool-using agent
  powers the booking, WhatsApp, and voice assistants — the "5 assistants" are really one
  agent with 5 prompt/config profiles + the two automated jobs (reminders, growth).
- **WhatsApp AI Agent**: **WhatsApp Cloud API (Meta)** webhook → messages routed to the LLM
  agent → tool calls hit your booking API → replies sent back via the API. This is the
  headline differentiator (WhatsApp is the dominant channel in T&T).
- **Voice Booking**: telephony/voice pipeline — **Speech-to-Text** (Whisper / Deepgram) →
  LLM agent → **Text-to-Speech** (ElevenLabs / provider TTS), fronted by Twilio Voice or an
  in-browser mic. Same tool-calling agent underneath.
- **Reminders / no-show**: a scheduled job (cron/queue) that scans bookings 24 h out and
  dispatches WhatsApp + email via templates.
- **Growth assistant**: scheduled re-engagement — segment customers from the CRM, generate
  copy with the LLM, send review-request / win-back messages.

---

## 7. Integrations

| Capability | Advertised? | Likely provider | Confidence |
|---|---|---|---|
| WhatsApp messaging + AI agent | Yes | WhatsApp Cloud API (Meta) | [OBSERVED] feature / [INFERRED] provider |
| Email confirmations | Yes | Resend / SendGrid / Postmark | [OBSERVED] / [INFERRED] |
| Voice / telephony | Yes ("AI Voice Command") | Twilio + Whisper + ElevenLabs | [OBSERVED] / [INFERRED] |
| LLM | Implicit | OpenAI or Anthropic | [INFERRED] |
| Payments / billing | Implied (trial→paid) | Stripe (+ local T&T gateway e.g. WiPay for TTD) | [INFERRED] |
| Calendar sync (Google/Outlook) | Not stated | — | Unknown |

---

## 8. Recommended tech stack for the rebuild

**[INFERRED]** — a modern, low-cost stack that a small team can ship fast and that matches
the product's shape (web/PWA, real-time bookings, AI agents).

- **Frontend**: Next.js (React) + Tailwind CSS + shadcn/ui. Two theme tokens (light marketing
  / dark app). Deploy on **Vercel**.
- **Backend / DB / Auth**: **Supabase** (Postgres + Auth + Row-Level-Security + Realtime) or
  Firebase. RLS keeps each business's data isolated.
- **Background jobs**: a queue/cron (Supabase scheduled functions, Trigger.dev, or a small
  worker) for reminders and growth campaigns.
- **AI**: LLM API with tool-calling; a thin "agent" service exposing booking tools.
- **Messaging**: WhatsApp Cloud API; Resend for email.
- **Voice**: Twilio Voice + STT/TTS providers.
- **Payments**: Stripe for cards; a local TTD gateway if needed.

> This is a *plausible* stack, not the confirmed one. Confirm the real stack by viewing the
> live site's page source, response headers, and script domains (BuiltWith/Wappalyzer).

---

## 9. Build plan (phased)

1. **MVP booking** — business signup, services, availability, public booking page, web bookings,
   email confirmation, dashboard list. *(No AI yet — proves the core loop.)*
2. **CRM + reminders** — customer records, 24 h reminder job (email), reschedule/cancel links.
3. **WhatsApp** — Cloud API confirmations + reminders, then the **WhatsApp AI booking agent**
   (LLM + tool calls). This is the biggest differentiator; do it before voice.
4. **Voice booking** — telephony/STT/TTS on the same agent.
5. **Growth assistant + billing** — re-engagement campaigns, Stripe/TTD billing, trial→paid.
6. **Polish** — branding per business, analytics, PWA install, testimonials/pricing pages.

---

## 10. Open items (confirm from an unrestricted browser)

These could **not** be captured because the site was network-blocked in this environment:

1. **Exact pricing tiers & numbers** (TTD/USD) — pricing page not reachable.
2. **Real tech stack** — no HTML/headers/asset fingerprints obtainable.
3. **Exact brand hex values, fonts, and logo source files** — need to eyedrop live assets.
4. **Full authenticated dashboard feature set & route map** — not crawlable.
5. **The actual identity of each of the "5 AI Assistants"** — never publicly enumerated.
6. **The second bio link** ("and 1 more" — likely Linktree or a booking subdomain).
7. **Testimonials, FAQ copy, footer legal text, and confirmed integration vendors.**
8. **WhatsApp API type** (official Cloud API vs. unofficial) and the **voice pipeline vendor** —
   the two hardest pieces to replicate exactly.

**To close these:** open `https://www.bookmett.com` in a normal browser → View Source +
DevTools Network tab (framework, headers, script domains), screenshot the pricing and features
pages, and click through the demo/signup to map the dashboard.

---

## 11. Public footprint (references)

- **Instagram:** [@book.mett](https://instagram.com/book.mett) — "BookMe- AI Booking & Scheduling" — 58 posts / ~76 followers (early-stage) **[OBSERVED]**
- **Website:** https://www.bookmett.com **[OBSERVED]** *(+ "1 more" link, unresolved)*
- **Founder:** Kelly French **[VERIFIED]**
- **Press:** TTT News — *"BookMeTT Driving Digital Transformation For Caribbean Businesses"* **[VERIFIED]**
- **App stores:** none found → web/PWA **[VERIFIED negative]**
- ⚠️ **Do not conflate** with *Intellico AI Agency Ltd.* (CEO Gregory Fernandez) — a different
  T&T AI company that appeared in adjacent press. **[VERIFIED]**
