# Data Management Plan

## Venezuelan Migrant Discourse Study

**Edition 1 Version 1**
5 September 2026
14:45

Author: KS Pierre
Creator: KS Pierre
Publisher: KS Pierre
Contributor: Claude

---

## 1. What is collected

| Field | Collected | Rationale |
|---|---|---|
| Comment text | Yes | The unit of analysis |
| Comment timestamp | Yes | Date-range control and trend analysis |
| Engagement count | Yes | Descriptive only; never used as an analytical weight |
| Parent post identifier | Yes | Sampling control, so one thread cannot dominate |
| Post region code | Yes | Restricts the sample to TT and VE |
| Username or display name | **No** | Not needed; the principal re-identification vector |
| Profile biography or image | **No** | Not needed |
| Follower or following graph | **No** | Not needed |
| User location beyond region | **No** | Not needed; narrows identity sharply |
| Private or restricted content | **No** | Out of scope and out of bounds |

Engagement is recorded but never weights a finding. Viral popularity measures
what an algorithm promoted, not how widely a view is held, and treating the two
as equivalent is the most common error in social listening.

## 2. Anonymisation

Author identifiers are replaced at ingestion, before any analysis, with a
truncated HMAC-SHA256 of the author label under a 256-bit secret salt.

The hash is stable, so the same person yields the same value and distinct
commenters can be counted. It is one-way, so a dataset holder without the salt
cannot recover an identifier. The salt is stored with filesystem mode 600,
excluded from version control, and never transmitted or stored with the data —
together they would undo the anonymisation.

Where the TikTok Research API does not expose a comment author identifier at
all, no author-level identifier enters the pipeline in any form, and
distinct-commenter counts are reported as unavailable for that platform rather
than estimated.

## 3. Storage and access

Working data is held on encrypted storage under the principal investigator's
control. Access is limited to named coders bound by the ethics approval. No
copy is placed in cloud storage, shared drives, or any service outside the
institution's control.

Meta Content Library data does not leave the secure enclave at all. Only
aggregate outputs are extracted, subject to the enclave's disclosure review.
This produces a split pipeline, documented in the study protocol: row-level for
TikTok, aggregate-only for Facebook and Instagram, with combined figures always
stating which platforms contribute to each number.

## 4. Retention and deletion

Raw collected data is retained only for the duration of coding and analysis, and
for a defined verification period afterwards. It is then deleted.

The coded dataset containing verbatim comment text is retained under the same
controls for the verification period and then deleted. What persists is the
aggregate analysis output, which contains no comment text.

Deletion requests from the platforms are honoured. Where a platform signals that
content has been removed or an account deleted, the corresponding rows are
deleted from the working dataset. Content deleted by its author is content its
author withdrew, and retaining it because it was public once would defeat the
purpose of the deletion.

## 5. Publication

Aggregate findings only. No dataset containing verbatim comment text is
published, shared or deposited.

Quotations, where used, are governed by the exclusion rules in the research
proposal: nothing touching legal status, exploitation or an identifiable
employer, and no pairing with attributes that narrow identity. A theme is
reported without a quotation rather than with an unsafe one.

Percentages are never published without their denominator, and no demographic
cell below 30 distinct commenters is expressed as a percentage.

## 6. Terms compliance

Data is collected only through the approved research programmes. No scraping, no
automated access to authenticated interfaces, no circumvention of access
controls, no collection from private accounts or restricted groups.

Data is not redistributed, sold, used for advertising or targeting, used to
train models, or used to identify or contact any individual.

## CHANGE LOG

**Edition 1 Version 1**
5 September 2026

Changes:

- Data management plan created
- Collected and excluded fields enumerated with rationale
- Anonymisation scheme documented, including the no-author-identifier case
- Split pipeline recorded for the Meta enclave constraint
- Retention, deletion and platform deletion-signal handling defined
- Publication and terms compliance commitments stated
