# Welcome Sequence — "The Imperial Dispatch"

For new subscribers who join via the wiki's signup form. Goal: turn a curious visitor into a committed reader who explores the universe, follows along, and buys Book I the day it launches.

---

## Sequence Overview

- **Sequence:** The Imperial Dispatch — Welcome
- **Trigger:** New newsletter signup on iseldoransagas.com
- **Goal:** Deepen immersion → convert to an engaged fan ready to buy at launch (books are not yet for sale, so there is **no hard sell** here — that's the `launch` skill's job later)
- **Length:** 5 emails over ~9 days
- **Timing:** #1 immediate, then days 2, 4, 6, 9
- **Sender:** Kerron Pierre (warm and human, with the imperial flavor carried in the lore)
- **Exit:** Unsubscribe, or transition to the regular broadcast list after #5

> **Voice note:** the *world* is grand and ceremonial; the *emails* are personal. You're a creator letting someone into a universe you built — write like it. Keep paragraphs short (mobile), one CTA each.

---

### Email 1 — Welcome + immediate payoff
- **Send:** Immediately
- **Subject:** Welcome to the Dragon Throne
- **Preview:** Your first step into 35,000 years of empire — start here.
- **Body:**

  You're in.

  The Iseldoran Sagas span 35,000 years, two universes, 38 volumes, and a single bloodline carried from planetary rulers to universal sovereigns. It's a lot. So let me give you the door, not the whole map.

  **Start here:** [the Lore Compendium →](https://www.iseldoransagas.com/) — pick any name that sounds dangerous and follow it. That's how the whole world is meant to be read: one thread at a time.

  One thing to know going in, because it tells you what kind of universe this is:

  When **Cassian I** was crowned, 433 rival princes had a legal claim to contest him. He had every one of them executed during the coronation itself. That was the day the empire stopped being a government and became a religion.

  Welcome to the archive. More soon.

  — Kerron
- **CTA:** Enter the Compendium → https://www.iseldoransagas.com/

---

### Email 2 — Where to start (the guided path)
- **Send:** Day 2
- **Subject:** Where to start (so it doesn't overwhelm you)
- **Preview:** Three doors into the universe, depending on what you love.
- **Body:**

  1.74 million words is intimidating. Here's how I'd enter if I were you — pick the door that fits:

  - **You love political intrigue** → start with the Soldier Emperor, **Lucius Luceron II**, who tried to reform an empire built on conquest.
  - **You love war and elite orders** → start with the **Black Death** — not an army, a precision force, deployed only when whole civilizations have already failed.
  - **You love myth and theology** → start with **Asha Kers I**, "La Diosa," the God-Empress who codified the law of a universe.

  Every one of them links out to the people, wars, and worlds around them. Follow the threads.

  Which door did you pick? Hit reply and tell me — I read every one.

  — Kerron
- **CTA:** Choose your door → https://www.iseldoransagas.com/

---

### Email 3 — The why (author story)
- **Send:** Day 4
- **Subject:** Why I wrote 1.74 million words before showing anyone
- **Preview:** The universe had to hold up like a real archive first.
- **Body:**

  Most fictional worlds are a backdrop — a thin set behind the characters. I wanted the opposite. I wanted a history so complete you could walk into any century of it and find it already standing.

  So before I let anyone read a single novel, I built the archive: the dynasties, the wars, the genealogies, the theology, the engineered post-human civilizations. 35,000 years of it, treated as historical record rather than loose myth.

  The conceit is that all of it is compiled by one man — **Prince Kairoh, Master Archivist** — a figure inside the history he records. When you read the wiki, you're reading *his* archive.

  That's the promise of the Iseldoran Sagas: a world that rewards the curious. The deeper you dig, the more there is.

  — Kerron
- **CTA:** Explore the archive → https://www.iseldoransagas.com/

---

### Email 4 — Deep lore drop (build the hunger)
- **Send:** Day 6
- **Subject:** 2.4 million dead in eleven days
- **Preview:** The Cooling Riots, and what they tell you about this empire.
- **Body:**

  A story from the archive, because it's the kind of thing this universe is made of:

  During the reign of Lucius Luceron I, House Varekh redirected coolant from the habitation districts to military production during a frontier emergency. In the Lower Furnace Districts, temperatures climbed past what a body can survive.

  The riots lasted eleven days. Estimated dead: **2.4 million.**

  The overseer who refused to reduce production — Director Havel Tor Varekh — became a curse word in the lower sectors. Workers still spit after saying his name.

  That's the texture of the Iseldoran Sagas: empire as a survival machine, and the people crushed in its gears remembered by name. There are hundreds of these threads.

  — Kerron

  P.S. If a friend would fall down this rabbit hole too, forward this — they can join the Dispatch [here](https://www.iseldoransagas.com/).
- **CTA:** Read more from the archive → https://www.iseldoransagas.com/

---

### Email 5 — Belong + what's coming (soft ask)
- **Send:** Day 9
- **Subject:** You're early — here's what that means
- **Preview:** Where this is going, and how to not miss the first book.
- **Body:**

  You found the Iseldoran Sagas before almost anyone. That matters to me, so here's the honest state of things:

  The archive is live and growing. The novels are coming — and as a Dispatch subscriber, **you'll be first to know the moment Book I is available.** No hunting, no missing it.

  Two ways to stay close until then:

  - **Follow along** where I post lore, art, and release news: [add your X / Instagram links]
  - **Keep exploring** — there are 38 volumes' worth of characters and history in the [compendium](https://www.iseldoransagas.com/), and I add to it constantly.

  Reply anytime. You're not on a list — you're early to something.

  — Kerron
- **CTA:** Follow the saga → [your primary social link]

---

## Metrics to watch

| Metric | Benchmark (early list) | Why |
|--------|------------------------|-----|
| Open rate | 40–60% (welcome emails run high) | Subject-line health, list quality |
| Click rate | 5–15% | Are people exploring the wiki? |
| Reply rate | Any replies are gold | Replies train deliverability *and* give you reader language |
| Unsub rate | < 1–2% per email | Pacing/relevance check |

Track which "door" (Email 2) gets the most replies — that's your audience telling you which entry point to lead with everywhere else.

---

## Implementation notes (important)

**The current signup form only *forwards* addresses to your inbox via FormSubmit — it cannot send an automated sequence.** To run this you need an email platform with automation:

- **Recommended free tiers:** MailerLite, Kit (ConvertKit), or Buttondown — all support automated welcome sequences. Paste each email above into the platform's automation builder.
- **Migration:** once you pick one, I'll swap `NEWSLETTER_ACTION` in the wiki to that provider's form endpoint (replacing FormSubmit), and the sequence runs automatically on every new signup.

**Bridge option (works today, no migration):** FormSubmit supports a one-time auto-reply via an `_autoresponse` field. We can wire **Email 1** as that auto-reply now, so every new subscriber gets an immediate welcome even before you set up a full ESP. Say the word and I'll add it to the signup form.

**Before sending:** drop your real X / Instagram URLs into Email 5 (and Email 2's reply prompt works as-is).

---

*Generated with the `emails` marketing skill. Related: `launch` (for the Book I release sequence), `social`, `copywriting`, `lead-magnets`.*
