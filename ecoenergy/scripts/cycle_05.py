#!/usr/bin/env python3
"""Cycle 4 continued, 2026-09-12. Southern, eastern and developer sweep."""

import json, os
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
RUN, PENDING, NOT_PUB = "2026-09-12", "PENDING VERIFICATION", "Not publicly listed"
load = lambda n: json.load(open(os.path.join(DATA, n)))
save = lambda n, o: json.dump(o, open(os.path.join(DATA, n), "w"), indent=2)

prospects = load("prospects.json")
existing = {p["company"].strip().lower(): p for p in prospects}


def upd(name, note, **kw):
    p = existing.get(name.strip().lower())
    if not p:
        raise SystemExit("dedup target missing: " + name)
    for k, v in kw.items():
        p[k] = v
    p["notes"] += " | CYCLE 4 UPDATE (2026-09-12): " + note


upd("Rite Buy Hardware",
    "Location established: Lower Milford Road, Scarborough, TOBAGO. Previously held as 'Trinidad' "
    "with no location. This changes the commercial picture: any quote must carry the inter-island "
    "freight leg.",
    location="Lower Milford Road, Scarborough, Tobago",
    next_action="Cost the Tobago barge leg BEFORE quoting. They confirmedly sell sand, gravel and "
                "sharp sand, so the fit is good but the freight decides viability.")
upd("Premix Concrete Ltd",
    "A Premix Concrete Ltd presence is reported in Scarborough, Tobago in addition to the Caroni "
    "listing. Confirm whether this is one company with two plants or two separate entities before "
    "contact.",
    location="Caroni; a Scarborough, Tobago presence is also reported (unconfirmed)")

seq = max(int(p["prospect_id"].split("-")[1]) for p in prospects)


def N(company, ctype, priority, location, source, signal, products_sold="",
      phone=PENDING, facebook="", website="", next_action="", notes="",
      platform="Google Web Search (public index)"):
    global seq
    seq += 1
    return {
        "prospect_id": "ECO-%04d" % seq, "date_identified": RUN, "company": company,
        "contact_name": NOT_PUB, "customer_type": ctype, "priority": priority,
        "location": location, "phone": phone, "whatsapp": PENDING, "email": PENDING,
        "facebook": facebook or PENDING, "instagram": PENDING, "x_twitter": PENDING,
        "threads": PENDING, "website": website or PENDING, "source_platform": platform,
        "source_url": source, "buying_signal": signal,
        "products_needed": "Pitrun; 3/8 gravel; 3/4 gravel; plastering sand; sharp sand; sandfill/backfill",
        "products_sold": products_sold, "est_volume": "EST - to confirm on contact",
        "purchase_freq": "To establish on contact", "observed_price": "Not published",
        "eco_price": "Per current EcoEnergy price list (see WEEKLY PRICING)",
        "potential_discount": "Up to 30% subject to qualification",
        "status": "CONTACT AVAILABLE" if phone != PENDING else "DISCOVERED",
        "last_contact": "", "next_followup": "2026-09-15", "next_action": next_action,
        "notes": "CYCLE 4 (2026-09-12), social buyer-hunt. " + notes,
    }


VER = "Verify direct contact from the source, then issue the wholesale introduction and price list."
RESELL = "RESELLER TARGET - already sells building material, therefore already buys it."

new = [
    N("Home Solutions TT", "Residential developer", "TIER 1", "Trinidad & Tobago (nationwide)",
      "https://homesolutionstt.com/",
      "Trinidad's largest private residential developer: 1,700 homes across 16 gated communities "
      "since 2003. Continuous foundation, fill and concrete demand.",
      website="https://homesolutionstt.com/",
      products_sold="N/A - developer, consumes aggregate",
      next_action=VER + " HIGHEST-VALUE PRIVATE DEVELOPER FOUND. Target the procurement or projects "
                        "manager and pitch a contracted supply agreement across active sites.",
      notes="A 1,700-home track record across 16 communities means sustained, plannable aggregate "
            "demand. Unlike HDC this is private, so no state tender is required and a commercial "
            "agreement can be struck directly."),

    N("Caribbean Housing Limited", "Residential developer / builder", "TIER 1",
      "Sir Solomon Hochoy Highway corridor, central Trinidad",
      "https://trinidadrealestate.co.tt/gated-communities-chaguanas-trinidad/",
      "Engineered Brentwood Court: 221 townhouses across 14 acres on the Sir Solomon Hochoy Highway, "
      "selling at TTD 2.40M to 2.90M. A development of that size consumes very large fill and "
      "concrete volumes.",
      products_sold="N/A - developer, consumes aggregate",
      next_action=VER + " Establish which phases are still in construction and what fill and concrete "
                        "volumes remain to be placed.",
      notes="221 units on 14 acres is one of the largest identified private aggregate demands in the "
            "central corridor, which is the top section 18 priority area."),

    N("Xippi Properties Ltd", "Property developer / agency", "TIER 2", "Chaguanas",
      "https://xippiproperties.com/property/3-bedroom-brand-new-homes-gated-community-chaguanas-1-4m/",
      "Marketing brand new stand-alone homes in a gated community on Todds Road, Chaguanas.",
      products_sold="N/A - developer/agency",
      website="https://xippiproperties.com/",
      next_action=VER + " Establish whether they build or only sell. If they build, qualify volume.",
      notes="Could be a developer or purely an agency. Qualify the role before commercial effort."),

    N("Dansteel Limited", "Building materials / hardware", "TIER 1",
      "La Romaine and Marabella, San Fernando",
      "https://dansteel.com/",
      "Two-branch building materials and hardware business in the southern corridor.",
      website="https://dansteel.com/",
      products_sold="Building materials; tiles; home decor; tools",
      facebook="https://www.facebook.com/DansteelLtd/",
      next_action=VER + " Two branches means one agreement supplies both. Marabella and La Romaine "
                        "are both section 18 priority areas.",
      notes="Aggregate range not confirmed, so this is both a supply pitch and a range-extension "
            "pitch. " + RESELL),

    N("Mega Hardware TT", "Hardware / home improvement", "TIER 2", "San Fernando",
      "https://www.tntyellow.com/category/hardware_stores/city:Marabella",
      "Serving the home improvement market for over 20 years in San Fernando.",
      products_sold="Hardware; home improvement",
      platform="TNT Yellow directory (via public search index)",
      next_action=VER, notes="Established southern retailer. " + RESELL),

    N("Trepur Hardware", "Hardware store", "TIER 2", "Vistabella, San Fernando",
      "https://www.cybo.com/TT/vistabella/hardware-store/?p=6",
      "Hardware store in the Vistabella area of San Fernando.",
      products_sold="Hardware", platform="Cybo directory (via public search index)",
      next_action=VER + " Qualify aggregate range by telephone.", notes=RESELL),

    N("Marv's Hardware Enterprise", "Hardware store", "TIER 2", "Vistabella, San Fernando",
      "https://www.cybo.com/TT/vistabella/hardware-store/?p=6",
      "Hardware store in the Vistabella area of San Fernando.",
      products_sold="Hardware", platform="Cybo directory (via public search index)",
      next_action=VER + " Qualify aggregate range by telephone.", notes=RESELL),

    N("DNI Sales and Service Limited", "Hardware / trade supplies", "TIER 3",
      "Vistabella, San Fernando", "https://www.cybo.com/TT/vistabella/hardware-store/?p=6",
      "Listed among hardware businesses in Vistabella.",
      products_sold="Not established", platform="Cybo directory (via public search index)",
      next_action="Qualify the line of business by telephone before any commercial effort.",
      notes="Line of business not established from the listing. Qualify first."),

    N("Ali's Hardware Marabella", "Hardware store", "TIER 2", "Marabella",
      "https://www.searchintt.com/Trinidad/alis-hardware-marabella",
      "Hardware store in Marabella, a section 18 priority area.",
      products_sold="Hardware", platform="SearchinTT directory (via public search index)",
      next_action=VER, notes=RESELL),

    N("L's General Hardware Store", "Hardware store", "TIER 3",
      "Eastern Main Road, Tunapuna-Piarco", "https://mapcarta.com/W384124327",
      "General hardware store on the Eastern Main Road corridor.",
      products_sold="General hardware", platform="Mapcarta listing (via public search index)",
      next_action=VER + " Thin record. Qualify aggregate range before effort.",
      notes="Map listing only."),

    N("Blackridge Research T&T housing project database", "Project intelligence source", "TIER 3",
      "Trinidad & Tobago (nationwide)",
      "https://www.blackridgeresearch.com/new-projects-near-me/singlefamily-housing-database/c/trinidad-and-tobago",
      "Tracks announced and upcoming single-family and semi-detached housing projects in T&T, naming "
      "developers, contractors and timelines.",
      products_sold="N/A - data source",
      next_action="EVALUATE AS A LEAD SOURCE. A database naming developers and contractors on upcoming "
                  "projects is exactly the forward pipeline this operation lacks. Check cost and "
                  "coverage before subscribing.",
      notes="LEAD SOURCE, not a prospect. Every other prospect here is found after the fact. This "
            "would identify aggregate demand BEFORE the concrete is ordered, which is where a supply "
            "agreement is actually won."),
]
prospects.extend(new)


def grade(p):
    t = (p["customer_type"] + " " + p["products_sold"] + " " + p["buying_signal"]).lower()
    if p["priority"] == "BENCHMARK" or "licensed quarry" in t or "industry association" in t:
        return "D - MARKET INTELLIGENCE"
    if any(w in t for w in ("gravel", "sand", "aggregate", "crusher run", "stockpile", "pitrun",
                            "backfill", "sandfill", "ready-mix", "readymix", "block manufacturer",
                            "precast", "asphalt", "concrete", "developer")):
        return "B - STRONG"
    return "C - POTENTIAL"


for p in prospects:
    p["lead_grade"] = grade(p)

names = [p["company"].strip().lower() for p in prospects]
assert len(names) == len(set(names)), "duplicate company after cycle 5"
assert len(set(p["prospect_id"] for p in prospects)) == len(prospects), "duplicate id"
save("prospects.json", prospects)
print("new prospects  :", len(new), "(%s to %s)" % (new[0]["prospect_id"], new[-1]["prospect_id"]))
print("total prospects:", len(prospects))
print("lead grades    :", dict(Counter(p["lead_grade"] for p in prospects)))
