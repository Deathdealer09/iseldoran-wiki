# ECOENERGY AGGREGATE SALES PIPELINE
## CHANGE LOG

**Author:** KS Pierre
**Creator:** KS Pierre
**Publisher:** KS Pierre
**Contributor:** Claude

---

## Edition 1 Version 3

**Date:** 12 September 2026
**Time:** 04:32 (Trinidad time, AST/UTC-4)

**Status:** Cycle 2 prospecting run, requested with Metricool and social media coverage.

### Changes

- Added 26 new prospects, ECO-0060 to ECO-0085. Pipeline total now 85.
- Applied 5 deduplication updates to records already held, rather than creating duplicates.
- Added 4 market benchmark observations. Total now 26.
- Added `data/market_intel.json` with 6 recorded market intelligence items.
- Added CHANNEL ACCESS and MARKET INTELLIGENCE sections to the DASHBOARD.
- Added cycle 1 and cycle 2 discovery counts throughout.
- Added `scripts/cycle_02.py` to the rebuild chain.

### Canon change, justified

**Seereeram Bros Limited (ECO-0033) reclassified from TIER 1 to BENCHMARK.** Cycle 2 established
that Seereeram Brothers holds a licensed quarry at Cangrejal Road, Santa Cruz. They are a producer,
not a wholesale buyer, so the previous classification would have produced a wrong approach. Logged
rather than changed silently.

Other dedup updates: Bestcrete and Abel Building Solutions licensed quarry sites confirmed, On The
Line General Hardware Facebook page recorded, AMCOL product range extended to crusher run, blue
metal and ballast across three pack sizes.

### Channel access established

- **Metricool: CONNECTED.** Returned 4 brands, all personal or Iseldoran Sagas accounts. **No
  EcoEnergy brand exists.** Nothing was posted to the personal accounts.
- **Metricool is not a prospecting tool.** Scheduling, analytics and best-time-to-post for owned
  accounts only. It cannot search any platform for third-party prospects or prices.
- **Facebook, Instagram, TikTok, X, Threads, LinkedIn: PLATFORM NOT ACCESSIBLE.** Direct connection
  was tested against each and refused by the network egress policy. All social findings came from
  public search indexing, not browsing. No autonomous browser activity occurred.

### Market intelligence recorded

Twenty-four quarries shut in November 2025 in a licensing dispute led by the newly formed TTAPA,
with reporting of a widening aggregate supply gap and police action against illegal quarries. Nine
companies hold full licences and the remainder operate on hold-over permits.

**Open question raised, not answered:** EcoEnergy's own licence status is not recorded anywhere and
was not supplied. The licence-led pitch is blocked until it is confirmed. No claim of licensed
supply has been written into any outreach material.

### Integrity

- No contact detail was invented. 14 of 85 prospects have a live contact route; 2 of the 26 new
  records carry a published telephone number.
- This agent has still sent zero messages.
- Section 4 comment mining could not be executed. Three Trinidad buyer groups were located by search
  and are named in the report for someone with Facebook access.

---

## Edition 1 Version 2

**Date:** 12 September 2026
**Time:** 02:14 (Trinidad time, AST/UTC-4)

**Status:** Prior canon recovered and merged. Version 1 was produced on the incorrect assumption
that no pipeline existed. The owner supplied the existing EcoEnergy workbook mid-cycle.

### Changes

- Merged the prior EcoEnergy workbook. It is treated as canon throughout.
- Added 11 prospects carried forward from prior canon, ECO-0049 to ECO-0059, each with verified
  telephone numbers and, for two of them, e-mail addresses.
- Deduplicated 1 record: Concrete Aggregate Suppliers was already held as ECO-0006 from the
  directory sweep. The existing record was UPDATED with the telephone number 868-750-1625 and the
  Charlieville location. No duplicate was created (section 10).
- Pipeline total now 59: 48 discovered this cycle, 11 carried forward.
- Imported 2 confirmed outbound e-mails into the COMMUNICATIONS LOG: Cumosco and KAMCO, both
  2026-09-12, both sent through Outlook outside this agent.
- Replaced the pricing schedule with prior canon, extending coverage from 4 materials to 7.
- Added 13 market benchmark observations recovered from prior canon; total now 22.
- Added a Last Verified column to WEEKLY PRICING and a Direction column to COMMUNICATIONS LOG.
- Added an Origin column to WEEKLY ADDITIONS separating discovered from carried-forward records.
- Added `scripts/rebuild.sh` for a deterministic, idempotent full rebuild.

### Financial figures changed, with justification

Per the canon protection rules, no figure was altered silently.

1. **Pitrun, backfill and sand fill are now priced.** Version 1 carried these as MARKET
   VERIFICATION REQUIRED because no published price could be located. Prior canon supplied
   benchmarks of TT$86.25, TT$140.625 and TT$126.563 per yd3. Bases are TT$77.63, TT$126.56 and
   TT$113.91.

2. **Rounding method corrected.** Python's built-in rounding is banker's rounding and turned the
   canon pitrun base of 77.625 into 77.62. Commercial half-up rounding is now used, giving 77.63.
   All other bases are unaffected. The exact unrounded base and floor are recorded in the note
   column of every pricing row.

3. **Prior canon float noise resolved to 2dp for publication.** 167.05800000000002 is published as
   167.06, 75.941999999999993 as 75.94, and so on. The underlying benchmarks are unchanged.

### Owner decisions recorded

- **The price list is canon.** The Cumosco quotation of TT$125 / 195 / 205 per yd3 for pitrun,
  3/8 and 3/4 sits above the list price of TT$77.63 / 167.06 / 167.06. A corrected quotation is
  now flagged as required on the prospect record, the communications log and the dashboard.
- **Six worksheets per section 9**, rather than the prior four-sheet layout.

### Canon and data integrity

- Every telephone number, e-mail address and price recovered from the prior workbook is reproduced
  verbatim. Nothing was inferred.
- Prospects carried forward are labelled as such and are excluded from the daily target count.
- This agent has still sent zero messages. The two logged e-mails are attributed to Outlook.

### Carried forward

1. 47 of 59 prospects still have no verified contact route. The egress policy blocks the hosts.
2. No messaging integration is connected, so outreach cannot be executed from here.
3. The NQCL pitrun benchmark is effective 31 August 2022, so it is four years old.
4. Backfill and sand fill are benchmarked on a retail load basis, not ex-quarry.
5. Facebook, Instagram, X and Threads remain unreachable.

---

## Edition 1 Version 1

**Date:** 12 September 2026
**Time:** 02:06 (Trinidad time, AST/UTC-4)

**Status:** Cold start. No prior pipeline, pricing or communication history existed in this repository.

### Changes

- Created the EcoEnergy aggregate sales pipeline data store under `ecoenergy/data/`.
- Recorded 48 sourced prospects, each carrying the public source URL it was found at.
- Recorded 9 market benchmark observations across four price categories.
- Ran the pricing engine: base price set at market benchmark multiplied by 0.90.
- Published provisional base prices for 3/4 gravel, 3/8 gravel, sharp sand and plastering sand.
- Flagged pitrun and sandfill/backfill as MARKET VERIFICATION REQUIRED. No price invented.
- Built `EcoEnergy_Aggregate_Sales_Pipeline.xlsx` with the six required worksheets.
- Issued the weekly price list and the weekly sales report.
- Wrote a dependency-free XLSX writer, because `openpyxl` and the package index are unavailable
  in this environment.

### Canon and data integrity

- No prospect was invented. No contact detail was inferred or guessed.
- No message is recorded as sent. Zero outreach was executed.
- Volume and revenue figures in the sales report are labelled illustrative planning assumptions
  and are separated from verified observations throughout.

### Blockers carried forward

1. Contact detail acquisition is blocked by the environment's network egress policy.
2. No authorised e-mail or messaging integration is connected.
3. The National Quarries price list is public but its domain is blocked.
4. Facebook, Instagram, X and Threads are not reachable, so comment mining could not be run.
