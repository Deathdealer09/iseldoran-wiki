# EcoEnergy Aggregate Sales Pipeline

Autonomous prospecting, pricing and sales pipeline for **EcoEnergy Limited**, Trinidad & Tobago.
Materials: pitrun, 3/8 gravel, 3/4 gravel, plastering sand, sharp sand, sandfill/backfill.

## Layout

```
ecoenergy/
  EcoEnergy_Aggregate_Sales_Pipeline.xlsx   generated workbook, 6 worksheets
  data/                                     source of truth (JSON)
    prospects.json         140 prospects (129 discovered, 11 from prior canon)
    benchmarks.json         32 market price observations
    market_intel.json       13 recorded market intelligence items
    pricing.json             pricing engine output
    communications.json      2 confirmed outbound e-mails (prior canon)
  scripts/
    xlsx_writer.py           dependency-free XLSX writer
    seed_data.py             seeds the prospect database
    merge_upload.py          merges the prior EcoEnergy workbook (canon)
    cycle_02.py              cycle 2 prospecting run
    cycle_03_social.py       social publication record
    cycle_04.py              cycle 4 social buyer-hunt
    cycle_05.py              cycle 4 continued
    cycle_06.py              cycle 5 public sector and energy sweep
    rebuild.sh               full deterministic rebuild
    seed_pricing.py          benchmarks + pricing engine
    build_workbook.py        regenerates the workbook from data
    generate_reports.py      price list + weekly sales report
  docs/                      issued price list and sales report
  CHANGELOG.md
```

## Running the loop

```bash
./ecoenergy/scripts/rebuild.sh   # full deterministic rebuild, idempotent
```

The JSON files are the source of truth. Edit data, never the spreadsheet by hand, then rebuild.
`build_workbook.py` is idempotent.

## Pricing rules

- **Base price** = verified market benchmark x 0.90, so roughly 10% below comparable market rate.
- **Negotiating floor** = base x 0.70, the maximum 30% concession. Internal only. Never advertised
  and never given automatically.
- Where evidence is insufficient the material is flagged **MARKET VERIFICATION REQUIRED** and no
  price is published.
- Market review runs every Sunday at 23:59 Trinidad time.

## Integrity rules enforced in the data

- Every prospect carries the public source URL it came from.
- Contact fields read `PENDING VERIFICATION` where the detail could not be verified. Nothing is
  guessed or inferred.
- A message is logged only when a send was confirmed. Entries name where the send happened.
- Estimated volumes are prefixed `EST` and name the basis of the inference.
- Deduplication is asserted at seed time on company name and prospect ID.

## Current blockers

Of the 59 prospects, 12 carry a verified contact route recovered from prior canon. For the other 47,
number, e-mail address or WhatsApp number could be verified, and no messaging integration is
connected. All 48 prospects therefore sit at **PROSPECT IDENTIFIED, DIRECT OUTREACH PENDING**.
See section 6 of the weekly sales report in `docs/`.

## Channel access

- **Metricool:** DISCONNECTED from the session as of 2026-09-12. While connected it held no EcoEnergy brand. It is a scheduling and analytics tool for
  accounts you own, not a prospecting tool, and cannot search any platform for third-party prospects
  or prices.
- **Facebook, Instagram, TikTok, X, Threads, LinkedIn:** PLATFORM NOT ACCESSIBLE. Tested directly and
  refused by the network egress policy. Social findings come from public search indexing only.
