import Image from "next/image";
import Link from "next/link";
import { ExperimentCard } from "@/components/ExperimentCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getFeaturedExperiment, listExperiments, messLabel, statusLabel } from "@/lib/experiments";

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedExperiment(), listExperiments()]);
  const more = all.filter((e) => e.id !== featured?.id).slice(0, 3);

  return (
    <div>
      <section className="border-b border-sage-200/60 bg-gradient-to-b from-sage-50 to-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-sage-700">
            Ages 1–5 · Parent-tested
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Weekend Experiments
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted">
            Activities we ran at home with a toddler and a preschooler — the ones they loved that
            also show something real about how the world works.
          </p>
          <Link
            href="/experiments"
            className="mt-8 inline-flex rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-700"
          >
            Browse experiments
          </Link>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Try this one</h2>
          <Link
            href={`/experiments/${featured.id}`}
            className="mt-5 grid gap-6 overflow-hidden rounded-3xl border border-sage-200/80 bg-white shadow-sm transition hover:border-sage-300 lg:grid-cols-5"
          >
            {featured.heroImageUrl && (
              <div className="relative aspect-[16/10] lg:col-span-3 lg:aspect-auto lg:min-h-[280px]">
                <Image
                  src={featured.heroImageUrl}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            )}
            <div className="flex flex-col justify-center p-6 lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800">
                  {statusLabel(featured.status)}
                </span>
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-ink-muted">
                  {featured.timeMinutes} min · {messLabel(featured.messLevel)}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{featured.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{featured.experience}</p>
              <span className="mt-5 text-sm font-semibold text-sage-700">Open guide →</span>
            </div>
          </Link>
        </section>
      )}

      <section className="border-y border-sage-200/60 bg-sage-50/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold">More to try</h2>
            <Link href="/experiments" className="text-sm font-semibold text-sage-700">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((e) => (
              <ExperimentCard key={e.id} experiment={e} />
            ))}
          </div>
        </div>
      </section>

      <section id="stay-in-touch" className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Mailing list</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Occasional notes when we add experiments or when kits become available. No spam.
        </p>
        <div className="mt-6 rounded-3xl border border-sage-200/80 bg-white p-6 shadow-sm">
          <NewsletterForm source="home" />
        </div>
      </section>
    </div>
  );
}
