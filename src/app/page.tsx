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
      <section className="relative overflow-hidden border-b border-sage-200/60 bg-gradient-to-b from-sage-50 to-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sage-700">
              Ages 1–5 · Free forever ideas
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Weekend Experiments
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-muted">
              Warm, practical experiment ideas for parents — curated from real home runs with a
              toddler and a preschooler. Winners only. Kits later; ideas stay free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/experiments"
                className="rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-700"
              >
                Browse experiments
              </Link>
              <Link
                href="/kits"
                className="rounded-full border border-sage-300 bg-white px-5 py-2.5 text-sm font-semibold text-sage-800 hover:bg-sage-50"
              >
                Kit waitlist
              </Link>
            </div>
          </div>
          {featured?.heroImageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-sage-200/80 shadow-lg">
              <Image
                src={featured.heroImageUrl}
                alt={featured.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Featured this week</h2>
              <p className="text-sm text-ink-muted">A real home run — density, salt, and balsamic bubbles.</p>
            </div>
            <Link href={`/experiments/${featured.id}`} className="text-sm font-semibold text-sage-700 hover:text-sage-800">
              Open guide →
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="overflow-hidden rounded-3xl border border-sage-200/80 bg-white shadow-sm lg:col-span-3">
              {featured.heroImageUrl && (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={featured.heroImageUrl}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center rounded-3xl border border-sage-200/80 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800">
                  {statusLabel(featured.status)}
                </span>
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-ink-muted">
                  {featured.timeMinutes} min · {messLabel(featured.messLevel)}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold">{featured.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{featured.experience}</p>
              <Link
                href={`/experiments/${featured.id}`}
                className="mt-6 inline-flex w-fit rounded-full bg-sage-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-700"
              >
                See full parent guide
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-sage-200/60 bg-sage-50/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
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

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div className="rounded-3xl border border-sage-200/80 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Kits are coming</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Pre-measured materials for the winners — optional. Experiment ideas stay free forever.
          </p>
          <Link href="/kits" className="mt-5 inline-block text-sm font-semibold text-sage-700">
            Join the waitlist →
          </Link>
        </div>
        <div className="rounded-3xl border border-sage-200/80 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Get new winners by email</h2>
          <p className="mt-2 mb-4 text-sm text-ink-muted">
            Occasional notes when we ship a tested favorite. No spam.
          </p>
          <NewsletterForm source="home" />
        </div>
      </section>
    </div>
  );
}
