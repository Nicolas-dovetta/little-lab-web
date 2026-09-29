import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { SIM_HEIGHT_MESSAGE, sanitizeSimHeight, simForExperiment, simSlugs } from "./sims";

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

test("sanitizeSimHeight clamps and rejects junk", () => {
  assert.equal(sanitizeSimHeight(1234.2), 1235);
  assert.equal(sanitizeSimHeight(10), 300);
  assert.equal(sanitizeSimHeight(1e9), 8000);
  assert.equal(sanitizeSimHeight("900"), null);
  assert.equal(sanitizeSimHeight(Number.NaN), null);
  assert.equal(sanitizeSimHeight(-5), null);
});
