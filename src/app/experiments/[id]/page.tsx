import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperimentViewTracker } from "@/components/ExperimentViewTracker";
import { JsonLd } from "@/components/JsonLd";
import { MechanismWalkthrough } from "@/components/MechanismWalkthrough";
import { SimTryIt } from "@/components/SimTryIt";
import { GrabBagProducts } from "@/components/GrabBagProducts";
import { VolcanoExperimentView } from "@/components/VolcanoExperimentView";
import type {
  Experiment,
  ExperimentProduct,
  KnowThis,
  RunThis,
} from "@/db/schema";
import { amazonPackCartHref } from "@/lib/amazon";
import { materialsWithoutBuyLink } from "@/lib/grab-bag";
import {
  ageLabel,
  difficultyLabel,
  formatRanOn,
  getExperiment,
  listExperiments,
  messLabel,
  plannedChipLabel,
  usesPilotSpine,
} from "@/lib/experiments";
import { howToJsonLd } from "@/lib/jsonld";
import { simForExperiment } from "@/lib/sims";
import { DEFAULT_SOCIAL_IMAGE, canonicalMetadata } from "@/lib/site";

export async function generateStaticParams() {
  const all = await listExperiments();
  return all.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await getExperiment(id);
  if (!e) return { title: "Experiment" };
  return canonicalMetadata(`/experiments/${id}`, {
    title: e.title,
    description: e.learningGoal,
    image: e.heroImageUrl ?? DEFAULT_SOCIAL_IMAGE,
  });
}

function hasRunContent(run: RunThis | null | undefined): boolean {
  if (!run) return false;
  return Boolean(run.overview || run.setup || (run.tracks && run.tracks.length > 0));
}

function hasKnowContent(know: KnowThis | null | undefined): boolean {
  if (!know) return false;
  return Boolean(know.mechanism || know.numbersNote || know.goDeeper || know.nameForThis);
}

export default async function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = await getExperiment(id);
  if (!e) notFound();

  return (
    <article className="pb-16">
      <JsonLd data={howToJsonLd(e)} />
      <ExperimentViewTracker slug={e.id} />
      <ExperimentTitleBand experiment={e} ranOnLabel={formatRanOn(e.ranOn)} />
      {usesPilotSpine(e.id) ? (
        <VolcanoExperimentView experiment={e} />
      ) : (
        <LegacyExperimentBody experiment={e} />
      )}
    </article>
  );
}

function ExperimentTitleBand({
  experiment: e,
  ranOnLabel,
}: {
  experiment: Experiment;
  ranOnLabel: string | null;
}) {
  return (
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
              {plannedChipLabel(e.plannedFor)}
            </span>
          )}
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">
            {difficultyLabel(e.difficulty)}
          </span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">
            {ageLabel(e.ageBands)}
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
          {ranOnLabel && (
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-ink-muted">
              {ranOnLabel}
            </span>
          )}
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink">{e.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-ink-muted">{e.learningGoal}</p>
      </div>
    </div>
  );
}

function LegacyExperimentBody({ experiment: e }: { experiment: Experiment }) {
  const products = (e.products as ExperimentProduct[]) || [];
  const materials = materialsWithoutBuyLink((e.materials as string[]) || [], products);
  const kidCanDo = (e.kidCanDo as string[]) || [];
  const adultRole = (e.adultRole as string[]) || [];
  const steps = (e.steps as { title: string; detail: string }[]) || [];
  const notice = (e.notice as string[]) || [];
  const runThis = (e.runThis as RunThis) || {};
  const knowThis = (e.knowThis as KnowThis) || { mechanism: "" };
  const tracks = runThis.tracks ?? [];
  const stepTitles = new Set(steps.map((step) => step.title.trim()));
  // Title-matched tracks are the step photo. They render on that step only,
  // not again as RUN THIS cards (salt-ice cards do not share step titles).
  const stepPhotoTracks = tracks.filter(
    (track) => Boolean(track.imageUrl?.trim()) && stepTitles.has(track.title.trim()),
  );
  const cardTracks = tracks.filter((track) => !stepPhotoTracks.includes(track));
  const sim = simForExperiment(e.id);

  const showRun = hasRunContent(runThis);
  const showKnow = hasKnowContent(knowThis);
  const showThreeMessage = showRun || showKnow;
  const showLegacySteps = !showRun && steps.length > 0;
  const showLegacyRoles = !showThreeMessage && (kidCanDo.length > 0 || adultRole.length > 0);
  const showLegacyNotice = !showKnow && notice.length > 0;

  return (
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

        {products.length > 0 && <GrabBag products={products} />}

        {showThreeMessage && (
          <div className="space-y-6">
            {showRun && (
              <MessageCard eyebrow="RUN THIS" title="How to run it" tone="run">
                {runThis.overview && (
                  <p className="text-sm text-ink-muted">{runThis.overview}</p>
                )}
                {cardTracks.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {cardTracks.map((track) => (
                      <div
                        key={track.label}
                        className="overflow-hidden rounded-2xl border border-sky-100/80 bg-white/80 shadow-sm"
                      >
                        <div className="relative aspect-[4/3] w-full bg-sage-50">
                          <Image
                            src={track.imageUrl}
                            alt={track.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, 30vw"
                          />
                        </div>
                        <div className="space-y-1.5 p-3">
                          <span className="inline-flex rounded-full bg-sky-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {track.label}
                          </span>
                          <h3 className="text-sm font-semibold text-ink">{track.title}</h3>
                          <p className="text-xs leading-relaxed text-ink-muted">{track.blurb}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {runThis.setup && <RunBlock label="Setup">{runThis.setup}</RunBlock>}
                {steps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Steps</h3>
                    <ol className="mt-2 space-y-3">
                      {steps.map((s, i) => {
                        const shot = stepPhotoTracks.find((track) => track.title.trim() === s.title.trim());
                        return (
                          <li
                            key={i}
                            className="rounded-2xl border border-sky-100/80 bg-white/70 p-3"
                          >
                            {shot && (
                              <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl border border-sky-100/80 bg-sage-50">
                                <Image
                                  src={shot.imageUrl}
                                  alt={shot.imageAlt?.trim() || s.title}
                                  fill
                                  className="object-contain"
                                  sizes="(max-width: 1024px) 100vw, 40rem"
                                />
                              </div>
                            )}
                            <div className="flex gap-3">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-700 text-xs font-bold text-white">
                                {i + 1}
                              </span>
                              <div>
                                <h4 className="text-sm font-semibold text-ink">{s.title}</h4>
                                <p className="mt-0.5 text-sm text-ink-muted">{s.detail}</p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </MessageCard>
            )}

            {showKnow && (
              <MessageCard title="Bear with me" tone="know">
                {knowThis.mechanism && (
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Mechanism</h3>
                    <MechanismWalkthrough knowThis={knowThis} />
                  </div>
                )}
                {knowThis.numbersNote && (
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Numbers</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">
                      {knowThis.numbersNote}
                    </p>
                  </div>
                )}
                {knowThis.goDeeper && (
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Go deeper</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">
                      {knowThis.goDeeper}
                    </p>
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

          </div>
        )}

        {/* Try it sim, right after the physics, as the volcano has it after "Bear with me". */}
        {sim && <SimTryIt sim={sim} />}

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

        {e.notesFromHome && (
          <Section title="Notes from home">
            <blockquote className="whitespace-pre-line rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 text-sm text-ink">
              {e.notesFromHome}
            </blockquote>
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
        {(e.safety ?? "").trim() && (
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
  );
}

function GrabBag({ products }: { products: ExperimentProduct[] }) {
  const packHref = amazonPackCartHref(products);
  return (
    <Section title="Grab bag">
      <p className="text-sm text-ink-muted">
        Kitchen first. If you&apos;re missing something, these are the pieces that worked at our
        table.
      </p>
      {packHref && (
        <div className="mt-4 rounded-2xl border border-sage-200/80 bg-sage-50/80 p-4">
          <a
            href={packHref}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-700"
          >
            Add the full pack to Amazon cart
          </a>
          <p className="mt-2 text-sm text-ink-muted">
            Opens Amazon with these items ready to add — you confirm the cart.
          </p>
        </div>
      )}
      <GrabBagProducts products={products} className="mt-3" />
    </Section>
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
  eyebrow?: string;
  title: string;
  tone: "run" | "know";
  children: React.ReactNode;
}) {
  const tones = {
    run: "border-sky-200 bg-sky-50/70",
    know: "border-sage-300 bg-sage-50/80",
  };
  const eyebrowTone = {
    run: "text-sky-900",
    know: "text-sage-900",
  };
  return (
    <section className={`rounded-3xl border-2 p-5 shadow-sm sm:p-6 ${tones[tone]}`}>
      {eyebrow && (
        <p className={`text-xs font-bold uppercase tracking-wide ${eyebrowTone[tone]}`}>{eyebrow}</p>
      )}
      <h2 className={`${eyebrow ? "mt-1" : ""} font-display text-xl font-semibold text-ink`}>{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
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
