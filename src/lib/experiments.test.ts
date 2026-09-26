import assert from "node:assert/strict";
import { test } from "node:test";
import { experimentSeeds } from "../data/seed";
import {
  isDoneStatus,
  kidVerdictProse,
  matchesStatusFilter,
  plannedChipLabel,
  uniqueKitchenGallery,
  uniqueMoveSteps,
  usesPilotSpine,
  withoutDuplicateGalleryPhotos,
} from "./experiments";
import type { Experiment } from "../db/schema";

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

test("planned chip uses the Saturday date when plannedFor is set", () => {
  assert.equal(plannedChipLabel("2026-09-26"), "Planned · Sat Sep 26");
  assert.equal(plannedChipLabel("2026-10-03"), "Planned · Sat Oct 3");
  assert.equal(plannedChipLabel(null), "Planned");
  assert.equal(plannedChipLabel(""), "Planned");
});

test("Done filter groups winner and tested; Planned is status planned only", () => {
  assert.equal(isDoneStatus("winner"), true);
  assert.equal(isDoneStatus("tested"), true);
  assert.equal(isDoneStatus("planned"), false);
  assert.equal(matchesStatusFilter("winner", "done"), true);
  assert.equal(matchesStatusFilter("tested", "done"), true);
  assert.equal(matchesStatusFilter("planned", "done"), false);
  assert.equal(matchesStatusFilter("draft", "done"), false);
  assert.equal(matchesStatusFilter("planned", "planned"), true);
  assert.equal(matchesStatusFilter("winner", "planned"), false);
  assert.equal(matchesStatusFilter("tested", undefined), true);
});

test("cornstarch is a winner from 2026-09-26 with Nicolas's home note", () => {
  const cornstarch = experimentSeeds.find((e) => e.id === "cornstarch-thickening-fluid");
  assert.ok(cornstarch);
  assert.equal(cornstarch.status, "winner");
  assert.equal(cornstarch.ranOn, "2026-09-26");
  assert.equal(cornstarch.plannedFor ?? null, null);
  assert.equal(
    cornstarch.notesFromHome,
    "The maïzena was great; very messy very easy to clean. Proportions can be approx — don’t be scared to put too much corn so it becomes a real solid-ish liquid. Play with your kids it is fun.\n\nFrom the clip: 3yo on the learning tower at the counter with a wooden stick; 1yo in the high chair with a small cup and stick — both shirtless. Stainless bowls; white mix pools flat in the bowl, splatters hold as thick blobs on the granite. Counter and the 3yo’s arms and tummy thoroughly coated.",
  );
  assert.match(cornstarch.runThis?.overview ?? "", /don’t be scared to put too much cornstarch/);
  assert.match(cornstarch.steps[0]?.detail ?? "", /Learning tower/);
  assert.match(cornstarch.steps[0]?.detail ?? "", /high chair/);
  assert.match(cornstarch.steps[1]?.detail ?? "", /Err toward more cornstarch/);
  assert.match(cornstarch.steps[2]?.detail ?? "", /splatters on the counter hold as thick blobs/);
  assert.match(cornstarch.steps[3]?.detail ?? "", /Shirtless helps/);
  assert.ok(cornstarch.materials.some((m) => /wooden sticks/i.test(m)));
  assert.ok(cornstarch.materials.some((m) => /learning tower/i.test(m)));
  assert.match(cornstarch.knowThis?.mechanism ?? "", /force chains and hydroclusters/);
  assert.match(cornstarch.knowThis?.mechanism ?? "", /shear-thickening/);
  assert.match(cornstarch.knowThis?.mechanism ?? "", /shear-thinning/);
  assert.match(cornstarch.knowThis?.mechanism ?? "", /volume fraction/);
  assert.equal(cornstarch.heroImageUrl, "/images/experiments/cornstarch-thickening-fluid-hero.png");
  assert.deepEqual(cornstarch.sayThis, {
    age12: ["[I will fill this after Saturday]"],
    age35: ["[I will fill this after Saturday]"],
  });
  assert.equal(cornstarch.products, undefined);
});

test("water-bottle-rocket is planned for 2026-10-03 with little-lab materials", () => {
  const rocket = experimentSeeds.find((e) => e.id === "water-bottle-rocket");
  assert.ok(rocket);
  assert.equal(rocket.status, "planned");
  assert.equal(rocket.plannedFor, "2026-10-03");
  assert.equal(rocket.ranOn ?? null, null);
  assert.equal(rocket.location, "outdoor");
  assert.ok(rocket.materials.some((m) => /soda bottle/i.test(m)));
  assert.ok(rocket.materials.some((m) => /Bike pump/i.test(m)));
  assert.match(rocket.notesFromHome, /I will fill this after Saturday/);
  assert.equal(rocket.products, undefined);
});

test("main-shaped volcano gallery (same three paths as tracks) sanitizes to empty", () => {
  const cleaned = withoutDuplicateGalleryPhotos({
    id: "baking-soda-volcano",
    heroImageUrl: "/images/experiments/baking-soda-volcano-overflow.png",
    gallery: [...VOLCANO_TRACKS],
    runThis: {
      tracks: VOLCANO_TRACKS.map((imageUrl, i) => ({
        label: ["SODA", "SOAP", "VINEGAR"][i],
        title: "step",
        imageUrl,
        blurb: "x",
      })),
    },
  } as Experiment);
  assert.deepEqual(cleaned.gallery, []);
});
