import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { mechanismBlocks } from "../mechanism";
import { reviewItems } from "./content";

const root = process.cwd();

test("review items stay off the public nav, sitemap, sim list, and seed", () => {
  const header = readFileSync(join(root, "src/components/Header.tsx"), "utf8");
  const footer = readFileSync(join(root, "src/components/Footer.tsx"), "utf8");
  const sitemap = readFileSync(join(root, "src/app/sitemap.ts"), "utf8");
  const robots = readFileSync(join(root, "src/app/robots.ts"), "utf8");
  const sims = readFileSync(join(root, "src/lib/sims.ts"), "utf8");
  const seed = readFileSync(join(root, "src/data/seed.ts"), "utf8");
  const llms = readFileSync(join(root, "public/llms.txt"), "utf8");
  const page = readFileSync(join(root, "src/app/lab/review/page.tsx"), "utf8");

  assert.doesNotMatch(header, /\/lab\/review/);
  assert.doesNotMatch(footer, /\/lab\/review/);
  assert.doesNotMatch(sitemap, /\/lab\/review/);
  assert.doesNotMatch(llms, /\/lab\/review/);
  assert.match(robots, /\/lab\//);
  assert.doesNotMatch(sims, /candle-in-glass|walking-water/);
  assert.doesNotMatch(seed, /candle-in-glass|walking-water/);
  assert.match(page, /index:\s*false/);
  assert.match(page, /CandleReviewSim/);
  assert.match(page, /WalkingWaterReviewSim/);
});

test("each review walkthrough has three sketched panels and no retired sections", () => {
  assert.deepEqual(
    reviewItems.map((item) => item.voteId),
    ["candle", "walking-water"],
  );
  assert.equal(reviewItems[0].contentId, "candle-in-glass");
  for (const item of reviewItems) {
    assert.equal(item.knowThis.panels?.length, 3, item.voteId);
    const blocks = mechanismBlocks(item.knowThis.mechanism, item.knowThis.panels);
    const placed = blocks.filter((block) => block.panel);
    assert.equal(placed.length, 3, item.voteId);
    for (const block of placed) assert.ok(block.paragraphs.length > 0);
    const blob = [item.knowThis.mechanism, item.knowThis.goDeeper, item.knowThis.numbersNote, item.knowThis.nameForThis]
      .filter(Boolean)
      .join("\n");
    assert.doesNotMatch(blob, /does not prove|stretch it/i, item.voteId);
    assert.doesNotMatch(blob, /SAY THIS|\bTRAP\b|\bTrap\b/, item.voteId);
    for (const panel of item.knowThis.panels ?? []) {
      assert.ok(existsSync(join(root, "public", panel.imageUrl)), panel.imageUrl);
    }
  }
});
