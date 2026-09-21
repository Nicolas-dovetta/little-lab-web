import type { Metadata } from "next";

/** Preferred public origin. Apex and http should redirect here. */
export const SITE_ORIGIN = "https://www.weekend-experiments.app";

/**
 * Existing public asset for home / experiments-index (and experiment pages
 * with no hero). Density Layers is the featured winner photo on the site.
 */
export const DEFAULT_SOCIAL_IMAGE = "/images/experiments/density-layers-glasses.png";

/** Path without a trailing slash (`/` stays `/`). */
export function canonicalPath(path: string = "/"): string {
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  if (withSlash === "/") return "/";
  return withSlash.replace(/\/+$/, "");
}

export function absoluteUrl(path: string = "/"): string {
  const p = canonicalPath(path);
  return p === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${p}`;
}

/** Relative public path or already-absolute https URL → www https URL. */
export function absoluteAssetUrl(src: string): string {
  const trimmed = src.trim();
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  return absoluteUrl(trimmed);
}

export type SocialImageInput = string | null | undefined;

export type CanonicalMetadataExtras = {
  title?: string;
  description?: string;
  /** Relative public path or absolute https URL. Null / blank is skipped. */
  image?: SocialImageInput;
  images?: SocialImageInput[];
};

function resolveSocialImageUrls(extras?: CanonicalMetadataExtras): string[] {
  const candidates = [extras?.image, ...(extras?.images ?? [])];
  const urls: string[] = [];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const trimmed = candidate.trim();
    if (!trimmed) continue;
    const url = absoluteAssetUrl(trimmed);
    if (!urls.includes(url)) urls.push(url);
  }
  return urls;
}

function socialImagesMetadata(urls: string[]): Pick<Metadata, "openGraph" | "twitter"> {
  const images = urls.map((url) => ({ url }));
  return {
    openGraph: { images },
    twitter: {
      card: "summary_large_image",
      images,
    },
  };
}

/**
 * Page-level canonical + matching Open Graph URL on the www origin.
 * Query strings are never included — pass the clean path only.
 * Optional `image` / `images` become absolute https `og:image` + `twitter:image`.
 */
export function canonicalMetadata(
  path: string,
  extras?: CanonicalMetadataExtras,
): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrls = resolveSocialImageUrls(extras);
  // Child openGraph replaces parent images, so always emit an image here.
  // Never invent a path — only DEFAULT_SOCIAL_IMAGE or caller-supplied URLs.
  const social = socialImagesMetadata(
    imageUrls.length > 0 ? imageUrls : [absoluteAssetUrl(DEFAULT_SOCIAL_IMAGE)],
  );
  return {
    ...(extras?.title !== undefined ? { title: extras.title } : {}),
    ...(extras?.description !== undefined ? { description: extras.description } : {}),
    alternates: { canonical },
    openGraph: {
      url: canonical,
      ...(extras?.title !== undefined ? { title: extras.title } : {}),
      ...(extras?.description !== undefined ? { description: extras.description } : {}),
      ...social.openGraph,
    },
    twitter: social.twitter,
  };
}
