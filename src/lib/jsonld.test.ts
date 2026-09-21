import assert from "node:assert/strict";
import { test } from "node:test";
import { experimentSeeds } from "../data/seed";
import { SITE_ORIGIN } from "./site";
import { howToJsonLd, serializeJsonLd, websiteJsonLd } from "./jsonld";

test("website JSON-LD is a WebSite published by Nicolas Dovetta", () => {
  assert.equal(websiteJsonLd["@context"], "https://schema.org");
  assert.equal(websiteJsonLd["@type"], "WebSite");
  assert.equal(websiteJsonLd.name, "Weekend Experiments");
  assert.equal(websiteJsonLd.url, SITE_ORIGIN);
  assert.equal(websiteJsonLd.publisher["@type"], "Person");
  assert.equal(websiteJsonLd.publisher.name, "Nicolas Dovetta");
  assert.equal(websiteJsonLd.publisher.url, `${SITE_ORIGIN}/about`);
});

test("serializeJsonLd escapes < so a script tag cannot break out", () => {
  const serialized = serializeJsonLd({ text: "</script><script>alert(1)" });
  assert.equal(serialized.includes("<"), false);
  assert.equal(JSON.parse(serialized).text, "</script><script>alert(1)");
});

test("every live seed experiment emits HowTo name, description, url, image, supply, and steps", () => {
  assert.ok(experimentSeeds.length > 0);
  for (const seed of experimentSeeds) {
    const data = howToJsonLd(seed);
    assert.equal(data["@type"], "HowTo");
    assert.equal(data.name, seed.title);
    assert.equal(data.description, seed.learningGoal);
    assert.equal(data.url, `${SITE_ORIGIN}/experiments/${seed.id}`);
    assert.match(data.image, /^https:\/\/www\.weekend-experiments\.app\//);
    assert.ok(data.supply.length > 0, `${seed.id} supply`);
    assert.ok(data.step.length > 0, `${seed.id} steps`);
    for (const [index, step] of data.step.entries()) {
      assert.equal(step["@type"], "HowToStep");
      assert.equal(step.position, index + 1);
      assert.ok(step.name);
      assert.ok(step.text);
      if (step.image) {
        assert.match(step.image, /^https:\/\/www\.weekend-experiments\.app\//);
      }
    }
  }
});

test("volcano HowTo uses grab-bag supplies and The moves, including track images", () => {
  const volcano = experimentSeeds.find((e) => e.id === "baking-soda-volcano");
  assert.ok(volcano);
  const data = howToJsonLd(volcano);
  assert.equal(
    data.image,
    `${SITE_ORIGIN}/images/experiments/baking-soda-volcano-overflow.png`,
  );
  const supply = data.supply.map((item) => item.name);
  assert.ok(supply.includes("Dish soap (small squeeze)"));
  assert.ok(supply.includes("Arm & Hammer Baking Soda, 1 lb"));
  assert.equal(data.step.length, 4);
  assert.equal(data.step[0]?.name, "Glass + baking soda");
  assert.match(data.step[0]?.text ?? "", /baking soda/i);
  assert.equal(
    data.step[0]?.image,
    `${SITE_ORIGIN}/images/experiments/baking-soda-volcano-soda.png`,
  );
  assert.equal(data.step[3]?.image, undefined);
});

test("HowTo without a hero image uses the site default asset", () => {
  const data = howToJsonLd({
    id: "example",
    title: "Example",
    learningGoal: "A short why.",
    heroImageUrl: "  ",
    materials: ["Water"],
    steps: [{ title: "Pour", detail: "Pour the water." }],
  });
  assert.equal(data.image, `${SITE_ORIGIN}/images/experiments/density-layers-glasses.png`);
  assert.deepEqual(data.supply, [{ "@type": "HowToSupply", name: "Water" }]);
  assert.equal(data.step[0]?.text, "Pour the water.");
});
