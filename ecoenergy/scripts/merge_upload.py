#!/usr/bin/env python3
"""
Merges the pre-existing EcoEnergy workbook (uploaded 2026-09-12) into the data store.

The uploaded workbook is PRIOR CANON. It carries verified telephone numbers,
e-mail addresses, two confirmed outbound e-mails and a pricing schedule covering
materials that Edition 1 Version 1 could not price. Nothing in it is discarded.

Owner decisions applied to this merge:
  1. The published price list is canon. The Cumosco quotation (TT$125/195/205
     per yd3) sits ABOVE list and is flagged for a corrected quotation.
  2. The workbook is rebuilt to the six worksheets required by section 9.
"""

import json, os
from decimal import Decimal, ROUND_HALF_UP

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
RUN = "2026-09-12"
PENDING = "PENDING VERIFICATION"
NOT_PUB = "Not publicly listed"

load = lambda n: json.load(open(os.path.join(DATA, n)))
save = lambda n, o: json.dump(o, open(os.path.join(DATA, n), "w"), indent=2)

prospects = load("prospects.json")
benchmarks = load("benchmarks.json")

# ------------------------------------------------------------------ 1. DEDUPE
# Section 10: search the workbook before creating anything. "Concrete Aggregate
# Suppliers" already exists as ECO-0006 from the directory sweep. The uploaded
# record carries a telephone number and a precise location, so the existing
# record is UPDATED rather than duplicated.
dedup_updates = {
    "ECO-0006": dict(
        phone="868-750-1625",
        location="Charlieville",
        customer_type="Aggregate supplier / equipment",
        status="CONTACT AVAILABLE",
        notes_append=(" | MERGED 2026-09-12 from the prior EcoEnergy workbook: telephone "
                      "868-750-1625 and Charlieville location supplied by prior canon. Prior "
                      "record listed this as an aggregate/paving materials supplier with no "
                      "published price, priority Medium. Duplicate avoided per section 10."),
    )
}
merged = 0
for p in prospects:
    up = dedup_updates.get(p["prospect_id"])
    if up:
        p["phone"] = up["phone"]
        p["location"] = up["location"]
        p["customer_type"] = up["customer_type"]
        p["status"] = up["status"]
        p["notes"] = p["notes"] + up["notes_append"]
        p["next_action"] = ("Telephone 868-750-1625 and open the wholesale supply conversation. "
                            "Contact route is live, so this no longer needs detail verification.")
        merged += 1

# --------------------------------------------------------- 2. NEW FROM UPLOAD
seq = max(int(p["prospect_id"].split("-")[1]) for p in prospects)


def N(company, ctype, priority, location, phone, source, signal,
      products, observed="Not published", email="", whatsapp="",
      status="CONTACT AVAILABLE", opportunity="", last_comm="", next_action="", notes=""):
    global seq
    seq += 1
    return {
        "prospect_id": "ECO-%04d" % seq, "date_identified": RUN, "company": company,
        "contact_name": NOT_PUB, "customer_type": ctype, "priority": priority,
        "location": location, "phone": phone, "whatsapp": whatsapp or PENDING,
        "email": email or PENDING, "facebook": PENDING, "instagram": PENDING,
        "x_twitter": PENDING, "threads": PENDING, "website": PENDING,
        "source_platform": "Prior EcoEnergy workbook (merged 2026-09-12)",
        "source_url": source, "buying_signal": signal, "products_needed": products,
        "products_sold": products, "est_volume": "Not stated - to establish on contact",
        "purchase_freq": "Not stated - to establish on contact", "observed_price": observed,
        "eco_price": "Per current EcoEnergy price list (see WEEKLY PRICING)",
        "potential_discount": "Up to 30% subject to qualification",
        "status": status, "last_contact": last_comm,
        "next_followup": "2026-09-15", "next_action": next_action,
        "notes": ("CARRIED FORWARD FROM PRIOR CANON. Contact details below were verified in the "
                  "prior workbook and are NOT the product of this cycle's searches. " + notes
                  + (" EcoEnergy opportunity as previously assessed: " + opportunity if opportunity else "")),
    }


CALL = "Telephone and open the wholesale supply conversation. Contact route is live."
new = [
    N("On The Line General Hardware", "Hardware / reseller", "TIER 1", "Chaguanas / Felicity",
      "242-4699 / 234-4949", "https://www.equipment10.com/TT/Chaguanas/1915323488711905/On-The-Line-General-Hardware",
      "Advertises plastering sand and gravel by the load - an active aggregate reseller.",
      "Plastering sand; gravel", "Plastering sand TT$1,200/load; gravel TT$2,350/load",
      whatsapp="796-1337 / 469-9178", opportunity="Wholesale/repeat reseller supply",
      next_action=CALL + " Load pricing is published, so the reseller spread can be quantified before the call."),

    N("NARS Value Hardware", "Hardware / reseller", "TIER 1", "San Juan", "625-7326",
      "https://www.findglocal.com/TT/San-Juan/1797123157231816/NARS-Value-Hardware-Ltd",
      "Publishes per-yard retail prices across three EcoEnergy lines - a confirmed reseller.",
      "Gravel; sharp sand; plastering sand",
      "Gravel TT$350/yd; sharp sand TT$450/yd; plastering sand TT$250/yd",
      whatsapp="747-6941 / 332-5433", opportunity="Large reseller margin possible",
      next_action=CALL + " Their sharp sand retails at TT$450/yd against an EcoEnergy base of TT$167.06, so lead with the spread."),

    N("Trinidad Quarry Materials", "Aggregate reseller / delivery", "TIER 1", "Sangre Grande",
      "868-704-6438", "https://www.findglocal.com/TT/Sangre-Grande-Town/106173400997686/Trinidad-Quarry-Materials",
      "Sells gravel, plastering sand, backfill and crusher run by the load with delivery.",
      "Gravel; plastering sand; backfill; crusher run",
      "Gravel TT$1,800/load; plastering sand TT$1,400/load",
      opportunity="Wholesale supply / overflow source",
      next_action=CALL + " Also qualify as an overflow supply source, not only as a buyer."),

    N("AMCOL Hardware", "Hardware / reseller", "TIER 1", "Penal", "647-7653",
      "https://www.amcolhardwarett.com/search.php?category=Construction+Aggregate",
      "Publishes an online construction aggregate catalogue including mixes, backfill and sandfill.",
      "Aggregate; gravel/sand mixes; backfill; sandfill",
      "3/8 mix 8yd TT$2,300; 10yd aggregate mix TT$3,000; sharp sand TT$440/yd",
      opportunity="Strong reseller prospect",
      next_action=CALL + " Their published catalogue is also the benchmark source for backfill and sand fill, so keep it monitored."),

    N("Cumosco", "Online hardware / reseller", "TIER 1", "Trinidad & Tobago", "868-689-3606",
      "https://www.cumosco.com/product/gravel/",
      "Sells gravel online at TT$300/yd. Already contacted by EcoEnergy.",
      "Gravel; sand", "Gravel TT$300/yd", email="sales@cumosco.com",
      status="OUTREACH SENT", last_comm="2026-09-12",
      opportunity="Wholesale supply",
      next_action=("CORRECTED QUOTATION REQUIRED. The e-mail of 2026-09-12 quoted TT$125 / 195 / 205 per "
                   "yd3 for pitrun / 3/8 / 3/4. All three sit ABOVE the canon list price of TT$77.63 / "
                   "167.06 / 167.06. Issue a corrected quotation at list before any follow-up."),
      notes="PRICING EXCEPTION - see COMMUNICATIONS LOG and the corrected-quotation action."),

    N("KAMCO Marketing & Contracting", "Procurement / contractor", "TIER 1", "San Fernando",
      "868-755-1702", "https://kmclglobal.com/",
      "Construction materials procurement business. Already contacted by EcoEnergy.",
      "Construction materials procurement", "Quote-based",
      email="kamcomarketing2014@gmail.com", status="OUTREACH SENT", last_comm="2026-09-12",
      opportunity="Project/contract supply",
      next_action="Follow up on the 2026-09-12 introduction and qualify material and volume. No price was quoted, so no correction is needed."),

    N("Southern Aggregate and Supplies Ltd", "Hardware / reseller", "TIER 1", "San Fernando",
      "868-271-9382", "Business listing (prior workbook)",
      "Named as an aggregate and building materials supplier - buys aggregate to resell.",
      "Aggregate / building materials", opportunity="Wholesale reseller", next_action=CALL),

    N("James Transport", "Aggregate supplier / trucking", "TIER 2", "Diego Martin",
      "868-633-7144", "Business listing (prior workbook)",
      "Combines aggregate supply with transport - both a buyer and a delivery partner.",
      "Aggregate supply / transport", opportunity="Distribution / trucking / resale",
      next_action=CALL + " Qualify for both material supply and haulage capacity."),

    N("Gibson's Hardware", "Building materials supplier", "TIER 2", "Aripero", "868-651-1033",
      "Business listing (prior workbook)", "Building materials supplier in south Trinidad.",
      "Building materials", opportunity="Reseller supply", next_action=CALL),

    N("K&S Hardware and Plumbing Supplies", "Building materials store", "TIER 2", "Cunupia",
      "868-219-3689", "Business listing (prior workbook)",
      "Building materials store in the central construction corridor.",
      "Building materials", opportunity="Reseller supply", next_action=CALL),

    N("Seupersad's Y Junction Hardware", "Building materials supplier", "TIER 2", "Claxton Bay",
      "868-348-4020", "Business listing (prior workbook)", "Building materials supplier.",
      "Building materials", opportunity="Reseller supply", next_action=CALL),
]
prospects.extend(new)

names = [p["company"].strip().lower() for p in prospects]
assert len(names) == len(set(names)), "duplicate company after merge"
ids = [p["prospect_id"] for p in prospects]
assert len(ids) == len(set(ids)), "duplicate id after merge"
save("prospects.json", prospects)

# ------------------------------------------------------ 3. PRICING (PRIOR CANON)
# Figures reproduced exactly from the uploaded Weekly Pricing sheet. Base and
# floor are recomputed from the same benchmark and rule so the arithmetic is
# auditable; displayed to 2 dp where the source carried float noise.
def money(x):
    """Commercial half-up rounding to 2dp. Python's round() is banker's rounding and
    would turn the canon pitrun base of 77.625 into 77.62 rather than 77.63."""
    return float(Decimal(str(x)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def row(product, benchmark, unit, source, verified, confidence, status, note):
    exact_base = benchmark * 0.90
    exact_floor = exact_base * 0.70
    base, floor = money(exact_base), money(exact_floor)
    note = note + (" Exact unrounded values: base %.6f, floor %.6f; published figures are rounded "
                   "half-up to 2dp for commercial use." % (exact_base, exact_floor))
    return dict(product=product, benchmark=benchmark, base=base, floor=floor, unit=unit,
                confidence=confidence, source=source, status=status, note=note,
                last_verified=verified, exact_base=exact_base, exact_floor=exact_floor)

BEST = "https://buildwithabs.com/product/bulk-aggregate/"
AMCOL = "https://www.amcolhardwarett.com/search.php?category=Construction+Aggregate"
STRONG = "Bestcrete/Aggre GO current public bulk price, VAT inclusive. Strong directly comparable benchmark."

pricing_products = [
    row("Pitrun", 86.25, "TT$/yd3 (collection)",
        "https://nqcl.co.tt/wp-content/uploads/NQCL-Price-List-2025.pdf", "2026-09-12",
        "MEDIUM", "ACTIVE - STALE BENCHMARK",
        "NQCL official published list. The document is effective 31-Aug-2022 and carries +12.5% VAT, so "
        "the benchmark is four years old. Retained per prior canon and per section 7, which requires the "
        "last verified price to be kept when no fresher evidence exists. Re-verify at the next review."),
    row("3/8 Gravel", 185.62, "TT$/yd3 (collection)", BEST, "2026-09-12", "MEDIUM", "ACTIVE", STRONG),
    row("3/4 Gravel", 185.62, "TT$/yd3 (collection)", BEST, "2026-09-12", "MEDIUM", "ACTIVE", STRONG),
    row("Sharp Sand", 185.62, "TT$/yd3 (collection)", BEST, "2026-09-12", "MEDIUM", "ACTIVE",
        "Bestcrete/Aggre GO current public bulk price, VAT inclusive. NARS retail is TT$450/yd3 and "
        "Cumosco TT$300/yd3, which shows the reseller spread available."),
    row("Plastering Sand", 84.38, "TT$/yd3 (collection)", BEST, "2026-09-12", "MEDIUM", "ACTIVE",
        "Bestcrete collection price, VAT inclusive. Pine Road Matura collection is TT$67.50/yd3, so quote "
        "location-specific where relevant."),
    row("Backfill / Overburden", 140.625, "TT$/yd3", AMCOL, "2026-09-12", "MEDIUM", "ACTIVE - RETAIL BASIS",
        "AMCOL 8-yard load TT$1,125 = TT$140.625/yd3. Likely a retail or delivered context, so not directly "
        "ex-quarry comparable. Treat the base as indicative until an ex-quarry observation is obtained."),
    row("Sand Fill", 126.563, "TT$/yd3", AMCOL, "2026-09-12", "MEDIUM", "ACTIVE - RETAIL BASIS",
        "AMCOL 10-yard load TT$1,265.63 = TT$126.563/yd3. Likely a retail or delivered context."),
]
meta = dict(run_date=RUN, effective_from=RUN,
            next_review="2026-09-13 23:59 (Sunday, Trinidad time, AST/UTC-4)",
            margin_rule="EcoEnergy base = verified market benchmark x 0.90 (10% below market)",
            discount_rule="Negotiated volume discount up to 30% off base for qualified cash, wholesale, "
                          "high-volume and contracted recurring customers. Never automatic.",
            currency="TTD", cold_start=False,
            canon_note="Pricing carried forward from the prior EcoEnergy workbook and confirmed as canon "
                       "by the owner on 2026-09-12.")
save("pricing.json", dict(meta=meta, products=pricing_products))

# --------------------------------------------------- 4. COMMUNICATIONS (CANON)
comms = [
    dict(datetime="2026-09-12", prospect_id="ECO-0053", prospect="Cumosco", channel="Email",
         direction="Outbound", recipient="sales@cumosco.com",
         message_type="Wholesale aggregate supply introduction",
         material="Pitrun; 3/8; 3/4", volume="",
         price_quoted="TT$125 / 195 / 205 per yd3", discount="No", response="Pending",
         followup="2026-09-15",
         next_action="CORRECTED QUOTATION REQUIRED before follow-up. Quoted prices sit above the canon "
                     "list price of TT$77.63 / 167.06 / 167.06 per yd3.",
         logged_by="Prior canon - Outlook Sent Items"),
    dict(datetime="2026-09-12", prospect_id="ECO-0054", prospect="KAMCO Marketing & Contracting",
         channel="Email", direction="Outbound", recipient="kamcomarketing2014@gmail.com",
         message_type="Individualised EcoEnergy supply introduction",
         material="Aggregate", volume="", price_quoted="Market-based", discount="No",
         response="Pending", followup="2026-09-15",
         next_action="Follow up and qualify material and volume.",
         logged_by="Prior canon - Outlook send action"),
]
save("communications.json", comms)

# ------------------------------------------------------- 5. NEW OBSERVATIONS
def B(seller, product, price, unit, basis, category, delivery, location, source, note):
    return dict(seller=seller, product=product, price=price, unit=unit, basis=basis,
                category=category, delivery=delivery, location=location, source=source,
                verified=RUN, note=note)

benchmarks = [b for b in benchmarks if "NQCL" not in b["seller"]]   # superseded by a real figure
benchmarks += [
    B("National Quarries Company Limited (NQCL)", "Pitrun", 86.25, "TT$/yd3", "Official state published list",
      "EX-QUARRY (STATE)", "Collection", "Guaico, Sangre Grande",
      "https://nqcl.co.tt/wp-content/uploads/NQCL-Price-List-2025.pdf",
      "Recovered from prior canon. Document effective 31-Aug-2022 plus 12.5% VAT - four years old."),
    B("NARS Value Hardware", "Gravel", 350.00, "TT$/yd", "Retail", "RETAIL", "Not stated", "San Juan",
      "https://www.findglocal.com/TT/San-Juan/1797123157231816/NARS-Value-Hardware-Ltd", "Reseller retail price."),
    B("NARS Value Hardware", "Sharp sand", 450.00, "TT$/yd", "Retail", "RETAIL", "Not stated", "San Juan",
      "https://www.findglocal.com/TT/San-Juan/1797123157231816/NARS-Value-Hardware-Ltd",
      "Retail sits 169% above the EcoEnergy base of TT$167.06 - the clearest reseller spread on record."),
    B("NARS Value Hardware", "Plastering sand", 250.00, "TT$/yd", "Retail", "RETAIL", "Not stated", "San Juan",
      "https://www.findglocal.com/TT/San-Juan/1797123157231816/NARS-Value-Hardware-Ltd", "Reseller retail price."),
    B("Cumosco", "Gravel", 300.00, "TT$/yd", "Retail, online", "RETAIL", "Not stated", "Trinidad & Tobago",
      "https://www.cumosco.com/product/gravel/", "Online reseller retail price."),
    B("AMCOL Hardware", "Sharp sand", 440.00, "TT$/yd", "Retail", "RETAIL", "Not stated", "Penal",
      AMCOL, "Retail. Close to the NARS figure, which corroborates the retail band."),
    B("AMCOL Hardware", "Backfill / overburden", 140.625, "TT$/yd3", "8-yard load at TT$1,125",
      "RETAIL (DELIVERED)", "Likely delivered", "Penal", AMCOL, "Benchmark source for backfill."),
    B("AMCOL Hardware", "Sand fill", 126.563, "TT$/yd3", "10-yard load at TT$1,265.63",
      "RETAIL (DELIVERED)", "Likely delivered", "Penal", AMCOL, "Benchmark source for sand fill."),
    B("AMCOL Hardware", "3/8 aggregate mix", None, "TT$ per load", "8-yard load TT$2,300; 10-yard mix TT$3,000",
      "RETAIL (DELIVERED)", "Likely delivered", "Penal", AMCOL,
      "Load pricing, grading of the mix not stated - not a like-for-like yd3 comparable."),
    B("On The Line General Hardware", "Plastering sand", None, "TT$ per load", "TT$1,200 per load",
      "RETAIL (DELIVERED)", "Load", "Chaguanas / Felicity",
      "https://www.equipment10.com/TT/Chaguanas/1915323488711905/On-The-Line-General-Hardware",
      "Load size not stated, so no yd3 rate can be derived without inventing the load volume."),
    B("On The Line General Hardware", "Gravel", None, "TT$ per load", "TT$2,350 per load",
      "RETAIL (DELIVERED)", "Load", "Chaguanas / Felicity",
      "https://www.equipment10.com/TT/Chaguanas/1915323488711905/On-The-Line-General-Hardware",
      "Load size not stated."),
    B("Trinidad Quarry Materials", "Gravel", None, "TT$ per load", "TT$1,800 per load",
      "RETAIL (DELIVERED)", "Load", "Sangre Grande",
      "https://www.findglocal.com/TT/Sangre-Grande-Town/106173400997686/Trinidad-Quarry-Materials",
      "Load size not stated."),
    B("Trinidad Quarry Materials", "Plastering sand", None, "TT$ per load", "TT$1,400 per load",
      "RETAIL (DELIVERED)", "Load", "Sangre Grande",
      "https://www.findglocal.com/TT/Sangre-Grande-Town/106173400997686/Trinidad-Quarry-Materials",
      "Load size not stated."),
    B("Pine Road, Matura", "Plastering sand", 67.50, "TT$/yd3", "Collection", "EX-QUARRY (COLLECTION)",
      "Collection", "Matura", "Prior EcoEnergy workbook (merged 2026-09-12)",
      "Recovered from prior canon. Sits BELOW the EcoEnergy plastering sand base of TT$75.94, so quote "
      "location-specific where this source competes."),
]
save("benchmarks.json", benchmarks)

print("dedup updates applied :", merged)
print("new prospects merged  :", len(new), "(%s to %s)" % (new[0]["prospect_id"], new[-1]["prospect_id"]))
print("total prospects       :", len(prospects))
print("priced materials      :", len(pricing_products))
print("communications logged :", len(comms))
print("benchmark observations:", len(benchmarks))
