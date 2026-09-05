# Meta Content Library Procedure

## Facebook and Instagram Collection

**Edition 1 Version 1**
5 September 2026
13:40

Author: KS Pierre
Creator: KS Pierre
Publisher: KS Pierre
Contributor: Claude

---

## 1. Why this is a procedure and not a script

TikTok collection ships as a runnable script because the Research API returns
data to the caller. The Meta Content Library does not work that way.

Content Library data is analysed **inside a secure enclave**. You work either in
SOMAR's Virtual Data Enclave or in Meta's Secure Research Environment, and raw
records do not leave it. A collector script running on your machine has nothing
to collect, so writing one would misrepresent how the access actually works.

What travels out of the enclave is aggregate output. That constraint shapes the
whole Facebook and Instagram side of this study and should be understood before
applying, not after.

## 2. Consequence for the study design

The brief specifies one master CSV covering all three platforms. That is not
achievable as written. Plan instead for:

- **TikTok** — full row-level dataset locally, via `collect-tiktok.mjs`.
- **Facebook and Instagram** — analysis runs inside the enclave. Theme counts,
  sentiment distributions and cross-tabs come out. Individual comment rows do
  not.
- **Merge** — at the aggregate layer, not the row layer. Combined figures must
  state which platforms contribute to each number, since the denominators
  differ.

If a single row-level dataset across all three platforms is a hard requirement,
the manual collection route is the only one that delivers it, and the Content
Library route should be dropped rather than half-adopted.

## 3. Applying

All applications route through ICPSR. Meta grants the user interface; ICPSR
grants the API.

**Eligibility.** Researchers affiliated with an academic institution, or with a
not-for-profit whose core activity is scientific or public-interest research.
Commercial use is not eligible.

**Timeline.** Review normally runs 2 to 6 weeks.

**Cost, as of January 2026.** Free compute on SOMAR's Virtual Data Enclave ended
31 December 2025. SOMAR charges USD 371 per research team per month of VDE
access, and teams created in 2026 or later pay a one-time USD 1,000 project
start fee. Meta's Secure Research Environment offers free computation and is the
cheaper path if it fits the work.

**Verify all figures at application time.** Costs and terms have changed once
already and this document records the position as of the date in its header.

## 4. Running the analysis inside the enclave

The pipeline in `scripts/vzla-tt/` is plain Node with no third-party
dependencies, specifically so it can be carried into a restricted environment.
Take in `codebook.mjs`, `csv.mjs` and `analyze.mjs`.

1. Query the Content Library for posts matching the terms in
   `search-terms.mjs`, restricted to Trinidad and Tobago and Venezuela.
2. Export comment records to CSV inside the enclave.
3. Map the export onto the raw six-column shape: `Platform`, `Date`,
   `Author_Label`, `Comment`, `Source_URL`, `Engagement`.
4. Run `prepare.mjs`, then code against `CODEBOOK.md`, then `analyze.mjs`.
5. Extract only `analysis.json` and `findings.md`, subject to the enclave's
   disclosure review. Do not attempt to extract the master dataset or the
   quotation candidates, which carry verbatim comment text.

## 5. Quotations

The brief calls for 6 to 10 anonymised quotations. Verbatim comment text is
exactly the sort of output enclave disclosure review is designed to restrict,
and a verbatim public comment is traceable back to its author by search.

Assume quotations cannot be exported from the Content Library side. Draw the
published quotation set from TikTok or from manual collection, where the
material is already public and you hold it directly. Note the platform mix in
the methodology so the quotations are not read as representing all three.
