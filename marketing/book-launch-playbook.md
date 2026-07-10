# Book I Launch Playbook — The Iseldoran Sagas

A repeatable launch system for releasing a novel from a standing start. Because this is an ongoing series ("the books, then more books"), **treat every book as a launch** — early releases build the audience that makes later releases explode. Nail the machine once; reuse it forever.

> **Reality check for launching from zero:** with no existing audience, launch *day* isn't where it's won — the **pre-launch runway** is. Your job in the weeks before release is to build a small, warm group (email subscribers + a review team) so Book I doesn't drop into silence. The wiki, the Imperial Dispatch email capture, and the social pack you already have are exactly the runway assets. Use them.

---

## Phase 0 — The hard dependency: make the book buyable

Nothing below matters until this is done. Today every book on the wiki links to `#`.

- [ ] Publish Book I on **Amazon KDP** (ebook + paperback via KDP Print). It's free, global, and the default for indie SFF.
- [ ] Consider **wide** later (Kobo, Apple Books, B&N via Draft2Digital) — but KDP-exclusive (KDP Select) unlocks Kindle Unlimited, which is huge for discovery in fantasy/sci-fi. Decide per book.
- [ ] Set up a **pre-order** (KDP allows up to 90 days) so you can collect sales *before* launch day and concentrate them.
- [ ] Wire the real buy links into the wiki: replace the `k`/`p` `#` placeholders in `BOOKS` (IseldoranSagasWiki.jsx) with the Amazon Kindle/Print URLs, then `npm run build:wiki`.

---

## Channel map (ORB)

| Type | Yours | Role in launch |
|------|-------|----------------|
| **Owned** | The wiki + the Imperial Dispatch email list | The engine. Everything funnels here; the list gets the launch email. |
| **Rented** | X, Instagram, TikTok/BookTok | Reach and discovery. Drive to the wiki (email) and to the buy link on launch. |
| **Borrowed** | SFF BookTubers/Bookstagrammers, book bloggers, podcast hosts, r/fantasy & r/printSF | Shortcut to an audience. Send ARCs; earn reviews and features. |

The whole game: **rented + borrowed attention → owned email list → launch-day buyers → reviews → algorithm → new readers.**

---

## Launch phases (adapted for a novel)

### Phase 1 — Foundation (now, pre-book)
Build the runway while you finish the book.
- Wiki live with email capture ✅ (done)
- Social presence posting lore consistently (use the social launch pack) ✅ (ready)
- Grow the Dispatch list — every wiki visitor is a potential launch-day buyer
- Draft the book's **sales page copy** and **cover** (the cover is your #1 marketing asset — see `copywriting`)

### Phase 2 — ARC / review team (T-minus 6–8 weeks)
Reviews are the single biggest launch lever on Amazon. You need a handful ready on day one.
- Recruit an **ARC team** (Advance Review Copies): email your Dispatch list and post on socials — "Want to read Book I free before anyone, in exchange for an honest review?"
- Aim for **15–30 committed readers** (you'll get reviews from ~half).
- Distribute ARCs via BookFunnel (cheap) or plain PDF/EPUB.
- Also pitch **book bloggers / BookTubers** in epic SFF now — long lead times.
- Set up the book's **Goodreads** listing and add it there so ARC readers can pre-load reviews.

### Phase 3 — Pre-order + teaser campaign (T-minus 3–4 weeks)
- Open the **pre-order**; announce it to the list and socials.
- Reveal the **cover** as an event (big social moment — carousel, countdown).
- Drip teasers: an excerpt, a character featured in the book, a map, the opening line.
- Send the **launch waitlist** a heads-up: "Book I drops [date]. Here's how to help it land."

### Phase 4 — Launch week (the event)
Concentrate everything into a tight window so Amazon's algorithm sees a velocity spike.
- **Launch-day email** to the full list (see the `emails` skill for the launch sequence).
- **All socials fire** — buy link everywhere, link-in-bio updated, Stories/Reels/TikTok.
- **ARC team activates** — reviews posted in the first 48h; ask them to share too.
- **Reddit**: a genuine, non-spammy post where allowed (r/fantasy self-promo rules vary — check each).
- **Price**: consider launching the ebook at $0.99 for launch week, then raise — drives volume/rank — or launch at full price if you're KU-focused. Decide deliberately.
- Engage all day: reply to every comment, repost every mention.

### Phase 5 — Post-launch (sustain)
- **Welcome sequence** runs for new subscribers (already drafted) → many buy after.
- Chase **more reviews** — a follow-up to buyers asking for an honest review (the #1 thing that keeps sales alive).
- Roll the launch into a **"start the saga here"** evergreen funnel: ads/social → free sample → email → buy.
- Announce the **next book's** existence while attention is high. Momentum compounds.

---

## Launch-week timeline (T-minus)

| When | Action |
|------|--------|
| T-7 days | Warm-up email: "Book I is almost here." Schedule all launch-week social posts. |
| T-3 days | ARC team reminder: "Post your review on launch day." Final asset check. |
| T-1 day | "Tomorrow" email + social countdown. |
| **Launch day** | Launch email at your list's best open time. All socials live with buy link. Engage all day. |
| T+1–2 days | ARC reviews go live. Reddit/community posts. Thank-you to early buyers. |
| T+7 days | "In case you missed it" email to non-openers. Share early reviews as social proof. |
| T+14 days | Follow-up to buyers requesting reviews. Tease Book II. |

---

## Amazon specifics that move the needle

- **Categories & keywords:** choose the most specific KDP categories (e.g., Space Opera, Military Science Fiction, Epic Fantasy) and 7 keyword strings that match how readers search. Niche categories = easier bestseller badge.
- **Reviews velocity:** 10–25 reviews in the first weeks is the goal; it's the trust signal *and* the algorithm signal.
- **The "also-boughts":** launch-day buyers who also read Dune/Foundation/40K teach Amazon who to show your book to. Your existing positioning is perfect for this.
- **A+ Content:** use KDP's A+ module to add the cover art, character portraits, and world blurb to the Amazon listing — your visual assets are a real advantage here.
- **Series page:** once Book II exists, link them as a Series on Amazon so readers auto-flow from one to the next.

---

## Assets checklist

- [ ] Final cover (ebook + print wrap)
- [ ] Book description / blurb (the Amazon sales copy — use `copywriting`)
- [ ] 3–5 launch social graphics (cover reveal, quote cards, countdown) — you have portrait/cover art
- [ ] Short book trailer / Reel (optional but strong on BookTok)
- [ ] ARC copy (EPUB/PDF via BookFunnel)
- [ ] Launch email + welcome sequence (welcome sequence ✅ done; launch email via `emails`)
- [ ] Goodreads listing
- [ ] Updated wiki buy links + a "Start Here / Book I" callout on the homepage

---

## Pre-launch checklist mapped to what you already have

- [x] Landing page / owned web presence → the wiki
- [x] Email capture → the Imperial Dispatch form
- [x] Social profiles + content → social launch pack (create the profiles)
- [x] Welcome/onboarding sequence → drafted
- [ ] Book buyable (Phase 0)
- [ ] ARC/review team
- [ ] Cover + blurb finalized
- [ ] Launch email written
- [ ] Analytics (GA4 on the wiki — see the `analytics` skill)

---

## The one-sentence version

Get Book I on Amazon with a pre-order, spend the next 6 weeks turning wiki visitors into an email list and a review team, then fire everything into one launch week so Amazon's algorithm catches the spike — and do it again for every book.

---

*Generated with the `launch` marketing skill. Related: `emails` (launch sequence), `social`, `copywriting` (blurb + sales page), `analytics`, `ai-seo`.*
