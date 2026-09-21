import Image from "next/image";
import type { Experiment, ExperimentProduct, KnowThis, RunThis, Trap } from "@/db/schema";
import { amazonPackCartHref, amazonProductHref } from "@/lib/amazon";
import { kidVerdictProse, uniqueMoveSteps } from "@/lib/experiments";

export function VolcanoExperimentView({ experiment: e }: { experiment: Experiment }) {
  const materials = (e.materials as string[]) || [];
  const products = (e.products as ExperimentProduct[]) || [];
  const steps = (e.steps as { title: string; detail: string }[]) || [];
  const runThis = (e.runThis as RunThis) || {};
  const knowThis = (e.knowThis as KnowThis) || { mechanism: "", doesNotProve: "" };
  const traps = (e.traps as Trap[]) || [];
  const moves = uniqueMoveSteps(steps, runThis.tracks);
  const verdict = kidVerdictProse(e.notesFromHome, e.experience);
  const packHref = amazonPackCartHref(products);

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6">
      <section>
        <h2 className="font-display text-2xl font-semibold text-ink">Grab bag</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Kitchen first. If you&apos;re missing something, these are the pieces that worked at our
          table.
        </p>
        {materials.length > 0 && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            {materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
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
        {products.length > 0 && (
          <ul className="mt-4 space-y-3">
            {products.map((product) => {
              const href = amazonProductHref(product);
              return (
                <li key={`${product.name}-${product.asin ?? product.amazonUrl ?? ""}`}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="font-semibold text-sage-800 underline-offset-2 hover:underline"
                    >
                      {product.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-ink">{product.name}</span>
                  )}
                  {product.note && <p className="mt-0.5 text-sm text-ink-muted">{product.note}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {moves.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">The moves</h2>
          <ol className="mt-5 space-y-8">
            {moves.map((move, index) => (
              <li key={`${move.title}-${index}`} className="space-y-3">
                {move.imageUrl && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-sage-200/80 bg-sage-50">
                    <Image
                      src={move.imageUrl}
                      alt={move.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 48rem"
                      priority={index === 0}
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{move.title}</h3>
                    <p className="mt-0.5 text-sm text-ink-muted">{move.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {(e.heroImageUrl || verdict) && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Kid verdict</h2>
          {e.heroImageUrl && (
            <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-3xl border border-sage-200/80 shadow-sm">
              <Image
                src={e.heroImageUrl}
                alt={e.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 48rem"
              />
            </div>
          )}
          {verdict && (
            <blockquote className="mt-5 whitespace-pre-line rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 text-sm text-ink">
              {verdict}
            </blockquote>
          )}
        </section>
      )}

      <section>
        <h2 className="font-display text-2xl font-semibold text-ink">Bear with me</h2>
        <div className="mt-4 space-y-5 text-sm text-ink-muted">
          {knowThis.mechanism && (
            <p className="whitespace-pre-line">{knowThis.mechanism}</p>
          )}
          {knowThis.numbersNote && (
            <div>
              <h3 className="font-semibold text-ink">Numbers</h3>
              <p className="mt-1">{knowThis.numbersNote}</p>
            </div>
          )}
          {knowThis.doesNotProve && (
            <div>
              <h3 className="font-semibold text-ink">Does not prove</h3>
              <p className="mt-1 whitespace-pre-line">{knowThis.doesNotProve}</p>
            </div>
          )}
          {knowThis.goDeeper && (
            <div>
              <h3 className="font-semibold text-ink">Go deeper</h3>
              <p className="mt-1">{knowThis.goDeeper}</p>
            </div>
          )}
          {traps.length > 0 && (
            <div>
              <h3 className="font-semibold text-ink">Easy to mix up</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {traps.map((trap) => (
                  <li key={trap.wrong}>{trap.replace}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {e.safety && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">Heads-up</h2>
          <p className="mt-3 text-sm text-ink-muted">{e.safety}</p>
        </section>
      )}
    </div>
  );
}
