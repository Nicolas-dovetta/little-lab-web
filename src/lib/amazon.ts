/** Amazon Associates tracking tag for Weekend Experiments. */
export const AMAZON_ASSOCIATES_TAG =
  process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG ??
  process.env.AMAZON_ASSOCIATES_TAG ??
  "weekendexperi-20";

export const AMAZON_ASSOCIATES_DISCLOSURE =
  "As an Amazon Associate I earn from qualifying purchases.";

export type AmazonProductLink = {
  asin?: string;
  amazonUrl?: string;
};

function taggedAmazonDpUrl(asin: string): string {
  const url = new URL(`https://www.amazon.com/dp/${asin}`);
  url.searchParams.set("tag", AMAZON_ASSOCIATES_TAG);
  return url.toString();
}

/**
 * Unique, non-empty ASINs in first-seen order.
 */
export function uniqueProductAsins(products: Iterable<AmazonProductLink>): string[] {
  const asins: string[] = [];
  const seen = new Set<string>();
  for (const product of products) {
    const asin = product.asin?.trim();
    if (!asin || seen.has(asin)) continue;
    seen.add(asin);
    asins.push(asin);
  }
  return asins;
}

/**
 * Amazon multi-item add-to-cart URL for products that have ASINs.
 * Quantity is always 1. Returns null when fewer than two unique ASINs
 * (a "pack" link is only useful for two or more items).
 */
export function amazonPackCartHref(products: Iterable<AmazonProductLink>): string | null {
  const asins = uniqueProductAsins(products);
  if (asins.length < 2) return null;

  const url = new URL("https://www.amazon.com/gp/aws/cart/add.html");
  url.searchParams.set("AssociateTag", AMAZON_ASSOCIATES_TAG);
  asins.forEach((asin, index) => {
    const n = index + 1;
    url.searchParams.set(`ASIN.${n}`, asin);
    url.searchParams.set(`Quantity.${n}`, "1");
  });
  return url.toString();
}

/**
 * Build an Amazon product URL with the Weekend Experiments Associates tag.
 * Prefers ASIN (`/dp/{ASIN}?tag=…`). Otherwise normalizes a pasted Amazon URL
 * by setting/replacing `tag` and keeping other query params.
 */
export function amazonProductHref(product: AmazonProductLink): string | null {
  const asin = product.asin?.trim();
  if (asin) {
    return taggedAmazonDpUrl(asin);
  }

  const raw = product.amazonUrl?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.searchParams.set("tag", AMAZON_ASSOCIATES_TAG);
    return url.toString();
  } catch {
    return null;
  }
}
