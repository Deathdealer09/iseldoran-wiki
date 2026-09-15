# BookMeTT — full-stack app

A working rebuild of **BookMeTT**, the AI-powered booking platform for service
businesses in Trinidad &amp; Tobago (Instagram [@book.mett](https://instagram.com/book.mett)).
Built with **Next.js 14 (App Router) + TypeScript**. Marketing site, real
multi-step booking flow, an AI booking assistant (chat + voice), and an operator
dashboard — all backed by real API routes and a persistent datastore.

> Companion to the product blueprint in [`../reverse-engineering/bookmett/`](../reverse-engineering/bookmett/README.md).

---

## Run it locally

```bash
cd bookmett-app
npm install
npm run dev
# open http://localhost:3000
```

That's it — no database to provision. Data seeds automatically on first run and
persists to `data/store.json`.

### Optional: live LLM assistant
The AI assistant works out of the box with a fast rule-based engine. To upgrade
it to a real LLM parser, add a key:

```bash
cp .env.example .env
# set ANTHROPIC_API_KEY=sk-ant-...
```

The assistant then uses Anthropic to parse intent and **falls back to the rule
engine automatically** if the key is missing or the call fails — so it never breaks.

---

## What actually works (not a mockup)

| Area | Behaviour |
|---|---|
| **Booking flow** | 4 steps → `POST /api/bookings`. Server re-checks the slot and **rejects double-bookings** (409). |
| **Availability** | `GET /api/availability` computes open slots from business hours minus real booking overlaps, per service duration. |
| **AI assistant** | `POST /api/assistant` parses intent (LLM or rules), books server-side, returns a reply. Voice button simulates speech→booking. |
| **Dashboard** | `GET /api/stats` returns live KPIs, bookings, CRM. A booking made anywhere appears here. Cancel is a real `POST …/cancel`. |
| **CRM** | New bookings upsert a customer; visit counts drive VIP/Regular/New tags. |
| **Theme** | Light/dark, persisted to `localStorage`, no flash on load. |

## Deploy (get a live link)

The app deploys to any Node host. Easiest is **Vercel**:

```bash
npm i -g vercel
vercel        # follow prompts → gives you a live https URL
```

Set `ANTHROPIC_API_KEY` in the Vercel project env vars to enable the LLM assistant.

> **Note on persistence:** the JSON datastore persists locally but is *ephemeral*
> on serverless hosts (per-instance). For production, swap `lib/db.ts` for Prisma +
> Postgres (e.g. Vercel Postgres / Supabase) — every call site already goes through
> the async `getStore()` / `mutate()` helpers, so it's a single-module change.

---

## Architecture

```
app/
  page.tsx              Landing (server) → <Landing/>
  dashboard/page.tsx    Dashboard (server) → <Dashboard/>
  api/
    services            GET services + business
    availability        GET open slots for a service/day
    bookings            GET all · POST create (slot-checked)
    bookings/[id]/cancel POST cancel
    customers           GET CRM
    stats               GET dashboard KPIs + data
    assistant           POST AI chat → intent → booking
components/             Landing, Dashboard, BookingModal, ChatWidget, ThemeToggle, BrandLogo
lib/
  types.ts             domain types
  seed.ts              first-run seed data
  db.ts                JSON datastore (swap for Prisma/Postgres)
  availability.ts      slot computation
  assistant.ts         intent parsing (rules + optional Anthropic) + executor
  content.ts           marketing copy, plans, money()
```

## Roadmap to the real production product
The blueprint's build plan (§9) maps the rest: real **WhatsApp Cloud API**,
email (Resend), **voice pipeline** (Twilio + STT/TTS), Stripe/TTD billing,
per-business booking pages, and multi-tenant auth. This app is phases 1–2 (booking
core + CRM + AI assistant) made real; the datastore and assistant are structured
so those integrations slot in without rewrites.

---

_Rebuild for evaluation. Not affiliated with the original bookmett.com._
