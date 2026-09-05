#!/usr/bin/env node
/*
 * Codebook for the "Venezuelans in Trinidad" social listening study.
 *
 * Single source of truth for the dataset schema, the theme taxonomy, the
 * sentiment scale and every controlled vocabulary. The validator, the
 * collection scripts and the analysis pipeline all import from here so the
 * documented codebook and the enforced one cannot drift apart.
 *
 * Coding rule that governs the whole file: UNKNOWN is a real, expected value.
 * Demographics are recorded only when the commenter states them. Nothing is
 * inferred from names, photographs, accents or writing style.
 */

/**
 * Master dataset columns, in export order.
 *
 * Columns 1-22 are the schema specified in the research brief, unchanged.
 * Commenter_Hash (23) is an addition: the brief requires both a comment count
 * and a distinct-commenter count, and requires that one prolific commenter not
 * distort the findings. Neither is computable from a per-comment id alone, so a
 * stable per-author salted hash is carried alongside it. It is a one-way hash,
 * never a username.
 */
export const COLUMNS = [
  "Platform",
  "Date",
  "Anonymous_ID",
  "Comment",
  "Language",
  "First_Hand",
  "Theme",
  "Subtheme",
  "Trinidad_Sentiment",
  "Venezuela_Sentiment",
  "Preference",
  "Reason",
  "Gender",
  "Age_Group",
  "Family_Status",
  "Time_In_Trinidad",
  "Employment_Context",
  "Trinidad_Location",
  "Venezuela_Location",
  "Engagement",
  "Confidence",
  "Source_URL",
  "Commenter_Hash",
];

export const PLATFORMS = ["Facebook", "TikTok", "Instagram"];

/** Six-point scale required by the brief. Applied separately per target. */
export const SENTIMENT = [
  "strongly_positive",
  "positive",
  "neutral",
  "mixed",
  "negative",
  "strongly_negative",
  "not_expressed",
];

/** Ordinal weights for computing a mean sentiment. not_expressed is excluded. */
export const SENTIMENT_WEIGHT = {
  strongly_positive: 2,
  positive: 1,
  neutral: 0,
  mixed: 0,
  negative: -1,
  strongly_negative: -2,
};

export const PREFERENCE = [
  "stay_trinidad",
  "return_venezuela",
  "another_country",
  "undecided",
  "not_expressed",
];

export const FIRST_HAND = ["first_hand", "second_hand", "unclear"];

export const LANGUAGE = ["es", "en", "es_en_mixed", "other"];

/* -- Demographics. Explicit self-statement only. ------------------------- */

export const GENDER = ["woman", "man", "unspecified"];

export const AGE_GROUP = ["18-24", "25-34", "35-44", "45-54", "55+", "unknown"];

export const FAMILY_STATUS = [
  "single",
  "couple",
  "parent_with_children",
  "parent_separated_from_children",
  "extended_family",
  "unknown",
];

export const TIME_IN_TRINIDAD = [
  "under_6_months",
  "6-12_months",
  "1-3_years",
  "3-5_years",
  "5_plus_years",
  "unknown",
];

export const EMPLOYMENT_CONTEXT = [
  "professional",
  "skilled_trade",
  "hospitality",
  "construction",
  "retail",
  "domestic_work",
  "beauty_aesthetics",
  "informal_employment",
  "entrepreneur_self_employed",
  "student",
  "unemployed",
  "other",
  "unknown",
];

/**
 * Seed theme taxonomy from the brief. Open coding is expected: a comment whose
 * content does not fit these is given a new theme slug rather than forced into
 * a poor match. The validator reports unrecognised themes as candidates for
 * promotion instead of rejecting the row.
 */
export const THEMES = [
  "employment",
  "wages",
  "cost_of_living",
  "housing",
  "food",
  "healthcare",
  "education",
  "safety",
  "crime",
  "police",
  "immigration_authorities",
  "documentation",
  "work_permits",
  "discrimination",
  "xenophobia",
  "acceptance",
  "friendships",
  "dating",
  "relationships",
  "trinidadian_men",
  "trinidadian_women",
  "venezuelan_community",
  "english_language_difficulty",
  "culture",
  "music",
  "nightlife",
  "transportation",
  "climate",
  "beaches",
  "business_opportunities",
  "entrepreneurship",
  "sending_money_home",
  "family_separation",
  "homesickness",
  "political_stability",
  "economic_stability",
  "availability_of_goods",
  "quality_of_life",
  "social_mobility",
  "returning_to_venezuela",
  "migrating_elsewhere",
];

/**
 * Confidence in the coding of a row, not in the truth of the comment.
 * high   - meaning is plain, sentiment and theme unambiguous
 * medium - some reliance on context, slang or implied meaning
 * low    - sarcasm, heavy slang or fragments; coded but flagged
 */
export const CONFIDENCE = ["high", "medium", "low"];

/** Column -> permitted values. Columns absent here are free text. */
export const ENUMS = {
  Platform: PLATFORMS,
  Language: LANGUAGE,
  First_Hand: FIRST_HAND,
  Trinidad_Sentiment: SENTIMENT,
  Venezuela_Sentiment: SENTIMENT,
  Preference: PREFERENCE,
  Gender: GENDER,
  Age_Group: AGE_GROUP,
  Family_Status: FAMILY_STATUS,
  Time_In_Trinidad: TIME_IN_TRINIDAD,
  Employment_Context: EMPLOYMENT_CONTEXT,
  Confidence: CONFIDENCE,
};

/** Columns that must carry a non-empty value for a row to be analysable. */
export const REQUIRED = [
  "Platform",
  "Anonymous_ID",
  "Comment",
  "First_Hand",
  "Theme",
  "Confidence",
  "Commenter_Hash",
];

/**
 * Minimum group size before a demographic percentage may be quoted without a
 * prominent sample-size warning. Below this the analysis reports counts only.
 */
export const MIN_CELL_FOR_PERCENT = 30;

/**
 * Validate one row against the codebook.
 * @param {Record<string,string>} row
 * @param {number} lineNo 1-based line number in the source CSV, for messages
 * @returns {{errors: string[], warnings: string[], newThemes: string[]}}
 */
export function validateRow(row, lineNo) {
  const errors = [];
  const warnings = [];
  const newThemes = [];

  for (const col of REQUIRED) {
    if (!row[col] || !row[col].trim()) {
      errors.push(`line ${lineNo}: required column ${col} is empty`);
    }
  }

  for (const [col, allowed] of Object.entries(ENUMS)) {
    const v = (row[col] || "").trim();
    if (v && !allowed.includes(v)) {
      errors.push(
        `line ${lineNo}: ${col}="${v}" is not in the codebook (allowed: ${allowed.join(", ")})`,
      );
    }
  }

  const date = (row.Date || "").trim();
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push(`line ${lineNo}: Date="${date}" is not ISO YYYY-MM-DD`);
  }

  const theme = (row.Theme || "").trim();
  if (theme && !THEMES.includes(theme)) {
    newThemes.push(theme);
    warnings.push(
      `line ${lineNo}: Theme="${theme}" is not a seed theme; treated as open-coded`,
    );
  }

  const eng = (row.Engagement || "").trim();
  if (eng && !/^\d+$/.test(eng)) {
    warnings.push(`line ${lineNo}: Engagement="${eng}" is not an integer; ignored`);
  }

  // A preference is a claim about the commenter's own intention. Second-hand
  // reports cannot carry one.
  if (
    row.First_Hand === "second_hand" &&
    row.Preference &&
    row.Preference !== "not_expressed"
  ) {
    warnings.push(
      `line ${lineNo}: second-hand row carries Preference="${row.Preference}"; preference is excluded from destination totals`,
    );
  }

  return { errors, warnings, newThemes };
}
