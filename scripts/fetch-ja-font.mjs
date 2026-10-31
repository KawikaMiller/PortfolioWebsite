// Builds app/fonts/DelaGothicOne-ja.woff2: Dela Gothic One subset to just the Japanese characters
// used in app/page.tsx, fetched from Google Fonts' `text=` API (a few KB instead of megabytes).
// Re-run after changing any Japanese text:  node scripts/fetch-ja-font.mjs
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const chars = [...new Set(source.match(/[　-ヿ一-鿿＀-￯]/g) ?? [])].join("");
if (!chars) throw new Error("No Japanese characters found in app/page.tsx");

const css = await (
  await fetch(
    `https://fonts.googleapis.com/css2?family=Dela+Gothic+One&text=${encodeURIComponent(chars)}`,
    // a modern browser UA makes Google return woff2
    { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36" } },
  )
).text();
const url = css.match(/url\((https:[^)]+)\)/)?.[1];
if (!url) throw new Error("Could not find a font URL in Google's response:\n" + css);

const font = Buffer.from(await (await fetch(url)).arrayBuffer());
writeFileSync(new URL("../app/fonts/DelaGothicOne-ja.woff2", import.meta.url), font);
console.log(`Wrote ${font.length} bytes for ${[...chars].length} characters: ${chars}`);
