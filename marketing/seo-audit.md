# SEO Audit — The Iseldoran Sagas Wiki

**Site:** www.iseldoransagas.com · **Audited:** 2026-06-26 · **Goal:** sell novels + build audience from zero

## Executive Summary

The wiki contains ~1.74M words of genuinely unique, high-quality lore across 46 volumes, 82+ characters/lore entries, a timeline, and galleries — an enormous latent SEO and AI-citation asset. **Almost none of it is currently visible to Google or AI crawlers.** The site is a client-side React app transpiled by Babel *in the browser*, with all navigation handled by React state on a single URL. To a crawler the entire site is one near-empty page.

There is also no way to buy the books: all 46 volumes link to `#`.

These are architectural problems, not content problems. The content is ready; the delivery layer blocks it.

### Top priority issues
1. **Content is not indexable** — client-side-only rendering hides all lore from search/AI. *(Critical)*
2. **No real URLs** — single-state SPA means nothing deep can ever rank or be linked. *(Critical)*
3. **No buy links** — all 46 books point to `#`; the "sell novels" goal is structurally blocked. *(Critical)*
4. **No robots.txt / sitemap / per-page meta / schema** — zero crawl infrastructure. *(High)*
5. **No email capture** — traffic, once earned, isn't converted into an audience. *(High)*

---

## Technical SEO Findings

### 1. Client-side-only rendering — content invisible to crawlers
- **Impact:** Critical
- **Evidence:** `index.html` ships `<div id="root"></div>` plus React + Babel `@babel/standalone` loaded from unpkg. The page is transpiled and rendered in the browser. Crawlers (and most AI bots) that don't execute JS see no body content. Live fetch returned 403, but the source is conclusive.
- **Fix:** Pre-render content to static HTML. Options, lightest to heaviest: (a) generate static HTML pages from the existing data arrays (`BOOKS`, `LORE`, `SOVEREIGNS`, `TIMELINE`) with a small build script; (b) migrate to a static-site generator / framework with SSG (Astro is an excellent fit for a content/lore site — keeps your React components, outputs static HTML). Either way, remove Babel-in-browser from production.

### 2. Single-URL SPA — no indexable pages
- **Impact:** Critical
- **Evidence:** `App()` uses `const [page, setPage] = useState("home")`; `Nav` calls `go(p)` to swap state. No router, no `pushState`, no hash routes. Every view shares `https://www.iseldoransagas.com/`.
- **Fix:** Give every entity its own URL: `/novels/no-gods-no-masters`, `/characters/gamelon`, `/lore/the-cooling-riots`, `/timeline/al-saud-era`, etc. Real URLs are what get indexed, linked, and shared. This is the unlock for the entire lore archive.

### 3. No robots.txt or XML sitemap
- **Impact:** High
- **Evidence:** Neither file exists in the repo root.
- **Fix:** Add `robots.txt` referencing a generated `sitemap.xml` listing every page URL (generate from the data arrays so it stays in sync). Submit in Google Search Console + Bing Webmaster Tools.

### 4. No per-page titles, meta descriptions, or canonicals
- **Impact:** High
- **Evidence:** `index.html` has one static `<title>The Iseldoran Sagas Wiki</title>` and one meta description for the whole site. No `document.title` updates in the JSX; no canonical tags.
- **Fix:** Unique, keyword-aligned `<title>` (50–60 chars) and meta description (150–160) per page, plus a self-referencing canonical. e.g. *"No Gods No Masters — Iseldoran Sagas Vol. I"* / character names + "Iseldoran Sagas character".

### 5. No Open Graph / Twitter Card tags
- **Impact:** High (you've prioritized social)
- **Evidence:** No `og:` or `twitter:` tags in `index.html` or JSX.
- **Fix:** Per-page OG title/description/image (use the cover art and portraits you already have). Without these, every link shared to social shows a blank/ugly preview — actively suppressing the social channel.

### 6. No structured data (JSON-LD)
- **Impact:** High for a book catalog
- **Evidence:** No `application/ld+json` anywhere.
- **Fix:** `Book` schema per volume (name, author, isbn, url, offers when buy links exist), `Person` schema for characters/sovereigns, `Breadcrumb` schema for navigation. This is what earns rich results and feeds AI answer engines. (See the `schema` and `ai-seo` skills.)

### 7. Babel-in-browser hurts Core Web Vitals
- **Impact:** Medium
- **Evidence:** `@babel/standalone` transpiles on every page load — heavy JS execution, slow LCP/INP.
- **Fix:** Resolved automatically by pre-rendering / a build step (issue #1).

---

## On-Page & Content Findings

### 8. Buy links are all placeholders
- **Impact:** Critical for revenue (not strictly SEO, but it's the goal)
- **Evidence:** All 46 entries in `BOOKS` use `k: "#", p: "#"` (Kindle/Print). Nothing is purchasable.
- **Fix:** Add real Amazon/retailer links as books go live. Until then, replace `#` with an email-capture CTA ("Get notified when this releases") so demand is captured, not lost.

### 9. No email capture anywhere
- **Impact:** High (you've prioritized email)
- **Evidence:** No signup form, newsletter, or list integration in the JSX.
- **Fix:** Add a newsletter signup (e.g. ConvertKit/Kit, MailerLite, Buttondown) to the home hero, the about page, and every book/lore page. This is the bridge from SEO/social traffic to a launch audience. (See the `emails` and `lead-magnets` skills.)

### 10. Strong content & E-E-A-T potential (the good news)
- **Evidence:** ~1.74M words of original, internally-consistent lore; in-world archivist framing; rich detail. Images already carry descriptive `alt` text.
- **Opportunity:** Once indexable with real URLs, this is exactly the deep, original content Google and AI engines reward. Internal linking between characters ↔ books ↔ timeline ↔ lore will build powerful topical authority.

---

## Prioritized Action Plan

**Phase 1 — Make it indexable (unblocks everything else)**
1. Pre-render to static HTML with a build step (Astro or a generator script over the existing data arrays).
2. Give every book / character / lore entry / timeline era its own URL.
3. Generate `sitemap.xml` + add `robots.txt`; verify in Search Console & Bing.

**Phase 2 — Capture demand**
4. Add real buy links (or "notify me" capture where books aren't live yet).
5. Add email signup across the site.

**Phase 3 — Optimize & amplify**
6. Per-page titles, meta, canonicals, Open Graph/Twitter cards.
7. JSON-LD: `Book`, `Person`, `Breadcrumb` schema.
8. Internal-linking pass across the lore graph.
9. Then drive traffic via social, with shareable previews working.

---

*Generated with the `seo-audit` marketing skill. Related: `schema`, `ai-seo`, `programmatic-seo`, `site-architecture`, `emails`, `cro`.*
