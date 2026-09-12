# EcoEnergy Aggregate Sales Pipeline

Autonomous prospecting, pricing and sales pipeline for **EcoEnergy Limited**, Trinidad & Tobago.
Materials: pitrun, 3/8 gravel, 3/4 gravel, plastering sand, sharp sand, sandfill/backfill.

## Layout

```
ecoenergy/
  EcoEnergy_Aggregate_Sales_Pipeline.xlsx   generated workbook, 6 worksheets
  data/                                     source of truth (JSON)
    prospects.json          59 prospects (48 discovered, 11 from prior canon)
    benchmarks.json         22 market price observations
    pricing.json             pricing engine output
    communications.json      2 confirmed outbound e-mails (prior canon)
  scripts/
    xlsx_writer.py           dependency-free XLSX writer
    seed_data.py             seeds the prospect database
    merge_upload.py          merges the prior EcoEnergy workbook (canon)
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
