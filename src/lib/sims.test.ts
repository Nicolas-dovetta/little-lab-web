import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { SIM_HEIGHT_MESSAGE, sanitizeSimHeight, simForExperiment, simSlugs } from "./sims";

const publicDir = join(process.cwd(), "public");

test("only the volcano has a sim", () => {
  assert.deepEqual(simSlugs(), ["baking-soda-volcano"]);
  assert.equal(simForExperiment("cornstarch-thickening-fluid"), null);
  assert.equal(simForExperiment("baking-soda-volcano")?.src, "/sims/baking-soda-volcano/index.html");
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
