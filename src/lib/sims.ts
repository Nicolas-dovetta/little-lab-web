/**
 * Interactive sims embedded on experiment pages, keyed by experiment slug.
 * Code-side on purpose: adding a sim needs no DB change.
 *
 * The sim itself is a self-contained static file (no network requests) copied
 * from little-lab-mechanics by `scripts/sync-sims.mjs`, which also adds a
 * noindex meta and a tiny script that posts the sim's height to this page.
 */
export type SimEmbed = {
  /** Static file under public/. */
  src: string;
  /** Heading of the Try it box. */
  title: string;
  /** One plain sentence under the heading. */
  blurb: string;
  /** Accessible name of the iframe. */
  iframeTitle: string;
  /** Iframe height (px) until the sim reports its own; fits the sim (after Pour) at 390 and 1280. */
  fallbackHeight: number;
};

/** postMessage type sent by the script scripts/sync-sims.mjs adds to each sim. */
export const SIM_HEIGHT_MESSAGE = "little-lab-sim-height";

const SIMS: Record<string, SimEmbed> = {
  "baking-soda-volcano": {
    src: "/sims/baking-soda-volcano/index.html",
    title: "Try it: which runs out first?",
    blurb: "Pick how much baking soda and vinegar go in, pour, and see which one runs out first.",
    iframeTitle: "Baking-soda volcano sim: which runs out first, the baking soda or the vinegar?",
    fallbackHeight: 2000,
  },
};

export function simForExperiment(slug: string): SimEmbed | null {
  return SIMS[slug] ?? null;
}

export function simSlugs(): string[] {
  return Object.keys(SIMS);
}

/** Clamp a height reported by a sim to something sane (px), or null if invalid. */
export function sanitizeSimHeight(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  return Math.min(Math.max(Math.ceil(value), 300), 8000);
}
