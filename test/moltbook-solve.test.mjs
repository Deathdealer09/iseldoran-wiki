import { test } from "node:test";
import assert from "node:assert/strict";
import { solveChallenge, extractNumbers, normalize } from "../scripts/moltbook-solve.mjs";

// Real challenges observed in production (obfuscation preserved), with answers.
const CASES = [
  ["A] Lo-oB sSt-Er Um^ SwImS[ aT/ tWeN tY fOuR ~cMe^tErS] pEr\\ SeCo/nd, AnD{ AcCeLeR aTeS- bY< SiX> umm, WhAtS^ ThE NeW] SpEeD?", "30.00"],
  ["A] Lo.oObB sStTeRr S^wImS[ aT tW^eNn-Ty ThReE] mE^tErS| pEr] mMiN~uTe aNd- SpEeDs^ U/p By] SeVeN{ mE^tErS< pEr> mMiN-uTe, WhAtS] Is^ ThE NeW- SpEeD?", "30.00"],
  ["A] lO.bS tEr LooobsssTer ClAaW ExErTs Um] tWeN tY SiX N ooOtOnS^ AnD MuLtIpLiEs| bY T wO, DuRiNg DoMiNaNcE F iG hT~ wHaT< Is> ThE ToTaL FoRcE?", "52.00"],
  ["LoObBsStTeR] SwImS^ LiKe Um, VeLaWcItEe/ AnD LoObBsStTeR ShOvEs- ClAaW {PuShEs} Tw/EnTy ThReE ~CeNtImEtErS PeR SeCoNd + FoUr NeWtOnS DuRiNg DoMiNaNcE FiGhT, WhAtS ToTaL FoRcE?", "27.00"],
  ["A] LoObBsTtEr ClAaW ExErTs TwEnTy ThReE NeWtOnS AnD ThE OtHeR ClAaW ExErTs EiGhT NeWtOnS ToTaL FoRcE?", "31.00"],
  ["A] LxO b-StEr ClAaW FoRcE Is/ TwEnTy- FiVe] NooToNs, Um| AnOtHeR^ ClAaW Is/ TwElVe] NooToNs, HoW/ MaNy^ NoOtOnS ToTaL<?", "37.00"],
  ["A] L oObBsStEr ClAaW ExErTs TwEnTy ThReE nEuToNs tHeRe ArE FoUrTeEn lObBsTeRs hOw mUcH tOtAl fOrCe?", "322.00"],
  ["LoOoBbSsTtEeR ClAaWw FoOrRcEe IsS TwEnTy TwO NeWwOtOnS AnNd OtHeR ClAaWw IsS ThIrTy ThReE NeWwOtOnS ToTaL FoOrCe?", "55.00"],
];

for (const [challenge, expected] of CASES) {
  test(`solves: ${challenge.slice(0, 40)}...`, () => {
    const r = solveChallenge(challenge);
    assert.ok(r, "should produce a confident answer");
    assert.equal(r.answer, expected);
  });
}

test("extractNumbers composes tens+ones and reads digits", () => {
  assert.deepEqual(extractNumbers(normalize("twenty four and six")), [24, 6]);
  assert.deepEqual(extractNumbers(normalize("23 and 14")), [23, 14]);
  assert.deepEqual(extractNumbers(normalize("fourteen")), [14]); // teen beats four
});

test("returns null (skips) when ambiguous — both add and multiply signals", () => {
  // contains "times" AND "plus" → two ops → unsafe → skip
  assert.equal(solveChallenge("twenty plus three times what"), null);
});

test("returns null when not exactly two numbers", () => {
  assert.equal(solveChallenge("just one number: twenty three, add what?"), null);
  assert.equal(solveChallenge("three numbers four five and multiply"), null);
});

test("never throws on junk input", () => {
  assert.equal(solveChallenge(""), null);
  assert.equal(solveChallenge("no numbers here at all"), null);
});
