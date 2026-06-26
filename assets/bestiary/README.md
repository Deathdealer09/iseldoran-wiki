# Bestiary Plates

Finished bestiary plates published to the wiki. The Bestiary page in
`IseldoranSagasWiki.jsx` loads `assets/bestiary/NNN.jpg` (zero-padded plate
number, e.g. `001.jpg` … `011.jpg`). Plate numbering matches the keys in
`species.mjs` and the order of the BESTIARY array.

Current plates are web-optimized JPEGs (max 1200px wide, quality 85). To add or
replace one, drop a high-res image in and convert it to the matching
`NNN.jpg` slot at similar settings.

## Generating fresh plates (optional)

The `generate.mjs` / `annotate.mjs` pipeline can produce new plates from scratch
(needs an image-generation API key). From the repo root, with `OPENAI_API_KEY` set:

```bash
npm install
npm run all                 # Stage 1 figures (out/figures) -> Stage 2 plates (out/plates)
# then convert out/plates/*.png to optimized NNN.jpg in this directory
```

`out/` is generated/gitignored working space; only the finished plates committed
here are published.
