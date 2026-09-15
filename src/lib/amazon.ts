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
