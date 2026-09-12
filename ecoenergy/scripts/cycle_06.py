#!/usr/bin/env python3
"""
Cycle 5, 2026-09-12. Public-sector, utility and energy-sector sweep.

Method unchanged and stated again: no browser tool exists here. facebook.com,
instagram.com, tiktok.com, x.com, threads.net, trinituner.com and findyello.com
were ALL re-tested this run and ALL returned blocked at the egress proxy. The
Metricool MCP server has also disconnected from this session. Everything below
came from public search indexing.
"""

import json, os
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
RUN, PENDING, NOT_PUB = "2026-09-12", "PENDING VERIFICATION", "Not publicly listed"
load = lambda n: json.load(open(os.path.join(DATA, n)))
save = lambda n, o: json.dump(o, open(os.path.join(DATA, n), "w"), indent=2)

prospects = load("prospects.json")
intel = load("market_intel.json")
existing = {p["company"].strip().lower(): p for p in prospects}


def upd(name, note, **kw):
    p = existing.get(name.strip().lower())
    if not p:
        raise SystemExit("dedup target missing: " + name)
    for k, v in kw.items():
        p[k] = v
    p["notes"] += " | CYCLE 5 UPDATE (2026-09-12): " + note


upd("NIPDEC (National Insurance Property Development Company Ltd)",
    "MATERIALLY MORE IMPORTANT THAN FIRST RECORDED. NIPDEC has been the authorised procurement "
    "agency for the Ministry of Works PURE road programme since 2002. It is therefore the "
    "procurement gateway for national road rehabilitation, not merely a property developer. "
    "Supplier registration here reaches the largest aggregate-consuming programme in the country.",
    priority="TIER 1",
    next_action="Register as an approved supplier with NIPDEC. This is the single highest-leverage "
                "registration available: it gates PURE road rehabilitation procurement.")
upd("Trinidad Contractors Limited",
    "Facebook business page identified at facebook.com/trinidadcontractorsltd, San Fernando.",
    facebook="https://www.facebook.com/trinidadcontractorsltd/")

seq = max(int(p["prospect_id"].split("-")[1]) for p in prospects)


def N(company, ctype, priority, location, source, signal, products_sold="N/A - consumes aggregate",
      phone=PENDING, website="", facebook="", next_action="", notes="",
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
        "products_needed": "Pitrun; 3/8 gravel; 3/4 gravel; sharp sand; sandfill/backfill",
        "products_sold": products_sold, "est_volume": "EST - to confirm",
        "purchase_freq": "To establish", "observed_price": "Not published",
        "eco_price": "Per current EcoEnergy price list (see WEEKLY PRICING)",
        "potential_discount": "Up to 30% subject to qualification",
        "status": "CONTACT AVAILABLE" if phone != PENDING else "DISCOVERED",
        "last_contact": "", "next_followup": "2026-09-15", "next_action": next_action,
        "notes": "CYCLE 5 (2026-09-12), public sector and energy sweep. " + notes,
    }


# --- the 14 municipal corporations. Each has a statutory local roads and
# drainage function, which is a standing aggregate requirement funded annually.
CORP_SIGNAL = ("Statutory responsibility for LOCAL ROADS AND BRIDGES and for DRAINAGE AND "
               "IRRIGATION. Both are annually funded, recurring aggregate requirements.")
CORP_NOTE = ("One of the 14 municipal corporations. Local roads and drainage are core statutory "
             "functions with annual budget allocations, so aggregate demand is recurring and "
             "plannable rather than one-off. Purchasing runs through formal procurement, so the "
             "action is supplier registration, not a cold sale.")
CORP_ACTION = ("Locate the corporation's procurement or tenders page and register EcoEnergy as an "
               "approved aggregate supplier. Then track notices for local roads and drainage works.")
CORPS = [
    ("Couva/Tabaquite/Talparo Regional Corporation", "Railway Road, Couva", "https://cttrc.gov.tt/procurement/",
     "PROCUREMENT PAGE CONFIRMED, listing categories 'Drainage and Irrigation' and 'Local Roads and "
     "Bridges'. The clearest documented public-sector aggregate requirement found so far.",
     "https://cttrc.gov.tt/", "https://www.facebook.com/CouvaTabaquiteTalparoRegionalCorporation/",
     "TOP PRIORITY of the 14. Its procurement page names the exact categories EcoEnergy supplies, and "
     "Couva is the number one area in the section 18 geographic priority list."),
    ("Sangre Grande Regional Corporation", "Sangre Grande", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Sits beside the NQCL Guaico sand and gravel division and the Matura quarry belt, so haulage is short."),
    ("Penal/Debe Regional Corporation", "Penal / Debe", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Penal and Debe are both section 18 priority areas."),
    ("Princes Town Regional Corporation", "Princes Town", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Princes Town is a section 18 priority area."),
    ("Chaguanas Borough Corporation", "Chaguanas", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Chaguanas is a section 18 priority area and the fastest-growing borough."),
    ("Arima Borough Corporation", "Arima", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Arima is a section 18 priority area."),
    ("San Fernando City Corporation", "San Fernando", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "San Fernando is a section 18 priority area and the southern commercial centre."),
    ("Port of Spain City Corporation", "Port of Spain", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Capital city corporation. Dense urban drainage and road maintenance load."),
    ("Diego Martin Borough Corporation", "Diego Martin", "https://dmbc.gov.tt/lga/", "", "https://dmbc.gov.tt/", "",
     "Declared a borough in 2023. Hillside terrain means heavy slope and drainage works."),
    ("Siparia Regional Corporation", "Siparia", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Declared a borough in 2023 alongside Diego Martin. Covers the deep south."),
    ("San Juan/Laventille Regional Corporation", "San Juan / Laventille", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Dense urban corridor with continuous road and drainage maintenance."),
    ("Tunapuna/Piarco Regional Corporation", "Tunapuna / Piarco", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Large east-west corridor region covering Arouca, Trincity, D'Abadie and Maloney."),
    ("Mayaro/Rio Claro Regional Corporation", "Mayaro / Rio Claro", "https://mayarorioclaro.com/timeline_slider_post/municipal-corporation/", "",
     "https://mayarorioclaro.com/", "",
     "Rural east with long access roads and a heavy agricultural access road burden."),
    ("Point Fortin Borough Corporation", "Point Fortin", "https://rdlg.gov.tt/municipal-corporations/", "", "", "",
     "Southwestern borough serving the energy corridor."),
]
new = []
for name, loc, src, extra_signal, web, fb, note in CORPS:
    new.append(N(name, "Municipal corporation - local roads and drainage", "TIER 1", loc, src,
                 (extra_signal + " " if extra_signal else "") + CORP_SIGNAL,
                 website=web, facebook=fb, next_action=CORP_ACTION, notes=note + " " + CORP_NOTE,
                 platform="Ministry of Rural Development and Local Government (via public search index)"))

# --- national programmes and utilities
new += [
    N("Ministry of Works and Transport - PURE Unit", "National road rehabilitation programme", "TIER 1",
      "Trinidad (nationwide)",
      "https://mowt.gov.tt/Divisions/Programme-For-Upgrading-Roads-Efficiency-(PURE)-Un/Procurement",
      "Programme for Upgrading Roads Efficiency. Tenders cover slope stabilisation, road work, bridge "
      "reconstruction and alternative access routes, all heavy aggregate consumers. Has a live "
      "procurement page inviting contractors to tender.",
      website="https://www.mowt.gov.tt/",
      next_action="LARGEST SINGLE AGGREGATE PROGRAMME IN THE COUNTRY. Procurement runs through NIPDEC "
                  "(ECO-0038), so register there first, then track PURE tender notices directly.",
      notes="Road rehabilitation, slope stabilisation and bridge reconstruction consume pitrun, base "
            "aggregate and gravel at national scale. The Moruga Road upgrade alone was reported at "
            "$178M. PURE is the demand engine behind much of the country's aggregate consumption."),

    N("Water and Sewerage Authority (WASA)", "State water and wastewater utility", "TIER 1",
      "Head office St Joseph; nationwide operations", "https://www.wasa.gov.tt/",
      "Sole national water and sewerage provider. Pipeline installation, leak repair, trench "
      "reinstatement and landslip restoration all require backfill and granular material continuously.",
      website="https://www.wasa.gov.tt/",
      next_action="Identify WASA's supplier registration route. Trench reinstatement is a continuous, "
                  "nationwide backfill and sandfill requirement, which matches EcoEnergy's two "
                  "newly priced lines.",
      notes="Founded 1965. Reported works include shoring, repacking material and rolling, which is "
            "exactly backfill and granular fill demand. A standing requirement rather than a project."),

    N("Point Lisas Industrial Port Development Corporation (PLIPDECO)",
      "Industrial estate landlord and port operator", "TIER 1", "Point Lisas, Couva",
      "https://www.plipdeco.com/main/",
      "Owner and landlord of the 860-hectare Point Lisas Industrial Estate with 103+ tenants, plus a "
      "six-berth port. Estate and port infrastructure works consume fill and aggregate.",
      website="https://www.plipdeco.com/main/",
      facebook="https://www.facebook.com/p/Point-Lisas-Industrial-Port-Development-Corporation-Limited-61576729882584/",
      next_action="Approach on estate infrastructure and port works. Also treat as a channel: 103 "
                  "tenants on one estate, each with their own civil works.",
      notes="51% state owned, 49% private. Couva location, the top section 18 priority area. The "
            "tenant base is a route to many industrial buyers through one relationship."),

    N("Heritage Petroleum Company Limited", "State onshore oil producer", "TIER 1",
      "Newtown, Port of Spain; onshore fields in south Trinidad",
      "https://heritage.co.tt/prequalification-of-contractors-and-suppliers/",
      "PREQUALIFICATION PAGE CONFIRMED for contractors and suppliers. Accounts for around 55% of "
      "onshore production, and onshore fields require lease roads, well pads and access roads, all "
      "built on pitrun and granular fill.",
      website="https://heritage.co.tt/",
      next_action="COMPLETE THE PREQUALIFICATION. Heritage publishes a formal supplier prequalification "
                  "route and its award-of-contracts records, so the process is transparent and open.",
      notes="Lease roads and well pads are pure pitrun and granular fill demand, sustained across the "
            "onshore acreage. The Lease Out / Farm Out programme adds many smaller independent "
            "operators, each with their own access road requirement."),
]

# --- energy-sector and civil contractors
CIVIL = ("Energy-sector civil contractor. These firms build lease roads, well pads, foundations and "
         "site infrastructure, all of which consume pitrun and granular fill.")
new += [
    N("Veratech Engineering and Construction Company Limited (VECCL)",
      "Energy civil / marine contractor", "TIER 1", "Trinidad",
      "https://www.veccl.com/",
      "Named Heritage Petroleum supplier for infrastructure development. A recent contract for subsea "
      "pipeline and riser installation was valued at TT$37,834,010.55.",
      website="https://www.veccl.com/",
      next_action="Verify contact and approach on onshore civil and shore-works aggregate supply.",
      notes="Established November 2018. Contract values in the tens of millions indicate genuine "
            "materials purchasing power. " + CIVIL),

    N("Vertech General Contracting Ltd", "Energy general contractor", "TIER 1", "San Fernando",
      "https://www.vertechltd-tt.com/",
      "Named Heritage Petroleum contractor, established 2008, delivering engineering solutions.",
      website="https://www.vertechltd-tt.com/",
      next_action="Verify contact and qualify their civil works volume.",
      notes="San Fernando base puts them in the southern energy corridor. " + CIVIL),

    N("Patrick Gordon's Construction", "Energy civil infrastructure contractor", "TIER 1",
      "Trinidad", "https://www.bus-ex.com/article/heritage-petroleum-fueling-caribbean-nations-economic-growth",
      "Named as Heritage Petroleum's key supplier for CIVIL INFRASTRUCTURE, which is the single most "
      "aggregate-intensive category in that supply chain.",
      platform="Business Excellence (via public search index)",
      next_action="HIGH FIT. Named specifically for civil infrastructure to the largest onshore "
                  "producer. Verify contact and approach on pitrun and granular fill.",
      notes="Of all the Heritage suppliers named, this one is described in the terms closest to "
            "EcoEnergy's product. " + CIVIL),

    N("Esskay Construction Services", "Energy construction contractor", "TIER 2", "Trinidad",
      "https://www.bus-ex.com/article/heritage-petroleum-fueling-caribbean-nations-economic-growth",
      "Named Heritage Petroleum contractor providing construction, maintenance and logistical support.",
      platform="Business Excellence (via public search index)",
      next_action="Verify contact and qualify the civil works share of their activity.", notes=CIVIL),

    N("Inland and Offshore Contractors", "Energy construction contractor", "TIER 2", "Trinidad",
      "https://www.bus-ex.com/article/heritage-petroleum-fueling-caribbean-nations-economic-growth",
      "Named Heritage Petroleum contractor providing construction, maintenance and logistical support.",
      platform="Business Excellence (via public search index)",
      next_action="Verify contact. The inland arm is the relevant one for aggregate.", notes=CIVIL),

    N("Uniform Building Contractors Ltd (UBC)", "Pipeline / civil contractor", "TIER 2", "Trinidad",
      "https://newsday.co.tt/2026/01/23/privy-council-dismisses-contractors-claim-against-wasa/",
      "Design-and-build contractor on a WASA pipeline project covering roughly 28km from Rio Claro to "
      "Mayaro, valued at just over $28 million. Pipeline work is trench and backfill intensive.",
      platform="Newsday (via public search index)",
      next_action="Verify current trading status FIRST. The WASA contract was terminated in 2009 and a "
                  "related claim reached the Privy Council, so confirm the company is active and "
                  "solvent before any commercial effort.",
      notes="CAUTION. Recorded for completeness because pipeline contractors are strong backfill "
            "buyers, but the litigation history and the 2009 termination mean creditworthiness must "
            "be checked before extending any terms."),

    N("CPML Contractors Ltd", "Civil contractor", "TIER 2",
      "Suite 101, Ramoutar Building, Southern Main Road, Couva",
      "https://membership.chamber.org.tt/list/ql/construction-1094",
      "Chamber-listed construction company in Couva.",
      platform="T&T Chamber of Industry & Commerce directory (via public search index)",
      next_action="Verify contact and qualify project pipeline. Couva is the top priority area.",
      notes="Chamber membership implies an established, verifiable business."),

    N("Alpha Engineering & Design (2002) Ltd", "Engineering / civil contractor", "TIER 2",
      "Atlantic Plaza, Atlantic Avenue, Couva",
      "https://membership.chamber.org.tt/list/ql/construction-1094",
      "Chamber-listed engineering and design firm in Couva.",
      platform="T&T Chamber of Industry & Commerce directory (via public search index)",
      next_action="Verify contact. Design firms specify materials, so they influence purchases even "
                  "where they do not buy directly.",
      notes="Possible SPECIFIER as well as buyer. Getting EcoEnergy material accepted in a "
            "specification is worth more than a single sale."),

    N("C & Z Engineering Services Ltd", "Engineering / civil contractor", "TIER 2",
      "Stephen Street & Southern Main Road, California, Couva",
      "https://membership.chamber.org.tt/list/ql/construction-1094",
      "Chamber-listed engineering services firm in the Couva corridor.",
      platform="T&T Chamber of Industry & Commerce directory (via public search index)",
      next_action="Verify contact and qualify civil works volume.", notes="Couva corridor, priority area."),

    N("HEMCCO Ltd", "Civil / construction contractor", "TIER 2",
      "#402 Southern Main Road, La Romaine, San Fernando",
      "https://hemcco.com/",
      "Established construction firm in the southern corridor with its own web presence.",
      website="https://hemcco.com/",
      next_action="Verify contact and qualify project pipeline.",
      notes="La Romaine and San Fernando are section 18 priority areas."),
]
prospects.extend(new)


def grade(p):
    t = (p["customer_type"] + " " + p["products_sold"] + " " + p["buying_signal"]).lower()
    if p["priority"] == "BENCHMARK" or "licensed quarry" in t or "industry association" in t:
        return "D - MARKET INTELLIGENCE"
    if any(w in t for w in ("gravel", "sand", "aggregate", "crusher run", "stockpile", "pitrun",
                            "backfill", "sandfill", "ready-mix", "readymix", "block manufacturer",
                            "precast", "asphalt", "concrete", "developer", "local roads and drainage",
                            "road rehabilitation", "water and wastewater")):
        return "B - STRONG"
    return "C - POTENTIAL"


for p in prospects:
    p["lead_grade"] = grade(p)

assert len({p["company"].strip().lower() for p in prospects}) == len(prospects), "duplicate company"
assert len({p["prospect_id"] for p in prospects}) == len(prospects), "duplicate id"
save("prospects.json", prospects)

intel.append(dict(
    headline="The public sector is the largest unworked aggregate demand in the pipeline",
    detail="Fourteen municipal corporations each hold statutory responsibility for local roads and "
           "bridges and for drainage and irrigation, with annual budgets. Above them sit the MOWT "
           "PURE road rehabilitation programme, procured through NIPDEC since 2002, and WASA's "
           "continuous trench reinstatement. Heritage Petroleum publishes an open supplier "
           "prequalification route for its onshore lease road and well pad works.",
    implication="This demand is recurring and annually funded rather than project-driven, which is "
                "exactly the recurring volume the brief targets. It is reached by SUPPLIER "
                "REGISTRATION, not cold selling, so the work is paperwork done once that then admits "
                "EcoEnergy to years of tenders. NIPDEC registration is the highest-leverage single "
                "action because it gates the national road programme.",
    source="https://mowt.gov.tt/Divisions/Programme-For-Upgrading-Roads-Efficiency-(PURE)-Un/Procurement",
    verified=RUN))
intel.append(dict(
    headline="Metricool connector has disconnected from this session",
    detail="The Metricool MCP server is no longer connected. Its tools cannot be called. The post "
           "scheduled on 2026-09-12 for the kerron.pierre5 brand, id 374817136, was confirmed present "
           "in the planner at the time it was created and is still expected to publish on 2026-09-14 "
           "at 11:00 Trinidad time, but that can no longer be verified from this session.",
    implication="Verify the post published by checking the Facebook, LinkedIn and Threads accounts "
                "directly, or by reopening Metricool. Do not assume delivery.",
    source="Session tool state, 2026-09-12", verified=RUN))
save("market_intel.json", intel)

print("dedup updates :", 2)
print("new prospects :", len(new), "(%s to %s)" % (new[0]["prospect_id"], new[-1]["prospect_id"]))
print("total         :", len(prospects))
print("grades        :", dict(Counter(p["lead_grade"] for p in prospects)))
