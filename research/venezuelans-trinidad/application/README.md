# Route 2 Application Package

**Edition 1 Version 1**
5 September 2026
15:15

Author: KS Pierre
Creator: KS Pierre
Publisher: KS Pierre
Contributor: Claude

---

## The gate before any of this

Both programmes require affiliation with a university or a not-for-profit whose
core activity is scientific or public-interest research. Both explicitly exclude
commercial use. TikTok further restricts eligibility to institutions in the US,
EEA, UK, Switzerland or Brazil, and requires completed ethical review.

Without such an affiliation these applications cannot succeed, and no quality of
proposal changes that. The documents here are written to be ready the moment a
sponsoring institution exists; they do not create one.

The realistic options are a named collaboration with a university or research
non-profit that sponsors the application and hosts the ethics review, or
returning to manual collection, which has no eligibility gate at all.

## Order of operations

The sequence is fixed by TikTok's requirement that ethical review be complete
before application. Running these in parallel wastes a cycle.

1. **Secure the sponsoring affiliation.** Everything else depends on it.
2. **Submit `ETHICS-SUBMISSION.md`** to the institution's committee. Obtain the
   approval reference and date.
3. **Complete section 0 of `RESEARCH-PROPOSAL.md`** with the investigator,
   institution, ethics reference and evidence of expertise.
4. **Apply to TikTok** at developers.tiktok.com, attaching the proposal and the
   ethics approval.
5. **Apply to ICPSR** for the Meta Content Library, attaching the proposal.
   Review runs roughly 2 to 6 weeks.
6. **Add the network allowlist entries** listed in the access register, so the
   approved credentials can actually reach the hosts.
7. **Preflight before collecting:**
   `node scripts/vzla-tt/collect-tiktok.mjs --preflight` spends one request to
   prove the credentials and the network path.

## Documents

| File | Purpose |
|---|---|
| `RESEARCH-PROPOSAL.md` | Core proposal for both programmes. Section 0 needs completing |
| `DATA-MANAGEMENT-PLAN.md` | Fields collected and excluded, anonymisation, retention, deletion |
| `ETHICS-SUBMISSION.md` | Committee submission. Must be approved before applying to TikTok |

## Costs to budget

Meta Content Library, as of January 2026: free compute on SOMAR's Virtual Data
Enclave ended 31 December 2025. SOMAR charges USD 371 per research team per
month of enclave access, and teams created in 2026 or later pay a one-time
USD 1,000 project start fee. Meta's Secure Research Environment offers free
computation and is the cheaper path where it fits.

TikTok Research API access carries no fee. Quota is 1,000 requests per day, up
to 100,000 records, which comfortably covers the 2,000-comment TikTok target in
a single day.

Verify both at application time. Meta's terms have already changed once.

## What the approval does not give you

Meta Content Library data is analysed inside a secure enclave and does not leave
it. The Facebook and Instagram portion of this study will produce aggregate
outputs only, never a row-level dataset, and almost certainly no exportable
quotations. Plan the merge at the aggregate layer from the outset rather than
discovering the constraint after approval.

## CHANGE LOG

**Edition 1 Version 1**
5 September 2026

Changes:

- Application package index created
- Eligibility gate stated ahead of the process
- Fixed order of operations recorded, driven by the ethics-before-TikTok rule
- Costs summarised with a verification caveat
- Enclave export constraint restated at the point of decision
