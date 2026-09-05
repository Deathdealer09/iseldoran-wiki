# Codebook

## Venezuelans in Trinidad — Coding Rules

**Edition 1 Version 1**
5 September 2026
13:25

Author: KS Pierre
Creator: KS Pierre
Publisher: KS Pierre
Contributor: Claude

---

## 1. The governing rule

Code what the comment says. Do not code what you infer about the person who
wrote it.

Where a value is not stated, `unknown` or `unspecified` is the correct answer,
not a guess. A dataset that is honestly half unknown supports real findings
about the half that is known. A dataset filled in by inference supports nothing,
because no one can tell afterwards which values were observed.

## 2. First_Hand

The single most consequential field, because it decides evidentiary weight.

- `first_hand` — the writer describes their own experience. "I live in
  Chaguanas", "when I arrived", "my boss", "I went back last year".
- `second_hand` — the writer describes someone else's, or comments on
  Venezuelans generally without being one. "My cousin says", "they come here
  and".
- `unclear` — genuinely ambiguous. Use it rather than guessing.

Second-hand rows are kept in the dataset and excluded from the destination
preference totals, since a preference is a statement about your own intentions.

## 3. Sentiment

Six points, coded separately toward Trinidad and toward Venezuela. A comment
often carries opposite signs for the two, which is the entire point of the
comparison.

- `strongly_positive` — emphatic. "Best decision of my life"
- `positive` — favourable without emphasis
- `neutral` — factual, no evaluation. "Rent in Arima is around 2000"
- `mixed` — genuinely both. "The work is good but I cannot get papers"
- `negative` — unfavourable without emphasis
- `strongly_negative` — emphatic
- `not_expressed` — the comment says nothing about that country

`mixed` and `neutral` are not interchangeable. Neutral carries no evaluation;
mixed carries two opposing ones. They score the same numerically but they
describe different comments, and collapsing them loses the ambivalence that
matters most in migration research.

Read sarcasm in context. "Sí claro, aquí todo es perfecto" following a
complaint is `negative`, not `strongly_positive`. When irony is plausible but
unproven, code the literal reading and set `Confidence` to `low`.

## 4. Theme and Subtheme

One primary theme per row, the one the comment is actually about. A comment
spanning several genuinely distinct topics can be entered as multiple rows
sharing a `Commenter_Hash`; the analysis counts distinct commenters, so this
does not inflate anything.

If nothing fits, invent a theme slug in `lower_snake_case`. The validator
accepts it, flags it, and lists it under open-coded themes. Forcing a comment
into a poor category is worse than adding a category.

`Subtheme` is free text and optional. Use it for the specific instance:
theme `housing`, subtheme `landlord refused without ID`.

## 5. Demographics

Code only from explicit statement or plain non-sensitive context.

Never infer gender from a name, a photograph or grammatical gender in someone
else's reply. Grammatical self-reference does count: a woman writing
"estoy cansada" has stated it.

Never infer age from writing style, slang or profile imagery. "Tengo 27" or
"llegué a los 19 y ya tengo cinco años aquí" are statements. A guess is not.

Never infer immigration or legal status unless the person discusses it
themselves. This field is genuinely dangerous to get wrong and there is no
version of this study that needs a guess at it.

`Time_In_Trinidad` may be computed from a clear statement: "llegué en 2021"
coded in 2026 gives `3-5_years`.

## 6. Preference

The commenter's own stated intention.

- `stay_trinidad` — intends to remain
- `return_venezuela` — intends to go back
- `another_country` — intends to move on elsewhere
- `undecided` — explicitly unsure. "No sé qué voy a hacer"
- `not_expressed` — says nothing about it

Wishing is not intending. "Extraño Venezuela" is homesickness and codes as
`not_expressed` for preference unless the person also says they mean to go
back. Conflating the two would systematically overstate return intention,
which is the error this study is most likely to make.

## 7. Confidence

Confidence in your coding, not in whether the commenter is telling the truth.

- `high` — plain meaning, unambiguous theme and sentiment
- `medium` — some reliance on context or slang
- `low` — possible sarcasm, heavy slang, fragments

Only `high` confidence first-hand rows are eligible as published quotations.

## 8. Engagement

Likes on the comment, if visible. Left blank otherwise. It is recorded for
description only. Viral popularity is never treated as evidence of how
widespread a view is, and the analysis never weights by it.

<!-- GENERATED BELOW THIS LINE — edit codebook.mjs, then rerun gen-codebook-doc.mjs -->

## Controlled vocabularies

Generated from `scripts/vzla-tt/codebook.mjs` on 2026-09-05.
A value outside these lists is a validation error, except for Theme, where an
unlisted value is accepted as open coding and reported.

### Platform

```
Facebook
TikTok
Instagram
```

### Language

```
es
en
es_en_mixed
other
```

### First_Hand

```
first_hand
second_hand
unclear
```

### Trinidad_Sentiment and Venezuela_Sentiment

```
strongly_positive
positive
neutral
mixed
negative
strongly_negative
not_expressed
```

### Preference

```
stay_trinidad
return_venezuela
another_country
undecided
not_expressed
```

### Gender

```
woman
man
unspecified
```

### Age_Group

```
18-24
25-34
35-44
45-54
55+
unknown
```

### Family_Status

```
single
couple
parent_with_children
parent_separated_from_children
extended_family
unknown
```

### Time_In_Trinidad

```
under_6_months
6-12_months
1-3_years
3-5_years
5_plus_years
unknown
```

### Employment_Context

```
professional
skilled_trade
hospitality
construction
retail
domestic_work
beauty_aesthetics
informal_employment
entrepreneur_self_employed
student
unemployed
other
unknown
```

### Confidence

```
high
medium
low
```

### Theme — 41 seed values, open coding permitted

```
employment
wages
cost_of_living
housing
food
healthcare
education
safety
crime
police
immigration_authorities
documentation
work_permits
discrimination
xenophobia
acceptance
friendships
dating
relationships
trinidadian_men
trinidadian_women
venezuelan_community
english_language_difficulty
culture
music
nightlife
transportation
climate
beaches
business_opportunities
entrepreneurship
sending_money_home
family_separation
homesickness
political_stability
economic_stability
availability_of_goods
quality_of_life
social_mobility
returning_to_venezuela
migrating_elsewhere
```

### Required columns

A row missing any of these is not analysable:

```
Platform
Anonymous_ID
Comment
First_Hand
Theme
Confidence
Commenter_Hash
```

### Column order

```
 1. Platform
 2. Date
 3. Anonymous_ID
 4. Comment
 5. Language
 6. First_Hand
 7. Theme
 8. Subtheme
 9. Trinidad_Sentiment
10. Venezuela_Sentiment
11. Preference
12. Reason
13. Gender
14. Age_Group
15. Family_Status
16. Time_In_Trinidad
17. Employment_Context
18. Trinidad_Location
19. Venezuela_Location
20. Engagement
21. Confidence
22. Source_URL
23. Commenter_Hash
```

### Reporting threshold

Demographic cells below **30 distinct commenters** are reported as
counts with a flag, never as percentages.
