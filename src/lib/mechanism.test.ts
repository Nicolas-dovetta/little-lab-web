import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { experimentSeeds } from "../data/seed";
import type { KnowThisPanel } from "../db/schema";
import { mechanismBlocks, stripPanelMarkers } from "./mechanism";

const panel = (n: number): KnowThisPanel => ({
  imageUrl: `/p${n}.png`,
  webpUrl: `/p${n}.webp`,
  alt: `panel ${n}`,
  width: 1200,
  height: 800,
});

test("mechanismBlocks interleaves each panel above its own paragraphs", () => {
  const text = "Intro one.\n\nArrow key.\n\n<!-- panel:1 -->\nP1 a.\n\nP1 b.\n\n<!-- panel:2 -->\nP2 a.";
  const blocks = mechanismBlocks(text, [panel(1), panel(2)]);
  assert.deepEqual(
    blocks.map((b) => [b.panelNumber, b.panel?.imageUrl ?? null, b.paragraphs]),
    [
      [null, null, ["Intro one.", "Arrow key."]],
      [1, "/p1.png", ["P1 a.", "P1 b."]],
      [2, "/p2.png", ["P2 a."]],
    ],
  );
});

test("mechanismBlocks without markers keeps old behaviour (sketches first, then text)", () => {
  const blocks = mechanismBlocks("Just text.\n\nMore.", [panel(1)]);
  assert.deepEqual(
    blocks.map((b) => [b.panel?.imageUrl ?? null, b.paragraphs]),
    [
      ["/p1.png", []],
      [null, ["Just text.", "More."]],
    ],
  );
  assert.deepEqual(mechanismBlocks("Only text.", undefined).map((b) => b.paragraphs), [["Only text."]]);
});

test("mechanismBlocks keeps text when a marker has no panel", () => {
  const blocks = mechanismBlocks("<!-- panel:3 -->\nOrphan text.", [panel(1)]);
  assert.deepEqual(
    blocks.map((b) => [b.panel?.imageUrl ?? null, b.paragraphs]),
    [
      ["/p1.png", []],
      [null, ["Orphan text."]],
    ],
  );
});

test("stripPanelMarkers removes markers", () => {
  assert.equal(stripPanelMarkers("A.\n\n<!-- panel:1 -->\nB."), "A.\n\nB.");
});

const SKETCHED = [
  "cornstarch-thickening-fluid",
  "baking-soda-volcano",
  "density-layers",
  "salt-ice-fishing",
  "cinnamon-soap-rush",
  "water-bottle-rocket",
];

test("sketched experiments: one marker per panel, in order, files exist, panel N walk-through starts 'Panel N'", () => {
  for (const id of SKETCHED) {
    const e = experimentSeeds.find((x) => x.id === id);
    assert.ok(e, id);
    const panels = e.knowThis?.panels ?? [];
    assert.ok(panels.length >= 2, id);
    const blocks = mechanismBlocks(e.knowThis?.mechanism, panels).filter((b) => b.panel);
    assert.equal(blocks.length, panels.length, id);
    blocks.forEach((b, i) => {
      assert.equal(b.panelNumber, i + 1, id);
      assert.match(b.paragraphs[0] ?? "", new RegExp(`^Panel ${i + 1}, `), id);
      assert.ok(b.panel?.alt && b.panel.alt.length > 40, `${id} alt`);
      assert.equal(b.panel?.width, 1200);
      assert.equal(b.panel?.height, 800);
      for (const url of [b.panel!.imageUrl, b.panel!.webpUrl!]) {
        assert.ok(existsSync(join(process.cwd(), "public", url)), `${id} missing ${url}`);
      }
    });
    // Arrow key sentence is part of every approved rewrite.
    assert.match(e.knowThis?.mechanism ?? "", /arrow/i, id);
  }
});

test("banned sections stay gone", () => {
  const raw = readFileSync(join(process.cwd(), "src/data/seed.ts"), "utf8");
  assert.equal(raw.includes("Does not prove"), false);
  assert.equal(raw.includes("Words at the table"), false);
  assert.equal(raw.includes("SAY THIS"), false);
  // Trap and Stretch sections retired 2026-09-28.
  assert.equal(/\btraps\??:/.test(raw), false);
  assert.equal(/\bstretch\??:/.test(raw), false);
  for (const e of experimentSeeds) {
    assert.equal("traps" in e, false, e.id);
    assert.equal("stretch" in e, false, e.id);
  }
});

test("approved rewrite bits", () => {
  const salt = experimentSeeds.find((e) => e.id === "salt-ice-fishing");
  assert.match(salt?.learningGoal ?? "", /copper carries the refreezing heat down/);
  assert.equal(
    salt?.runThis?.tracks?.find((t) => t.label === "LONG")?.blurb,
    "Copper wire + bottle weights. Squeeze + copper melt a path; ice freezes again behind. ~1–2 hours.",
  );
  const cinnamon = experimentSeeds.find((e) => e.id === "cinnamon-soap-rush");
  assert.equal(cinnamon?.learningGoal, "Soap can weaken the “skin” on water so floating powder suddenly rushes away.");
  const density = experimentSeeds.find((e) => e.id === "density-layers");
  assert.match(density?.learningGoal ?? "", /then the oil it dragged down floats back up\.$/);
  const rocket = experimentSeeds.find((e) => e.id === "water-bottle-rocket");
  assert.match(rocket?.safety ?? "", /^Carbonated-soda \(PET\) bottles only/);
  assert.match(rocket?.steps[3]?.detail ?? "", /It will launch\.$/);
  assert.match(rocket?.runThis?.overview ?? "", /or you reach ~60 psi and release/);
});
