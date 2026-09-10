import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperimentViewTracker } from "@/components/ExperimentViewTracker";
import type { KnowThis, RunThis, SayThis, Trap } from "@/db/schema";
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

function hasSayContent(say: SayThis | null | undefined): boolean {
  if (!say) return false;
  return Boolean(
    (say.age12 && say.age12.length > 0) ||
      (say.age35 && say.age35.length > 0) ||
      (say.lines && say.lines.length > 0),
  );
}

function hasRunContent(run: RunThis | null | undefined): boolean {
  if (!run) return false;
  return Boolean(run.overview || run.setup);
}

function hasKnowContent(know: KnowThis | null | undefined): boolean {
  if (!know) return false;
  return Boolean(know.mechanism || know.doesNotProve);
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
  const sayThis = (e.sayThis as SayThis) || {};
  const runThis = (e.runThis as RunThis) || {};
  const knowThis = (e.knowThis as KnowThis) || { mechanism: "", doesNotProve: "" };
  const traps = (e.traps as Trap[]) || [];

  const showSay = hasSayContent(sayThis);
  const showRun = hasRunContent(runThis);
  const showKnow = hasKnowContent(knowThis);
  const showThreeMessage = showSay || showRun || showKnow || traps.length > 0;
  const showLegacySteps = !showRun && steps.length > 0;
  const showLegacyRoles = !showSay && (kidCanDo.length > 0 || adultRole.length > 0);
  const showLegacyNotice = !showKnow && notice.length > 0;

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
            {e.planUnit && (
              <Link
                href="/plan"
                className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800 hover:bg-sage-200"
              >
                Plan: {e.planUnit}
              </Link>
            )}
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

          {showThreeMessage && (
            <div className="space-y-6">
              {showSay && (
                <MessageCard
                  eyebrow="SAY THIS"
                  title="Words at the table"
                  tone="say"
                >
                  {sayThis.age12 && sayThis.age12.length > 0 && (
                    <LineGroup label="Ages 1–2" lines={sayThis.age12} />
                  )}
                  {sayThis.age35 && sayThis.age35.length > 0 && (
                    <LineGroup label="Ages 3–5" lines={sayThis.age35} />
                  )}
                  {sayThis.lines && sayThis.lines.length > 0 && (
                    <LineGroup label="Lines" lines={sayThis.lines} />
                  )}
                </MessageCard>
              )}

              {showRun && (
                <MessageCard eyebrow="RUN THIS" title="How to run it" tone="run">
                  {runThis.overview && (
                    <p className="text-sm text-ink-muted">{runThis.overview}</p>
                  )}
                  {runThis.setup && (
                    <RunBlock label="Setup">{runThis.setup}</RunBlock>
                  )}
                  {steps.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Steps</h3>
                      <ol className="mt-2 space-y-3">
                        {steps.map((s, i) => (
                          <li
                            key={i}
                            className="flex gap-3 rounded-2xl border border-sky-100/80 bg-white/70 p-3"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-700 text-xs font-bold text-white">
                              {i + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-semibold text-ink">{s.title}</h4>
                              <p className="mt-0.5 text-sm text-ink-muted">{s.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </MessageCard>
              )}

              {showKnow && (
                <MessageCard eyebrow="KNOW THIS" title="What’s happening" tone="know">
                  {knowThis.mechanism && (
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Mechanism</h3>
                      <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">
                        {knowThis.mechanism}
                      </p>
                    </div>
                  )}
                  {knowThis.doesNotProve && (
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Does not prove</h3>
                      <p className="mt-1 text-sm text-ink-muted">{knowThis.doesNotProve}</p>
                    </div>
                  )}
                  {knowThis.goDeeper && (
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Go deeper</h3>
                      <p className="mt-1 text-sm text-ink-muted">{knowThis.goDeeper}</p>
                    </div>
                  )}
                  {knowThis.numbersNote && (
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Numbers</h3>
                      <p className="mt-1 text-sm text-ink-muted">{knowThis.numbersNote}</p>
                    </div>
                  )}
                  {knowThis.nameForThis && (
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Name for this</h3>
                      <p className="mt-1 text-sm text-ink-muted">{knowThis.nameForThis}</p>
                    </div>
                  )}
                </MessageCard>
              )}

              {traps.length > 0 && (
                <div className="space-y-4">
                  {traps.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-3xl border-2 border-rose-300 bg-rose-50/90 p-5 shadow-sm"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-rose-800">
                        Trap{traps.length > 1 ? ` ${i + 1}` : ""}
                      </p>
                      <dl className="mt-3 space-y-3 text-sm">
                        <div>
                          <dt className="font-semibold text-rose-950">Wrong</dt>
                          <dd className="mt-0.5 text-ink-muted">{t.wrong}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-rose-950">Why</dt>
                          <dd className="mt-0.5 text-ink-muted">{t.why}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-rose-950">Replace</dt>
                          <dd className="mt-0.5 text-ink-muted">{t.replace}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showLegacySteps && (
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
          {showLegacyRoles && kidCanDo.length > 0 && (
            <Card title="Kid can do">
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {kidCanDo.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Card>
          )}
          {showLegacyRoles && adultRole.length > 0 && (
            <Card title="Adult role">
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {adultRole.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Card>
          )}
          {showLegacyNotice && (
            <Card title="Good to know">
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-muted">
                {notice.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Card>
          )}
          {e.planUnit && (
            <Card title="In the plan">
              <p className="text-sm text-ink-muted">
                Part of{" "}
                <Link href="/plan" className="font-medium text-sage-800 underline-offset-2 hover:underline">
                  {e.planUnit}
                </Link>
                .
              </p>
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

function MessageCard({
  eyebrow,
  title,
  tone,
  children,
}: {
  eyebrow: string;
  title: string;
  tone: "say" | "run" | "know";
  children: React.ReactNode;
}) {
  const tones = {
    say: "border-amber-200 bg-amber-50/70",
    run: "border-sky-200 bg-sky-50/70",
    know: "border-sage-300 bg-sage-50/80",
  };
  const eyebrowTone = {
    say: "text-amber-900",
    run: "text-sky-900",
    know: "text-sage-900",
  };
  return (
    <section className={`rounded-3xl border-2 p-5 shadow-sm sm:p-6 ${tones[tone]}`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${eyebrowTone[tone]}`}>{eyebrow}</p>
      <h2 className="mt-1 font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function LineGroup({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">{label}</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function RunBlock({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">{label}</h3>
      <p className="mt-1 text-sm text-ink-muted">{children}</p>
    </div>
  );
}
