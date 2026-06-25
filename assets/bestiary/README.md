# Bestiary Plates

Finished bestiary plates published to the wiki. The Bestiary page in
`IseldoranSagasWiki.jsx` loads `assets/bestiary/NNN.png` (zero-padded plate
number, e.g. `001.png` … `011.png`). Until a plate exists here, the card shows
a "Plate Pending" placeholder.

## How to populate

From the repo root, with `OPENAI_API_KEY` set:

```bash
npm install
npm run all                 # Stage 1 figures (out/figures) -> Stage 2 plates (out/plates)
cp out/plates/*.png assets/bestiary/
```

`out/` is generated/gitignored working space; only the finished plates copied
here are committed and published. Plate numbering matches the keys in
`species.mjs` and the order of the BESTIARY array in `IseldoranSagasWiki.jsx`.
