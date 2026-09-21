import assert from "node:assert/strict";
import { test } from "node:test";
import { experimentSeeds } from "../data/seed";
import {
  kidVerdictProse,
  uniqueKitchenGallery,
  uniqueMoveSteps,
  usesPilotSpine,
} from "./experiments";

const VOLCANO_TRACKS = [
  "/images/experiments/baking-soda-volcano-soda.png",
  "/images/experiments/baking-soda-volcano-soap-color.png",
  "/images/experiments/baking-soda-volcano-vinegar.png",
];

test("usesPilotSpine is volcano-only", () => {
  assert.equal(usesPilotSpine("baking-soda-volcano"), true);
  assert.equal(usesPilotSpine("salt-ice-fishing"), false);
  assert.equal(usesPilotSpine("density-layers"), false);
});

test("uniqueMoveSteps pairs volcano steps to each track image once", () => {
  const volcano = experimentSeeds.find((e) => e.id === "baking-soda-volcano");
  assert.ok(volcano);
  const moves = uniqueMoveSteps(volcano.steps, volcano.runThis?.tracks);
  assert.equal(moves.length, 4);
  assert.deepEqual(
    moves.map((m) => m.imageUrl),
    [...VOLCANO_TRACKS, null],
  );
  const pictured = moves.map((m) => m.imageUrl).filter(Boolean);
  assert.equal(new Set(pictured).size, pictured.length);
  assert.ok(!pictured.includes(volcano.heroImageUrl));
});

test("uniqueMoveSteps does not reuse a track image", () => {
  const moves = uniqueMoveSteps(
    [
      { title: "A", detail: "a" },
      { title: "B", detail: "b" },
      { title: "C", detail: "c" },
    ],
    [
      { title: "A", imageUrl: "/one.png", blurb: "a" },
      { title: "B", imageUrl: "/one.png", blurb: "b" },
      { title: "C", imageUrl: "/two.png", blurb: "c" },
    ],
  );
  assert.deepEqual(
    moves.map((m) => m.imageUrl),
    ["/one.png", null, "/two.png"],
  );
});

test("kidVerdictProse prefers notes and does not invent text", () => {
  assert.equal(kidVerdictProse("  notes  ", "experience"), "notes");
  assert.equal(kidVerdictProse(" ", "  experience  "), "experience");
  assert.equal(kidVerdictProse("", ""), null);
});

test("uniqueKitchenGallery drops hero, RUN THIS tracks, blanks, and duplicates", () => {
  assert.deepEqual(
    uniqueKitchenGallery(
      [
        "  ",
        "/images/experiments/baking-soda-volcano-overflow.png",
        VOLCANO_TRACKS[0],
        VOLCANO_TRACKS[0],
        VOLCANO_TRACKS[1],
        "/images/experiments/only-in-gallery.png",
        VOLCANO_TRACKS[2],
        "/images/experiments/only-in-gallery.png",
      ],
      {
        heroImageUrl: "/images/experiments/baking-soda-volcano-overflow.png",
        trackImageUrls: VOLCANO_TRACKS,
      },
    ),
    ["/images/experiments/only-in-gallery.png"],
  );
});

test("baking-soda-volcano seed: empty gallery, unique step pics, notes prose", () => {
  const volcano = experimentSeeds.find((e) => e.id === "baking-soda-volcano");
  assert.ok(volcano);
  assert.deepEqual(volcano.gallery, []);
  assert.equal(volcano.heroImageUrl, "/images/experiments/baking-soda-volcano-overflow.png");
  assert.match(volcano.notesFromHome, /3yo asked to do more volcanos/);
  assert.doesNotMatch(volcano.notesFromHome, /!\[[^\]]*]\([^)]+\)|<img\b|\.png|\.jpg|\.webp/i);
  const trackUrls = volcano.runThis?.tracks?.map((track) => track.imageUrl) ?? [];
  assert.deepEqual(trackUrls, VOLCANO_TRACKS);
});
