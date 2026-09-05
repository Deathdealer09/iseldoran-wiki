# Research Proposal

## Venezuelan Migrant Self-Reported Experience in Trinidad and Tobago: A Social Media Discourse Study

**Edition 1 Version 1**
5 September 2026
14:30

Author: KS Pierre
Creator: KS Pierre
Publisher: KS Pierre
Contributor: Claude

Submitted in support of applications to the TikTok Research API and, through
ICPSR, the Meta Content Library.

---

## 0. Fields the applicant must complete

These cannot be drafted on the applicant's behalf and are left blank
deliberately. An application submitted with invented values in them would be
false.

| Field | Value |
|---|---|
| Principal investigator | `TO BE COMPLETED` |
| Institution | `TO BE COMPLETED` |
| Institution type | `TO BE COMPLETED — must be a university or a not-for-profit whose core activity is scientific or public-interest research` |
| Country of institution | `TO BE COMPLETED — TikTok eligibility is limited to US, EEA, UK, Switzerland, Brazil` |
| Ethics committee | `TO BE COMPLETED` |
| Ethics approval reference and date | `TO BE COMPLETED — must be granted before the TikTok application is submitted` |
| Prior published work evidencing expertise | `TO BE COMPLETED` |
| Funding source and commercial interests | `TO BE COMPLETED — must evidence non-commercial basis` |

Section 8 explains why these are a hard gate rather than paperwork.

## 1. Summary

Trinidad and Tobago hosts one of the largest Venezuelan migrant populations
relative to national population anywhere in the Caribbean. Policy toward that
population — registration, work permits, healthcare access, maritime
interception — has been debated and revised repeatedly, and it is made largely
without systematic evidence of how the migrants themselves describe their
circumstances.

The existing evidence base is real but narrow in one specific way. Studies such
as the IOM Displacement Tracking Matrix rounds, the 2020 food insecurity survey
and the 2022 healthcare access work are agency-mediated: the respondent knows
they are answering an organisation that may control access to services. That
framing is well documented to shape answers, particularly on questions touching
legal status, exploitation and satisfaction.

Public social media discourse is differently biased, not less biased. What it
offers is unelicited speech: people describing their circumstances to each other
rather than to an institution. Read alongside the survey literature, it can
show where the two sources agree and, more usefully, where they diverge.

## 2. Research questions

**Primary.** How do Venezuelan migrants in Trinidad and Tobago characterise
their circumstances there relative to Venezuela, in public discourse addressed
to one another rather than to institutions?

**Secondary.**

1. Which aspects of life in Trinidad are most frequently described favourably,
   and which unfavourably, ranked by the number of distinct people raising them?
2. What do migrants describe missing about Venezuela, and is that distinguishable
   from stated intention to return?
3. What proportions express intention to remain, to return, to move onward, or
   report themselves undecided?
4. How do these differ by stated gender, age band, family situation, length of
   residence and employment context?
5. Do reported experiences differ between recent arrivals and longer-term
   residents, and in which direction?
6. Where does unelicited discourse diverge from agency-mediated survey findings
   on the same topics?

Question 6 is the contribution. Questions 1 to 5 are largely answerable from
existing survey work; the divergence is what platform data adds.

## 3. Why platform data access is necessary

The questions concern what people say publicly to each other. There is no
substitute source: interview and survey instruments reintroduce exactly the
institutional framing whose effect the study seeks to measure.

Manual browsing can gather illustrative material but cannot support the
distinct-commenter counts, date-range control or systematic sampling the
questions require, and it cannot be documented reproducibly.

## 4. Why the request is proportionate

The study requests the minimum that answers the questions.

**Fields requested:** comment text, comment timestamp, comment engagement count,
parent video or post identifier, and post region code.

**Fields not requested and not wanted:** usernames, display names, profile
biographies, profile images, follower or following graphs, user location beyond
post region, private or restricted content, direct messages, and any content
from accounts that are not public.

**Scope:** public posts matching a defined Spanish and English term list,
restricted to region codes TT and VE, within a bounded date range.

**Volume:** a target of 5,000 comments. Well inside the 100,000 record daily
ceiling, and chosen as the smallest sample supporting demographic cross-tabs at
the study's own 30-commenter reporting threshold rather than as a maximum.

No individual is profiled. The unit of analysis is the comment; the only
person-level quantity computed is a count of distinct authors, derived from a
salted one-way hash, which exists solely to prevent one prolific commenter
distorting a frequency.

## 5. Method

Instrument, codebook and analysis pipeline are already built and are available
for review with the application. They are dependency-free and can be carried
into a secure enclave.

**Sampling.** Term list of 56 items spanning Venezuelan Spanish, Trinidadian
English, code-mixed usage, regional slang and platform hashtags. Sampling
spreads across many posts rather than exhausting high-engagement threads,
because a viral comment section is one conversation, not a cross-section.

**Coding.** A 41-theme seed taxonomy with open coding permitted; a six-point
sentiment scale applied separately toward each country; first-hand testimony
distinguished from second-hand report and weighted accordingly. Demographic
attributes are coded only from explicit self-statement. Nothing is inferred from
names, photographs, writing style or accent, and legal status is never inferred
at all.

**Reliability.** A double-coded subsample with disagreement reported. Coding
confidence is recorded per row, and only high-confidence first-hand rows are
eligible for quotation.

**Analysis.** Theme frequency ranked by distinct commenters; sentiment
distributions per country; destination preference resolved once per person;
demographic cross-tabs suppressed below 30 distinct commenters in a cell.

## 6. Outputs

An aggregate written report, a theme frequency table, sentiment distributions, a
demographic cross-tab analysis, and a summary graphic.

No raw comment data will be republished. No dataset will be shared or deposited
in a form containing verbatim comment text. Quotations, if any appear, will be
handled under section 7.

## 7. Risk assessment

**The population is vulnerable.** Migrants whose legal status may be irregular
face concrete consequences — detention, deportation, loss of employment — if
identified. This is the governing risk and it shapes every other decision.

**Re-identification through quotation.** A verbatim public comment can be found
by searching for it. Mitigation: quotations are drawn only from material the
research team holds directly, are never paired with any other attribute that
narrows identity, and any quotation whose content touches legal status,
exploitation or an identifiable employer is excluded regardless of how
illustrative it is. Where a quotation cannot be used safely, the theme is
reported without one.

**Re-identification through combination.** A rare combination of attributes —
occupation, town, family situation, arrival date — can identify a person even
without a name. Mitigation: the 30-commenter suppression threshold, and no
publication of cross-tabs at more than two dimensions.

**Inference of legal status.** Mitigation: status is coded only where the
commenter discusses it themselves, and is never used as a cross-tab dimension.

**Harm through aggregate finding.** Findings about a migrant population can be
put to hostile political use. Mitigation: reporting states sampling limitations
prominently, never describes findings as representing all Venezuelans in
Trinidad and Tobago, and reports favourable and unfavourable findings with equal
prominence.

**Absent voices.** People without smartphones, without data, without written
literacy in either language, and those deliberately avoiding visibility are
absent from the sample, and their absence is not random — it correlates with
precarity. The study cannot correct this and will state it rather than obscure
it.

## 8. Eligibility

Both programmes restrict access to universities and not-for-profit
organisations whose core activity is scientific or public-interest research, and
both explicitly exclude commercial use. TikTok additionally requires evidence of
completed ethical review and limits eligibility by country of institution.

An applicant without such an affiliation is ineligible, and no strength of
proposal changes that. The realistic routes are a named collaboration with a
university or research non-profit that will sponsor the application and host the
ethics review, or abandoning platform API access in favour of manual collection.

## CHANGE LOG

**Edition 1 Version 1**
5 September 2026

Changes:

- Proposal created for TikTok Research API and Meta Content Library applications
- Research questions defined, with the survey-divergence question identified as
  the study's contribution
- Necessity and proportionality arguments set out, with requested and
  explicitly excluded fields enumerated
- Method summarised against the built instrument
- Risk assessment written around migrant vulnerability as the governing risk
- Eligibility gate stated plainly
- Applicant-specific fields left blank rather than invented
