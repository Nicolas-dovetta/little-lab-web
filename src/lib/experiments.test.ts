import assert from "node:assert/strict";
import { test } from "node:test";
import { experimentSeeds } from "../data/seed";
import { uniqueKitchenGallery } from "./experiments";

const VOLCANO_TRACKS = [
  "/images/experiments/baking-soda-volcano-soda.png",
  "/images/experiments/baking-soda-volcano-soap-color.png",
  "/images/experiments/baking-soda-volcano-vinegar.png",
];

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

test("volcano-shaped gallery that copies RUN THIS tracks is empty leftover", () => {
  assert.deepEqual(
    uniqueKitchenGallery(VOLCANO_TRACKS, {
      heroImageUrl: "/images/experiments/baking-soda-volcano-overflow.png",
      trackImageUrls: VOLCANO_TRACKS,
    }),
    [],
  );
});

test("seed kitchen galleries do not repeat hero or RUN THIS track images", () => {
  for (const seed of experimentSeeds) {
    const leftover = uniqueKitchenGallery(seed.gallery, {
      heroImageUrl: seed.heroImageUrl,
      trackImageUrls: seed.runThis?.tracks?.map((track) => track.imageUrl),
    });
    assert.deepEqual(
      leftover,
      seed.gallery.filter(Boolean),
      `${seed.id} gallery should only list photos not already on hero/tracks`,
    );
  }
});

test("baking-soda-volcano seed: notes are prose, gallery empty, tracks unique once", () => {
  const volcano = experimentSeeds.find((e) => e.id === "baking-soda-volcano");
  assert.ok(volcano);
  assert.deepEqual(volcano.gallery, []);
  assert.equal(volcano.heroImageUrl, "/images/experiments/baking-soda-volcano-overflow.png");
  assert.match(volcano.notesFromHome, /3yo asked to do more volcanos/);
  assert.doesNotMatch(volcano.notesFromHome, /!\[[^\]]*]\([^)]+\)|<img\b|\.png|\.jpg|\.webp/i);
  const trackUrls = volcano.runThis?.tracks?.map((track) => track.imageUrl) ?? [];
  assert.deepEqual(trackUrls, VOLCANO_TRACKS);
  assert.equal(new Set(trackUrls).size, trackUrls.length);
});
