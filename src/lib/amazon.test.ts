import assert from "node:assert/strict";
import { test } from "node:test";
import { AMAZON_ASSOCIATES_TAG, amazonPackCartHref, uniqueProductAsins } from "./amazon";

test("uniqueProductAsins skips blanks and keeps first-seen order", () => {
  assert.deepEqual(uniqueProductAsins([]), []);
  assert.deepEqual(
    uniqueProductAsins([
      { asin: "  " },
      { asin: "B000PYF8VM" },
      { amazonUrl: "https://www.amazon.com/dp/B000RO08L0" },
      { asin: " B000RO08L0 " },
      { asin: "B000PYF8VM" },
    ]),
    ["B000PYF8VM", "B000RO08L0"],
  );
});

test("amazonPackCartHref is null when fewer than two unique ASINs", () => {
  assert.equal(amazonPackCartHref([]), null);
  assert.equal(amazonPackCartHref([{ asin: "B000PYF8VM" }]), null);
  assert.equal(amazonPackCartHref([{ asin: "" }, { asin: "B000PYF8VM" }]), null);
  assert.equal(
    amazonPackCartHref([{ asin: "B000PYF8VM" }, { asin: "B000PYF8VM" }]),
    null,
  );
});

test("amazonPackCartHref builds AssociateTag + ASIN.n + Quantity.n=1", () => {
  const href = amazonPackCartHref([
    { asin: "B000PYF8VM" },
    { asin: "B000RO08L0" },
    { asin: "B07G2Z6CLG" },
    { asin: "B000PYF8VM" },
  ]);
  assert.ok(href);
  const url = new URL(href);
  assert.equal(url.origin, "https://www.amazon.com");
  assert.equal(url.pathname, "/gp/aws/cart/add.html");
  assert.equal(url.searchParams.get("AssociateTag"), AMAZON_ASSOCIATES_TAG);
  assert.equal(url.searchParams.get("ASIN.1"), "B000PYF8VM");
  assert.equal(url.searchParams.get("Quantity.1"), "1");
  assert.equal(url.searchParams.get("ASIN.2"), "B000RO08L0");
  assert.equal(url.searchParams.get("Quantity.2"), "1");
  assert.equal(url.searchParams.get("ASIN.3"), "B07G2Z6CLG");
  assert.equal(url.searchParams.get("Quantity.3"), "1");
  assert.equal(url.searchParams.get("ASIN.4"), null);
});
