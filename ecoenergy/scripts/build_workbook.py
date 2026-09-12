#!/usr/bin/env python3
"""
Builds EcoEnergy_Aggregate_Sales_Pipeline.xlsx from the JSON data store.

The JSON files under ecoenergy/data/ are the source of truth. This script is
idempotent: re-running it regenerates the workbook from current data, so the
daily loop edits data, never the spreadsheet by hand.
"""

import json
import os
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from xlsx_writer import (Sheet, Cell, write_workbook, S_HEADER, S_TITLE, S_BOLD,
                         S_MONEY, S_NOTE, S_SUB, S_WRAP, S_DEFAULT)

DATA = os.path.join(HERE, "..", "data")
OUT = os.path.join(HERE, "..", "EcoEnergy_Aggregate_Sales_Pipeline.xlsx")

EDITION = 1
VERSION = 2
TT = timezone(timedelta(hours=-4))          # Trinidad & Tobago, AST / UTC-4
NOW = datetime.now(TT)
STAMP = NOW.strftime("%d %B %Y  %H:%M") + " (Trinidad time)"
VERSTR = "Edition %d Version %d" % (EDITION, VERSION)


def load(name):
    with open(os.path.join(DATA, name)) as f:
        return json.load(f)


prospects = load("prospects.json")
benchmarks = load("benchmarks.json")
pricing = load("pricing.json")
comms = load("communications.json")


def head(sheet, title, subtitle=""):
    sheet.add([Cell(title, S_TITLE)])
    sheet.add([Cell("EcoEnergy Limited, Trinidad & Tobago   |   %s   |   %s" % (VERSTR, STAMP), S_BOLD)])
    if subtitle:
        sheet.add([Cell(subtitle, S_NOTE)])
    sheet.blank()


def table(sheet, headers):
    sheet.add([Cell(h, S_HEADER) for h in headers])
    return len(sheet.rows)          # 1-based row index of the header row


# ------------------------------------------------------------ 1. PIPELINE
PIPE_COLS = [
    ("Prospect ID", "prospect_id", 12), ("Date Identified", "date_identified", 14),
    ("Company", "company", 38), ("Contact Name", "contact_name", 18),
    ("Customer Type", "customer_type", 26), ("Priority", "priority", 12),
    ("Location", "location", 32), ("Phone", "phone", 18), ("WhatsApp", "whatsapp", 18),
    ("Email", "email", 20), ("Facebook", "facebook", 26), ("Instagram", "instagram", 16),
    ("X / Twitter", "x_twitter", 16), ("Threads", "threads", 16),
    ("Website", "website", 34), ("Source Platform", "source_platform", 24),
    ("Source URL", "source_url", 44), ("Buying Signal", "buying_signal", 52),
    ("Products Needed", "products_needed", 34), ("Products Currently Sold", "products_sold", 34),
    ("Estimated Volume", "est_volume", 28), ("Purchase Frequency", "purchase_freq", 26),
    ("Observed Current Price", "observed_price", 38), ("EcoEnergy Price", "eco_price", 28),
    ("Potential Discount", "potential_discount", 18), ("Status", "status", 14),
    ("Last Contact", "last_contact", 14), ("Next Follow-Up", "next_followup", 14),
    ("Next Action", "next_action", 52), ("Notes", "notes", 64),
]

s1 = Sheet("PROSPECT PIPELINE", widths=[c[2] for c in PIPE_COLS])
head(s1, "PROSPECT PIPELINE",
     "Every record carries the public source it came from. Fields marked PENDING VERIFICATION were "
     "not reachable from this environment and have deliberately NOT been guessed.")
hdr = table(s1, [c[0] for c in PIPE_COLS])
for p in prospects:
    s1.add([Cell(p.get(k, ""), S_WRAP) for _, k, _ in PIPE_COLS])
s1.freeze = (hdr, 3)
s1.autofilter = (hdr, 1, len(s1.rows), len(PIPE_COLS))

# ------------------------------------------------------- 2. COMMUNICATIONS
COMM_COLS = [("Date / Time", 14), ("Prospect ID", 12), ("Prospect", 30), ("Channel", 12),
             ("Direction", 12), ("Recipient", 30), ("Message Type", 34), ("Material", 22),
             ("Volume", 12), ("Price Quoted", 24), ("Discount Mentioned", 16), ("Response", 14),
             ("Follow-Up Date", 14), ("Next Action", 60), ("Logged By", 28)]
s2 = Sheet("COMMUNICATIONS LOG", widths=[c[1] for c in COMM_COLS])
head(s2, "COMMUNICATIONS LOG",
     "A message is recorded here ONLY when a send was confirmed. The two entries below are prior "
     "canon carried forward from the previous EcoEnergy workbook.")
hdr2 = table(s2, [c[0] for c in COMM_COLS])
for c in comms:
    s2.add([Cell(c.get(k, ""), S_WRAP) for k in
            ("datetime", "prospect_id", "prospect", "channel", "direction", "recipient",
             "message_type", "material", "volume", "price_quoted", "discount", "response",
             "followup", "next_action", "logged_by")])
if not comms:
    s2.blank()
    s2.add([Cell("NO OUTREACH EXECUTED THIS CYCLE.", S_BOLD)])
    s2.add([Cell("Zero messages have been sent. No e-mail, WhatsApp or messaging integration was "
                 "authorised or available to this agent, and no verified recipient address was "
                 "captured, so nothing could be sent and nothing is recorded as sent.", S_NOTE)])
    s2.add([Cell("Status for all 48 prospects: PROSPECT IDENTIFIED - DIRECT OUTREACH PENDING.", S_NOTE)])
s2.freeze = (hdr2, 0)

# ------------------------------------------------------------ 3. WEEKLY PRICING
PR_COLS = [("Product", 26), ("Market Benchmark (TTD)", 20), ("EcoEnergy Base Price (TTD)", 22),
           ("Unit", 24), ("Negotiated Floor - INTERNAL ONLY (TTD)", 26), ("Effective From", 14),
           ("Evidence Confidence", 18), ("Status", 30), ("Last Verified", 14),
           ("Benchmark Source", 46), ("Note", 70)]
s3 = Sheet("WEEKLY PRICING", widths=[c[1] for c in PR_COLS])
head(s3, "ECOENERGY WEEKLY AGGREGATE PRICE LIST",
     "%s  |  Next scheduled market review: %s" % (pricing["meta"]["margin_rule"], pricing["meta"]["next_review"]))
hdr3 = table(s3, [c[0] for c in PR_COLS])
for p in pricing["products"]:
    s3.add([
        Cell(p["product"], S_WRAP),
        Cell(p["benchmark"], S_MONEY) if p["benchmark"] is not None else Cell("NO DATA", S_WRAP),
        Cell(p["base"], S_MONEY) if p["base"] is not None else Cell("NOT SET", S_WRAP),
        Cell(p["unit"], S_WRAP),
        Cell(p["floor"], S_MONEY) if p["floor"] is not None else Cell("n/a", S_WRAP),
        Cell(pricing["meta"]["effective_from"], S_WRAP),
        Cell(p["confidence"], S_WRAP),
        Cell(p["status"], S_WRAP),
        Cell(p.get("last_verified", ""), S_WRAP),
        Cell(p["source"], S_WRAP),
        Cell(p["note"], S_WRAP),
    ])
s3.blank()
s3.add([Cell("CUSTOMER-FACING STATEMENT", S_SUB)])
s3.add([Cell("Wholesale, cash-volume and contracted recurring customers may qualify for additional "
             "negotiated volume discounts of up to 30%.", S_WRAP)])
s3.blank()
s3.add([Cell("INTERNAL - DO NOT PUBLISH", S_SUB)])
s3.add([Cell("The Negotiated Floor column is the maximum 30% concession and is a closing tool, not a "
             "list price. It is never offered automatically and never advertised. Award it against "
             "quantity, frequency, payment method and speed, collection versus delivery, trucking "
             "economics, contract duration, lifetime value and reseller potential.", S_WRAP)])
s3.freeze = (hdr3, 1)

# --------------------------------------------------------- 4. MARKET BENCHMARKS
BM_COLS = [("Seller", 40), ("Product", 30), ("Price (TTD)", 14), ("Unit", 20),
           ("Price Basis", 34), ("Category", 24), ("Collection / Delivery", 18),
           ("Location", 28), ("Source URL", 50), ("Verified", 14), ("Note", 70)]
s4 = Sheet("MARKET BENCHMARKS", widths=[c[1] for c in BM_COLS])
head(s4, "MARKET BENCHMARK OBSERVATIONS",
     "Unlike prices are never compared without stating the difference - categories are kept separate.")
hdr4 = table(s4, [c[0] for c in BM_COLS])
for b in benchmarks:
    s4.add([
        Cell(b["seller"], S_WRAP), Cell(b["product"], S_WRAP),
        Cell(b["price"], S_MONEY) if b["price"] is not None else Cell("NOT RETRIEVED", S_WRAP),
        Cell(b["unit"], S_WRAP), Cell(b["basis"], S_WRAP), Cell(b["category"], S_WRAP),
        Cell(b["delivery"], S_WRAP), Cell(b["location"], S_WRAP), Cell(b["source"], S_WRAP),
        Cell(b["verified"], S_WRAP), Cell(b["note"], S_WRAP),
    ])
s4.freeze = (hdr4, 2)
s4.autofilter = (hdr4, 1, len(s4.rows), len(BM_COLS))

# ------------------------------------------------------------------ 5. DASHBOARD
prio = Counter(p["priority"] for p in prospects)
status = Counter(p["status"] for p in prospects)
MERGED_TAG = "Prior EcoEnergy workbook"
merged_in = [p for p in prospects if MERGED_TAG in p["source_platform"]]
discovered = [p for p in prospects if MERGED_TAG not in p["source_platform"]]
PEND = "PENDING VERIFICATION"
with_contact = [p for p in prospects if p["phone"] != PEND or p["email"] != PEND]
contacted = [p for p in prospects if p["status"] == "OUTREACH SENT"]


def count_type(*words):
    n = 0
    for p in prospects:
        t = (p["customer_type"] + " " + p["products_sold"]).lower()
        if any(w in t for w in words):
            n += 1
    return n


s5 = Sheet("DASHBOARD", widths=[52, 20, 78])
head(s5, "DASHBOARD")
hdr5 = table(s5, ["Metric", "Value", "Comment"])


def row(metric, value, comment=""):
    s5.add([Cell(metric, S_WRAP), Cell(value, S_BOLD), Cell(comment, S_WRAP)])


def section(name):
    s5.add([Cell(name, S_SUB), Cell("", S_SUB), Cell("", S_SUB)])


section("PIPELINE VOLUME")
row("New prospects discovered this cycle", len(discovered), "Daily target is 25.")
row("Daily target", 25, "Brief section 1.")
row("Performance against daily target",
    "%d%%" % round(100 * len(discovered) / 25), "Quality gate applied - no filler records.")
row("Carried forward from prior canon", len(merged_in),
    "Merged from the previous EcoEnergy workbook on 2026-09-12. Not counted against the daily target.")
row("Duplicates avoided on merge", 1,
    "Concrete Aggregate Suppliers was already held as ECO-0006 and was updated, not duplicated (section 10).")
row("Total prospects in pipeline", len(prospects), "")
section("BY PRIORITY")
for k in ("TIER 1", "TIER 2", "TIER 3", "BENCHMARK"):
    row(k, prio.get(k, 0), {"TIER 1": "Highest-value recurring buyers and resellers.",
                            "TIER 2": "Secondary commercial buyers.",
                            "TIER 3": "Low-volume but steady.",
                            "BENCHMARK": "Competitors and price references, not buyers."}[k])
section("BY SEGMENT")
row("Ready-mix and block producers", count_type("ready-mix", "block"), "Highest continuous aggregate draw.")
row("Hardware stores and building-material resellers", count_type("hardware", "building materials", "wholesaler"),
    "Already sell aggregate, therefore already buy it.")
row("Contractors, civil, earthworks and drainage", count_type("contractor", "civil", "earthworks", "demolition", "paving"),
    "Project-driven volume.")
row("State developers and agencies", count_type("state"), "Tender and vendor registration route.")
row("Trucking and haulage", count_type("haulage", "transport", "trucking"), "Buyers and potential delivery partners.")
row("Landscaping", count_type("landscaping"), "Batch into one campaign.")
section("COMMERCIAL ACTIVITY")
row("Prospects with a verified contact route", len(with_contact),
    "All carried forward from prior canon. Telephone and e-mail for these were verified previously, "
    "not by this cycle's searches.")
row("Prospects with NO contact route", len(prospects) - len(with_contact),
    "Sourced and named, but no number or address could be verified from this environment. None invented.")
row("Outreach messages sent", len(contacted),
    "Cumosco and KAMCO, both by e-mail on 2026-09-12. Prior canon. This agent sent nothing.")
row("Responses received", 0, "Both outbound e-mails are still pending a reply.")
row("Quote requests", 0, "")
row("Quotes issued", 1, "Cumosco was quoted TT$125 / 195 / 205 per yd3 on 2026-09-12.")
row("Negotiations open", 0, "")
row("Customers won", 0, "")
section("PRICING EXCEPTION - ACTION REQUIRED")
row("Cumosco quotation above list price", "CORRECTION DUE",
    "The 2026-09-12 quote of TT$125 / 195 / 205 per yd3 for pitrun / 3/8 / 3/4 sits ABOVE the canon list "
    "price of TT$77.63 / 167.06 / 167.06. Owner ruled on 2026-09-12 that the price list is canon, so a "
    "corrected quotation must be issued to Cumosco before any follow-up.")
section("PRICING")
priced = [p for p in pricing["products"] if p["base"] is not None]
row("Materials with an EcoEnergy base price", "%d of %d" % (len(priced), len(pricing["products"])),
    "3/4 gravel, 3/8 gravel, sharp sand, plastering sand.")
row("Materials flagged MARKET VERIFICATION REQUIRED",
    len(pricing["products"]) - len(priced), "Pitrun and sandfill/backfill - no published T&T price found.")
row("Pricing rule applied", "Benchmark x 0.90", "10% below verified market benchmark.")
row("Maximum negotiated discount", "30%", "Closing tool. Never automatic, never advertised.")
row("Next scheduled market review", pricing["meta"]["next_review"], "Brief section 6.")
section("BLOCKERS - REQUIRE HUMAN ACTION")
row("1. Contact details for the discovered prospects", "BLOCKING",
    "%d of %d prospects have no verified contact route. Directory and company pages (findyello.com, "
    "nqcl.co.tt, energy.gov.tt, tt.directory) are refused by the egress proxy. Allowlist those hosts, or "
    "supply the details from a machine with ordinary web access."
    % (len(prospects) - len(with_contact), len(prospects)))
row("2. Messaging integration", "BLOCKING",
    "No authorised e-mail or messaging tool is connected to this agent. The two e-mails on record were "
    "sent outside it, through Outlook. Until an integration is authorised, outreach cannot be executed "
    "here even for the %d prospects that do have a contact route." % len(with_contact))
row("3. NQCL price list PDF", "PARTIALLY RESOLVED",
    "The pitrun benchmark of TT$86.25/yd3 was recovered from prior canon, so pitrun is now priced. The "
    "PDF itself is still blocked, and it is effective 31-Aug-2022, so the benchmark is four years old.")
row("4. Social comment mining", "NOT ACCESSIBLE",
    "Facebook, Instagram, X and Threads are not reachable from this environment. Section 4 comment mining "
    "could not be run beyond what public search indexes surfaced.")
s5.freeze = (hdr5, 0)

# ----------------------------------------------------------- 6. WEEKLY ADDITIONS
s6 = Sheet("WEEKLY ADDITIONS", widths=[14, 12, 40, 14, 28, 24, 56])
head(s6, "WEEKLY ADDITIONS",
     "Week commencing Monday 2026-09-07. Weekly target is 175 new prospects (brief section 15).")
hdr6 = table(s6, ["Date", "Prospect ID", "Company", "Priority", "Customer Type", "Origin", "Buying Signal"])
for p in prospects:
    origin = "Merged from prior canon" if MERGED_TAG in p["source_platform"] else "Discovered this cycle"
    s6.add([Cell(p["date_identified"], S_WRAP), Cell(p["prospect_id"], S_WRAP),
            Cell(p["company"], S_WRAP), Cell(p["priority"], S_WRAP),
            Cell(p["customer_type"], S_WRAP), Cell(origin, S_WRAP), Cell(p["buying_signal"], S_WRAP)])
s6.blank()
s6.add([Cell("Discovered this cycle", S_SUB), Cell(len(discovered), S_BOLD)])
s6.add([Cell("Merged from prior canon", S_SUB), Cell(len(merged_in), S_BOLD)])
s6.add([Cell("Weekly target", S_SUB), Cell(175, S_BOLD)])
s6.add([Cell("Against weekly target (discovered only)", S_SUB),
        Cell("%d%%" % round(100 * len(discovered) / 175), S_BOLD)])
s6.freeze = (hdr6, 0)
s6.autofilter = (hdr6, 1, len(s6.rows), 7)

write_workbook(OUT, [s1, s2, s3, s4, s5, s6],
               title="EcoEnergy Aggregate Sales Pipeline %s" % VERSTR,
               creator="KS Pierre")
print("wrote %s  (%d bytes)" % (os.path.relpath(OUT), os.path.getsize(OUT)))
print("sheets: %d | prospects: %d | benchmarks: %d | comms: %d"
      % (6, len(prospects), len(benchmarks), len(comms)))
