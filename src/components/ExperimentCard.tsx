import Image from "next/image";
import Link from "next/link";
import type { Experiment } from "@/db/schema";
import { messLabel, statusLabel } from "@/lib/experiments";

export function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <Link
      href={`/experiments/${experiment.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-sage-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-sage-100">
        {experiment.heroImageUrl ? (
          <Image
            src={experiment.heroImageUrl}
            alt={experiment.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-sage-100 to-cream px-6 text-center">
            <span className="font-display text-xl font-semibold text-sage-700">{experiment.title}</span>
          </div>
        )}
        {experiment.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[11px] font-medium text-sage-800">
            {statusLabel(experiment.status)}
          </span>
          <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-medium text-ink-muted">
            {experiment.timeMinutes} min
          </span>
          <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-medium text-ink-muted">
            {messLabel(experiment.messLevel)}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold text-ink">{experiment.title}</h3>
        <p className="line-clamp-2 text-sm text-ink-muted">{experiment.learningGoal}</p>
        <p className="mt-auto pt-2 text-xs text-sage-700">
          Ages {experiment.ageBands.join(", ")} · {experiment.domains.join(", ")}
        </p>
      </div>
    </Link>
  );
}
