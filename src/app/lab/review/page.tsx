import type { Metadata } from "next";
import { CandleReviewSim } from "@/components/review/CandleReviewSim";
import { WalkingWaterReviewSim } from "@/components/review/WalkingWaterReviewSim";
import { MechanismWalkthrough } from "@/components/MechanismWalkthrough";
import { reviewItems, type ReviewItem } from "@/lib/review/content";

export const metadata: Metadata = {
  title: "Review",
  robots: { index: false, follow: false },
};

/**
 * Unlisted review for two vote options. Not in the header, footer, sitemap,
 * or the public sim list. Crawlers are pointed away in robots.ts.
 */
export default function ReviewPage() {
  return (
    <div className="pb-16">
      <div className="border-b border-sage-200/60 bg-gradient-to-b from-sage-50 to-cream">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-sm font-medium text-sage-700">Private review</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Two vote options</h1>
          <p className="mt-3 max-w-3xl text-lg text-ink-muted">
            Candle and walking water, for a look before anything is published. This page is not in the
            menu, not on the experiments list, and not on the simulators page.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:px-6">
        {reviewItems.map((item) => (
          <ReviewBlock key={item.voteId} item={item} />
        ))}
      </div>
    </div>
  );
}

function ReviewBlock({ item }: { item: ReviewItem }) {
  return (
    <article id={item.voteId} className="scroll-mt-28 space-y-6">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-sage-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            Vote · {item.voteId}
          </span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">
            Content · {item.contentId}
          </span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">Not published</span>
        </div>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink">{item.title}</h2>
        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-sage-800">Challenge</p>
        <p className="mt-1 max-w-3xl text-lg text-ink-muted">{item.challenge}</p>
      </div>

      <section
        aria-labelledby={`${item.voteId}-try`}
        className="overflow-hidden rounded-3xl border border-sage-200/80 bg-sage-50/80 shadow-sm"
      >
        <div className="p-5 sm:p-6">
          <h3 id={`${item.voteId}-try`} className="font-display text-2xl font-semibold text-ink">
            {item.simTitle}
          </h3>
          <p className="mt-2 text-sm text-ink-muted">{item.simBlurb}</p>
        </div>
        <div className="border-t border-sage-200 bg-cream">
          {item.voteId === "candle" ? <CandleReviewSim /> : <WalkingWaterReviewSim />}
        </div>
      </section>

      <section className="rounded-3xl border-2 border-sage-300 bg-sage-50/80 p-5 shadow-sm sm:p-6">
        <h3 className="font-display text-xl font-semibold text-ink">Bear with me</h3>
        <div className="mt-4 space-y-4">
          {item.knowThis.mechanism && (
            <div>
              <h4 className="text-sm font-semibold text-ink">Mechanism</h4>
              <MechanismWalkthrough knowThis={item.knowThis} />
            </div>
          )}
          {item.knowThis.numbersNote && (
            <div>
              <h4 className="text-sm font-semibold text-ink">Numbers</h4>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">{item.knowThis.numbersNote}</p>
            </div>
          )}
          {item.knowThis.goDeeper && (
            <div>
              <h4 className="text-sm font-semibold text-ink">Go deeper</h4>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">{item.knowThis.goDeeper}</p>
            </div>
          )}
          {item.knowThis.nameForThis && (
            <div>
              <h4 className="text-sm font-semibold text-ink">Name for this</h4>
              <p className="mt-1 text-sm text-ink-muted">{item.knowThis.nameForThis}</p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
