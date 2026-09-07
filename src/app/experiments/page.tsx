import { ExperimentCard } from "@/components/ExperimentCard";
import { listExperiments } from "@/lib/experiments";
import Link from "next/link";

type Search = { age?: string; domain?: string; mess?: string; location?: string; status?: string };

export const metadata = {
  title: "Experiments",
  description:
    "For parents with curious kids who are looking for a way to make their kitchen extra messy on weekends.",
};

export default async function ExperimentsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const all = await listExperiments();

  const filtered = all.filter((e) => {
    if (params.age && !e.ageBands.includes(params.age)) return false;
    if (params.domain && !e.domains.includes(params.domain)) return false;
    if (params.mess && e.messLevel !== params.mess) return false;
    if (params.location && e.location !== params.location) return false;
    if (params.status && e.status !== params.status) return false;
    return true;
  });

  const ages = Array.from(new Set(all.flatMap((e) => e.ageBands))).sort();
  const domains = Array.from(new Set(all.flatMap((e) => e.domains))).sort();
  const statuses = Array.from(new Set(all.map((e) => e.status)));

  function hrefFor(next: Partial<Search>) {
    const merged = { ...params, ...next };
    const q = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) q.set(k, v);
    });
    const s = q.toString();
    return s ? `/experiments?${s}` : "/experiments";
  }

  function clearKey(key: keyof Search) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== key) q.set(k, v);
    });
    const s = q.toString();
    return s ? `/experiments?${s}` : "/experiments";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Experiments</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        For parents with curious kids who are looking for a way to make their kitchen extra messy on
        weekends.
      </p>

      <div className="mt-8 space-y-3 rounded-3xl border border-sage-200/80 bg-white p-4 shadow-sm">
        <FilterRow label="Age">
          {ages.map((a) => (
            <Chip key={a} href={hrefFor({ age: a })} active={params.age === a} clearHref={clearKey("age")}>
              {a}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Domain">
          {domains.map((d) => (
            <Chip
              key={d}
              href={hrefFor({ domain: d })}
              active={params.domain === d}
              clearHref={clearKey("domain")}
            >
              {d}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Mess">
          {["low", "medium", "high"].map((m) => (
            <Chip key={m} href={hrefFor({ mess: m })} active={params.mess === m} clearHref={clearKey("mess")}>
              {m}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Where">
          {["indoor", "outdoor", "either"].map((loc) => (
            <Chip
              key={loc}
              href={hrefFor({ location: loc })}
              active={params.location === loc}
              clearHref={clearKey("location")}
            >
              {loc}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Status">
          {statuses.map((s) => (
            <Chip
              key={s}
              href={hrefFor({ status: s })}
              active={params.status === s}
              clearHref={clearKey("status")}
            >
              {s}
            </Chip>
          ))}
        </FilterRow>
        {(params.age || params.domain || params.mess || params.location || params.status) && (
          <Link href="/experiments" className="inline-block text-sm font-semibold text-sage-700">
            Clear filters
          </Link>
        )}
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        Showing {filtered.length} of {all.length}
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <ExperimentCard key={e.id} experiment={e} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-ink-muted">No experiments match those filters.</p>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  href,
  active,
  clearHref,
  children,
}: {
  href: string;
  active: boolean;
  clearHref: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={active ? clearHref : href}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active ? "bg-sage-600 text-white" : "bg-sage-50 text-ink-muted hover:bg-sage-100"
      }`}
    >
      {children}
    </Link>
  );
}
