#!/usr/bin/env node
/*
 * Build step for the wiki front-end.
 *
 * The wiki used to load React, ReactDOM and Babel from a CDN and compile
 * IseldoranSagasWiki.jsx in the browser on every visit — slow, and a blank
 * page whenever the CDN or in-browser compile failed (common on mobile).
 *
 * This script makes the site self-contained:
 *   1. Transpiles IseldoranSagasWiki.jsx -> IseldoranSagasWiki.compiled.js
 *      (plain React.createElement calls, no JSX, no runtime Babel).
 *   2. Vendors the React / ReactDOM UMD production bundles into vendor/.
 *
 * index.html then loads vendor/react, vendor/react-dom and the compiled file
 * locally — zero external dependencies. Re-run after editing the .jsx:
 *   npm run build:wiki
 */

import { transformFileSync } from "@babel/core";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// 1. Transpile JSX -> plain JS
const srcJsx = join(root, "IseldoranSagasWiki.jsx");
const outJs = join(root, "IseldoranSagasWiki.compiled.js");
const { code } = transformFileSync(srcJsx, {
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  comments: false,
  compact: false,
});
const banner =
  "/* AUTO-GENERATED from IseldoranSagasWiki.jsx by scripts/build-wiki.mjs. " +
  "Do not edit directly — edit the .jsx and run `npm run build:wiki`. */\n";
writeFileSync(outJs, banner + code, "utf8");
console.log(`Compiled wiki -> ${outJs} (${(banner.length + code.length)} bytes)`);

// 2. Vendor React / ReactDOM UMD production builds
const vendorDir = join(root, "vendor");
mkdirSync(vendorDir, { recursive: true });
const bundles = [
  "react/umd/react.production.min.js",
  "react-dom/umd/react-dom.production.min.js",
];
for (const pkgPath of bundles) {
  const from = join(root, "node_modules", pkgPath);
  const outName = pkgPath.split("/").pop();
  copyFileSync(from, join(vendorDir, outName));
  console.log(`Vendored ${outName}`);
}

console.log("Wiki build complete.");
