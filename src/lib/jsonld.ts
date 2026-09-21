import type { ExperimentProduct, RunThis } from "@/db/schema";
import { uniqueMoveSteps } from "@/lib/experiments";
import { absoluteAssetUrl, absoluteUrl, DEFAULT_SOCIAL_IMAGE, SITE_ORIGIN } from "@/lib/site";

/** Fields HowTo needs. Both DB rows and in-repo seeds satisfy this. */
export type HowToSource = {
  id: string;
  title: string;
  learningGoal: string;
  heroImageUrl?: string | null;
  materials?: readonly string[] | null;
  products?: readonly Pick<ExperimentProduct, "name">[] | null;
  steps?: readonly { title: string; detail: string }[] | null;
  runThis?: RunThis | null;
};

export type HowToSupplyLd = {
  "@type": "HowToSupply";
  name: string;
};

export type HowToStepLd = {
  "@type": "HowToStep";
  position: number;
  name: string;
  text: string;
  image?: string;
};

export type HowToLd = {
  "@context": "https://schema.org";
  "@type": "HowTo";
  name: string;
  description: string;
  url: string;
  image: string;
  supply: HowToSupplyLd[];
  step: HowToStepLd[];
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Weekend Experiments",
  url: SITE_ORIGIN,
  description: "Parent-tested kitchen science experiments for ages 1–5.",
  publisher: {
    "@type": "Person",
    name: "Nicolas Dovetta",
    url: `${SITE_ORIGIN}/about`,
  },
} as const;

/** JSON-LD safe to embed in a script tag (escapes `<` so markup cannot break out). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function supplyNames(experiment: HowToSource): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string | null | undefined) => {
    const name = raw?.trim() ?? "";
    if (!name) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    names.push(name);
  };

  for (const material of experiment.materials ?? []) push(material);
  for (const product of experiment.products ?? []) push(product.name);
  return names;
}

/**
 * HowTo from the same fields the page renders:
 * Grab bag (materials + named products), The moves / RUN THIS (steps, else tracks).
 */
export function howToJsonLd(experiment: HowToSource): HowToLd {
  const runThis = experiment.runThis ?? {};
  const moves = uniqueMoveSteps(experiment.steps, runThis.tracks);
  const imageSrc = experiment.heroImageUrl?.trim() || DEFAULT_SOCIAL_IMAGE;

  const fromMoves: HowToStepLd[] = [];
  for (const move of moves) {
    const name = move.title.trim();
    const text = move.detail.trim() || name;
    if (!name && !text) continue;
    const step: HowToStepLd = {
      "@type": "HowToStep",
      position: fromMoves.length + 1,
      name: name || `Step ${fromMoves.length + 1}`,
      text,
    };
    if (move.imageUrl) step.image = absoluteAssetUrl(move.imageUrl);
    fromMoves.push(step);
  }

  const fallbackText =
    runThis.overview?.trim() ||
    runThis.setup?.trim() ||
    experiment.learningGoal.trim() ||
    experiment.title.trim();

  const step: HowToStepLd[] =
    fromMoves.length > 0
      ? fromMoves
      : [
          {
            "@type": "HowToStep",
            position: 1,
            name: experiment.title.trim() || "Run it",
            text: fallbackText,
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: experiment.title,
    description: experiment.learningGoal.trim() || experiment.title,
    url: absoluteUrl(`/experiments/${experiment.id}`),
    image: absoluteAssetUrl(imageSrc),
    supply: supplyNames(experiment).map((name) => ({
      "@type": "HowToSupply",
      name,
    })),
    step,
  };
}
