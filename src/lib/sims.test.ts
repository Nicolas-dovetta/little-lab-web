import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { SIM_ANCHOR_ID, SIM_HEIGHT_MESSAGE, sanitizeSimHeight, simForExperiment, simHref, simSlugs } from "./sims";

const publicDir = join(process.cwd(), "public");

test("volcano, rocket, salt ice and density have sims; the others don't", () => {
  assert.deepEqual(simSlugs(), ["baking-soda-volcano", "water-bottle-rocket", "salt-ice-fishing", "density-layers"]);
  assert.equal(simForExperiment("cornstarch-thickening-fluid"), null);
  assert.equal(simForExperiment("cinnamon-soap-rush"), null);
  for (const slug of simSlugs()) assert.equal(simForExperiment(slug)?.src, `/sims/${slug}/index.html`);
});

test("each sim hides its own heading inside the embed and has no retired sections", () => {
  for (const slug of simSlugs()) {
    const html = readFileSync(join(publicDir, simForExperiment(slug)!.src), "utf8");
    assert.match(html, /window\.self !== window\.top/, `${slug}: no embedded check`);
    assert.match(html, /\.embedded h1\{display:none\}/, `${slug}: heading not hidden when embedded`);
    assert.doesNotMatch(html, /<title>[^<]*prototype/i, `${slug}: title says prototype`);
    assert.doesNotMatch(html, /does not prove|stretch it/i, `${slug}: retired section wording`);
    assert.doesNotMatch(html, /SAY THIS|\bTRAP\b|\bTrap\b/, `${slug}: retired section wording`);
  }
});

test("each sim file exists, is noindex, self-contained and posts its height", () => {
  for (const slug of simSlugs()) {
    const sim = simForExperiment(slug)!;
    const file = join(publicDir, sim.src);
    assert.ok(existsSync(file), `${file} missing: run node scripts/sync-sims.mjs`);
    const html = readFileSync(file, "utf8");
    assert.match(html, /<meta\s+name="robots"\s+content="noindex">/);
    assert.ok(html.includes("little-lab-web: embed height"), "height script missing");
    assert.ok(html.includes(`type: "${SIM_HEIGHT_MESSAGE}"`), "height message type out of step");
    assert.doesNotMatch(html, /\b(src|href)=["']https?:/i);
  }
});

test("/simulators: each sim has its short name and links to the sim anchor on its page", () => {
  assert.deepEqual(
    simSlugs().map((s) => simForExperiment(s)!.name),
    ["Baking-soda volcano", "Water-bottle rocket", "Salt ice fishing", "Density layers"],
  );
  assert.equal(SIM_ANCHOR_ID, "simulator");
  assert.equal(simHref("water-bottle-rocket"), "/experiments/water-bottle-rocket#simulator");
  const tryIt = readFileSync(join(process.cwd(), "src/components/SimTryIt.tsx"), "utf8");
  assert.match(tryIt, /id=\{SIM_ANCHOR_ID\}/);
  assert.match(tryIt, /scroll-mt-/);
  const header = readFileSync(join(process.cwd(), "src/components/Header.tsx"), "utf8");
  assert.match(
    header,
    /"\/simulators", label: "Simulators" \},\n\s*\{ href: "\/vote", label: "Vote" \},\n\s*\{ href: "\/about", label: "About" \}/,
  );
  const sitemap = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8");
  assert.match(sitemap, /\/simulators/);
});

test("sanitizeSimHeight clamps and rejects junk", () => {
  assert.equal(sanitizeSimHeight(1234.2), 1235);
  assert.equal(sanitizeSimHeight(10), 300);
  assert.equal(sanitizeSimHeight(1e9), 8000);
  assert.equal(sanitizeSimHeight("900"), null);
  assert.equal(sanitizeSimHeight(Number.NaN), null);
  assert.equal(sanitizeSimHeight(-5), null);
});
