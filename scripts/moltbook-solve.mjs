#!/usr/bin/env node
/*
 * Conservative solver for Moltbook's "lobster math" verification challenges.
 *
 * Challenges are an obfuscated word problem with exactly two numbers and one
 * operation. Obfuscation = alternating case + injected punctuation/spaces +
 * DUPLICATED letters ("tW^eNn-Ty" -> "twennty", "ClAaW" -> "claaw"). So all
 * matching is done with letter-repeat tolerance (each letter may repeat).
 *
 * SAFETY: Moltbook auto-suspends after 10 consecutive failed verifications, so
 * this NEVER guesses. solveChallenge() returns an answer ONLY when confident
 * (exactly two numbers AND exactly one unambiguous operation); otherwise null,
 * and the caller must skip (never submit).
 */

const ONES = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
const TEENS = {
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };

// Letter-repeat-tolerant pattern for a word: "claw" -> /c+l+a+w+/.
const rep = (w) => w.split("").map((c) => `${c}+`).join("");
const hasFuzzy = (s, stem) => new RegExp(rep(stem)).test(s);

// Longest-first so "sixteen" beats "six", "twenty" before "two".
const WORD_ENTRIES = [...Object.entries(TEENS), ...Object.entries(TENS), ...Object.entries(ONES)]
  .sort((a, b) => b[0].length - a[0].length)
  .map(([w, v]) => ({
    w, v,
    re: new RegExp("^" + rep(w)),
    tens: v >= 20 && v <= 90 && v % 10 === 0,
    ones: v >= 1 && v <= 9,
  }));

/** Normalize obfuscated text to a lowercase [a-z0-9] string (spaces removed). */
export function normalize(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Extract numbers (digit runs + fuzzy number words, composing tens+ones). */
export function extractNumbers(s) {
  const nums = [];
  let i = 0;
  while (i < s.length) {
    const dm = /^[0-9]+/.exec(s.slice(i));
    if (dm) {
      nums.push({ value: parseInt(dm[0], 10), start: i, end: i + dm[0].length });
      i += dm[0].length;
      continue;
    }
    let matched = null;
    for (const ent of WORD_ENTRIES) {
      const m = ent.re.exec(s.slice(i));
      if (m) { matched = { ent, len: m[0].length }; break; }
    }
    if (matched) {
      nums.push({ value: matched.ent.v, start: i, end: i + matched.len, tens: matched.ent.tens, ones: matched.ent.ones });
      i += matched.len;
      continue;
    }
    i++;
  }
  // Combine adjacent tens + ones ("twenty","four" -> 24).
  const out = [];
  for (let k = 0; k < nums.length; k++) {
    const cur = nums[k], nxt = nums[k + 1];
    if (cur.tens && nxt && nxt.ones && nxt.start === cur.end) {
      out.push(cur.value + nxt.value);
      k++;
    } else {
      out.push(cur.value);
    }
  }
  return out;
}

/**
 * Decide the operation, or null if ambiguous.
 * @param s    normalized [a-z0-9] text
 * @param raw  lowercased original (for operator symbols)
 */
export function detectOp(s, raw = "") {
  const plusSym = raw.includes("+");      // trusted: not seen as injected noise
  const mulSym = /[×]/.test(raw);         // unicode multiply only

  const explicitMul = mulSym || hasFuzzy(s, "multipl") || hasFuzzy(s, "times") || hasFuzzy(s, "product");
  // "there are N lobsters ... total" → count × force. Use "there are" (not the
  // plural "lobsters", which fuzzy-matches "lobster"+next word's leading s).
  const countMul = hasFuzzy(s, "thereare") && hasFuzzy(s, "total");
  const hasMul = explicitMul || countMul;

  const addStems = ["accelerat", "increase", "speedsup", "speedup", "combined", "another", "risesby", "jumpsby", "gainsby", "fasterby", "addedto"];
  const explicitAdd = plusSym || addStems.some((w) => hasFuzzy(s, w)) || hasFuzzy(s, "plus");
  const clawCount = (s.match(new RegExp(rep("claw"), "g")) || []).length;
  const twoClawAdd = hasFuzzy(s, "total") && clawCount >= 2 && !countMul;
  const hasAdd = explicitAdd || twoClawAdd;

  const hasSub = ["minus", "decreas", "slowsby", "reducedby"].some((w) => hasFuzzy(s, w));
  const hasDiv = ["dividedby", "perlobster", "splitinto"].some((w) => hasFuzzy(s, w));

  const ops = [hasMul && "*", hasAdd && "+", hasSub && "-", hasDiv && "/"].filter(Boolean);
  return ops.length === 1 ? ops[0] : null;
}

/** @returns {{answer:string, a:number, b:number, op:string} | null} */
export function solveChallenge(text) {
  const s = normalize(text);
  const nums = extractNumbers(s);
  if (nums.length !== 2) return null;
  const op = detectOp(s, String(text).toLowerCase());
  if (!op) return null;
  const [a, b] = nums;
  let r;
  switch (op) {
    case "+": r = a + b; break;
    case "*": r = a * b; break;
    case "-": r = a - b; break;
    case "/": if (b === 0) return null; r = a / b; break;
    default: return null;
  }
  if (!Number.isFinite(r) || r < 0) return null;
  return { answer: r.toFixed(2), a, b, op };
}

// CLI: echo "<challenge>" | node scripts/moltbook-solve.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import("node:fs");
  const input = process.argv.slice(2).filter((a) => !a.startsWith("--")).join(" ") || fs.readFileSync(0, "utf8");
  const res = solveChallenge(input);
  console.log(res ? res.answer : "UNSURE");
  process.exit(res ? 0 : 1);
}
