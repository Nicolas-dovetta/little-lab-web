import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperimentViewTracker } from "@/components/ExperimentViewTracker";
import { difficultyLabel, getExperiment, listExperiments, messLabel } from "@/lib/experiments";

export async function generateStaticParams() {
  const all = await listExperiments();
  return all.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await getExperiment(id);
  if (!e) return { title: "Experiment" };
  return { title: e.title, description: e.learningGoal };
}

export default async function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = await getExperiment(id);
  if (!e) notFound();

  const materials = (e.materials as string[]) || [];
  const kidCanDo = (e.kidCanDo as string[]) || [];
  const adultRole = (e.adultRole as string[]) || [];
  const steps = (e.steps as { title: string; detail: string }[]) || [];
  const notice = (e.notice as string[]) || [];
  const gallery = (e.gallery as string[]) || [];

  return (
    <article className="pb-16">
      <ExperimentViewTracker slug={e.id} />
      <div className="border-b border-sage-200/60 bg-gradient-to-b from-sage-50 to-cream">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Link href="/experiments" className="text-sm font-medium text-sage-700 hover:text-sage-800">
            ← All experiments
          </Link>
          <div className="mt-4 flex flex-wrap gap-2">
            {e.status === "winner" && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                Winner
              </span>
            )}
            {e.status === "planned" && (
              <span className="rounded-full bg-sage-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                Planned
              </span>
            )}
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">
              {difficultyLabel(e.difficulty)}
            </span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">
              Ages {e.ageBands.join(", ")}
            </span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">
              {e.timeMinutes} min · {messLabel(e.messLevel)} · {e.location}
            </span>
            {e.domains.map((d) => (
              <span key={d} className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">
                {d}
              </span>
            ))}
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold text-ink">{e.title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-ink-muted">{e.learningGoal}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          {e.heroImageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-sage-200/80 shadow-sm">
              <Image
                src={e.heroImageUrl}
                alt={e.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          )}

          {e.experience && (
            <Section title="The experience">
              <p className="text-ink-muted">{e.experience}</p>
            </Section>
          )}

          {steps.length > 0 && (
            <Section title="Steps">
              <ol className="space-y-4">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-4 rounded-2xl border border-sage-100 bg-white p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{s.title}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {gallery.length > 0 && (
            <Section title="From our kitchen">
              <div className="grid gap-4 sm:grid-cols-2">
                {gallery.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-sage-200/80"
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 30vw" />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {e.notesFromHome && (
            <Section title="Notes from home">
              <blockquote className="whitespace-pre-line rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 text-sm text-ink">
                {e.notesFromHome}
              </blockquote>
            </Section>
          )}

          {e.stretch && (
            <Section title="Stretch it">
              <p className="text-sm text-ink-muted">{e.stretch}</p>
            </Section>
          )}
        </div>

        <aside className="space-y-5 lg:col-span-2">
          {materials.length > 0 && (
            <Card title="Materials">
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {materials.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Card>
          )}
          {e.prep && (
            <Card title="Prep">
              <p className="text-sm text-ink-muted">{e.prep}</p>
            </Card>
          )}
          {e.safety && (
            <Card title="Safety">
              <p className="text-sm text-ink-muted">{e.safety}</p>
            </Card>
          )}
          {kidCanDo.length > 0 && (
            <Card title="Kid can do (3–5)">
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {kidCanDo.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Card>
          )}
          {adultRole.length > 0 && (
            <Card title="Adult role">
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {adultRole.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Card>
          )}
          {notice.length > 0 && (
            <Card title="Good to know">
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {notice.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-sage-200/80 bg-white p-5 shadow-sm">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
