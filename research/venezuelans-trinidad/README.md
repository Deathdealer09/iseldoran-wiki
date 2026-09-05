# Venezuelans in Trinidad — Research Protocol

**Edition 1 Version 1**
5 September 2026
13:55

Author: KS Pierre
Creator: KS Pierre
Publisher: KS Pierre
Contributor: Claude

---

## Status

**No data has been collected. This directory holds the instrument, not results.**

Every statistic in any output produced here comes from an input dataset. With no
dataset, the pipeline emits zeroes and empty tables, by design. Nothing is
estimated, modelled or filled in.

## Two collection routes

| | Manual | API |
|---|---|---|
| Covers | All three platforms | TikTok fully, Meta in an enclave |
| Needs | Your own browsing time | Institutional affiliation, ethics review |
| Lead time | Immediate | 2 to 6 weeks |
| Cost | None | Up to USD 371/month plus USD 1,000 start fee |
| Row-level data | Yes | TikTok yes, Meta no |
| Guide | `COLLECTION-GUIDE.md` | `META-COLLECTION-PROCEDURE.md`, `collect-tiktok.mjs` |

They share everything downstream: one codebook, one dataset schema, one
analysis pipeline. Data from either route, or both, flows through the same
steps.

## The pipeline

```
raw comments (either route)
        |
        v
  prepare.mjs          anonymise, assign stable comment and commenter ids
        |
        v
  dataset.csv          23 columns, coding fields blank
        |
        v
  human coding         against CODEBOOK.md
        |
        v
  analyze.mjs          validate, dedupe, compute, report
        |
        v
  analysis.json + findings.md + qc-report.txt
```

## Files

| Path | What it is |
|---|---|
| `CODEBOOK.md` | Coding rules and controlled vocabularies |
| `COLLECTION-GUIDE.md` | Manual collection, including sampling discipline |
| `META-COLLECTION-PROCEDURE.md` | Facebook and Instagram via the enclave |
| `raw-collection-template.csv` | Six-column starting sheet |
| `scripts/vzla-tt/codebook.mjs` | Enforced schema. Single source of truth |
| `scripts/vzla-tt/search-terms.mjs` | 56 terms across Spanish, English, slang, hashtags |
| `scripts/vzla-tt/prepare.mjs` | Anonymisation and identifier assignment |
| `scripts/vzla-tt/analyze.mjs` | Analysis and reporting |
| `scripts/vzla-tt/collect-tiktok.mjs` | TikTok Research API collector |
| `scripts/vzla-tt/gen-codebook-doc.mjs` | Regenerates the codebook's vocabulary tables |
| `scripts/vzla-tt/analyze.test.mjs` | Tests, including the empty-input guarantee |
| `docs/venezuelans-trinidad-social-listening-access.md` | Access blocker register |

## Integrity properties, enforced in code

These are the brief's research-integrity requirements, implemented rather than
promised. Each is covered by a test.

1. **An empty dataset yields an empty report.** No estimates ever stand in for
   absent data.
2. **Findings are ranked by distinct commenters**, not comment volume, so one
   prolific account cannot manufacture a theme.
3. **Percentages carry their denominator**, and any demographic cell under 30
   commenters is reported as a count with a flag instead.
4. **Second-hand comments are excluded** from destination preference totals.
5. **Unrecognised themes are reported, not discarded**, so open coding stays
   visible and comments are never forced into a poor category.
6. **Uncoded rows are errors**, so a half-coded dataset cannot pass as finished.
7. **Author identifiers are salted one-way hashes.** The salt is gitignored and
   never travels with the data.

## Running it

```
node scripts/vzla-tt/prepare.mjs raw.csv --out dataset.csv    # anonymise
node scripts/vzla-tt/analyze.mjs dataset.csv                  # analyse
node --test scripts/vzla-tt/analyze.test.mjs                  # verify pipeline
node scripts/vzla-tt/collect-tiktok.mjs --dry-run             # preview API spend
```

## Known limitations of the instrument

Social media comments are not a representative sample of Venezuelans in Trinidad
and Tobago, and no amount of sampling care makes them one. People without
smartphones, without data, without literacy in either written language, and
those avoiding visibility for reasons connected to their status are absent, and
their absence is not random. Platform demographics skew the picture again:
TikTok younger, Facebook older. Algorithmic surfacing favours emotionally
charged material over ordinary experience.

Findings must be written as "among the public social media comments sampled",
never as a claim about all Venezuelans in Trinidad and Tobago.

## CHANGE LOG

**Edition 1 Version 1**
5 September 2026

Changes:

- Research protocol created
- Codebook and controlled vocabularies defined and machine-enforced
- Manual collection guide written, with sampling discipline and anonymity rules
- Meta Content Library enclave procedure documented
- TikTok Research API collector written, marked unverified against the live API
- Search vocabulary compiled across Spanish, Trinidadian English, slang, hashtags
- Analysis pipeline implemented with nine passing tests
- Seven research-integrity properties enforced in code
