#!/usr/bin/env python3
"""Generates the customer-facing price list and the internal weekly sales report."""

import json, os
from collections import Counter
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
DOCS = os.path.join(HERE, "..", "docs")
EDITION, VERSION = 1, 1
TT = timezone(timedelta(hours=-4))
NOW = datetime.now(TT)
DATESTR = NOW.strftime("%d %B %Y")
TIMESTR = NOW.strftime("%H:%M")
FSTAMP = NOW.strftime("%Y-%m-%d_%H%M")
VERSTR = "Edition %d Version %d" % (EDITION, VERSION)

load = lambda n: json.load(open(os.path.join(DATA, n)))
prospects, pricing, benchmarks = load("prospects.json"), load("pricing.json"), load("benchmarks.json")
byid = {p["prospect_id"]: p for p in prospects}
priced = {p["product"]: p for p in pricing["products"]}
GRAVEL = priced["3/4 gravel"]["base"]      # 167.06 TTD per cubic yard

META = """**Author:** KS Pierre
**Creator:** KS Pierre
**Publisher:** KS Pierre
**Contributor:** Claude

**Edition:** %d
**Version:** %d
**Date:** %s
**Time:** %s (Trinidad time, AST/UTC-4)
""" % (EDITION, VERSION, DATESTR, TIMESTR)

# ----------------------------------------------------------------- PRICE LIST
pl = ["# ECOENERGY LIMITED", "## WEEKLY AGGREGATE PRICE LIST", "",
      "**Trinidad & Tobago**", "", META, "---", "",
      "**Effective from:** %s" % pricing["meta"]["effective_from"],
      "**Next market review:** %s" % pricing["meta"]["next_review"],
      "**Currency:** TTD", "", "---", "", "## PRICE SCHEDULE", "",
      "| Product | Market Benchmark (TTD) | EcoEnergy Base Price (TTD) | Unit | Basis | Status |",
      "|---|---|---|---|---|---|"]
for p in pricing["products"]:
    bm = "%.2f" % p["benchmark"] if p["benchmark"] is not None else "No verified data"
    bs = "**%.2f**" % p["base"] if p["base"] is not None else "**Not set**"
    st = "Provisional" if p["confidence"] == "LOW" else ("Market verification required" if p["base"] is None else "Active")
    pl.append("| %s | %s | %s | %s | Collection ex-quarry | %s |" % (p["product"], bm, bs, p["unit"], st))

pl += ["", "---", "", "## COLLECTION AND DELIVERY", "",
       "Prices above are quoted on a **collection ex-quarry** basis.",
       "",
       "Delivery is quoted separately against distance, load size and site access. Customers who",
       "collect with their own fleet receive the better commercial outcome, and EcoEnergy prices",
       "accordingly.",
       "", "---", "", "## VOLUME PRICING", "",
       "> Wholesale, cash-volume and contracted recurring customers may qualify for additional",
       "> negotiated volume discounts of up to 30%.",
       "",
       "Volume terms are negotiated against quantity, purchase frequency, payment method and",
       "payment speed, collection versus delivery, contract duration and total expected value.",
       "", "---", "", "## MATERIALS AWAITING PRICING", ""]
for p in pricing["products"]:
    if p["base"] is None:
        pl.append("**%s** — price not yet published. %s" % (p["product"], "Market verification in progress."))
        pl.append("")
pl += ["---", "", "## PRICING BASIS AND LIMITATIONS", "",
       "EcoEnergy prices at **90% of the verified market benchmark**, placing the base price",
       "approximately 10% below the comparable market rate.",
       "",
       "**Evidence standard applied to this edition.** The four published prices above derive from a",
       "single verified Trinidad & Tobago source, recorded in full on the MARKET BENCHMARKS sheet of",
       "the pipeline workbook. The brief requires multiple observations for each material. One",
       "credible published source was reachable during this cycle, so these prices are issued as",
       "**provisional** and will be re-derived once a second source is obtained.",
       "",
       "Pitrun and sandfill/backfill carry no published price because no verified Trinidad & Tobago",
       "price was located. No figure has been estimated for them.",
       "",
       "### Contact", "",
       "Dawn Ramjit-Jones, EcoEnergy Limited", "",
       "Call: +1 (868) 368-5534", "", "WhatsApp: +1 (868) 251-7458", ""]

pln = "EcoEnergy_Weekly_Price_List_Edition_%d_Version_%d_%s.md" % (EDITION, VERSION, FSTAMP)
open(os.path.join(DOCS, pln), "w").write("\n".join(pl))

# -------------------------------------------------------------- SALES REPORT
# Illustrative volume assumptions. These are stated planning assumptions, NOT
# customer-stated requirements. No prospect has been contacted.
ASSUMPTIONS = [
    ("Ready-mix plant (multi-site)", 200),
    ("Ready-mix plant (single/regional)", 150),
    ("Block plant", 120),
    ("National hardware chain", 100),
    ("Large civil contractor, during works", 300),
    ("Aggregate reseller / independent hardware", 40),
    ("Equipment and haulage reseller", 60),
]
ASSUME = dict(ASSUMPTIONS)

TOP10 = [
    ("ECO-0008", "Sharp sand; 3/8 and 3/4 gravel", "Ready-mix plant (multi-site)", "Weekly, continuous",
     "Not established", "HIGH", "Multi-plant national footprint, the largest continuous draw in the market."),
    ("ECO-0009", "Sharp sand; 3/8 and 3/4 gravel", "Ready-mix plant (multi-site)", "Weekly, continuous",
     "Not established", "HIGH", "Multi-site including Tobago, where a freight premium may be undercut."),
    ("ECO-0016", "Pitrun; 3/8 and 3/4 gravel; sharp sand", "Aggregate reseller / independent hardware", "Recurring",
     "Not established", "HIGH", "Publicly advertising truckload sand and gravel now, and the wording indicates they resell third-party material."),
    ("ECO-0040", "Full range", "Equipment and haulage reseller", "Recurring",
     "Not established", "HIGH", "Already offers aggregate supply as a service line, so already buys aggregate in."),
    ("ECO-0015", "Full range", "National hardware chain", "Recurring",
     "Not established", "HIGH", "One agreement supplies many branches. Largest single strategic prize."),
    ("ECO-0012", "Sharp sand; 3/8 gravel; plastering sand", "Block plant", "Continuous",
     "Not established", "MEDIUM-HIGH", "Block, paver and ventilation block production runs continuously."),
    ("ECO-0006", "Full range", "Aggregate reseller / independent hardware", "Recurring",
     "Not established", "MEDIUM-HIGH", "A dedicated aggregate supply business must buy from a quarry."),
    ("ECO-0004", "Pitrun; 3/4 and 3/8 gravel; sharp sand", "Large civil contractor, during works", "Project-driven",
     "Not established", "MEDIUM", "Both a large road contractor and an aggregate supplier, so the relationship can run either way."),
    ("ECO-0013", "Sharp sand; 3/8 gravel; plastering sand", "Block plant", "Continuous",
     "Not established", "MEDIUM-HIGH", "Newly independent and scaling, so more likely than an incumbent to switch on price."),
    ("ECO-0021", "Full range", "Aggregate reseller / independent hardware", "Recurring",
     "Bestcrete Aggre GO! at TTD 22.44 per 30kg bag (retail)", "MEDIUM",
     "Known current supplier, so the displacement pitch is concrete and measurable."),
]

prio = Counter(p["priority"] for p in prospects)
wk_vol = sum(ASSUME[t[2]] for t in TOP10)
wk_rev = wk_vol * GRAVEL

sr = ["# ECOENERGY LIMITED", "## WEEKLY AGGREGATE SALES REPORT", "",
      "**Reporting cycle:** Week commencing Monday 2026-09-07 | Run date %s" % pricing["meta"]["run_date"],
      "", META, "---", "", "## 1. HEADLINE", "",
      "The pipeline did not exist before this cycle. It now holds **%d sourced prospects**, a published" % len(prospects),
      "provisional price schedule for four materials, and %d recorded market observations." % len(benchmarks),
      "",
      "**No prospect has been contacted.** Direct outreach is blocked, and the reason is set out in",
      "section 6. Nothing in this report should be read as a conversation in progress.",
      "", "---", "", "## 2. PIPELINE METRICS", "",
      "| Metric | Value | Note |", "|---|---|---|",
      "| New prospects this cycle | **%d** | Daily target 25 |" % len(prospects),
      "| Against daily target of 25 | **%d%%** | Exceeded |" % round(100*len(prospects)/25),
      "| Against weekly target of 175 | **%d%%** | Single cycle, cold start |" % round(100*len(prospects)/175),
      "| Tier 1 prospects | %d | Highest-value buyers and resellers |" % prio.get("TIER 1", 0),
      "| Tier 2 prospects | %d | Secondary commercial buyers |" % prio.get("TIER 2", 0),
      "| Tier 3 prospects | %d | Low volume, steady |" % prio.get("TIER 3", 0),
      "| Benchmark/competitor records | %d | Price references, not buyers |" % prio.get("BENCHMARK", 0),
      "| Verified direct contact details | **0** | Blocked, see section 6 |",
      "| Emails sent | **0** | No messaging integration authorised |",
      "| Responses | **0** | No outreach, therefore no responses |",
      "| Qualified opportunities | **0** | Qualification requires contact |",
      "| Quote requests | **0** | |", "| Quotes issued | **0** | |",
      "| Negotiations | **0** | |", "| Customers won | **0** | |",
      "", "---", "", "## 3. PRICING POSITION", "",
      "| Product | Benchmark | EcoEnergy base | Position |", "|---|---|---|---|"]
for p in pricing["products"]:
    if p["base"] is None:
        sr.append("| %s | No data | Not set | Market verification required |" % p["product"])
    else:
        sr.append("| %s | %.2f | **%.2f** | 10%% below benchmark |" % (p["product"], p["benchmark"], p["base"]))
sr += ["",
       "Internal negotiating floor at the maximum 30%% concession: **TTD %.2f** per cubic yard for" % priced["3/4 gravel"]["floor"],
       "gravel and sharp sand, **TTD %.2f** for plastering sand. Never advertised, never automatic." % priced["Plastering sand"]["floor"],
       "", "---", "", "## 4. TOP 10 OPPORTUNITIES", "",
       "**Revenue figures below are illustrative planning estimates built on the stated volume",
       "assumptions in section 5. No prospect has stated a requirement. They are not forecasts.**", "",
       "| # | Prospect | Material | Assumed volume (cu yd/wk) | Frequency | Current supplier / price | EcoEnergy price | Illustrative wk revenue (TTD) | Fit | Next action |",
       "|---|---|---|---|---|---|---|---|---|---|"]
for i, (pid, mat, seg, freq, cur, fit, why) in enumerate(TOP10, 1):
    p = byid[pid]
    vol = ASSUME[seg]
    sr.append("| %d | %s (%s) | %s | %d | %s | %s | %.2f/cu yd | %s | %s | %s |"
              % (i, p["company"][:46], pid, mat, vol, freq, cur, GRAVEL,
                 vol*GRAVEL, fit, "Verify contact, then approach"))
sr += ["",
       "| Total | | | **%d cu yd/wk** | | | | **%s** | | |" % (wk_vol, "{:,.2f}".format(wk_rev)),
       "",
       "Annualised at 52 weeks that is **TTD %s**, on the stated assumptions alone." % "{:,.2f}".format(wk_rev*52),
       "", "### Why these ten", ""]
for i, (pid, mat, seg, freq, cur, fit, why) in enumerate(TOP10, 1):
    sr.append("%d. **%s** — %s" % (i, byid[pid]["company"], why))
sr += ["", "---", "", "## 5. STATED ASSUMPTIONS", "",
       "Volumes are planning assumptions by segment, applied uniformly. They are not customer-stated",
       "requirements and carry no evidential weight.", "",
       "| Segment | Assumed cu yd per week |", "|---|---|"]
for seg, v in ASSUMPTIONS:
    sr.append("| %s | %d |" % (seg, v))
sr += ["",
       "Revenue is assumed volume multiplied by the EcoEnergy base price of TTD %.2f per cubic yard," % GRAVEL,
       "before any negotiated volume discount. Applying the full 30% concession across the whole book",
       "would reduce the illustrative weekly figure to TTD %s." % "{:,.2f}".format(wk_vol*priced["3/4 gravel"]["floor"]),
       "", "---", "", "## 6. BLOCKERS REQUIRING A DECISION", "",
       "### 6.1 Contact detail acquisition — BLOCKING",
       "",
       "Every prospect below is sourced and named, but not one telephone number, e-mail address or",
       "WhatsApp number was captured. This environment's egress policy refuses direct page fetches, and",
       "the refusal covers the exact hosts that carry the details: findyello.com, nqcl.co.tt,",
       "energy.gov.tt, tt.directory and the company sites themselves. Search result summaries do not",
       "carry reliable contact data.",
       "",
       "No number has been invented to fill the gap. **Remedy:** allowlist those hosts for this",
       "environment, or supply the contact details from a machine with ordinary web access.",
       "",
       "### 6.2 Messaging integration — BLOCKING",
       "",
       "No authorised e-mail or messaging tool is connected to this agent. Even with addresses in hand,",
       "outreach could not be executed. **Remedy:** connect and authorise a sending integration.",
       "",
       "### 6.3 NQCL price list — HIGH VALUE",
       "",
       "National Quarries is the state producer and the market's reference price setter. Its 2025 price",
       "list is public but the domain is blocked. Obtaining it would lift pricing confidence from a",
       "single commercial source to a supported benchmark.",
       "",
       "### 6.4 Social comment mining — NOT ACCESSIBLE",
       "",
       "Facebook, Instagram, X and Threads are not reachable from this environment. The comment-mining",
       "loop in section 4 of the brief could not be run. One live marketplace buying signal was",
       "recovered through public search indexing and is recorded as ECO-0048, but its advertised",
       "WhatsApp number could not be read and has not been guessed.",
       "", "---", "", "## 7. NEXT CYCLE", "",
       "1. Resolve 6.1. Nothing else in the loop moves revenue until contact details exist.",
       "2. Obtain the NQCL price list and a second commercial source, then re-derive all six prices.",
       "3. Price pitrun and sandfill/backfill, the two unpriced core lines.",
       "4. Issue the wholesale introduction to the Tier 1 resellers first: ECO-0016, ECO-0040, ECO-0015, ECO-0006.",
       "5. Cost the Tobago freight leg before quoting ECO-0025.",
       "6. Work the HDC Infill Lots small-contractor list, which is winnable without a state tender.",
       ""]
srn = "EcoEnergy_Weekly_Sales_Report_Edition_%d_Version_%d_%s.md" % (EDITION, VERSION, FSTAMP)
open(os.path.join(DOCS, srn), "w").write("\n".join(sr))
print("wrote docs/%s" % pln)
print("wrote docs/%s" % srn)
print("illustrative weekly revenue TTD %s across %d cu yd/wk" % ("{:,.2f}".format(wk_rev), wk_vol))
