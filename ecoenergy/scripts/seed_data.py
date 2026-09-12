#!/usr/bin/env python3
"""
Seeds the EcoEnergy aggregate sales pipeline data store.

Every record below was derived from a live web search performed on the run date
and carries the public source URL it came from. Fields that could not be
verified are marked PENDING VERIFICATION rather than guessed. Direct page
fetches are blocked by this environment's egress policy, so telephone numbers,
e-mail addresses and social handles were deliberately NOT captured — inventing
them would corrupt the pipeline.
"""

import json
import os

RUN_DATE = "2026-09-12"
PENDING = "PENDING VERIFICATION"
NOT_PUB = "Not publicly listed"

DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

_seq = [0]


def P(company, customer_type, priority, location, source_url,
      source_platform="Google Web Search",
      website="", buying_signal="", products_needed="", products_sold="",
      est_volume="", purchase_freq="", observed_price="",
      next_followup="", next_action="", notes="", contact_name=NOT_PUB,
      facebook="", status="DISCOVERED"):
    _seq[0] += 1
    return {
        "prospect_id": "ECO-%04d" % _seq[0],
        "date_identified": RUN_DATE,
        "company": company,
        "contact_name": contact_name,
        "customer_type": customer_type,
        "priority": priority,
        "location": location,
        "phone": PENDING,
        "whatsapp": PENDING,
        "email": PENDING,
        "facebook": facebook or PENDING,
        "instagram": PENDING,
        "x_twitter": PENDING,
        "threads": PENDING,
        "website": website or PENDING,
        "source_platform": source_platform,
        "source_url": source_url,
        "buying_signal": buying_signal,
        "products_needed": products_needed,
        "products_sold": products_sold,
        "est_volume": est_volume,
        "purchase_freq": purchase_freq,
        "observed_price": observed_price,
        "eco_price": "Per current EcoEnergy price list (see WEEKLY PRICING)",
        "potential_discount": "",
        "status": status,
        "last_contact": "",
        "next_followup": next_followup,
        "next_action": next_action,
        "notes": notes,
    }


ALL = "Pitrun; 3/8 gravel; 3/4 gravel; plastering sand; sharp sand; sandfill/backfill"
VERIFY = ("Verify direct telephone/e-mail from company website, then issue "
          "wholesale introduction letter and current price list.")
TIER1_FU = "2026-09-15"
TIER2_FU = "2026-09-17"
TIER3_FU = "2026-09-22"

prospects = []

# ---------------------------------------------------------------- producers /
# Quarry operators and aggregate producers. Primarily price benchmarks and
# competitors; secondary value as overflow-supply or swap partners.
prospects += [
    P("National Quarries Company Limited (NQCL)",
      "Quarry operator - state enterprise", "BENCHMARK",
      "Sand & Gravel Division, Guaico, Sangre Grande",
      "https://nqcl.co.tt/", website="https://nqcl.co.tt/",
      buying_signal="Publishes a public price list; state-owned market price regulator.",
      products_sold="Sharp sand; silt sand; 3/8 gravel; 3/4 gravel; pit run",
      est_volume="N/A - producer", purchase_freq="N/A - producer",
      observed_price="Price list published (NQCL-Price-List-2025.pdf) - PDF BLOCKED BY EGRESS POLICY, not retrieved",
      next_followup=TIER1_FU,
      next_action="Obtain the published NQCL 2025/2026 price list by a channel outside this environment; it is the single most valuable benchmark input.",
      notes="PRIMARY PRICE BENCHMARK. State-owned, established 1979, supplies state enterprises and private sector. Washes pit run to remove clay, then sieves to sharp sand, silt sand, 3/8 and 3/4. Treat as competitor, not customer."),

    P("Bestcrete Aggregate Limited (BAL) / Abel Building Solutions",
      "Quarry operator + aggregate producer", "BENCHMARK",
      "Matura quarry, North-Eastern Trinidad; Arouca factory",
      "https://buildwithabs.com/product/bulk-aggregate/",
      website="https://buildwithabs.com/",
      buying_signal="Publishes bulk aggregate pricing per cubic yard - direct price benchmark.",
      products_sold="Plastering sand; CS1 sharp sand; 3/8 (10mm) gravel; 3/4 (20mm) gravel; pit-run granular",
      est_volume="N/A - producer", purchase_freq="N/A - producer",
      observed_price="3/4 gravel TTD 185.62/cu yd; 3/8 gravel TTD 185.62/cu yd; sharp sand TTD 185.62/cu yd; plastering sand TTD 84.38/cu yd (all VAT incl.)",
      next_followup=TIER1_FU,
      next_action="Hold as the anchor benchmark. Re-verify the four published figures at the Sunday pricing review.",
      notes="ANCHOR BENCHMARK - the only source in this cycle carrying published TTD prices for all four of EcoEnergy's core comparables. Acquired its Matura sand and gravel quarry in 2018. Part of ANSA McAL group via Abel Building Solutions."),

    P("Coosal's (Sand & Gravel Operations / Coosal's Concrete Limited)",
      "Quarry operator + ready-mix producer", "BENCHMARK",
      "Multiple plants throughout Trinidad",
      "https://coosalstt.com/our-divisions/sand-and-gravel-operations/",
      website="https://coosalstt.com/",
      buying_signal="Operates own sand and gravel plants feeding an internal ready-mix division.",
      products_sold="Sand; gravel; ready-mixed concrete",
      est_volume="N/A - vertically integrated", purchase_freq="N/A",
      next_followup=TIER2_FU,
      next_action="Monitor as competitor. Approach only for shortfall/overflow supply if their own plants run short.",
      notes="Vertically integrated - own aggregate feeds own concrete. Low probability as a buyer; tracked as a competitor and as a possible overflow-supply counterparty."),

    P("Dipcon Engineering Services Limited",
      "Civil/road contractor + aggregate supplier", "TIER 1",
      "Trinidad (nationwide civil works)",
      "http://www.dipconcaribbean.com/aggregates.html",
      website="http://www.dipconcaribbean.com/",
      buying_signal="Described as one of the largest suppliers of aggregates to Trinidad's construction industry AND a major road contractor - consumes and resells.",
      products_needed=ALL,
      products_sold="Crushed rock; aggregates; sand and gravel; armour stone",
      est_volume="EST HIGH (inferred from business type) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Position as bulk wholesale top-up supply for road contracts.",
      notes="Dual profile: both a competitor (sells aggregate) and a high-value prospect (large road/highway contractor consuming aggregate). Also listed under general civil engineering contractors, highway and road building, bridges."),

    P("Batchasingh Quarry Ltd", "Quarry operator", "BENCHMARK",
      "Trinidad", "https://businessviewcaribbean.com/national-quarries-company-limited/",
      buying_signal="Named as an established quarry operator (est. 2000).",
      products_sold="Quarry aggregates - product range not verified",
      next_followup=TIER3_FU,
      next_action="Verify product range and published pricing; add to benchmark set if pricing is public.",
      notes="Identified only by name in a secondary article; own website not confirmed. Low-confidence record - verify existence and trading status before any outreach."),

    P("Concrete Aggregate Suppliers Ltd", "Aggregate wholesaler/supplier", "TIER 1",
      "Trinidad", "https://www.findyello.com/trinidad/concrete-aggregate-suppliers-ltd/",
      source_platform="FindYello business directory (via web search)",
      buying_signal="Directory-listed dedicated aggregate supply business - core reseller profile.",
      products_needed=ALL,
      products_sold="Concrete aggregates - range not verified",
      est_volume="EST MEDIUM-HIGH (inferred) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Strong wholesale-supply fit - lead with reseller margin.",
      notes="Name indicates a pure aggregate supply business, so it must buy from a quarry. High-fit wholesale prospect. Directory page blocked by egress policy - contact details not retrieved."),

    P("Trinidad Aggregate Product Limited (TAP)", "Clay products manufacturer", "TIER 2",
      "Longdenville, Borough of Chaguanas (44 acres)",
      "https://www.findyello.com/trinidad/sand-and-gravel/",
      buying_signal="Long-established (1976) materials producer on a large site; leading regional clay products producer.",
      products_needed="Sandfill/backfill; pitrun; sharp sand",
      products_sold="Clay building products",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST recurring (inferred)",
      next_followup=TIER2_FU,
      next_action=VERIFY + " Probe for site/yard fill and process sand requirements.",
      notes="Clay products rather than aggregate, so not a direct competitor. Possible buyer of fill and sand for site works and blending."),
]

# ---------------------------------------------------- ready-mix & block plants
# Highest-value recurring consumers of sharp sand and gravel.
RM_NOTE = ("Ready-mix and block plants are the highest-value recurring aggregate "
           "consumers in the market - continuous sharp sand and gravel draw. Priority segment.")
prospects += [
    P("Readymix (West Indies) Limited", "Ready-mix concrete producer", "TIER 1",
      "Plants in North, East, Central and South Trinidad, and Tobago",
      "https://www.findyello.com/trinidad/readymix-west-indies-ltd/profile/",
      buying_signal="Multi-plant national ready-mix operation - continuous high-volume sand and gravel consumption.",
      products_needed="Sharp sand; 3/8 gravel; 3/4 gravel",
      products_sold="Ready-mixed concrete and related products",
      est_volume="EST VERY HIGH (inferred from multi-plant national footprint) - to confirm",
      purchase_freq="EST continuous/weekly (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Target procurement/purchasing manager. Lead with contracted weekly supply and up-to-30% negotiated volume terms.",
      notes="Operating since 1959. " + RM_NOTE),

    P("Alescon Readymix Limited", "Ready-mix concrete producer", "TIER 1",
      "Central and East Trinidad; Canaan, Tobago",
      "https://www.alesconreadymix.com/", website="https://www.alesconreadymix.com/",
      buying_signal="Described as one of the premiere and largest readymix suppliers - multi-site.",
      products_needed="Sharp sand; 3/8 gravel; 3/4 gravel",
      products_sold="Ready-mixed concrete",
      est_volume="EST VERY HIGH (inferred) - to confirm",
      purchase_freq="EST continuous/weekly (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Tobago operation may carry a freight premium EcoEnergy can undercut - quantify before approach.",
      notes=RM_NOTE),

    P("Premix Concrete Ltd", "Ready-mix concrete producer", "TIER 1",
      "Caroni", "https://www.findyello.com/trinidad/premix-concrete-ltd/profile/",
      buying_signal="Directory-listed ready-mix manufacturer.",
      products_needed="Sharp sand; 3/8 gravel; 3/4 gravel",
      products_sold="Ready-mixed concrete",
      est_volume="EST HIGH (inferred) - to confirm",
      purchase_freq="EST weekly (inferred) - to confirm",
      next_followup=TIER1_FU, next_action=VERIFY, notes=RM_NOTE),

    P("Ready Mix Concrete Co Ltd", "Ready-mix concrete producer", "TIER 1",
      "Trinidad", "https://www.findyello.com/trinidad/ready-mix-concrete-co-ltd/",
      buying_signal="Directory-listed ready-mix producer.",
      products_needed="Sharp sand; 3/8 gravel; 3/4 gravel",
      products_sold="Ready-mixed concrete",
      est_volume="EST HIGH (inferred) - to confirm",
      purchase_freq="EST weekly (inferred) - to confirm",
      next_followup=TIER1_FU, next_action=VERIFY,
      notes="Confirm this is a distinct entity from Readymix (W.I.) Ltd before outreach - names are close. " + RM_NOTE),

    P("Trinidad Concrete Blocks Limited (TCBL)", "Block manufacturer", "TIER 1",
      "Trinidad (e TecK industrial park listing)",
      "https://tcblwi.com/", website="https://tcblwi.com/",
      buying_signal="Manufactures foundation blocks, standard/ventilation/decorative blocks and pavers - continuous sand and gravel feed.",
      products_needed="Sharp sand; 3/8 gravel; plastering sand",
      products_sold="Concrete blocks; ventilation blocks; decorative blocks; concrete pavers",
      est_volume="EST HIGH (inferred from block plant scale) - to confirm",
      purchase_freq="EST continuous (inferred) - to confirm",
      next_followup=TIER1_FU, next_action=VERIFY, notes=RM_NOTE),

    P("RD Premium Blocks (RD Group Limited)", "Block manufacturer", "TIER 1",
      "Trinidad", "https://rdgrouptt.com/rd-premium-blocks/", website="https://rdgrouptt.com/",
      buying_signal="Established 2015 and recently made a self-sufficient subsidiary serving the development sector - growth signal.",
      products_needed="Sharp sand; 3/8 gravel; plastering sand",
      products_sold="Concrete blocks",
      est_volume="EST MEDIUM-HIGH (inferred) - to confirm",
      purchase_freq="EST continuous (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Newer and scaling - more likely than incumbents to switch supplier on price.",
      notes="Growth-stage subsidiary. Newly independent operations are the most winnable block-plant targets. " + RM_NOTE),

    P("Abel Building Solutions (ANSA McAL)", "Block/paver manufacturer + aggregate retailer", "BENCHMARK",
      "Longdenville, Chaguanas; Arouca",
      "https://www.ansamcal.com/companies/abel-building-solutions/",
      website="https://buildwithabs.com/",
      buying_signal="Largest manufacturer of clay building blocks in the English-speaking Caribbean; also retails bulk and bagged aggregate.",
      products_sold="Clay and concrete blocks; pavers; bulk aggregate; Aggre GO! bagged aggregate; landscaping",
      est_volume="N/A - vertically integrated via Bestcrete",
      purchase_freq="N/A",
      observed_price="Bulk: 3/4 and 3/8 gravel and sharp sand TTD 185.62/cu yd; plastering sand TTD 84.38/cu yd (VAT incl.)",
      next_followup=TIER2_FU,
      next_action="Track as the anchor price benchmark alongside its Bestcrete quarry arm.",
      notes="Same group as Bestcrete Aggregate Ltd - self-supplied, so not a buyer. Retained because it sets the published retail/bulk benchmark EcoEnergy prices against."),
]

# ------------------------------------------------------- hardware / resellers
# Section 5 of the brief: existing sellers are prospects. A hardware store or
# stockpile already selling sand and gravel must buy it from somewhere, so the
# pitch is reseller margin plus reliable recurring supply.
RESELL = ("RESELLER TARGET - already sells aggregate, therefore already buys it. "
          "Pitch wholesale purchase price and reseller spread, not retail price.")
prospects += [
    P("Bhagwansingh's Hardware & Steel Industries Limited",
      "Hardware chain / building materials", "TIER 1",
      "1 Development Circular Road, Beetham Highway, Sea Lots, Port of Spain; branches incl. St. Augustine, Chaguanas, Trincity",
      "https://www.dnb.com/business-directory/company-profiles.bhagwansinghs_hardware__steel_industries_limited.5ba54e5647c52eef373b88f4cc5f08bb.html",
      source_platform="Dun & Bradstreet / web search",
      website="https://www.bhsil.com",
      facebook="https://www.facebook.com/BhagwansinghsPOS/",
      buying_signal="Largest hardware and building-materials chain in T&T; multi-branch national distribution.",
      products_needed=ALL,
      products_sold="Building materials; tools; steel; home improvement",
      est_volume="EST VERY HIGH (inferred from chain scale) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action="Verify head-office procurement contact. Approach as a multi-branch supply agreement, not a single-store sale.",
      notes="Highest strategic value in the hardware segment: one agreement supplies many branches. Address is from a D&B listing and must be re-confirmed before use. " + RESELL),

    P("Authentic Builders General Hardware (ABG Hardware)",
      "Hardware store selling aggregate", "TIER 1",
      "Cunupia, Chaguanas",
      "https://www.facebook.com/abghardware/posts/sand-and-gravel-is-available-by-the-truckload-trinidad-only-contact-the-supplier/1394928772649589/",
      source_platform="Facebook business page (via web search)",
      facebook="https://www.facebook.com/abghardware/",
      buying_signal="ACTIVE PUBLIC ADVERTISEMENT: 'Sand and Gravel is available by the Truckload (Trinidad only)' - currently trading truckload aggregate.",
      products_needed="Pitrun; 3/8 gravel; 3/4 gravel; sharp sand; plastering sand",
      products_sold="Sand and gravel by the truckload; general hardware",
      est_volume="EST MEDIUM-HIGH - truckload trade confirmed by own advertisement",
      purchase_freq="EST recurring (inferred from active trading) - to confirm",
      next_followup=TIER1_FU,
      next_action="HOT - verify contact from the Facebook page, then approach directly on wholesale truckload supply.",
      notes="STRONGEST RESELLER SIGNAL IN THIS CYCLE. The advertisement wording 'contact the supplier' indicates they broker/resell third-party material rather than produce it - exactly EcoEnergy's wholesale target. " + RESELL),

    P("Rite Buy Hardware", "Hardware store selling aggregate", "TIER 1",
      "Trinidad", "https://www.findyello.com/trinidad/HARDWARE-STORES/",
      buying_signal="Stocks sand, gravel and sharp sand alongside lumber, blocks and concrete - confirmed aggregate reseller.",
      products_needed="Sharp sand; plastering sand; 3/8 gravel; 3/4 gravel",
      products_sold="Sand; gravel; sharp sand; lumber; blocks; concrete",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER1_FU, next_action=VERIFY, notes=RESELL),

    P("S K Singh Hardware Ltd", "Hardware store selling aggregate", "TIER 1",
      "Trinidad", "https://tt.directory/top-hardwares-in-trinidad-and-tobago",
      source_platform="TT Directory (via web search)",
      buying_signal="Listed as supplying sand and gravel alongside paints and power tools.",
      products_needed="Sharp sand; plastering sand; 3/8 gravel; 3/4 gravel",
      products_sold="Sand and gravel; paints; power tools",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER1_FU, next_action=VERIFY, notes=RESELL),

    P("Southern Wholesale Stores Ltd", "Building materials wholesaler", "TIER 1",
      "Southern Trinidad", "https://tt.directory/top-hardwares-in-trinidad-and-tobago",
      source_platform="TT Directory (via web search)",
      buying_signal="Explicitly a WHOLESALER and retailer of building materials - wholesale buying behaviour already established.",
      products_needed=ALL,
      products_sold="Building materials; sanitary fittings; steel beams; plumbing; electrical; reinforcing rods; lumber; power tools",
      est_volume="EST HIGH (inferred from wholesale model) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Wholesale buyer profile - qualifies for the upper discount band if volume supports it.",
      notes="Aggregate not confirmed in their current range, so this is both a supply opportunity and a range-extension pitch. " + RESELL),

    P("Samaroo's Materials & General Ltd", "Hardware / building materials", "TIER 1",
      "Trinidad", "https://smghardwarett.com/", website="https://smghardwarett.com/",
      buying_signal="Operates an online hardware storefront - materials-focused business with e-commerce reach.",
      products_needed=ALL, products_sold="Building materials; general hardware",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Online catalogue makes listed aggregate pricing easy to verify - check before contact.",
      notes="Online storefront means published prices are likely retrievable, which also makes this a benchmark source. " + RESELL),

    P("Almandoz Hardware Ltd", "Hardware store", "TIER 1",
      "Trinidad", "https://almandozhardware.com/product/bestcrete-aggre-go-sharp-sand-30kg/",
      website="https://almandozhardware.com/",
      buying_signal="Currently stocks and resells Bestcrete Aggre GO! bagged sharp sand - confirmed aggregate reseller buying from a competing quarry.",
      products_needed="Sharp sand; plastering sand; 3/8 gravel; 3/4 gravel",
      products_sold="Bestcrete Aggre GO! bagged aggregate (30kg); general hardware",
      est_volume="EST LOW-MEDIUM (bagged trade) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      observed_price="Aggre GO! 30kg bagged aggregate TTD 22.44 per bag (retail)",
      next_followup=TIER1_FU,
      next_action="COMPETITIVE DISPLACEMENT - they currently buy Bestcrete. Verify contact and quote against the bagged-equivalent rate.",
      notes="Known current supplier is Bestcrete, so the switching pitch is concrete and measurable. Also a live retail benchmark source. " + RESELL),

    P("Island Express Hardware & General", "Hardware store", "TIER 2",
      "Chaguanas", "https://tt.directory/top-hardwares-in-trinidad-and-tobago",
      source_platform="TT Directory (via web search)",
      buying_signal="Directory-listed top hardware store in a high-construction central corridor.",
      products_needed=ALL, products_sold="General hardware - aggregate range not confirmed",
      est_volume="EST LOW-MEDIUM (inferred) - to confirm",
      purchase_freq="Unknown - to establish",
      next_followup=TIER2_FU, next_action=VERIFY, notes=RESELL),

    P("Kamlall's Hardware", "Hardware / building materials", "TIER 2",
      "Trinidad", "https://tt.directory/top-hardwares-in-trinidad-and-tobago",
      source_platform="TT Directory (via web search)",
      buying_signal="Supplies all building material 'from foundation to finish' - foundation stage implies fill and aggregate.",
      products_needed="Pitrun; sandfill/backfill; sharp sand; 3/4 gravel",
      products_sold="Building materials, foundation to finish",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER2_FU, next_action=VERIFY, notes=RESELL),

    P("Richard's Hardware Supplies", "Hardware store", "TIER 2",
      "Tobago", "https://tt.directory/top-hardwares-in-trinidad-and-tobago",
      source_platform="TT Directory (via web search)",
      buying_signal="Described as Tobago's leading hardware, stocking construction materials for homeowners and contractors.",
      products_needed=ALL, products_sold="Construction materials; general hardware",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER2_FU,
      next_action="Model inter-island freight to Tobago BEFORE quoting - barge cost may decide whether this is viable.",
      notes="TOBAGO MARKET. Tobago buyers pay a freight premium on Trinidad material; margin depends entirely on shipping economics. Do not quote before costing the barge leg. " + RESELL),

    P("Goolcharan's General Hardware", "Hardware store", "TIER 2",
      "Trinidad", "https://www.findyello.com/trinidad/HARDWARE-STORES/",
      buying_signal="Trading since February 2007, serving customers throughout Trinidad and Tobago.",
      products_needed=ALL, products_sold="General hardware",
      est_volume="EST LOW-MEDIUM (inferred) - to confirm",
      purchase_freq="Unknown - to establish",
      next_followup=TIER2_FU, next_action=VERIFY, notes=RESELL),

    P("K A Yadali & Sons Sawmill & Hardware", "Sawmill / hardware", "TIER 2",
      "Trinidad", "https://www.findyello.com/trinidad/HARDWARE-STORES/",
      buying_signal="Three-generation family business holding extensive hardware stock.",
      products_needed=ALL, products_sold="Lumber; general hardware",
      est_volume="EST LOW-MEDIUM (inferred) - to confirm",
      purchase_freq="Unknown - to establish",
      next_followup=TIER2_FU, next_action=VERIFY, notes=RESELL),
]

# ------------------------------------------------------ contractors / civil
CONTR = ("Contractor profile - aggregate is a project input. Volume is lumpy and "
         "project-driven, so qualify on current project pipeline, not on history.")
prospects += [
    P("Trinidad Contractors Limited", "Civil / road / marine contractor", "TIER 1",
      "Trinidad", "https://trinidadcontractorsltd.com/", website="https://trinidadcontractorsltd.com/",
      buying_signal="Roadworks, asphalting, bridges, sea defence and precast concrete - all heavy aggregate consumers.",
      products_needed="Pitrun; 3/4 gravel; 3/8 gravel; sharp sand; sandfill/backfill",
      products_sold="Civil construction services",
      est_volume="EST VERY HIGH (inferred from roads/bridges/sea defence scope) - to confirm",
      purchase_freq="EST project-driven, sustained during works",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Ask which projects are in construction now and what monthly tonnage they carry.",
      notes="Established 1959. Sea defence and precast work implies armour stone and high-spec aggregate demand. " + CONTR),

    P("Carib Asphalt Pavers Limited (CAPL)", "Road / paving contractor", "TIER 1",
      "Trinidad", "https://www.tntyellow.com/category/Civil_engineering",
      source_platform="TNT Yellow directory (via web search)",
      buying_signal="Over 30 years in full-service ground construction works - paving contractors consume base aggregate continuously.",
      products_needed="Pitrun; 3/4 gravel; sandfill/backfill",
      products_sold="Asphalt paving; civil works",
      est_volume="EST HIGH (inferred) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Lead with pitrun and road base, which is where paving contractors buy most.",
      notes=CONTR),

    P("George Aboud & Sons", "Construction company", "TIER 1",
      "Trinidad", "https://www.zoominfo.com/top-lists/top-construction-civil-companies-in-TT",
      source_platform="ZoomInfo top-list (via web search)",
      buying_signal="Listed among the top civil construction companies in T&T by revenue (cited at USD 17.1M).",
      products_needed=ALL, products_sold="Construction services",
      est_volume="EST HIGH (inferred from revenue rank) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER1_FU, next_action=VERIFY,
      notes="Revenue figure is from a third-party aggregator and is unverified. " + CONTR),

    P("Critical Engineering Solutions Ltd", "General contractor / engineering", "TIER 2",
      "Trinidad", "https://www.tntyellow.com/category/Civil_engineering",
      source_platform="TNT Yellow directory (via web search)",
      buying_signal="General contractor providing engineering and construction services nationally.",
      products_needed=ALL, products_sold="Engineering and construction services",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER2_FU, next_action=VERIFY, notes=CONTR),

    P("Seereeram Bros Limited", "Earthworks / civil contractor", "TIER 1",
      "Trinidad", "https://www.findyello.com/trinidad/demolition-and-earth-works/",
      buying_signal="Long-established (1933) transport and contracting business, now a large civil operation.",
      products_needed="Pitrun; sandfill/backfill; 3/4 gravel",
      products_sold="Earthworks; demolition; transport",
      est_volume="EST HIGH (inferred) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Earthworks firms are the natural home for pitrun and backfill volume - lead there.",
      notes="Own transport fleet means they may collect ex-quarry, which improves EcoEnergy's margin. " + CONTR),

    P("D and N Contracting Company Ltd", "Demolition / earthworks contractor", "TIER 2",
      "252 Calcutta #1, Couva",
      "https://www.findyello.com/trinidad/demolition-and-earth-works/",
      buying_signal="Described as a leading emerging business in demolition and earth works.",
      products_needed="Pitrun; sandfill/backfill",
      products_sold="Demolition; earthworks",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER2_FU,
      next_action=VERIFY + " Emerging firms are price-sensitive and switch readily - good discount-led target.",
      notes="Address from directory listing, to be re-confirmed. " + CONTR),

    P("Trinidese General Construction Co. Limited", "General / drainage contractor", "TIER 2",
      "Trinidad", "https://buildwithtrinidese.com/", website="https://buildwithtrinidese.com/",
      buying_signal="Offers drainage solutions, retaining walls and bridges - all aggregate-intensive.",
      products_needed="3/4 gravel; 3/8 gravel; sharp sand; pitrun",
      products_sold="Construction; drainage; retaining walls; bridges",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER2_FU,
      next_action=VERIFY + " Drainage works consume graded gravel steadily - lead with 3/4.",
      notes="Established 2017 - younger firm, likely still forming supplier relationships. " + CONTR),
]

# --------------------------------------------------- state developers / bodies
STATE = ("STATE ENTITY - purchasing runs through formal tender and vendor "
         "registration. The action is to register as an approved supplier, not to "
         "cold-sell. Long lead time, very high volume.")
prospects += [
    P("Housing Development Corporation (HDC)", "State housing developer", "TIER 1",
      "Trinidad and Tobago (national)", "https://hdc.gov.tt/construction-programme/",
      website="https://hdc.gov.tt/",
      buying_signal="Runs an aggressive national construction programme across Infill Lots, Joint Venture and Urban Housing components.",
      products_needed=ALL, products_sold="N/A - developer",
      est_volume="EST VERY HIGH (national housing programme) - to confirm",
      purchase_freq="EST sustained across programme duration",
      next_followup=TIER1_FU,
      next_action="Locate HDC supplier/vendor registration and procurement notices; register EcoEnergy as an approved aggregate supplier.",
      notes="The Infill Lots component explicitly uses SMALL CONTRACTORS - those contractors buy their own materials and are individually winnable without a state tender. Mine that contractor list. " + STATE),

    P("T&T Housing Development Corporation Construction Company Ltd (CCL)",
      "State construction project manager", "TIER 1",
      "Trinidad and Tobago", "https://www.ccl.gov.tt/about-us/", website="https://www.ccl.gov.tt/",
      buying_signal="HDC subsidiary (est. 2022) handling contractor procurement and construction management for residential programmes.",
      products_needed=ALL, products_sold="N/A - project manager",
      est_volume="EST VERY HIGH (inferred) - to confirm",
      purchase_freq="EST sustained",
      next_followup=TIER1_FU,
      next_action="Identify the procurement route; CCL manages contractor procurement, so approval here reaches many downstream contractors.",
      notes="Controls contractor procurement for HDC residential work - high leverage. " + STATE),

    P("National Infrastructure Development Company (NIDCO)", "State infrastructure agency", "TIER 1",
      "Trinidad and Tobago", "https://en.wikipedia.org/wiki/National_Infrastructure_Development_Company",
      source_platform="Wikipedia / web search",
      buying_signal="Manages drainage, flood control, reclamation, highway and transportation projects - the largest aggregate-consuming programmes in the country.",
      products_needed="Pitrun; 3/4 gravel; sandfill/backfill; armour-grade material",
      products_sold="N/A - state agency",
      est_volume="EST VERY HIGH - reclamation and flood control consume bulk fill at scale",
      purchase_freq="EST sustained across programmes",
      next_followup=TIER1_FU,
      next_action="Track published tender notices. Reclamation and sea defence work is the single largest fill opportunity available.",
      notes="Reclamation projects consume enormous volumes of fill and rock. Highest theoretical volume in the pipeline. " + STATE),

    P("Urban Development Corporation of T&T (UDeCOTT)", "State development company", "TIER 2",
      "Trinidad and Tobago", "https://en.wikipedia.org/wiki/UDeCOTT",
      source_platform="Wikipedia / web search",
      buying_signal="State-owned development company (formed 1994) delivering major public building projects.",
      products_needed=ALL, products_sold="N/A - state developer",
      est_volume="EST HIGH (inferred) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER2_FU,
      next_action="Monitor tender notices; register as a supplier where a standing vendor list exists.", notes=STATE),

    P("NIPDEC (National Insurance Property Development Company Ltd)",
      "State property development / procurement", "TIER 2",
      "Trinidad and Tobago", "https://www.zoominfo.com/top-lists/top-construction-civil-companies-in-TT",
      source_platform="ZoomInfo top-list (via web search)",
      buying_signal="Listed as the highest-revenue civil construction entity in T&T (cited at USD 60.8M).",
      products_needed=ALL, products_sold="N/A - state developer/procurer",
      est_volume="EST HIGH (inferred) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER2_FU,
      next_action="Identify procurement portal and vendor registration requirements.",
      notes="Revenue figure is third-party and unverified. NIPDEC also acts as a procurement agent for other state bodies, which multiplies reach. " + STATE),
]

# ------------------------------------------------------------ trucking / haulage
TRUCK = ("Trucking profile - two ways to win: sell them material to resell on "
         "their own delivered jobs, or use their fleet to extend EcoEnergy's "
         "delivery radius. Qualify for both.")
prospects += [
    P("Adequip Services Limited", "Equipment rental + aggregate supply + haulage", "TIER 1",
      "Trinidad", "https://adequipservices.com/", website="https://adequipservices.com/",
      buying_signal="Explicitly offers AGGREGATE SUPPLY alongside heavy equipment rental and transport - they resell aggregate they must buy in.",
      products_needed=ALL,
      products_sold="Aggregate supply; heavy equipment rental; transportation",
      est_volume="EST MEDIUM-HIGH (inferred) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER1_FU,
      next_action="HIGH FIT - verify contact and pitch wholesale supply behind their existing aggregate offering.",
      notes="Serves both domestic and corporate clients, so they need consistent supply across order sizes. Strong reseller fit AND a potential delivery partner. " + TRUCK),

    P("Bartlett Group Ltd / Bartlett Haulage", "Haulage / construction / civil works", "TIER 1",
      "San Fernando", "https://bartletthaulagett.com/", website="https://bartletthaulagett.com/",
      buying_signal="Transports bulk and construction materials with a modern fleet; also performs construction and civil works.",
      products_needed="Pitrun; sandfill/backfill; 3/4 gravel",
      products_sold="Haulage; heavy lifting; construction and civil works; waste disposal",
      est_volume="EST MEDIUM-HIGH (inferred) - to confirm",
      purchase_freq="EST project-driven",
      next_followup=TIER1_FU,
      next_action=VERIFY + " Dual pitch: material for their civil works, and haulage capacity for EcoEnergy's southern deliveries.",
      notes="Established 1998, serves major energy-sector clients - implies reliability standards and creditworthiness. " + TRUCK),

    P("GML Contractors Ltd", "Transport / heavy lifting contractor", "TIER 2",
      "Trinidad", "https://gmlcontractors.com/services/transportation-heavy-lifting/",
      website="https://gmlcontractors.com/",
      buying_signal="24/7 national transport of construction materials with a certified fleet.",
      products_needed="Pitrun; sandfill/backfill",
      products_sold="Transport; heavy lifting",
      est_volume="EST MEDIUM (inferred) - to confirm",
      purchase_freq="Unknown - to establish",
      next_followup=TIER2_FU,
      next_action="Qualify primarily as a delivery partner; secondarily as a material buyer.", notes=TRUCK),

    P("D.S. Movers Ltd", "Haulage and storage", "TIER 2",
      "Trinidad", "https://www.findyello.com/trinidad/TRANSPORT-CONTRACTORS/",
      buying_signal="Established 2002, providing haulage and storage across T&T and the wider Caribbean.",
      products_needed="Pitrun; sandfill/backfill",
      products_sold="Haulage; storage",
      est_volume="EST LOW-MEDIUM (inferred) - to confirm",
      purchase_freq="Unknown - to establish",
      next_followup=TIER2_FU, next_action="Qualify as a delivery partner first.", notes=TRUCK),

    P("SNM Transport", "Transport contractor", "TIER 3",
      "Trinidad", "https://www.findyello.com/trinidad/demolition-and-earth-works/",
      buying_signal="Operating since 1960 in transport services.",
      products_needed="Pitrun; sandfill/backfill",
      products_sold="Transport services",
      est_volume="Unknown - to establish", purchase_freq="Unknown - to establish",
      next_followup=TIER3_FU, next_action="Low priority - qualify by telephone before any commercial effort.",
      notes="Minimal public information. Confirm still trading before spending effort. " + TRUCK),
]

# ------------------------------------------------------------- landscaping etc.
LAND = ("Landscaping profile - low individual volume but steady, and sand and "
        "decorative aggregate carry good margin. Batch these into one campaign "
        "rather than working them individually.")
prospects += [
    P("Trinidad & Tobago Landscaping Company Ltd", "Landscaping contractor", "TIER 2",
      "Trinidad", "https://caricontractors.com/listing/trinidad-and-tobago-landscaping-company-limited/",
      source_platform="CariContractors directory (via web search)",
      buying_signal="Founded 2006; landscape design, CONSTRUCTION and maintenance - construction work consumes sand and gravel.",
      products_needed="Plastering sand; sharp sand; 3/8 gravel; decorative stone",
      products_sold="Landscape design, construction and maintenance",
      est_volume="EST LOW-MEDIUM (inferred) - to confirm",
      purchase_freq="EST recurring (inferred) - to confirm",
      next_followup=TIER2_FU,
      next_action=VERIFY + " Largest of the landscaping targets - work this one individually.", notes=LAND),

    P("Dynaprofs Landscaping Services", "Landscaping contractor", "TIER 3",
      "Trinidad", "https://dynaprofslandscaping.adelieweb.com/",
      website="https://dynaprofslandscaping.adelieweb.com/",
      buying_signal="Over 13 years operating across Trinidad, including irrigation and garden construction.",
      products_needed="Plastering sand; sharp sand; decorative gravel",
      products_sold="Landscaping services",
      est_volume="EST LOW (inferred) - to confirm", purchase_freq="Unknown - to establish",
      next_followup=TIER3_FU, next_action="Include in the batched landscaping campaign.", notes=LAND),

    P("Yardmen Services", "Landscaping contractor", "TIER 3",
      "Trinidad", "https://yardmenservices.com/landscaping-in-trinidad-and-tobago/",
      website="https://yardmenservices.com/",
      buying_signal="Professional landscaping for homes and businesses including installation work.",
      products_needed="Plastering sand; sharp sand; decorative gravel",
      products_sold="Landscaping services",
      est_volume="EST LOW (inferred) - to confirm", purchase_freq="Unknown - to establish",
      next_followup=TIER3_FU, next_action="Include in the batched landscaping campaign.", notes=LAND),

    P("Wallace Landscaping Services", "Landscaping contractor", "TIER 3",
      "Trinidad", "https://www.findyello.com/trinidad/landscaping/",
      buying_signal="Trading since 2007 and has expanded beyond lawn care into broader services.",
      products_needed="Plastering sand; sharp sand; decorative gravel",
      products_sold="Landscaping services",
      est_volume="EST LOW (inferred) - to confirm", purchase_freq="Unknown - to establish",
      next_followup=TIER3_FU, next_action="Include in the batched landscaping campaign.", notes=LAND),
]

# ------------------------------------------------------- marketplace / signals
prospects += [
    P("Unidentified aggregate reseller - 'SAND / GRAVEL / Aggregates, Nationwide Delivery'",
      "Independent aggregate reseller", "TIER 2",
      "Trinidad (nationwide delivery advertised)",
      "https://www.facebook.com/marketplace/116087261735365/gravel/",
      source_platform="Facebook Marketplace (via web search)",
      buying_signal="LIVE LISTING advertising sand, gravel and aggregates with nationwide delivery and a WhatsApp contact - an active reseller placing material now.",
      products_needed=ALL,
      products_sold="Sand; gravel; aggregates - delivered nationwide",
      est_volume="EST MEDIUM (inferred from nationwide delivery claim) - to confirm",
      purchase_freq="EST recurring (active trader)",
      observed_price="Listings on the same marketplace: 3/4 white deco stone TTD 500/yd; 2in crush stone TTD 375/yd; assorted gravel TTD 200-400/yd",
      next_followup=TIER2_FU,
      next_action="Re-locate the listing and capture the advertised WhatsApp number by a channel with Facebook access, then approach on wholesale supply.",
      notes="IDENTITY NOT ESTABLISHED. The listing advertises a WhatsApp number but Facebook is not reachable from this environment, so the number was NOT captured and has NOT been guessed. Record is retained because the buying signal is genuine and recoverable."),
]

os.makedirs(DATA, exist_ok=True)
with open(os.path.join(DATA, "prospects.json"), "w") as f:
    json.dump(prospects, f, indent=2)

# integrity: no duplicate company names, no duplicate ids
names = [p["company"].strip().lower() for p in prospects]
assert len(names) == len(set(names)), "duplicate company in seed data"
ids = [p["prospect_id"] for p in prospects]
assert len(ids) == len(set(ids)), "duplicate prospect id"
print("prospects seeded:", len(prospects))
from collections import Counter
print("by priority:", dict(Counter(p["priority"] for p in prospects)))
