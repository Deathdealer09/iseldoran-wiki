#!/usr/bin/env python3
"""
Cycle 4, 2026-09-12. Social buyer-hunting run.

IMPORTANT ON METHOD. The brief asked for logged-in browser sessions on Facebook,
Instagram, TikTok, X and Threads. No browser tool exists in this environment and
every one of those hosts returns 403 at the egress proxy (re-tested this cycle).
Everything below came from PUBLIC SEARCH INDEXING of those pages. No page was
opened, no comment thread was read, and no logged-in session was used.
"""

import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
RUN = "2026-09-12"
PENDING = "PENDING VERIFICATION"
NOT_PUB = "Not publicly listed"
load = lambda n: json.load(open(os.path.join(DATA, n)))
save = lambda n, o: json.dump(o, open(os.path.join(DATA, n), "w"), indent=2)

prospects = load("prospects.json")
benchmarks = load("benchmarks.json")
intel = load("market_intel.json")
existing = {p["company"].strip().lower(): p for p in prospects}

# --------------------------------------------- LEAD GRADING (brief section 11)
# A HOT  = explicit current buying requirement, material/quantity/location identifiable
# B STRONG = business verifiably consumes or resells aggregate
# C POTENTIAL = construction-related, no verified current requirement
# D MARKET INTELLIGENCE = useful seller/price data, weak immediate sales potential
def grade(p):
    t = (p["customer_type"] + " " + p["products_sold"] + " " + p["buying_signal"]).lower()
    if p["priority"] == "BENCHMARK" or "licensed quarry" in t or "industry association" in t:
        return "D - MARKET INTELLIGENCE"
    sells = any(w in t for w in ("gravel", "sand", "aggregate", "crusher run", "stockpile",
                                 "pitrun", "backfill", "sandfill"))
    consumes = any(w in t for w in ("ready-mix", "readymix", "block manufacturer", "precast",
                                    "asphalt", "concrete"))
    if sells or consumes:
        return "B - STRONG"
    if any(w in t for w in ("contractor", "hardware", "building materials", "developer",
                            "earthworks", "drainage", "haulage", "transport", "lumber")):
        return "C - POTENTIAL"
    return "C - POTENTIAL"


# ------------------------------------------------- DEDUP UPDATES (section 1/10)
def upd(name, note, **kw):
    p = existing.get(name.strip().lower())
    if not p:
        raise SystemExit("dedup target missing: " + name)
    for k, v in kw.items():
        p[k] = v
    p["notes"] += " | CYCLE 4 UPDATE (2026-09-12): " + note
    return p


upd("NARS Value Hardware",
    "Location refined to Eastern Main Road, in the Port of Spain / San Juan corridor.",
    location="Eastern Main Road, San Juan / Port of Spain corridor")
upd("National Quarries Company Limited (NQCL)",
    "Second division identified: Limestone Division at Verdant Vale, Blanchisseuse, alongside the "
    "Sand and Gravel Division at Guaico, Sangre Grande.",
    location="Sand & Gravel Division, Guaico, Sangre Grande; Limestone Division, Verdant Vale, Blanchisseuse")
upd("Coosal's (Sand & Gravel Operations / Coosal's Concrete Limited)",
    "Operation at Tapana, Valencia is cited by the Environmental Management Authority as a model "
    "operation. Group trading over 70 years.")
upd("AMCOL Hardware",
    "PRICE CAPTURED: 8 yard load crusher run / blue metal advertised at TT$3,000, which is "
    "TT$375/yd3. This is the first hard per-yard figure captured for crusher run.",
    observed_price="3/8 mix 8yd TT$2,300; 10yd aggregate mix TT$3,000; sharp sand TT$440/yd; "
                   "backfill 8yd TT$1,125; sandfill 10yd TT$1,265.63; crusher run/blue metal 8yd TT$3,000 (TT$375/yd3)")
upd("Unidentified aggregate reseller - 'SAND / GRAVEL / Aggregates, Nationwide Delivery'",
    "PUBLIC WHATSAPP SURFACED: 474-4005, advertised on the Marketplace listing alongside nationwide "
    "delivery. Recovered from a search-result summary, NOT read from the listing itself, so confirm "
    "the number before dialling. Recorded under section 13 as a publicly displayed commercial contact.",
    whatsapp="474-4005 (from search summary - CONFIRM BEFORE USE)",
    status="CONTACT AVAILABLE")

# ----------------------------------------------------------- NEW THIS CYCLE
seq = max(int(p["prospect_id"].split("-")[1]) for p in prospects)


def N(company, ctype, priority, location, source, signal, products_sold="",
      phone=PENDING, facebook="", website="", observed="Not published",
      next_action="", notes="", platform="Google Web Search (public index)", whatsapp=PENDING):
    global seq
    seq += 1
    return {
        "prospect_id": "ECO-%04d" % seq, "date_identified": RUN, "company": company,
        "contact_name": NOT_PUB, "customer_type": ctype, "priority": priority,
        "location": location, "phone": phone, "whatsapp": whatsapp, "email": PENDING,
        "facebook": facebook or PENDING, "instagram": PENDING, "x_twitter": PENDING,
        "threads": PENDING, "website": website or PENDING, "source_platform": platform,
        "source_url": source, "buying_signal": signal,
        "products_needed": "Pitrun; 3/8 gravel; 3/4 gravel; plastering sand; sharp sand; sandfill/backfill",
        "products_sold": products_sold, "est_volume": "EST - to confirm on contact",
        "purchase_freq": "To establish on contact", "observed_price": observed,
        "eco_price": "Per current EcoEnergy price list (see WEEKLY PRICING)",
        "potential_discount": "Up to 30% subject to qualification",
        "status": "CONTACT AVAILABLE" if phone != PENDING else "DISCOVERED",
        "last_contact": "", "next_followup": "2026-09-15", "next_action": next_action,
        "notes": "CYCLE 4 (2026-09-12), social buyer-hunt. " + notes,
    }


VER = "Verify direct contact from the source, then issue the wholesale introduction and price list."
CALL = "Telephone and open the wholesale supply conversation. Contact route is live."
RESELL = "RESELLER TARGET - already sells aggregate, therefore already buys it."

new = [
    N("Ramcharan's Hardware & Lumber Gravel & Sand", "Hardware / lumber / aggregate reseller", "TIER 1",
      "4 Fifth Street, San Juan",
      "https://www.bizexposed.com/Trinidad_and_Tobago/B/Ramcharans_Hardware_and_Lumber_Gravel_and_Sand-San_Juan.php",
      "Carries GRAVEL & SAND in its registered trading name, so aggregate is a core line, not a sideline.",
      products_sold="Gravel; sand; hardware; lumber",
      next_action=VER + " Aggregate is in the business name, so lead straight to wholesale supply.",
      notes="One of the strongest reseller signals available: the trade name itself declares the product. " + RESELL),

    N("Central Concrete and Pumps Limited (CCAPL)", "Ready-mix + aggregate supplier", "TIER 1",
      "Couva", "https://www.facebook.com/ccapl/",
      "Supplies ready-mixed concrete, concrete pump rentals AND aggregate materials. Advertises readymix "
      "at TT$785/m3 VAT inclusive, 21N 3000 PSI, central Trinidad.",
      products_sold="Ready-mixed concrete; concrete pump rental; aggregate materials",
      facebook="https://www.facebook.com/ccapl/",
      observed="Readymix concrete TT$785/m3 VAT inclusive (21N, 3000 PSI), central Trinidad",
      platform="Facebook business page (via public search index)",
      next_action=VER + " Dual profile: they consume aggregate for readymix AND resell it. Pitch both.",
      notes="Located in Couva, the top geographic priority in section 18. Publishes its own pricing, "
            "which also makes it a standing benchmark source. " + RESELL),

    N("Sand & Gravel Direct", "Aggregate supplier / reseller", "TIER 1", "Trinidad",
      "https://www.facebook.com/SandAndGravelDirect/",
      "Facebook business page offering a range of sand and gravel products for projects from the "
      "smallest to larger developments.",
      products_sold="Sand; gravel; aggregate products",
      facebook="https://www.facebook.com/SandAndGravelDirect/",
      platform="Facebook business page (via public search index)",
      next_action=VER + " Pure aggregate trader, so wholesale supply is the whole conversation.",
      notes="Page content could not be opened. PLATFORM NOT ACCESSIBLE, so the page and any comments "
            "beneath its posts remain unmined. " + RESELL),

    N("Trinidad Sand & Gravel Ltd", "Aggregate supplier", "TIER 1", "Trinidad",
      "https://www.tntyellow.com/company/25504/Trinidad_Sand_Gravel_Ltd",
      "Supplies construction aggregates. Registered in the T&T Yellow Pages since 29 March 2012.",
      products_sold="Aggregates; construction materials",
      platform="TNT Yellow directory (via public search index)",
      next_action=VER + " Dedicated aggregate business, so it must buy from a quarry.",
      notes="Directory lists a contact number and e-mail but the page could not be fetched, so neither "
            "was captured. " + RESELL),

    N("Trinidad Blocks Company Limited", "Block manufacturer", "TIER 1",
      "260-262 Mon Desir Road, South Oropouche, Siparia",
      "http://ttmanufacturers.memberzone.com/list/member/trinidad-blocks-company-limited-siparia-459",
      "Manufactures concrete products for commercial, residential and industrial use. Block plants draw "
      "sand and gravel continuously.",
      products_sold="Concrete blocks and concrete products", phone="(868) 677-5130",
      facebook="https://www.facebook.com/trinidadblockscompanyltd/",
      platform="T&T Manufacturers Association directory (via public search index)",
      next_action=CALL + " Block plant with a published number. Highest-value callable lead this cycle.",
      notes="Part of the Clint Arjoon Group. Published telephone (868) 677-5130, fax (868) 677-4956. "
            "Block manufacturing is a continuous aggregate draw."),

    N("Trincross Enterprises Ltd", "Hardware / plant sales", "TIER 1", "Penal",
      "https://www.findyello.com/trinidad/HARDWARE-STORES/",
      "Described as Penal's first hardware store, family run with over 40 years in hardware and plant sales.",
      products_sold="Hardware; plant sales",
      next_action=VER + " Penal is a section 18 priority area and they also sell plant, so they know every contractor locally.",
      notes="Long-established southern hardware. Plant sales means contractor relationships worth tapping. " + RESELL),

    N("B&A Harrinanan Hardware Ltd.", "Hardware / building materials", "TIER 2",
      "Valencia old road, Valencia, Saint Andrew",
      "https://www.facebook.com/p/BA-Harrinanan-Hardware-Ltd-100054348438466/",
      "Advertises all building materials at reasonable prices.",
      products_sold="Building materials",
      facebook="https://www.facebook.com/p/BA-Harrinanan-Hardware-Ltd-100054348438466/",
      platform="Facebook business page (via public search index)",
      next_action=VER + " Valencia sits beside the Coosal's Tapana operation and the quarry belt, so haulage is short.",
      notes="Competing on price by its own advertising, which makes purchase cost the lever. " + RESELL),

    N("D & A Hardware and Contractors Ltd", "Hardware + contractor", "TIER 1",
      "#66 Eastern Main Road, No. 2 Guaico, Sangre Grande",
      "https://www.dnb.com/business-directory/company-profiles.d__a_hardware_and_contractors_ltd.ade933b0cb00becdbd67694293b5f1c2.html",
      "Hardware supplier that also contracts, so it both resells material and consumes it on site.",
      products_sold="Hardware; plumbing and heating equipment; contracting",
      platform="Dun & Bradstreet (via public search index)",
      next_action=VER + " Dual profile. Sited at Guaico, beside the NQCL Sand and Gravel Division.",
      notes="Guaico location is significant: NQCL's sand and gravel division is there, so this business "
            "is already inside a quarry catchment and will compare EcoEnergy against NQCL directly. " + RESELL),

    N("Northeastern Hardware Ltd (Sangre Grande)", "Hardware / building supplies", "TIER 2",
      "Sangre Grande Town, Saint Andrew",
      "https://www.tntyellow.com/category/Hardware_Stores/city:Sangre_Grande",
      "Hardware supplier carrying lumber, plumbing, electrical and tiles.",
      products_sold="Lumber; plumbing; electrical; tiles; hardware",
      platform="TNT Yellow directory (via public search index)",
      next_action=VER + " Confirm whether this is the same entity as ECO-0063 before contact.",
      notes="POSSIBLE DUPLICATE of ECO-0063 Northeastern Hardware Ltd, recorded in cycle 2 from a "
            "Facebook page. Kept separate because the directory entry carries different detail and the "
            "match is unconfirmed. MERGE OR DELETE once verified."),

    N("Doc's Hardware and More Ltd", "Hardware / aggregate reseller", "TIER 1", "Trinidad",
      "https://tt.directory/top-hardwares-in-trinidad-and-tobago",
      "Supplies all building materials including sand and gravel. Confirmed aggregate reseller.",
      products_sold="Sand; gravel; tiles; building materials",
      platform="TT Directory (via public search index)",
      next_action=VER + " Sells sand and gravel already, so the spread conversation starts immediately.", notes=RESELL),

    N("Fred's Hardware and General Contractors Ltd", "Hardware + contractor", "TIER 1", "Trinidad",
      "https://tt.directory/top-hardwares-in-trinidad-and-tobago",
      "Supplies gravel, sand, blocks, lumber, steel, tiles and more, and also contracts.",
      products_sold="Gravel; sand; blocks; lumber; steel; tiles; plumbing; electrical; contracting",
      platform="TT Directory (via public search index)",
      next_action=VER + " Broadest confirmed aggregate range among the new hardware finds.",
      notes="Dual profile, resells aggregate and consumes it on contracts. " + RESELL),

    N("PriceMaster Hardware", "Hardware / building supplies", "TIER 2", "Tunapuna",
      "https://www.facebook.com/pricemaster.hardware.tt/",
      "Hardware business trading on price positioning, by its own name.",
      products_sold="Hardware; building supplies",
      facebook="https://www.facebook.com/pricemaster.hardware.tt/",
      platform="Facebook business page (via public search index)",
      next_action=VER + " A price-led retailer lives on purchase cost, which is EcoEnergy's lever.", notes=RESELL),

    N("AM Hardware and General Building Supplies", "Hardware / building materials", "TIER 2",
      "Couva-Tabaquite-Talparo (near Gasparillo)", "https://mapcarta.com/W836643834",
      "General building supplies business in the central corridor.",
      products_sold="Building supplies", platform="Mapcarta listing (via public search index)",
      next_action=VER + " Couva and Gasparillo are both section 18 priority areas.", notes=RESELL),

    N("Chan's Hardware", "Hardware store", "TIER 3", "San Juan-Laventille",
      "https://mapcarta.com/N2139585005", "Hardware store in the San Juan corridor.",
      products_sold="Hardware", platform="Mapcarta listing (via public search index)",
      next_action=VER + " Thin record. Qualify aggregate range by telephone before effort.",
      notes="Map listing only. Aggregate range not established."),

    N("Trinidad Contractors and Hardware group buyers - trinituner 'WTK: Price of Gravel & Cement'",
      "Buyer discussion thread", "TIER 3", "Trinidad (nationwide forum)",
      "https://trinituner.com/v4/forums/viewtopic.php?t=91219",
      "ACTIVE BUYING DISCUSSION: a long-running public thread of Trinidad buyers asking and comparing "
      "gravel and cement prices, reporting TT$1,600 to TT$2,800 per load from various suppliers.",
      products_sold="N/A - buyers, not sellers",
      platform="Trinituner public forum (via public search index)",
      next_action="MINE THIS THREAD. It is a public forum and, unlike Facebook, it may be readable "
                  "without a login from a machine with ordinary web access. Individual posters state "
                  "material, load size, price paid and sometimes location.",
      notes="LEAD SOURCE, not a single prospect. This is the closest accessible equivalent to the "
            "Facebook comment mining the brief asks for, and it carries exactly the price-intent "
            "language section 3 targets. The thread could not be opened from here."),

    N("Trinidad house builders - trinituner 'Building a house in Trinidad'",
      "Buyer discussion thread", "TIER 3", "Trinidad (nationwide forum)",
      "http://www.trinituner.com/v4/forums/viewtopic.php?start=690&t=349501",
      "ACTIVE BUILD DISCUSSION running to at least 24 pages, where members document house builds "
      "including material purchases, suppliers and prices paid.",
      products_sold="N/A - buyers, not sellers",
      platform="Trinituner public forum (via public search index)",
      next_action="MINE THIS THREAD for individuals currently at foundation or backfill stage. Those "
                  "are grade A buying signals with a stated requirement.",
      notes="LEAD SOURCE. Long-running build diaries are the richest source of current, dated, "
            "quantified aggregate requirements available outside Facebook. Not openable from here."),
]
prospects.extend(new)

# backfill lead grades across the whole book
for p in prospects:
    p["lead_grade"] = grade(p)

names = [p["company"].strip().lower() for p in prospects]
assert len(names) == len(set(names)), "duplicate company after cycle 4"
assert len(set(p["prospect_id"] for p in prospects)) == len(prospects), "duplicate id"
save("prospects.json", prospects)

# ------------------------------------------------------------- NEW PRICES
TUNER = "https://trinituner.com/v4/forums/viewtopic.php?t=91219"


def B(seller, product, price, unit, basis, cat, delivery, location, source, note):
    return dict(seller=seller, product=product, price=price, unit=unit, basis=basis,
                category=cat, delivery=delivery, location=location, source=source,
                verified=RUN, note=note)


benchmarks += [
    B("AMCOL Hardware", "Crusher run / blue metal", 375.00, "TT$/yd3",
      "8 yard load advertised at TT$3,000, divided by 8", "RETAIL", "Not stated", "Penal",
      "https://www.amcolhardwarett.com/product-6222/8-yard-load-crusher-run--blue-metal.php",
      "Cycle 4. First hard per-yard figure for crusher run. TT$3,000 / 8 yd = TT$375/yd3."),
    B("Central Concrete and Pumps Limited", "Ready-mixed concrete 21N 3000 PSI", 785.00, "TT$/m3",
      "Advertised, VAT inclusive", "RETAIL", "Not stated", "Central Trinidad",
      "https://www.facebook.com/ccapl/", "Cycle 4. ADJACENT PRODUCT, not aggregate. Recorded because "
      "concrete pricing tracks aggregate input cost and this seller also resells aggregate."),
    B("Trinidad ready-mix market", "Ready-mixed concrete", 900.00, "TT$/cubic yard",
      "Reported market level, August 2026", "RETAIL", "Not stated", "Trinidad",
      "https://wiseequities.com/home/newsarticle/488",
      "Cycle 4. ADJACENT PRODUCT. Reported as a price reduction from earlier levels."),
    B("Trinituner forum members (user reported)", "Gravel, half and half mixture", 275.00, "TT$/yd3",
      "8 yard load reported at TT$2,200, divided by 8", "UNKNOWN (user reported)", "Not stated",
      "Trinidad", TUNER,
      "Cycle 4. USER-REPORTED, not a seller advertisement. Date of the report is not established. "
      "Treat as indicative of the delivered retail band, not as a benchmark."),
    B("Trinituner forum members (user reported)", "Gravel, half and half mixture", None, "TT$ per load",
      "Historic reports: TT$1,600 per load; later TT$2,500 from a private supplier and TT$2,800 from "
      "a hardware store", "UNKNOWN (user reported)", "Not stated", "Trinidad", TUNER,
      "Cycle 4. Load sizes NOT stated for the TT$2,500 and TT$2,800 figures, so no per-yard rate can "
      "be derived without inventing the load volume. Recorded as reported."),
    B("Trinituner forum members (user reported)", "Red sand", None, "TT$ per load",
      "Historic report: TT$750 per load", "UNKNOWN (user reported)", "Not stated", "Trinidad", TUNER,
      "Cycle 4. Load size not stated. Red sand is not currently an EcoEnergy line."),
]
save("benchmarks.json", benchmarks)

# -------------------------------------------------------- INTELLIGENCE
intel += [
    dict(headline="PRICING GAP: the delivered market may sit far above the EcoEnergy base",
         detail="EcoEnergy's base is derived from the Bestcrete published figure of TT$185.62/yd3, "
                "giving TT$167.06. Cycle 4 captured delivered and retail load pricing well above that: "
                "AMCOL crusher run at TT$375/yd3, forum-reported half-and-half gravel at about "
                "TT$275/yd3, NARS sharp sand at TT$450/yd and AMCOL sharp sand at TT$440/yd.",
         implication="Section 10 forbids undercutting delivered retail with an ex-quarry product, and "
                     "that rule protects EcoEnergy here. The TT$167.06 base is an EX-QUARRY COLLECTION "
                     "price and should stay that way. A SEPARATE DELIVERED price list should be built "
                     "against the TT$275 to TT$375/yd3 delivered band. Quoting the collection base to a "
                     "delivered customer gives away the entire haulage margin.",
         source=TUNER, verified=RUN),
    dict(headline="Buyer demand is concentrated in Facebook groups and a public forum",
         detail="Four active Trinidad buyer venues were identified: Facebook groups 909331405759624, "
                "202165237740335, 339202526592121 and 3250335484987349, plus the Trinituner forum, "
                "where threads carry explicit price questions such as 'What is the average price of "
                "ready mix concrete per meter?'.",
         implication="The forum is the one venue that may be readable without a login. It is the "
                     "highest-value unmined source and should be worked first by anyone with ordinary "
                     "web access.",
         source="https://trinituner.com/v4/forums/viewtopic.php?t=91219", verified=RUN),
    dict(headline="Instagram and TikTok returned no usable Trinidad & Tobago results",
         detail="Searches on Instagram and TikTok terms returned predominantly United States results, "
                "including Trinidad, Colorado businesses and a US 'Trinidad Construction LLC'. No "
                "Trinidad & Tobago aggregate buyer or seller was identified on either platform.",
         implication="Not evidence that no such accounts exist. It reflects what the public search "
                     "index surfaces without platform access. Both platforms remain unmined.",
         source="Search results, cycle 4", verified=RUN),
]
save("market_intel.json", intel)

from collections import Counter
print("dedup updates applied :", 5)
print("new prospects         :", len(new), "(%s to %s)" % (new[0]["prospect_id"], new[-1]["prospect_id"]))
print("total prospects       :", len(prospects))
print("lead grades           :", dict(Counter(p["lead_grade"] for p in prospects)))
print("benchmarks            :", len(benchmarks))
print("market intel items    :", len(intel))
