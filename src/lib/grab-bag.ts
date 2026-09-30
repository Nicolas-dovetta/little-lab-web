import type { ExperimentProduct } from "@/db/schema";
import { experimentSeeds } from "@/data/seed";
import { amazonProductHref } from "@/lib/amazon";

export type GrabBagRow = {
  material: string;
  /** Tagged Amazon URL, or null when this product has no ASIN or amazonUrl. */
  href: string | null;
  /** Visible link text beside the material. Null when there is no buy link. */
  linkLabel: string | null;
};

/**
 * One Grab bag row: the material name, and the Amazon link beside it.
 * When the listing title is the material, the link reads "Amazon" so the
 * name is not repeated as the only text on the anchor.
 */
export function grabBagRow(product: ExperimentProduct): GrabBagRow {
  const material = (product.material?.trim() || product.name).trim();
  const href = amazonProductHref(product);
  const listing = product.name.trim();
  const linkLabel = !href
    ? null
    : listing.toLowerCase() === material.toLowerCase()
      ? "Amazon"
      : listing;
  return { material, href, linkLabel };
}

/**
 * Fill a missing `material` from seed, matched by ASIN then by listing name.
 * Neon rows that predate the field still show the kitchen name beside the link.
 */
export function attachSeedMaterials(
  experimentId: string,
  products: readonly ExperimentProduct[],
): ExperimentProduct[] {
  const seedProducts = experimentSeeds.find((seed) => seed.id === experimentId)?.products ?? [];
  return products.map((product) => {
    if (product.material?.trim()) return product;
    const asin = product.asin?.trim();
    const name = product.name.trim().toLowerCase();
    const match = seedProducts.find((seed) => {
      const seedAsin = seed.asin?.trim();
      if (asin && seedAsin && asin === seedAsin) return true;
      return seed.name.trim().toLowerCase() === name;
    });
    const material = match?.material?.trim();
    return material ? { ...product, material } : product;
  });
}

/**
 * Materials already shown on a product row. The plain list keeps kitchen
 * pieces that have no buy link.
 */
export function materialsWithoutBuyLink(
  materials: readonly string[],
  products: readonly ExperimentProduct[],
): string[] {
  const paired = new Set(
    products
      .map((product) => product.material?.trim().toLowerCase())
      .filter((name): name is string => Boolean(name)),
  );
  return materials.filter((item) => !paired.has(item.trim().toLowerCase()));
}
