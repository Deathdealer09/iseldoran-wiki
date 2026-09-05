# Collection Guide

## Venezuelans in Trinidad — Manual Collection Route

**Edition 1 Version 1**
5 September 2026
13:10

Author: KS Pierre
Creator: KS Pierre
Publisher: KS Pierre
Contributor: Claude

---

## 1. What you are doing

You browse the platforms yourself as an ordinary user and copy public comments
into a spreadsheet. Nothing automated touches your account, so there is no terms
of service exposure and no risk to your login.

Start from `raw-collection-template.csv`. It has six columns, all of which you
can see on screen while reading:

| Column | What to put |
|---|---|
| `Platform` | Facebook, TikTok or Instagram, spelled exactly |
| `Date` | Comment date as YYYY-MM-DD. Leave blank if only "3 weeks ago" is shown |
| `Author_Label` | Any consistent label for the writer. See section 4 |
| `Comment` | The comment text, verbatim, original language |
| `Source_URL` | Link to the post or video the comment sits under |
| `Engagement` | Like count, if shown. Blank otherwise |

Everything else in the master dataset is generated or coded later. You do not
fill in themes or sentiment while collecting; separating collection from coding
keeps the collecting fast and stops you unconsciously selecting comments that
fit a theme you have in mind.

## 2. Where to search

`scripts/vzla-tt/search-terms.mjs` holds 56 terms across three layers: the seed
terms from the brief, expansions in Venezuelan Spanish, Trinidadian English and
the vocabulary of the crossing itself, plus platform hashtags.

Print the list with:

```
node -e "import('./scripts/vzla-tt/search-terms.mjs').then(m=>m.manualTerms().forEach(t=>console.log(t)))"
```

Search in Spanish first. The bulk of this conversation happens in Venezuelan
Spanish, and English-only searching produces a sample skewed toward people who
have already settled and switched languages, which quietly biases the whole
study toward longer-term, better-integrated respondents.

When you find a term recurring that is not on the list, add it. Real vocabulary
beats a list written in advance.

## 3. What to collect and what to skip

**Collect** first-person accounts above everything: "I live", "I worked",
"when I arrived", "my experience", "I have been here", "I went back",
"I prefer". These carry the evidentiary weight.

**Collect** ordinary comments as well as dramatic ones. A study built only from
what stands out describes only what stands out.

**Skip** advertising, job listings, currency exchange offers, obvious bots,
and comments copy-pasted across many posts.

**Skip** anything behind a private group, a locked account or a friends-only
post. If you had to be admitted to see it, the people in it did not publish it
to the world.

**Do collect** comments from Trinidadians about Venezuelans, and mark them in
the coding pass. They answer a different question than the one at the centre of
the brief, and mixing them in silently would corrupt the main finding.

## 4. Author labels and anonymity

Do not record usernames, real names, profile links, photographs, phone numbers,
addresses or anything about someone's immigration papers.

For `Author_Label`, use a consistent stand-in of your own: `a1`, `a2`, `a3`, or
`tiktok-user-07`. The only thing that matters is that the same person gets the
same label every time you see them, because that is what lets the analysis count
distinct people rather than distinct comments.

`prepare.mjs` then replaces your label with a salted one-way hash. The salt is
generated on first run into `.vzla-salt`, which is gitignored. Keep it. Losing
it means later batches cannot be matched to earlier ones. Never send it with the
data; together they undo the anonymisation.

## 5. Avoiding a lopsided sample

One viral video's comment section is one conversation, not a cross-section. A
few habits keep the sample honest:

- Spread across many posts rather than exhausting a handful. Twenty comments
  each from thirty posts beats six hundred from three.
- Deliberately include posts with modest view counts.
- Cover all three platforms. Their user bases differ by age and by gender.
- Cover a date range rather than a single week. Conditions in both countries
  shift, and so does what people say.
- Record the disagreeable alongside the agreeable. If a thread runs against
  what you expected, that is data.

Nothing above makes the sample statistically representative, and the final
report says so plainly. It does keep it from being obviously distorted.

## 6. Running it

```
# 1. anonymise and assign identifiers
node scripts/vzla-tt/prepare.mjs raw-batch-1.csv --out dataset.csv

# 2. later batches append, keeping identifiers stable
node scripts/vzla-tt/prepare.mjs raw-batch-2.csv --out dataset.csv --append

# 3. code the blank columns in dataset.csv against CODEBOOK.md

# 4. analyse
node scripts/vzla-tt/analyze.mjs dataset.csv
```

`analyze.mjs` reports every uncoded row as an error rather than quietly
analysing around it, so a partly coded dataset cannot slip through as if it were
finished.

## 7. How much is enough

The brief targets 5,000 comments. Below that, the analysis still runs and simply
reports the real number.

Rough guidance on what a sample supports:

| Sample | What it supports |
|---|---|
| Under 100 | Illustrative quotations only. No percentages |
| 100 to 300 | Overall theme ranking. No demographic breakdowns |
| 300 to 800 | Theme ranking and overall sentiment, with a stated caveat |
| 800 to 2,000 | Cross-tabs for the larger demographic groups |
| 2,000+ | The full analysis the brief describes |

The pipeline enforces the spirit of this: any demographic cell under 30
commenters is reported as a count with a flag, never as a percentage.
