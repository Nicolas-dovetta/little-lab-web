#!/usr/bin/env node
// Copy an interactive sim from the private little-lab-mechanics repo into
// public/sims/<slug>/index.html, ready to embed in an experiment page.
//
//   node scripts/sync-sims.mjs                       # every sim in SIMS below
//   node scripts/sync-sims.mjs baking-soda-volcano   # one sim
//   MECHANICS_DIR=/path/to/little-lab-mechanics node scripts/sync-sims.mjs
//
// Default source: ../little-lab-mechanics/sims/<slug>/index.html (a sibling clone).
// Rerun it after any fix to the sim in little-lab-mechanics, then commit the copy.
//
// The copy is the source file byte for byte, plus two things this script adds:
// - <meta name="robots" content="noindex"> if the source doesn't already have it
//   (search engines should index the experiment page, not the bare sim);
// - a tiny script that tells the parent page the sim's height (postMessage), so
//   the page can size the iframe to fit with no scroll box inside the page.
// Rerunning on an already-synced source is a no-op (the marker is checked).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mechanics = resolve(process.env.MECHANICS_DIR ?? join(root, "..", "little-lab-mechanics"));

// Keep in step with src/lib/sims.ts.
const SIMS = ["baking-soda-volcano", "water-bottle-rocket", "salt-ice-fishing", "density-layers"];

const MARKER = "little-lab-web: embed height";
// Keep the message type in step with SIM_HEIGHT_MESSAGE in src/lib/sims.ts.
const HEIGHT_SCRIPT = `<!-- ${MARKER} (added by scripts/sync-sims.mjs; tells the embedding page how tall the sim is) -->
<script>
(function () {
  if (window.parent === window) return;
  var last = 0;
  function send() {
    var h = Math.ceil(document.documentElement.getBoundingClientRect().height);
    if (h > 0 && h !== last) {
      last = h;
      window.parent.postMessage({ type: "little-lab-sim-height", height: h }, "*");
    }
  }
  if (window.ResizeObserver) new ResizeObserver(send).observe(document.documentElement);
  window.addEventListener("load", send);
  window.addEventListener("resize", send);
  send();
})();
</script>
`;

function sync(slug) {
  const src = join(mechanics, "sims", slug, "index.html");
  if (!existsSync(src)) throw new Error(`Missing sim source: ${src} (set MECHANICS_DIR?)`);
  let html = readFileSync(src, "utf8");

  if (!/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) {
    if (!/<head[^>]*>/i.test(html)) throw new Error(`${src}: no <head> to add noindex to`);
    html = html.replace(/<head[^>]*>/i, (m) => `${m}\n<meta name="robots" content="noindex">`);
  }
  if (!html.includes(MARKER)) {
    const i = html.toLowerCase().lastIndexOf("</body>");
    if (i < 0) throw new Error(`${src}: no </body> to add the height script before`);
    html = html.slice(0, i) + HEIGHT_SCRIPT + html.slice(i);
  }
  if (/\b(src|href)=["']https?:/i.test(html)) {
    throw new Error(`${src}: loads something from the network; sims must be self-contained`);
  }

  const out = join(root, "public", "sims", slug, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`${slug}: ${src} -> ${out.slice(root.length + 1)}`);
}

const wanted = process.argv.slice(2);
for (const slug of wanted.length ? wanted : SIMS) {
  if (!SIMS.includes(slug)) throw new Error(`Unknown sim "${slug}"; add it to SIMS first`);
  sync(slug);
}
