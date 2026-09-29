import Link from "next/link";
import { canonicalMetadata } from "@/lib/site";
import { simForExperiment, simHref, simSlugs } from "@/lib/sims";

export const metadata = canonicalMetadata("/simulators", {
  title: "Simulators",
  description:
    "Interactive simulators for our kitchen experiments: baking-soda volcano, water-bottle rocket, salt ice fishing and density layers.",
});

export default function SimulatorsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Simulators</h1>
      <ul className="mt-6 space-y-3 text-lg">
        {simSlugs().map((slug) => (
          <li key={slug}>
            <Link
              href={simHref(slug)}
              className="font-semibold text-sage-800 underline-offset-2 hover:underline"
            >
              {simForExperiment(slug)!.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
