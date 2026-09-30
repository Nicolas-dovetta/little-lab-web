import assert from "node:assert/strict";
import { test } from "node:test";
import { experimentSeeds } from "../data/seed";
import { AMAZON_ASSOCIATES_TAG } from "./amazon";
import { attachSeedMaterials, grabBagRow, materialsWithoutBuyLink } from "./grab-bag";

test("every grab-bag product shows a material beside its Amazon link", () => {
  const withProducts = experimentSeeds.filter((seed) => (seed.products ?? []).length > 0);
  assert.ok(withProducts.length >= 5);
  for (const seed of withProducts) {
    for (const product of seed.products ?? []) {
      const row = grabBagRow(product);
      assert.ok(row.material, `${seed.id} material`);
      const href = row.href;
      if (product.asin?.trim() || product.amazonUrl?.trim()) {
        assert.ok(href, `${seed.id} ${product.name} link`);
        const url = new URL(href);
        assert.equal(url.searchParams.get("tag"), AMAZON_ASSOCIATES_TAG);
        assert.equal(AMAZON_ASSOCIATES_TAG, "weekendexperi-20");
        assert.ok(row.linkLabel, `${seed.id} link label`);
        assert.notEqual(row.linkLabel?.toLowerCase(), row.material.toLowerCase());
      } else {
        assert.equal(href, null);
        assert.equal(row.linkLabel, null);
      }
    }
  }
});

test("volcano rows name the material next to the listing link", () => {
  const volcano = experimentSeeds.find((seed) => seed.id === "baking-soda-volcano");
  assert.ok(volcano);
  const soda = volcano.products?.find((product) => product.asin === "B000PYF8VM");
  assert.ok(soda);
  const row = grabBagRow(soda);
  assert.equal(row.material, "Baking soda");
  assert.equal(row.linkLabel, "Arm & Hammer Baking Soda, 1 lb");
  assert.match(row.href ?? "", /\/dp\/B000PYF8VM\?tag=weekendexperi-20$/);
  const kitchen = materialsWithoutBuyLink(volcano.materials, volcano.products ?? []);
  assert.deepEqual(kitchen, ["Dish soap (small squeeze)", "Spoon", "Towels"]);
});

test("buy-linked materials leave the plain list; kitchen pieces stay", () => {
  const rocket = experimentSeeds.find((seed) => seed.id === "water-bottle-rocket");
  assert.ok(rocket);
  const plain = materialsWithoutBuyLink(rocket.materials, rocket.products ?? []);
  assert.ok(plain.some((item) => /carbonated-soda/i.test(item)));
  assert.equal(
    plain.some((item) => /bike pump/i.test(item)),
    false,
  );
  assert.equal(
    plain.some((item) => /eye protection/i.test(item)),
    false,
  );
  const pump = grabBagRow(rocket.products!.find((product) => product.asin === "B072J8D6GR")!);
  assert.match(pump.material, /Bike pump with a pressure gauge/);
  assert.match(pump.linkLabel ?? "", /Schwinn/);
  const eyes = grabBagRow(
    rocket.products!.find((product) => /eye protection/i.test(product.name))!,
  );
  assert.match(eyes.material, /Eye protection/);
  assert.equal(eyes.href, null);
});

test("salt-ice wire keeps the material name and an Amazon link", () => {
  const salt = experimentSeeds.find((seed) => seed.id === "salt-ice-fishing");
  assert.ok(salt);
  const row = grabBagRow(salt.products![0]!);
  assert.equal(row.material, "Bare copper craft wire");
  assert.equal(row.linkLabel, "Amazon");
  assert.match(row.href ?? "", /\/dp\/B000H5OL30\?tag=weekendexperi-20$/);
});

test("linked materials are the same strings as the materials list", () => {
  for (const id of ["density-layers", "cornstarch-thickening-fluid", "water-bottle-rocket"]) {
    const seed = experimentSeeds.find((item) => item.id === id);
    assert.ok(seed);
    for (const product of seed.products ?? []) {
      assert.ok(product.material, `${id} ${product.name}`);
      assert.ok(
        seed.materials.includes(product.material),
        `${id} material not in list: ${product.material}`,
      );
    }
    const plain = materialsWithoutBuyLink(seed.materials, seed.products ?? []);
    for (const product of seed.products ?? []) {
      assert.equal(plain.includes(product.material!), false);
    }
  }
});

test("cinnamon has no grab-bag products to link", () => {
  const cinnamon = experimentSeeds.find((seed) => seed.id === "cinnamon-soap-rush");
  assert.ok(cinnamon);
  assert.equal((cinnamon.products ?? []).length, 0);
});

test("attachSeedMaterials fills a Neon row that has no material field", () => {
  const filled = attachSeedMaterials("baking-soda-volcano", [
    { name: "Arm & Hammer Baking Soda, 1 lb", asin: "B000PYF8VM", note: "from db" },
  ]);
  assert.equal(filled[0]?.material, "Baking soda");
  assert.equal(filled[0]?.note, "from db");
});
