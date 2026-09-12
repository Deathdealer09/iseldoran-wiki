#!/usr/bin/env python3
"""
Cycle 2, 2026-09-12. Prospecting run requested with Metricool and social media.

Runs after merge_upload.py in the rebuild chain. Adds newly discovered prospects,
applies dedup updates to existing records, extends the benchmark set and records
market intelligence.
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
existing = {p["company"].strip().lower(): p for p in prospects}

# ------------------------------------------------- DEDUP UPDATES (section 10)
# Cycle 2 turned up new facts about records already held. They are UPDATED.
def upd(name, **kw):
    p = existing.get(name.strip().lower())
    if not p:
        raise SystemExit("dedup target missing: " + name)
    note = kw.pop("append_note", "")
    for k, v in kw.items():
        p[k] = v
    if note:
        p["notes"] += " | CYCLE 2 UPDATE (2026-09-12): " + note
    return p


LIC = ("Named in the Ministry of Energy list of licensed quarry operations reported by Trinidad "
       "Express. Confirms licensed producer status.")
upd("Seereeram Bros Limited",
    customer_type="Earthworks contractor + LICENSED QUARRY OPERATOR",
    priority="BENCHMARK",
    append_note="MATERIAL PROFILE CHANGE. Seereeram Brothers holds a licensed quarry at Cangrejal "
                "Road, Santa Cruz. They are a PRODUCER, not just a consumer, so the wholesale pitch "
                "is wrong for them. Reclassified from TIER 1 to BENCHMARK. Approach only for "
                "overflow or swap supply. " + LIC)
upd("Bestcrete Aggregate Limited (BAL) / Abel Building Solutions",
    append_note="Licensed quarry confirmed at the Melajo Forest Reserve, Matura. " + LIC)
upd("Abel Building Solutions (ANSA McAL)",
    append_note="Group licensed quarry confirmed at Depot Road, Longdenville (listed as ANSA McAL "
                "Limited). " + LIC)
upd("On The Line General Hardware",
    facebook="https://www.facebook.com/onthelinehardware",
    append_note="Facebook business page located at facebook.com/onthelinehardware.")
upd("AMCOL Hardware",
    observed_price="3/8 mix 8yd TT$2,300; 10yd aggregate mix TT$3,000; sharp sand TT$440/yd; "
                   "backfill 8yd TT$1,125; sandfill 10yd TT$1,265.63",
    products_sold="Aggregate; gravel/sand mixes; backfill; sandfill; crusher run / blue metal "
                  "(8-yard loads, M3, bagged); ballast (1/2 x 1/2 gravel with sharp sand, 10 and "
                  "11 yard loads)",
    append_note="Online catalogue carries a wider aggregate range than first recorded: crusher run "
                "and blue metal by the 8-yard load, by cubic metre and bagged, plus ballast in 10 "
                "and 11 yard loads. Their catalogue is a standing benchmark source.")

# --------------------------------------------------------- NEW THIS CYCLE
seq = max(int(p["prospect_id"].split("-")[1]) for p in prospects)


def N(company, ctype, priority, location, source, signal, products_sold="",
      products_needed="", phone=PENDING, website="", facebook="", observed="",
      est_vol="EST - to confirm on contact", freq="To establish on contact",
      next_action="", notes="", platform="Google Web Search"):
    global seq
    seq += 1
    status = "CONTACT AVAILABLE" if phone != PENDING else "DISCOVERED"
    return {
        "prospect_id": "ECO-%04d" % seq, "date_identified": RUN, "company": company,
        "contact_name": NOT_PUB, "customer_type": ctype, "priority": priority,
        "location": location, "phone": phone, "whatsapp": PENDING, "email": PENDING,
        "facebook": facebook or PENDING, "instagram": PENDING, "x_twitter": PENDING,
        "threads": PENDING, "website": website or PENDING, "source_platform": platform,
        "source_url": source, "buying_signal": signal,
        "products_needed": products_needed or "Pitrun; 3/8 gravel; 3/4 gravel; plastering sand; sharp sand; sandfill/backfill",
        "products_sold": products_sold, "est_volume": est_vol, "purchase_freq": freq,
        "observed_price": observed or "Not published",
        "eco_price": "Per current EcoEnergy price list (see WEEKLY PRICING)",
        "potential_discount": "Up to 30% subject to qualification", "status": status,
        "last_contact": "", "next_followup": "2026-09-15",
        "next_action": next_action, "notes": "CYCLE 2 (2026-09-12). " + notes,
    }


VERIFY = "Verify direct contact from the source, then issue the wholesale introduction and price list."
CALL = "Telephone and open the wholesale supply conversation. Contact route is live."
RESELL = "RESELLER TARGET - already sells aggregate, therefore already buys it."
QUARRY = ("LICENSED QUARRY OPERATOR. Competitor and benchmark, not a wholesale buyer. Track pricing "
          "and treat as a possible overflow or swap counterparty.")

new = [
    # --- active aggregate sellers, strongest fit
    N("A Class Gravel & Aggregates", "Aggregate reseller", "TIER 1",
      "Constance Street, Montrose, Chaguanas",
      "https://www.tntyellow.com/company/11461/A_Class_Gravel_Aggregates",
      "A dedicated gravel and aggregate business, so it must buy from a quarry.",
      products_sold="Gravel; aggregates", phone="(868) 478-4400",
      platform="TNT Yellow directory (via web search)",
      next_action=CALL + " Pure aggregate business, so lead straight to wholesale pricing.",
      notes="STRONGEST NEW FIT THIS CYCLE. Dedicated aggregate trader with a published telephone "
            "number. " + RESELL),

    N("Roopnarine Hardware Limited", "Hardware / reseller", "TIER 1", "Chaguanas",
      "https://www.facebook.com/roopnarinehardware/",
      "ACTIVE ADVERTISEMENT: 'Gravel, Sharp Sand, Red Sand. Delivery available.' Currently trading aggregate.",
      products_sold="Gravel; sharp sand; red sand; general hardware",
      facebook="https://www.facebook.com/roopnarinehardware/",
      platform="Facebook business page (via web search)",
      next_action=VERIFY + " They advertise three sand and gravel lines with delivery, so the range fits directly.",
      notes="Established 1956 and described as a leading T&T hardware. " + RESELL),

    N("B Chadee & Sons Stockpile and Hardware Supplies Ltd", "Stockpile operator / hardware", "TIER 1",
      "La Horquetta", "https://www.facebook.com/BChadeeandSonsLtd",
      "Operates a STOCKPILE segregating material grades and maintaining steady supply, with a rental and aggregate division.",
      products_sold="Aggregate (graded from stockpile); hardware tools; equipment rental",
      facebook="https://www.facebook.com/BChadeeandSonsLtd",
      platform="Facebook business page (via web search)",
      next_action=VERIFY + " Stockpile operators buy in bulk and hold inventory, which is the ideal recurring wholesale profile.",
      notes="Stockpile operators are named explicitly in section 2 as a Tier 1 target. They run a "
            "stockpile to segregate grades and keep steady supply, and deliver nationwide at cost. " + RESELL),

    N("Northeastern Hardware Ltd", "Hardware / reseller", "TIER 2", "Sangre Grande Town",
      "https://www.facebook.com/northeasternhardwareltd/",
      "Hardware business in Sangre Grande, close to the Guaico and Matura quarry belt.",
      products_sold="General hardware", facebook="https://www.facebook.com/northeasternhardwareltd/",
      platform="Facebook business page (via web search)",
      next_action=VERIFY, notes="Northeast location sits near the quarry belt, so haulage is short. " + RESELL),

    N("C.J. Lumber Ltd", "Lumber / building materials", "TIER 2", "Longdenville, Chaguanas",
      "https://www.tntyellow.com/company/11461/A_Class_Gravel_Aggregates",
      "Established building materials supplier in the central construction corridor.",
      products_sold="Lumber; building materials",
      platform="TNT Yellow directory (via web search)",
      next_action=VERIFY, notes="Established 1997. " + RESELL),

    N("Samlal Seepersad Hardware Limited", "Hardware / building supplies", "TIER 2", "Trinidad",
      "http://www.tntisland.com/hardwarestores.html",
      "Supplying building materials nationally for over 50 years.",
      products_sold="Building supplies", platform="TNT Island directory (via web search)",
      next_action=VERIFY, notes=RESELL),

    N("Island Roofing & Hardware Solutions Ltd", "Hardware / roofing", "TIER 2", "Trinidad",
      "http://www.tntisland.com/hardwarestores.html",
      "Supplies lumber, roofing materials and general hardware.",
      products_sold="Lumber; roofing; hardware", platform="TNT Island directory (via web search)",
      next_action=VERIFY, notes=RESELL),

    N("Aqucan Hardware and Construction Ltd", "Hardware + construction", "TIER 2", "Trinidad",
      "http://www.tntisland.com/hardwarestores.html",
      "Supplies construction tools and accessories and carries out construction work, so it both buys and uses material.",
      products_sold="Household, garden and construction tools and accessories",
      platform="TNT Island directory (via web search)",
      next_action=VERIFY + " Dual profile, so qualify for both resale and site consumption.", notes=RESELL),

    N("Discount Hardware And Building Supplies", "Hardware / building supplies", "TIER 2", "Trinidad",
      "https://www.findyello.com/trinidad/discount-hardware-and-building-supplies/",
      "Discount building supplies business, so it competes on price and is sensitive to purchase cost.",
      products_sold="Building supplies", platform="FindYello directory (via web search)",
      next_action=VERIFY + " A discounter lives on purchase price, which is exactly EcoEnergy's lever.", notes=RESELL),

    N("Sands Parry", "Sand and gravel supplier", "TIER 2", "Trinidad",
      "https://www.findyello.com/Trinidad/Sands-Parry/",
      "Listed under sand and gravel in a national directory.",
      products_sold="Sand; gravel", platform="FindYello directory (via web search)",
      next_action=VERIFY + " Confirm trading status and exact business name before any approach.",
      notes="Thin record. Directory listing only, and the name may be a directory rendering rather "
            "than the registered trading name. Verify before spending effort. " + RESELL),

    # --- ready-mix / precast
    N("Trinity Readymix Limited", "Ready-mix concrete producer", "TIER 1", "Penal and Point Lisas",
      "https://trinityreadymix.com/",
      "Two batching plants, at Penal and Point Lisas, so sand and gravel draw is continuous.",
      website="https://trinityreadymix.com/",
      products_sold="Ready-mixed concrete",
      products_needed="Sharp sand; 3/8 gravel; 3/4 gravel",
      est_vol="EST HIGH (inferred from two plants) - to confirm",
      freq="EST continuous (inferred) - to confirm",
      next_action=VERIFY + " Point Lisas sits in the heaviest industrial corridor in the country.",
      notes="Not previously held. Ready-mix plants are the highest continuous aggregate draw in the market."),

    N("Central Concrete Product Ltd", "Precast concrete manufacturer", "TIER 1", "Trinidad",
      "https://centralconcretett.com/",
      "Market leader in precast concrete products, incorporated 1976. Precast production consumes graded aggregate continuously.",
      website="https://centralconcretett.com/",
      products_sold="Precast concrete products",
      products_needed="Sharp sand; 3/8 gravel; 3/4 gravel",
      est_vol="EST HIGH (inferred from precast scale) - to confirm",
      freq="EST continuous (inferred) - to confirm",
      next_action=VERIFY, notes="Precast is a steady, quality-sensitive aggregate buyer."),

    N("PRESTCON 2021 Limited", "Precast / prestressed concrete", "TIER 1", "Trinidad",
      "https://www.prestcon2021.com/",
      "Manufactures precast and prestressed products for bridges, docks, jetties, marinas and petrochemical structures.",
      website="https://www.prestcon2021.com/",
      products_sold="Precast and prestressed concrete products",
      products_needed="Sharp sand; 3/8 gravel; 3/4 gravel",
      est_vol="EST MEDIUM-HIGH (inferred) - to confirm", freq="EST project-driven",
      next_action=VERIFY + " Prestressed work demands consistent high-spec aggregate, so quality is the lead, not price.",
      notes="Serves the Caribbean and northeastern South America, so volumes may exceed the domestic picture."),

    # --- asphalt / civil contractors
    N("General Earth Movers Limited (GEML)", "Asphalt / civil contractor", "TIER 1", "Trinidad",
      "https://gemlttwi.com/asphalt/",
      "Produces hot mix asphalt from a wide range of aggregate combinations, and performs milling and paving at scale.",
      website="https://gemlttwi.com/",
      products_sold="Hot mix asphalt; civil construction",
      products_needed="Pitrun; 3/4 gravel; 3/8 gravel; sharp sand",
      est_vol="EST HIGH (inferred from asphalt production) - to confirm", freq="EST project-driven",
      next_action=VERIFY + " An asphalt plant buys graded aggregate by the thousand tonnes. Lead with consistent grading.",
      notes="In construction since 1945 and producing asphalt since 2000. Asphalt producers are among "
            "the largest aggregate consumers in any market."),

    N("Danny's Enterprises Company Limited (DECL)", "Roadworks / drainage contractor", "TIER 1", "Trinidad",
      "https://www.decltt.com/",
      "Roadworks, asphalt paving and installation of wick and earthquake drains, all aggregate-intensive.",
      website="https://www.decltt.com/",
      products_sold="Roadworks; asphalt paving; drainage installation",
      products_needed="Pitrun; 3/4 gravel; sandfill/backfill",
      est_vol="EST MEDIUM-HIGH (inferred) - to confirm", freq="EST project-driven",
      next_action=VERIFY + " Drainage installation consumes graded gravel and backfill steadily.",
      notes="Drainage work is a strong fit for the backfill and sandfill lines now priced."),

    N("Lake Asphalt of Trinidad and Tobago (1978) Limited", "State asphalt producer", "TIER 2",
      "Brighton, La Brea", "https://en.wikipedia.org/wiki/Lake_Asphalt_of_Trinidad_and_Tobago",
      "State asphalt producer. Asphalt manufacture requires aggregate blending.",
      products_sold="Asphalt and asphalt products",
      products_needed="3/8 gravel; 3/4 gravel; sharp sand",
      est_vol="EST MEDIUM (inferred) - to confirm", freq="EST recurring",
      platform="Wikipedia / web search",
      next_action="Identify the procurement route. State entity, so expect vendor registration and tender.",
      notes="State entity. Long lead time through formal procurement."),

    N("Asphalt Paving Co Ltd", "Asphalt paving contractor", "TIER 2", "Trinidad",
      "https://www.findyello.com/trinidad/Asphalt-Paving-Co-Ltd/",
      "Directory-listed asphalt paving contractor.",
      products_sold="Asphalt paving", products_needed="Pitrun; 3/4 gravel; sandfill/backfill",
      platform="FindYello directory (via web search)", next_action=VERIFY,
      notes="Paving contractors buy road base and pitrun in volume."),

    N("Trinidad Asphalt Pavers General Contractors Ltd", "Asphalt / general contractor", "TIER 2",
      "Trinidad", "https://www.findyello.com/trinidad/trinidad-asphalt-pavers-general-contractors-ltd/ksort:t/",
      "Directory-listed asphalt and general contracting firm.",
      products_sold="Asphalt paving; general contracting",
      products_needed="Pitrun; 3/4 gravel; sandfill/backfill",
      platform="FindYello directory (via web search)", next_action=VERIFY,
      notes="Confirm this is distinct from Carib Asphalt Pavers (ECO-0030) before approach."),

    N("Weathershield Systems Caribbean Limited", "Asphalt / waterproofing contractor", "TIER 3",
      "Trinidad", "https://www.findyello.com/trinidad/Asphalt-Paving-Co-Ltd/",
      "Founded 1994, successor to Trinidad Mastic Asphalt & Contracting Company.",
      products_sold="Mastic asphalt; waterproofing systems",
      products_needed="Sharp sand; 3/8 gravel",
      platform="FindYello directory (via web search)",
      next_action="Low priority. Qualify material need by telephone before any commercial effort.",
      notes="Mastic asphalt and waterproofing use far less bulk aggregate than roadbuilding. Weak fit."),

    # --- licensed quarry operators: competitors and benchmarks
    N("Mineral Mines of Trinidad Limited", "Licensed quarry operator", "BENCHMARK",
      "Vega de Oropouche", "https://trinidadexpress.com/news/local/stop-quarrying-mashing-up-our-lives/article_74ce0d92-1b6d-11ed-a7db-f3a68b15cf27.html",
      "Holds a licence to mine or process aggregate.",
      products_sold="Quarry aggregate", products_needed="N/A - producer",
      est_vol="N/A - producer", freq="N/A - producer",
      platform="Trinidad Express (via web search)",
      next_action="Monitor pricing. Approach only for overflow or swap supply.", notes=QUARRY),

    N("Estate Management and Business Development Company Limited (EMBD)",
      "State land company / licensed quarry", "BENCHMARK",
      "Coco Road, Claxton Bay and Milton Village, Couva",
      "https://trinidadexpress.com/news/local/stop-quarrying-mashing-up-our-lives/article_74ce0d92-1b6d-11ed-a7db-f3a68b15cf27.html",
      "Holds licensed quarry operations at two sites.",
      products_sold="Quarry aggregate", products_needed="N/A - producer",
      est_vol="N/A - producer", freq="N/A - producer",
      platform="Trinidad Express (via web search)",
      next_action="Monitor. State entity holding two licensed sites, so also a possible supply partner.",
      notes=QUARRY + " State-owned land development company, so its quarrying is secondary to its main business."),

    N("AADS Multi-Tasking Limited", "Licensed quarry operator", "BENCHMARK",
      "Rio Grande Trace, Matura",
      "https://trinidadexpress.com/news/local/stop-quarrying-mashing-up-our-lives/article_74ce0d92-1b6d-11ed-a7db-f3a68b15cf27.html",
      "Holds a licence to mine or process aggregate.",
      products_sold="Quarry aggregate", products_needed="N/A - producer",
      est_vol="N/A - producer", freq="N/A - producer",
      platform="Trinidad Express (via web search)",
      next_action="Monitor pricing. Matura site, so same catchment as Bestcrete.", notes=QUARRY),

    N("Firma Fabrication and Construction Limited", "Licensed quarry operator + contractor", "TIER 3",
      "Melajo Forest Reserve, Sangre Grande",
      "https://trinidadexpress.com/news/local/stop-quarrying-mashing-up-our-lives/article_74ce0d92-1b6d-11ed-a7db-f3a68b15cf27.html",
      "Holds a licensed quarry and also carries out fabrication and construction.",
      products_sold="Quarry aggregate; fabrication; construction",
      products_needed="Possible overflow purchaser during construction works",
      est_vol="Unknown - to establish", freq="Unknown - to establish",
      platform="Trinidad Express (via web search)",
      next_action="Qualify carefully. They produce their own aggregate, so only their construction arm could buy.",
      notes=QUARRY + " Dual profile, so the construction side may still buy grades they do not produce."),

    # --- plant / equipment
    N("Conveyor and Plant Solutions", "Plant and conveyor supplier", "TIER 3",
      "Lot 54 Cemetery Street, Balmain, Couva",
      "http://ttmanufacturers.memberzone.com/list/ql/manufacturing-production-wholesale-16",
      "Supplies conveyor and plant equipment to the quarry and materials sector.",
      products_sold="Conveyor and plant equipment",
      products_needed="Unlikely direct buyer - route to their quarry clients",
      est_vol="N/A", freq="N/A",
      platform="T&T Manufacturers Association directory (via web search)",
      next_action="Treat as a referral channel rather than a buyer. Their clients are quarry and aggregate operators.",
      notes="CHANNEL PARTNER, not a prospect in the usual sense. Equipment suppliers know every operator "
            "in the sector and their introductions carry weight."),

    N("Christle Limited", "Industrial supplier", "TIER 3",
      "Lot 18E O'Meara Industrial Estate, Arima",
      "http://ttmanufacturers.memberzone.com/list/ql/manufacturing-production-wholesale-16",
      "Listed in the manufacturers association wholesale directory with a published telephone number.",
      products_sold="Not established", phone="(868) 235-5312",
      products_needed="To establish on contact", est_vol="Unknown", freq="Unknown",
      platform="T&T Manufacturers Association directory (via web search)",
      next_action="Telephone to establish what they actually trade before any commercial effort.",
      notes="Contact route is live but the line of business is NOT established. Qualify first. Recorded "
            "because the telephone number is published and verification is cheap."),

    # --- industry body
    N("Trinidad and Tobago Aggregate Producers Alliance (TTAPA)", "Industry association", "BENCHMARK",
      "Trinidad and Tobago", "https://www.guardian.co.tt/news/24-quarries-on-strike-operators-demand-processing-licences-amid-govt-scrutiny-6.2.2442975.5bea92b6d7",
      "Newly formed alliance representing aggregate producers. Led the November 2025 shutdown of 24 quarries over processing licences.",
      products_sold="N/A - industry body", products_needed="N/A",
      est_vol="N/A", freq="N/A", platform="Trinidad Guardian (via web search)",
      next_action="Establish whether EcoEnergy is or should be a member. Membership gives licensing "
                  "intelligence and direct access to every producer in the sector.",
      notes="STRATEGIC CONTACT, not a buyer. TTAPA is the centre of the licensing dispute driving the "
            "current supply disruption. Whoever sits inside it sees the shortage coming first."),
]

for p in new:
    if p["company"].strip().lower() in existing:
        raise SystemExit("duplicate created: " + p["company"])
prospects.extend(new)

names = [p["company"].strip().lower() for p in prospects]
assert len(names) == len(set(names)), "duplicate company after cycle 2"
ids = [p["prospect_id"] for p in prospects]
assert len(ids) == len(set(ids)), "duplicate id after cycle 2"
save("prospects.json", prospects)

# ------------------------------------------------------- NEW OBSERVATIONS
FBM = "https://www.facebook.com/marketplace/116087261735365/gravel/"
benchmarks += [
    dict(seller="Facebook Marketplace seller (T&T)", product="Gravel", price=500.00, unit="TT$/yd",
         basis="Retail, delivered", category="RETAIL (DELIVERED)", delivery="Delivery",
         location="Trinidad", source=FBM, verified=RUN,
         note="Cycle 2 observation. Same listing also offers TT$60 per 75lb bag."),
    dict(seller="Facebook Marketplace seller (T&T)", product="Gravel - bagged 75lb", price=60.00,
         unit="TT$ per 75lb bag", basis="Retail bagged", category="RETAIL (BAGGED)",
         delivery="Not stated", location="Trinidad", source=FBM, verified=RUN,
         note="Cycle 2 observation. Bagged retail, not comparable to bulk cubic-yard pricing."),
    dict(seller="AMCOL Hardware", product="Crusher run / blue metal", price=None,
         unit="8-yard load, per m3, and bagged", basis="Price not captured",
         category="RETAIL", delivery="Not stated", location="Penal",
         source="https://www.amcolhardwarett.com/product-6222/8-yard-load-crusher-run--blue-metal.php",
         verified=RUN,
         note="Cycle 2. Product lines confirmed across three pack sizes but no price was surfaced by "
              "search and the site cannot be fetched. Price NOT captured and NOT estimated."),
    dict(seller="AMCOL Hardware", product="Ballast (1/2 x 1/2 gravel with sharp sand)", price=None,
         unit="10-yard and 11-yard loads", basis="Price not captured", category="RETAIL",
         delivery="Not stated", location="Penal",
         source="https://www.amcolhardwarett.com/product-7960/1-load-12-x-12-gravel-w-sharp-sand-10-yards.php",
         verified=RUN,
         note="Cycle 2. A blended product EcoEnergy could supply as components. Price NOT captured."),
]
save("benchmarks.json", benchmarks)

# --------------------------------------------------------- MARKET INTELLIGENCE
intel = [
    dict(headline="24 quarries voluntarily shut in a licensing dispute",
         detail="In November 2025 the newly formed Trinidad and Tobago Aggregate Producers Alliance "
                "(TTAPA) closed 24 member quarries nationwide over the Government's failure to issue "
                "overdue processing licences. TTAPA's president warned that as many as 100,000 "
                "construction jobs were at risk.",
         implication="A supply shock in the aggregate market. Buyers who lost their supplier are "
                     "actively looking for one. This is the strongest commercial opening available.",
         source="https://www.guardian.co.tt/news/24-quarries-on-strike-operators-demand-processing-licences-amid-govt-scrutiny-6.2.2442975.5bea92b6d7",
         verified=RUN),
    dict(headline="Aggregate shortfall feared as demand outruns production",
         detail="Reporting describes a widening gap between aggregate demand and production capacity "
                "as major infrastructure projects move forward.",
         implication="Demand-led market. Supply reliability outranks price for many buyers, which "
                     "supports holding the base price rather than discounting early.",
         source="https://www.guardian.co.tt/news/aggregate-shortfall-feared-as-quarry-operators-challenge-holdover-licence-system-6.2.2593248.91f45cd7b2",
         verified=RUN),
    dict(headline="Licensing structure: 9 full licences, the rest on hold-over permits",
         detail="Nine companies hold full licences to mine or process aggregate. Another 13 operate "
                "under temporary hold-over permits granted by the line minister. The Ministry states "
                "25 bona fide operators received hold-over letters on 22 May.",
         implication="Licence status is now a commercial differentiator. A buyer facing a police "
                     "crackdown on illegal material wants a supplier whose paperwork is sound.",
         source="https://www.energy.gov.tt/our-business/aggregates/quarrying/", verified=RUN),
    dict(headline="Police crackdown on illegal quarries",
         detail="Newsday reported in November 2025 that police moved against illegal quarrying operations.",
         implication="Buyers sourcing from unlicensed operators carry real risk. Licensed supply is "
                     "worth a premium to any contractor on a government project.",
         source="https://newsday.co.tt/2025/11/23/cops-move-to-crush-illegal-quarries/", verified=RUN),
    dict(headline="Named licensed quarry operations",
         detail="Reported licensed operations include Bestcrete (Melajo Forest Reserve, Matura), ANSA "
                "McAL (Depot Road, Longdenville), Mineral Mines of Trinidad (Vega de Oropouche), EMBD "
                "(Coco Road, Claxton Bay and Milton Village, Couva), AADS Multi-Tasking (Rio Grande "
                "Trace, Matura), Firma Fabrication and Construction (Melajo Forest Reserve, Sangre "
                "Grande) and Seereeram Brothers (Cangrejal Road, Santa Cruz).",
         implication="This is the competitor map. Seereeram Brothers was previously held as a "
                     "contractor prospect and has been reclassified as a producer.",
         source="https://trinidadexpress.com/news/local/stop-quarrying-mashing-up-our-lives/article_74ce0d92-1b6d-11ed-a7db-f3a68b15cf27.html",
         verified=RUN),
    dict(headline="OPEN QUESTION: EcoEnergy's own licence status is not established",
         detail="The shortage and crackdown make licensed supply a strong selling position, but "
                "EcoEnergy's own licence or hold-over permit status is not recorded anywhere in this "
                "pipeline and was not supplied.",
         implication="BLOCKING for the licence-led pitch. Confirm EcoEnergy's status before any "
                     "outreach claims licensed supply. Do not make the claim until it is confirmed.",
         source="Internal gap - no source", verified="NOT VERIFIED"),
]
save("market_intel.json", intel)

print("dedup updates applied:", 5)
print("new prospects        :", len(new), "(%s to %s)" % (new[0]["prospect_id"], new[-1]["prospect_id"]))
print("total prospects      :", len(prospects))
print("benchmarks           :", len(benchmarks))
print("market intel items   :", len(intel))
