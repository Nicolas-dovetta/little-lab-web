import type { Metadata } from "next";

/** Preferred public origin. Apex and http should redirect here. */
export const SITE_ORIGIN = "https://www.weekend-experiments.app";

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

/**
 * Page-level canonical + matching Open Graph URL on the www origin.
 * Query strings are never included — pass the clean path only.
 */
export function canonicalMetadata(
  path: string,
  extras?: { title?: string; description?: string },
): Metadata {
  const canonical = absoluteUrl(path);
  return {
    ...(extras?.title !== undefined ? { title: extras.title } : {}),
    ...(extras?.description !== undefined ? { description: extras.description } : {}),
    alternates: { canonical },
    openGraph: {
      url: canonical,
      ...(extras?.title !== undefined ? { title: extras.title } : {}),
      ...(extras?.description !== undefined ? { description: extras.description } : {}),
    },
  };
}
