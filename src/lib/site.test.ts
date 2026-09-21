import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_ORIGIN,
  absoluteAssetUrl,
  canonicalMetadata,
} from "./site";

test("absoluteAssetUrl prefixes relative public paths with the www origin", () => {
  assert.equal(
    absoluteAssetUrl("/images/experiments/baking-soda-volcano-overflow.png"),
    `${SITE_ORIGIN}/images/experiments/baking-soda-volcano-overflow.png`,
  );
  assert.equal(
    absoluteAssetUrl(DEFAULT_SOCIAL_IMAGE),
    `${SITE_ORIGIN}/images/experiments/density-layers-glasses.png`,
  );
});

test("absoluteAssetUrl keeps an already-absolute https URL", () => {
  const url = `${SITE_ORIGIN}/images/experiments/baking-soda-volcano-overflow.png`;
  assert.equal(absoluteAssetUrl(url), url);
});

test("canonicalMetadata without image keeps canonical / og url and omits social images", () => {
  const meta = canonicalMetadata("/experiments/baking-soda-volcano", {
    title: "Baking-soda volcano",
    description: "Vinegar and baking soda make a gas.",
  });
  assert.equal(
    meta.alternates?.canonical,
    `${SITE_ORIGIN}/experiments/baking-soda-volcano`,
  );
  assert.equal(
    meta.openGraph && "url" in meta.openGraph ? meta.openGraph.url : undefined,
    `${SITE_ORIGIN}/experiments/baking-soda-volcano`,
  );
  assert.equal(meta.openGraph && "images" in meta.openGraph ? meta.openGraph.images : undefined, undefined);
  assert.equal(meta.twitter, undefined);
});

test("canonicalMetadata image becomes absolute og + twitter images and large card", () => {
  const meta = canonicalMetadata("/experiments/baking-soda-volcano", {
    title: "Baking-soda volcano",
    description: "Vinegar and baking soda make a gas.",
    image: "/images/experiments/baking-soda-volcano-overflow.png",
  });
  const expected = `${SITE_ORIGIN}/images/experiments/baking-soda-volcano-overflow.png`;
  assert.deepEqual(meta.openGraph?.images, [{ url: expected }]);
  assert.equal(meta.twitter && "card" in meta.twitter ? meta.twitter.card : undefined, "summary_large_image");
  assert.deepEqual(meta.twitter && "images" in meta.twitter ? meta.twitter.images : undefined, [
    { url: expected },
  ]);
});

test("canonicalMetadata skips null / blank images and never invents a path", () => {
  const skipped = canonicalMetadata("/experiments/example", {
    image: null,
    images: ["", "   ", null, undefined],
  });
  assert.equal(skipped.openGraph && "images" in skipped.openGraph ? skipped.openGraph.images : undefined, undefined);
  assert.equal(skipped.twitter, undefined);
});
