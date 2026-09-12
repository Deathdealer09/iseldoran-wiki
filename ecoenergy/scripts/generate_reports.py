#!/usr/bin/env python3
"""Generates the customer-facing price list and the internal weekly sales report."""

import json, os
from collections import Counter
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
DATA, DOCS = os.path.join(HERE, "..", "data"), os.path.join(HERE, "..", "docs")
EDITION, VERSION = 1, 5
TT = timezone(timedelta(hours=-4))
NOW = datetime.now(TT)
DATESTR, TIMESTR, FSTAMP = NOW.strftime("%d %B %Y"), NOW.strftime("%H:%M"), NOW.strftime("%Y-%m-%d_%H%M")

load = lambda n: json.load(open(os.path.join(DATA, n)))
prospects, pricing, benchmarks, comms = load("prospects.json"), load("pricing.json"), load("benchmarks.json"), load("communications.json")
byid = {p["prospect_id"]: p for p in prospects}
priced = {p["product"]: p for p in pricing["products"]}
GRAVEL = priced["3/4 Gravel"]["base"]
SAND = priced["Sharp Sand"]["base"]
PLAST = priced["Plastering Sand"]["base"]

PEND = "PENDING VERIFICATION"
MERGED_TAG = "Prior EcoEnergy workbook"
merged_in = [p for p in prospects if MERGED_TAG in p["source_platform"]]
discovered = [p for p in prospects if MERGED_TAG not in p["source_platform"]]
contactable = [p for p in prospects if p["phone"] != PEND or p["email"] != PEND]
contacted = [p for p in prospects if p["status"] == "OUTREACH SENT"]
prio = Counter(p["priority"] for p in prospects)
cycle2 = [p for p in prospects if p["notes"].startswith("CYCLE 2")]
cycle4 = [p for p in prospects if p["notes"].startswith("CYCLE 4")]
cycle1 = [p for p in discovered if not p["notes"].startswith(("CYCLE 2", "CYCLE 4"))]
grades = Counter(p.get("lead_grade", "") for p in prospects)
def seg(*words):
    return [p for p in prospects if any(w in (p["customer_type"] + " " + p["products_sold"]).lower() for w in words)]
resellers = seg("hardware", "reseller", "wholesaler", "building materials", "stockpile")
sellers_analysed = [p for p in prospects if p.get("lead_grade") == "D - MARKET INTELLIGENCE"]
new_prices = [b for b in benchmarks if "Cycle 4" in b.get("note", "")]
intel = load("market_intel.json")
TOPIDS = {"ECO-0050", "ECO-0052", "ECO-0053"}

META = f"""**Author:** KS Pierre
**Creator:** KS Pierre
**Publisher:** KS Pierre
**Contributor:** Claude

**Edition:** {EDITION}
**Version:** {VERSION}
**Date:** {DATESTR}
**Time:** {TIMESTR} (Trinidad time, AST/UTC-4)
"""

# ----------------------------------------------------------------- PRICE LIST
pl = ["# ECOENERGY LIMITED", "## WEEKLY AGGREGATE PRICE LIST", "", "**Trinidad & Tobago**", "",
      META, "---", "", f"**Effective from:** {pricing['meta']['effective_from']}",
      f"**Next market review:** {pricing['meta']['next_review']}", "**Currency:** TTD", "",
      "---", "", "## PRICE SCHEDULE", "",
      "| Product | Market Benchmark | EcoEnergy Base Price | Unit | Basis |", "|---|---|---|---|---|"]
for p in pricing["products"]:
    pl.append(f"| {p['product']} | {p['benchmark']:.2f} | **{p['base']:.2f}** | {p['unit']} | Collection |")
pl += ["", "---", "", "## COLLECTION AND DELIVERY", "",
       "Prices are quoted on a **collection** basis. Delivery is quoted separately against distance,",
       "load size and site access. Customers collecting with their own fleet get the better commercial",
       "outcome, and EcoEnergy prices accordingly.",
       "", "---", "", "## VOLUME PRICING", "",
       "> Wholesale, cash-volume and contracted recurring customers may qualify for additional",
       "> negotiated volume discounts of up to 30%.", "",
       "Volume terms are negotiated against quantity, purchase frequency, payment method and payment",
       "speed, collection versus delivery, contract duration and total expected value.",
       "", "---", "", "## PRICING BASIS", "",
       "EcoEnergy prices at **90% of the verified market benchmark**, placing the base price",
       "approximately 10% below the comparable market rate.", "",
       "**Notes on this edition.**", "",
       "- Pitrun is benchmarked to the National Quarries published list. That document is effective",
       "  31 August 2022 and carries 12.5% VAT, so the benchmark is four years old and is retained",
       "  pending fresher evidence.",
       "- Backfill and sand fill are benchmarked to a retail load price, so those two bases are",
       "  indicative until an ex-quarry observation is obtained.",
       "- Plastering sand at Pine Road, Matura collects at TT$67.50/yd3, below the EcoEnergy base.",
       "  Quote location-specific where that source competes.",
       "", "### Contact", "", "Dawn Ramjit-Jones, EcoEnergy Limited", "",
       "Call: +1 (868) 368-5534", "", "WhatsApp: +1 (868) 251-7458", ""]
pln = f"EcoEnergy_Weekly_Price_List_Edition_{EDITION}_Version_{VERSION}_{FSTAMP}.md"
open(os.path.join(DOCS, pln), "w").write("\n".join(pl))

# -------------------------------------------------------------- SALES REPORT
# Top opportunities are drawn from prospects that have a LIVE contact route.
# Where the prospect publishes its own retail price the spread is evidence, not
# assumption: their published retail minus the EcoEnergy base.
TOP = [
    ("ECO-0050", "Sharp sand", 450.00, SAND, "Publishes TT$450/yd retail on sharp sand. Widest verified spread on record."),
    ("ECO-0052", "Sharp sand", 440.00, SAND, "Publishes TT$440/yd retail, corroborating the retail band."),
    ("ECO-0050", "Gravel", 350.00, GRAVEL, "Publishes TT$350/yd retail on gravel."),
    ("ECO-0053", "Gravel", 300.00, GRAVEL, "Publishes TT$300/yd online. Already contacted, correction due."),
    ("ECO-0050", "Plastering sand", 250.00, PLAST, "Publishes TT$250/yd retail on plastering sand."),
]
NOSPREAD = ["ECO-0049", "ECO-0051", "ECO-0054", "ECO-0055", "ECO-0006", "ECO-0056"]

sr = ["# ECOENERGY LIMITED", "## WEEKLY AGGREGATE SALES REPORT", "",
      f"**Reporting cycle:** Week commencing Monday 2026-09-07 | Run date {pricing['meta']['run_date']}",
      "", META, "---", "", "## 1. HEADLINE", "",
      f"The pipeline now holds **{len(prospects)} prospects**: {len(discovered)} discovered this cycle and",
      f"{len(merged_in)} carried forward from the prior EcoEnergy workbook, which was supplied mid-cycle.",
      f"All {len(pricing['products'])} materials now carry a base price, including pitrun, backfill and sand fill,",
      "which Version 1 could not price.", "",
      f"**{len(contactable)} prospects have a live contact route.** Every one of them comes from prior canon.",
      f"The remaining {len(prospects) - len(contactable)} are sourced and named but have no verified number or address.",
      "",
      f"**{len(contacted)} outbound e-mails are on record**, both sent outside this agent through Outlook. This",
      "agent has sent nothing.",
      "", "---", "", "## 1A. DAILY REPORT (brief section 21)", "",
      "```",
      f"NEW PROSPECTS FOUND:            {len(cycle4)}",
      f"HOT BUYERS (grade A):           {grades.get('A - HOT', 0)}",
      f"STRONG COMMERCIAL (grade B):    {grades.get('B - STRONG', 0)}   (whole book)",
      f"WHOLESALERS / RESELLERS:        {len(resellers)}   (whole book)",
      f"SELLERS / COMPETITORS ANALYSED: {len(sellers_analysed)}   (whole book)",
      f"NEW MARKET PRICES CAPTURED:     {len(new_prices)}",
      "OUTREACH SENT:                  0   (this agent; 2 e-mails on record are prior canon)",
      "RESPONSES:                      0",
      "QUOTE REQUESTS:                 0",
      "```",
      "",
      f"**HOT BUYERS is zero, and that is the headline.** Grade A requires an explicit current",
      "requirement read from a comment or post. No social platform was accessible, so no comment",
      "thread was read. See section 7.",
      "", "---", "", "## 2. PIPELINE METRICS", "", "| Metric | Value | Note |", "|---|---|---|",
      f"| Discovered cycle 1 | {len(cycle1)} | Directory and category sweep |",
      f"| Discovered cycle 2 | {len(cycle2)} | Quarry-licensing and regional sweep |",
      f"| Discovered cycle 4 | **{len(cycle4)}** | Social buyer-hunt, this run |",
      f"| Total discovered to date | {len(discovered)} | Daily target 25 |",
      f"| Against daily target of 25 | **{round(100*len(discovered)/25)}%** | Exceeded |",
      f"| Carried forward from prior canon | {len(merged_in)} | Not counted against the daily target |",
      f"| Duplicates avoided on merge | 1 | Concrete Aggregate Suppliers updated, not duplicated |",
      f"| Total pipeline | **{len(prospects)}** | |",
      f"| Tier 1 | {prio.get('TIER 1',0)} | |", f"| Tier 2 | {prio.get('TIER 2',0)} | |",
      f"| Tier 3 | {prio.get('TIER 3',0)} | |",
      f"| Benchmark/competitor records | {prio.get('BENCHMARK',0)} | Price references, not buyers |",
      f"| Prospects with a live contact route | **{len(contactable)}** | All from prior canon |",
      f"| Prospects with no contact route | {len(prospects)-len(contactable)} | Blocked, see section 6 |",
      f"| Emails sent | **{len(contacted)}** | Cumosco and KAMCO, prior canon |",
      "| Responses | **0** | Both still pending |", "| Quote requests | **0** | |",
      "| Quotes issued | **1** | Cumosco |", "| Negotiations | **0** | |", "| Customers won | **0** | |",
      "", "---", "", "## 3. PRICING POSITION", "",
      "| Product | Benchmark | EcoEnergy base | Internal floor at 30% | Basis |", "|---|---|---|---|---|"]
for p in pricing["products"]:
    st = "Stale benchmark" if "STALE" in p["status"] else ("Retail basis" if "RETAIL" in p["status"] else "Strong")
    sr.append(f"| {p['product']} | {p['benchmark']:.2f} | **{p['base']:.2f}** | {p['floor']:.2f} | {st} |")
sr += ["", "The floor column is the maximum 30% concession. Never advertised, never automatic.",
       "", "---", "", "## 4. PRICING EXCEPTION, ACTION REQUIRED", "",
       "The Cumosco e-mail of 2026-09-12 quoted **TT$125 / 195 / 205 per yd3** for pitrun, 3/8 and 3/4.",
       f"The canon list price is **TT$77.63 / {GRAVEL:.2f} / {GRAVEL:.2f}**. All three quoted figures sit above list.",
       "",
       "The owner ruled on 2026-09-12 that the price list is canon. A **corrected quotation must be issued**",
       "to Cumosco before any follow-up. The correction is downward, so it strengthens the approach rather",
       "than weakening it.",
       "",
       "Note also that the quote priced 3/8 and 3/4 differently, at TT$195 and TT$205, while the list holds",
       "3/8, 3/4 and sharp sand at an identical TT$167.06. That identical figure comes from the Bestcrete",
       "source listing three products at one price. It is worth re-verifying at the Sunday review.",
       "", "---", "", "## 5. TOP OPPORTUNITIES", "",
       "Ranked by **verified reseller spread**, which is the prospect's own published retail price minus",
       "the EcoEnergy base. These are observed figures, not assumptions.", "",
       "| # | Prospect | Contact | Material | Their retail | EcoEnergy base | Spread per yd | Why |",
       "|---|---|---|---|---|---|---|---|"]
for i, (pid, mat, retail, base, why) in enumerate(TOP, 1):
    p = byid[pid]
    sr.append(f"| {i} | {p['company']} ({pid}) | {p['phone']} | {mat} | {retail:.2f} | {base:.2f} | "
              f"**{retail-base:.2f}** | {why} |")
sr += ["", "### Every prospect with a live contact route", "",
       "| Prospect | Contact | Status | Next action |", "|---|---|---|---|"]
for p in sorted(contactable, key=lambda x: x["prospect_id"]):
    if p["prospect_id"] in TOPIDS:
        continue
    contact = p["phone"] if p["phone"] != PEND else p["email"]
    sr.append(f"| {p['company']} ({p['prospect_id']}) | {contact} | {p['status']} | {p['next_action'][:105]} |")

sr += ["", "---", "", "## 6. MARKET INTELLIGENCE", ""]
for it in intel:
    flag = "  **NOT VERIFIED.**" if it["verified"] == "NOT VERIFIED" else ""
    sr += [f"### {it['headline']}{flag}", "", it["detail"], "",
           f"**Implication.** {it['implication']}", "", f"Source: {it['source']}", ""]

sr += ["---", "", "## 7. CHANNEL ACCESS, VERIFIED THIS CYCLE", "",
       "### Metricool", "",
       "The Metricool connector is **authenticated and responding**. It returned four brands, and all",
       "of them are personal or Iseldoran Sagas accounts: `kerron.pierre5`, `thekerron`, `kerron347`,",
       "`kerron.shaul.pier` and `IseldoranSagas`.",
       "",
       "**There is no EcoEnergy brand in the account.** Nothing was posted to the personal accounts.",
       "",
       "Metricool also cannot do what this cycle needed it to do. Its toolset is scheduling, analytics",
       "and best-time-to-post for accounts you own. It has no facility to search Facebook, Instagram,",
       "TikTok, X or Threads for third-party prospects or prices. Its only third-party feature is",
       "competitor tracking on Instagram, Facebook, Twitch, YouTube, X and Bluesky, and that needs an",
       "EcoEnergy brand connected first.",
       "",
       "**Recommendation.** Create an EcoEnergy brand in Metricool and connect its Facebook and",
       "Instagram pages. That turns on competitor tracking against rival aggregate sellers and gives",
       "EcoEnergy an inbound lead channel of its own.",
       "", "### Social platforms", "",
       "Direct connection was tested this cycle against facebook.com, m.facebook.com, instagram.com,",
       "tiktok.com, x.com, threads.net and linkedin.com. **Every one was refused by the network egress",
       "policy.** app.metricool.com is blocked too; the connector reaches Metricool through the MCP",
       "proxy instead.",
       "",
       "**PLATFORM NOT ACCESSIBLE.** Every social finding in this report came from public search",
       "indexing of those pages, not from browsing them. No autonomous browser activity occurred.",
       "", "### Buyer groups located for comment mining", "",
       "Three active Trinidad buyer groups were identified but could not be read. Anyone with Facebook",
       "access can mine these directly for section 4 buying signals:", "",
       "- Gravel and sand delivery in Trinidad, group 909331405759624",
       "- Sand and gravel delivery in Trinidad, group 202165237740335",
       "- Best Value Gravel & Aggregates in Trinidad, group 339202526592121",
       "", "---", "", "## 8. BLOCKERS", "",
       f"### 8.1 Contact details for the {len(prospects)-len(contactable)} prospects without a route, BLOCKING", "",
       "Sourced and named, but no telephone number or e-mail could be verified. The egress policy",
       "refuses direct page fetches, including findyello.com, nqcl.co.tt, energy.gov.tt and",
       "tt.directory. Nothing was invented. **Remedy:** allowlist those hosts, or supply the details",
       "from a machine with ordinary web access.",
       "", "### 8.2 Messaging integration, BLOCKING", "",
       f"No authorised e-mail or messaging tool is connected to this agent. The {len(contacted)} e-mails on record",
       "were sent through Outlook, outside it. Outreach cannot be executed here.",
       "", "### 8.3 EcoEnergy licence status, BLOCKING THE STRONGEST PITCH", "",
       "The shortage and the crackdown make licensed supply a powerful position, but EcoEnergy's own",
       "licence or hold-over permit status is not recorded anywhere in this pipeline and was not",
       "supplied. **Do not claim licensed supply in any outreach until it is confirmed.**",
       "", "### 8.4 NQCL price list, PARTIALLY RESOLVED", "",
       "Pitrun is priced from prior canon at TT$86.25/yd3, but that document is effective 31 August",
       "2022 and the PDF is still blocked.",
       "", "---", "", "## 9. NEXT CYCLE", "",
       "1. Confirm EcoEnergy's quarry licence status. It gates the strongest pitch available.",
       "2. Issue the corrected Cumosco quotation at list, then follow up.",
       "3. Follow up KAMCO.",
       f"4. Work the {len(contactable)} live contact routes by telephone, starting with A Class Gravel &",
       "   Aggregates, NARS, AMCOL, B Chadee & Sons and On The Line.",
       "5. Create the EcoEnergy brand in Metricool and connect its Facebook and Instagram pages.",
       "6. Mine the three buyer groups above from a machine with Facebook access.",
       "7. Resolve 8.1 so the rest of the pipeline becomes workable.",
       "8. Re-verify the identical TT$185.62 Bestcrete figure and the 2022 NQCL pitrun benchmark at the",
       "   Sunday review.",
       ""]
srn = f"EcoEnergy_Weekly_Sales_Report_Edition_{EDITION}_Version_{VERSION}_{FSTAMP}.md"
open(os.path.join(DOCS, srn), "w").write("\n".join(sr))
print("wrote docs/" + pln)
print("wrote docs/" + srn)
print(f"contactable {len(contactable)} | contacted {len(contacted)} | cycle1 {len(cycle1)} | cycle2 {len(cycle2)}")
