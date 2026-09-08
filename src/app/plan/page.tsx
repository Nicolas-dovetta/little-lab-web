import Link from "next/link";
import { listExperiments } from "@/lib/experiments";

export const metadata = {
  title: "The plan",
  description:
    "Nicolas’s personal ~30-week Saturday science path with his kids — take what’s useful, ignore the rest.",
};

type Unit = {
  name: string;
  focus: string;
  weeks: string;
  /** Curriculum order — only IDs present in the DB render as links */
  experimentIds: string[];
};

const units: Unit[] = [
  {
    name: "Matter & mess",
    focus: "Sink/float, mix, goo, ice, density",
    weeks: "Weeks 1–5",
    experimentIds: [
      "density-layers",
      "cornstarch-thickening-fluid",
      "cinnamon-soap-rush",
    ],
  },
  {
    name: "Force & motion",
    focus: "Push/pull, ramps, roll, bounce",
    weeks: "Weeks 6–10",
    experimentIds: [],
  },
  {
    name: "Water & weather",
    focus: "Flow, absorb, wind, evaporate",
    weeks: "Weeks 11–15",
    experimentIds: ["salt-ice-fishing"],
  },
  {
    name: "Light & sound",
    focus: "Shadows, mirrors, loud/quiet, vibrate",
    weeks: "Weeks 16–20",
    experimentIds: [],
  },
  {
    name: "Living things",
    focus: "Seeds, bugs, bodies, habitats",
    weeks: "Weeks 21–25",
    experimentIds: [],
  },
  {
    name: "Build & invent",
    focus: "Tools, structures, simple machines, “fix it”",
    weeks: "Weeks 26–30",
    experimentIds: [],
  },
];

function statusTag(status: string) {
  if (status === "winner") {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
        Winner
      </span>
    );
  }
  if (status === "planned") {
    return (
      <span className="rounded-full bg-sage-600 px-2.5 py-0.5 text-xs font-semibold text-white">
        Planned
      </span>
    );
  }
  if (status === "tested") {
    return (
      <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-semibold text-sage-800">
        Tested
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-ink-muted">
        Draft
      </span>
    );
  }
  return null;
}

export default async function PlanPage() {
  const all = await listExperiments();
  const byId = new Map(all.map((e) => [e.id, e]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">The plan</h1>

      <p className="mt-4 rounded-3xl border border-sage-200/80 bg-white p-4 text-base leading-relaxed text-ink shadow-sm sm:p-5">
        This is <strong>my</strong> plan with <strong>my</strong> kids — my taste, my starting
        point. Steal what helps, ignore what doesn&apos;t. The most important thing is having fun
        with your kid, not following a curriculum from a random stranger (me).
      </p>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-muted">
        <p>
          I&apos;m building a ~30-Saturday path so sessions hang on real concepts — not random cute
          activities. Each unit is five weeks. We&apos;re filling week-by-week as we run them at
          home; experiments on the site map here when that&apos;s useful.
        </p>
        <p>
          Want your own path? Build one. Age, mess tolerance, and what makes your kid light up
          matter more than matching my list.
        </p>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold text-ink">Year-one spine</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Draft units — experiments listed in the order I&apos;d run them. Empty slots = still
        filling.
      </p>

      <ol className="mt-6 space-y-4">
        {units.map((u, i) => {
          const linked = u.experimentIds
            .map((id) => byId.get(id))
            .filter((e): e is NonNullable<typeof e> => Boolean(e));

          return (
            <li
              key={u.name}
              className="rounded-3xl border border-sage-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-ink">
                  <span className="text-sage-600">{i + 1}.</span> {u.name}
                </h3>
                <span className="text-xs font-medium uppercase tracking-wide text-sage-600">
                  {u.weeks}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{u.focus}</p>

              {linked.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {linked.map((e) => (
                    <li key={e.id}>
                      <Link
                        href={`/experiments/${e.id}`}
                        className="flex flex-wrap items-center gap-2 rounded-2xl bg-cream/80 px-3 py-2 text-sm font-medium text-ink transition hover:bg-sage-100"
                      >
                        <span>{e.title}</span>
                        {statusTag(e.status)}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-ink-muted">No sessions mapped yet — filling soon.</p>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-10 text-base text-ink-muted">
        More context on why this exists at all:{" "}
        <Link href="/about" className="font-semibold text-sage-800 underline-offset-2 hover:underline">
          About
        </Link>
        . Or jump to{" "}
        <Link
          href="/experiments"
          className="font-semibold text-sage-800 underline-offset-2 hover:underline"
        >
          Experiments
        </Link>
        .
      </p>
    </div>
  );
}
