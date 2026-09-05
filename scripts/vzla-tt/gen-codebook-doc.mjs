#!/usr/bin/env node
/*
 * Regenerate the controlled-vocabulary section of CODEBOOK.md from the enforced
 * codebook module, so the document a coder reads and the rules the validator
 * applies cannot drift apart.
 *
 * The prose above the marker is hand-written and is left untouched.
 *
 * Usage: node scripts/vzla-tt/gen-codebook-doc.mjs
 */
import fs from "node:fs";
import * as cb from "./codebook.mjs";

const DOC = "research/venezuelans-trinidad/CODEBOOK.md";
const MARKER = "<!-- GENERATED BELOW THIS LINE — edit codebook.mjs, then rerun gen-codebook-doc.mjs -->";

const table = (title, values) =>
  [`### ${title}`, ``, "```", values.join("\n"), "```", ``].join("\n");

const sections = [
  MARKER,
  ``,
  `## Controlled vocabularies`,
  ``,
  `Generated from \`scripts/vzla-tt/codebook.mjs\` on ${new Date().toISOString().slice(0, 10)}.`,
  `A value outside these lists is a validation error, except for Theme, where an`,
  `unlisted value is accepted as open coding and reported.`,
  ``,
  table("Platform", cb.PLATFORMS),
  table("Language", cb.LANGUAGE),
  table("First_Hand", cb.FIRST_HAND),
  table("Trinidad_Sentiment and Venezuela_Sentiment", cb.SENTIMENT),
  table("Preference", cb.PREFERENCE),
  table("Gender", cb.GENDER),
  table("Age_Group", cb.AGE_GROUP),
  table("Family_Status", cb.FAMILY_STATUS),
  table("Time_In_Trinidad", cb.TIME_IN_TRINIDAD),
  table("Employment_Context", cb.EMPLOYMENT_CONTEXT),
  table("Confidence", cb.CONFIDENCE),
  table(`Theme — ${cb.THEMES.length} seed values, open coding permitted`, cb.THEMES),
  `### Required columns`,
  ``,
  `A row missing any of these is not analysable:`,
  ``,
  "```",
  cb.REQUIRED.join("\n"),
  "```",
  ``,
  `### Column order`,
  ``,
  "```",
  cb.COLUMNS.map((c, i) => `${String(i + 1).padStart(2)}. ${c}`).join("\n"),
  "```",
  ``,
  `### Reporting threshold`,
  ``,
  `Demographic cells below **${cb.MIN_CELL_FOR_PERCENT} distinct commenters** are reported as`,
  `counts with a flag, never as percentages.`,
  ``,
].join("\n");

const existing = fs.readFileSync(DOC, "utf8");
const head = existing.split(MARKER)[0].trimEnd();
fs.writeFileSync(DOC, head + "\n\n" + sections);
console.log(`regenerated controlled vocabularies in ${DOC}`);
