#!/usr/bin/env python3
"""
Market benchmark observations and the EcoEnergy pricing engine.

Pricing rule (brief section 7):  BASE = MARKET BENCHMARK x 0.90
Volume floor (brief section 8):  FLOOR = BASE x 0.70  (max 30% discount, internal only)

Where the evidence is not sufficient the price is NOT invented: the material is
carried at no price and flagged MARKET VERIFICATION REQUIRED.
"""

import json
import os

RUN_DATE = "2026-09-12"
DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

# --------------------------------------------------------------- observations
# Every row below was returned by a live web search on the run date. Nothing is
# estimated, interpolated or carried over from memory.
benchmarks = [
    dict(seller="Bestcrete / Abel Building Solutions", product="3/4 gravel",
         price=185.62, unit="per cubic yard", basis="Bulk - producer/retail list, VAT inclusive",
         category="BULK (PRODUCER LIST)", delivery="Not stated on source", location="Trinidad (Matura quarry / Arouca)",
         source="https://buildwithabs.com/product/bulk-aggregate/", verified=RUN_DATE,
         note="Anchor benchmark for 3/4 gravel."),
    dict(seller="Bestcrete / Abel Building Solutions", product="3/8 gravel",
         price=185.62, unit="per cubic yard", basis="Bulk - producer/retail list, VAT inclusive",
         category="BULK (PRODUCER LIST)", delivery="Not stated on source", location="Trinidad",
         source="https://buildwithabs.com/product/bulk-aggregate/", verified=RUN_DATE,
         note="Anchor benchmark for 3/8 gravel."),
    dict(seller="Bestcrete / Abel Building Solutions", product="Sharp sand",
         price=185.62, unit="per cubic yard", basis="Bulk - producer/retail list, VAT inclusive",
         category="BULK (PRODUCER LIST)", delivery="Not stated on source", location="Trinidad",
         source="https://buildwithabs.com/product/bulk-aggregate/", verified=RUN_DATE,
         note="Anchor benchmark for sharp sand. Source lists 3/4, 3/8 and sharp sand at an identical figure - re-confirm at next review."),
    dict(seller="Bestcrete / Abel Building Solutions", product="Plastering sand (white sand)",
         price=84.38, unit="per cubic yard", basis="Bulk - producer/retail list, VAT inclusive",
         category="BULK (PRODUCER LIST)", delivery="Not stated on source", location="Trinidad",
         source="https://buildwithabs.com/product/bulk-aggregate/", verified=RUN_DATE,
         note="Anchor benchmark for plastering sand."),
    dict(seller="Almandoz Hardware (reselling Bestcrete Aggre GO!)", product="Sharp sand - 30kg bagged",
         price=22.44, unit="per 30kg bag", basis="Retail bagged",
         category="RETAIL (BAGGED)", delivery="Collection", location="Trinidad",
         source="https://almandozhardware.com/product/bestcrete-aggre-go-sharp-sand-30kg/", verified=RUN_DATE,
         note="Bagged retail. NOT comparable to bulk cubic-yard pricing - held in a separate category."),
    dict(seller="Facebook Marketplace seller (T&T)", product="3/4 white deco stone",
         price=500.00, unit="per yard", basis="Retail, delivered",
         category="RETAIL (DELIVERED)", delivery="Delivery", location="Trinidad",
         source="https://www.facebook.com/marketplace/116087261735365/gravel/", verified=RUN_DATE,
         note="Decorative stone - premium product, not a like-for-like comparable for construction 3/4."),
    dict(seller="Facebook Marketplace seller (T&T)", product="2 inch crush stone",
         price=375.00, unit="per yard", basis="Retail, delivered",
         category="RETAIL (DELIVERED)", delivery="Delivery", location="Trinidad",
         source="https://www.facebook.com/marketplace/116087261735365/gravel/", verified=RUN_DATE,
         note="Larger grading than EcoEnergy's 3/4 line - indicative of the delivered retail ceiling."),
    dict(seller="Facebook Marketplace sellers (T&T, multiple listings)", product="Gravel (grading not stated)",
         price=None, unit="per yard", basis="Retail, delivered - range TTD 200 to 400",
         category="RETAIL (DELIVERED)", delivery="Delivery", location="Trinidad",
         source="https://www.facebook.com/marketplace/116087261735365/gravel/", verified=RUN_DATE,
         note="Range only; grading and yard definition not stated by the listings. Indicative of the delivered retail band, not a benchmark."),
    dict(seller="National Quarries Company Limited (NQCL)", product="Full product range",
         price=None, unit="n/a", basis="NOT RETRIEVED",
         category="EX-QUARRY (STATE)", delivery="n/a", location="Guaico, Sangre Grande",
         source="https://nqcl.co.tt/wp-content/uploads/NQCL-Price-List-2025.pdf", verified="NOT VERIFIED",
         note="A public NQCL price list PDF exists but the domain is blocked by this environment's egress policy, so it was NOT retrieved. This is the highest-value missing input - it is the state benchmark."),
]

# ------------------------------------------------------------ pricing engine
MARGIN = 0.90       # EcoEnergy sits 10% below the verified benchmark
MAX_DISCOUNT = 0.30  # negotiating floor, internal only


def price_row(product, benchmark, bench_source, unit, confidence, note):
    if benchmark is None:
        return dict(product=product, benchmark=None, base=None, floor=None, unit=unit,
                    confidence=confidence, source=bench_source,
                    status="MARKET VERIFICATION REQUIRED", note=note)
    base = round(benchmark * MARGIN, 2)
    floor = round(base * (1 - MAX_DISCOUNT), 2)
    return dict(product=product, benchmark=benchmark, base=base, floor=floor, unit=unit,
                confidence=confidence, source=bench_source,
                status="PROVISIONAL - SINGLE SOURCE" if confidence == "LOW" else "ACTIVE",
                note=note)


SRC = "https://buildwithabs.com/product/bulk-aggregate/"
SINGLE = ("Derived from ONE verified source. The brief calls for multiple observations "
          "per material; only one credible published T&T source was reachable this cycle. "
          "Treat as provisional and re-derive once a second source is obtained.")

pricing = [
    price_row("3/4 gravel", 185.62, SRC, "per cubic yard (VAT incl.)", "LOW", SINGLE),
    price_row("3/8 gravel", 185.62, SRC, "per cubic yard (VAT incl.)", "LOW", SINGLE),
    price_row("Sharp sand", 185.62, SRC, "per cubic yard (VAT incl.)", "LOW", SINGLE),
    price_row("Plastering sand", 84.38, SRC, "per cubic yard (VAT incl.)", "LOW", SINGLE),
    price_row("Pitrun", None, "No verified T&T published price located this cycle",
              "per cubic yard", "NONE",
              "NO PRICE SET. No published T&T pitrun price was found. Per section 7 no price is "
              "invented and no stale price exists to retain. Highest-priority pricing gap - pitrun "
              "is a core EcoEnergy line."),
    price_row("Sandfill / backfill", None, "No verified T&T published price located this cycle",
              "per cubic yard", "NONE",
              "NO PRICE SET. No published T&T sandfill/backfill price was found. Second-highest "
              "pricing gap."),
]

meta = dict(
    run_date=RUN_DATE,
    effective_from=RUN_DATE,
    next_review="2026-09-13 23:59 (Sunday, Trinidad time, AST/UTC-4)",
    margin_rule="EcoEnergy base = verified market benchmark x 0.90 (10% below market)",
    discount_rule="Negotiated volume discount up to 30% off base for qualified cash, wholesale, "
                  "high-volume and contracted recurring customers. Never automatic.",
    currency="TTD",
    cold_start=True,
)

os.makedirs(DATA, exist_ok=True)
with open(os.path.join(DATA, "benchmarks.json"), "w") as f:
    json.dump(benchmarks, f, indent=2)
with open(os.path.join(DATA, "pricing.json"), "w") as f:
    json.dump(dict(meta=meta, products=pricing), f, indent=2)
with open(os.path.join(DATA, "communications.json"), "w") as f:
    json.dump([], f, indent=2)   # no outreach executed - see sheet note

print("benchmark observations:", len(benchmarks))
for p in pricing:
    if p["base"] is None:
        print("  %-22s %s" % (p["product"], p["status"]))
    else:
        print("  %-22s benchmark %8.2f -> base %8.2f  (floor %8.2f)"
              % (p["product"], p["benchmark"], p["base"], p["floor"]))
