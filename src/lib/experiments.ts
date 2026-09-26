import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { experiments, faqEntries, type Experiment, type FaqEntry, type RunThis } from "@/db/schema";
import { experimentSeeds, faqSeeds, type ExperimentSeed, type FaqSeed } from "@/data/seed";

function seedToExperiment(e: ExperimentSeed): Experiment {
  const now = new Date();
  return withoutDuplicateGalleryPhotos({
    id: e.id,
    title: e.title,
    status: e.status,
    difficulty: e.difficulty,
    ageBands: e.ageBands,
    domains: e.domains,
    learningGoal: e.learningGoal,
    timeMinutes: e.timeMinutes,
    messLevel: e.messLevel,
    location: e.location,
    materials: e.materials,
    products: e.products ?? [],
    prep: e.prep,
    safety: e.safety,
    experience: e.experience,
    kidCanDo: e.kidCanDo,
    adultRole: e.adultRole,
    steps: e.steps,
    notice: e.notice,
    stretch: e.stretch,
    notesFromHome: e.notesFromHome,
    heroImageUrl: e.heroImageUrl,
    gallery: e.gallery,
    featured: e.featured,
    sayThis: e.sayThis ?? {},
    runThis: e.runThis ?? {},
    knowThis: e.knowThis ?? { mechanism: "" },
    traps: e.traps ?? [],
    planUnit: e.planUnit ?? null,
    ranOn: e.ranOn ?? null,
    plannedFor: e.plannedFor ?? null,
    createdAt: now,
    updatedAt: now,
  });
}

function seedToFaq(f: FaqSeed, idx: number): FaqEntry {
  return {
    id: idx + 1,
    question: f.question,
    answer: f.answer,
    sortOrder: f.sortOrder,
  };
}

/** Normalize a Postgres date / ISO string to YYYY-MM-DD, or null. */
export function dateOnly(value: string | Date | null | undefined): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return null;
}

/**
 * Planned status chip. Concrete Saturday when `plannedFor` is set
 * ("Planned · Sat Sep 26"); otherwise the undated "Planned" label.
 */
export function plannedChipLabel(value: string | Date | null | undefined): string {
  const iso = dateOnly(value);
  if (!iso) return "Planned";
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return "Planned";
  const when = new Date(Date.UTC(year, month - 1, day));
  const weekday = when.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
  const monthDay = when.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `Planned · ${weekday} ${monthDay}`;
}

/** Done filter: already run and published as keepers (winner + tested). */
export function isDoneStatus(status: string): boolean {
  return status === "winner" || status === "tested";
}

/** Status query on /experiments. Unknown values do not hide rows. */
export function matchesStatusFilter(status: string, filter?: string | null): boolean {
  if (filter === "done") return isDoneStatus(status);
  if (filter === "planned") return status === "planned";
  return true;
}

/** Short parent-facing date, e.g. "Sep 12, 2026". */
export function formatRanOn(value: string | Date | null | undefined): string | null {
  const iso = dateOnly(value);
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Pilot five-section spine (Grab bag → The moves → Kid verdict → Bear with me → Heads-up). */
export const PILOT_SPINE_SLUG = "baking-soda-volcano";

export function usesPilotSpine(id: string): boolean {
  return id === PILOT_SPINE_SLUG;
}

export type MoveStep = {
  title: string;
  detail: string;
  imageUrl: string | null;
};

/**
 * Ordered moves: seed steps first, each paired with at most one unused track image.
 * Extra steps stay text-only. Never repeats an image path.
 */
export function uniqueMoveSteps(
  steps: Iterable<{ title: string; detail: string }> | null | undefined,
  tracks?: Iterable<{ title: string; imageUrl?: string | null; blurb?: string }> | null,
): MoveStep[] {
  const trackList = [...(tracks ?? [])];
  const trackImages = trackList
    .map((track) => track.imageUrl?.trim() ?? "")
    .filter(Boolean);
  const used = new Set<string>();
  const stepList = [...(steps ?? [])];

  if (stepList.length > 0) {
    return stepList.map((step, index) => {
      const candidate = trackImages[index];
      let imageUrl: string | null = null;
      if (candidate && !used.has(candidate)) {
        used.add(candidate);
        imageUrl = candidate;
      }
      return { title: step.title, detail: step.detail, imageUrl };
    });
  }

  return trackList.map((track) => {
    const candidate = track.imageUrl?.trim() || null;
    let imageUrl: string | null = null;
    if (candidate && !used.has(candidate)) {
      used.add(candidate);
      imageUrl = candidate;
    }
    return {
      title: track.title,
      detail: track.blurb?.trim() || "",
      imageUrl,
    };
  });
}

/** Kid verdict body: lived notes, else the short experience line. Never invents quotes. */
export function kidVerdictProse(
  notesFromHome?: string | null,
  experience?: string | null,
): string | null {
  const notes = notesFromHome?.trim();
  if (notes) return notes;
  const line = experience?.trim();
  return line || null;
}

/**
 * Drop kitchen-gallery paths that already appear as the hero or a RUN THIS
 * track image. On main, baking-soda-volcano listed the same three step photos
 * in `gallery` and `runThis.tracks`, which rendered twice.
 */
export function withoutDuplicateGalleryPhotos(e: Experiment): Experiment {
  const runThis = (e.runThis ?? {}) as RunThis;
  return {
    ...e,
    gallery: uniqueKitchenGallery(e.gallery, {
      heroImageUrl: e.heroImageUrl,
      trackImageUrls: runThis.tracks?.map((track) => track.imageUrl),
    }),
  };
}

/**
 * Kitchen photos that are not already the hero or a RUN THIS track image.
 * Each remaining path appears once. Pilot spine does not render this gallery.
 */
export function uniqueKitchenGallery(
  gallery: Iterable<string | null | undefined> | null | undefined,
  options?: {
    heroImageUrl?: string | null;
    trackImageUrls?: Iterable<string | null | undefined> | null;
  },
): string[] {
  const excluded = new Set<string>();
  const hero = options?.heroImageUrl?.trim();
  if (hero) excluded.add(hero);
  for (const url of options?.trackImageUrls ?? []) {
    const trimmed = url?.trim();
    if (trimmed) excluded.add(trimmed);
  }

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const raw of gallery ?? []) {
    const src = raw?.trim();
    if (!src || excluded.has(src) || seen.has(src)) continue;
    seen.add(src);
    unique.push(src);
  }
  return unique;
}

function sortExperiments(rows: Experiment[], sort?: string | null): Experiment[] {
  if (sort === "newest") {
    // Newest overrides winner/planned ranking: ranOn desc, nulls last, then title
    return [...rows].sort((a, b) => {
      const aDate = dateOnly(a.ranOn);
      const bDate = dateOnly(b.ranOn);
      if (aDate && bDate) {
        const byDate = bDate.localeCompare(aDate);
        if (byDate !== 0) return byDate;
      } else if (aDate) return -1;
      else if (bDate) return 1;
      return a.title.localeCompare(b.title);
    });
  }

  // Winner first, then planned, then featured, then title
  return [...rows].sort((a, b) => {
    const rank = (s: string) => (s === "winner" ? 0 : s === "planned" ? 1 : 2);
    const ar = rank(a.status);
    const br = rank(b.status);
    if (ar !== br) return ar - br;
    const af = a.featured ? 0 : 1;
    const bf = b.featured ? 0 : 1;
    if (af !== bf) return af - bf;
    return a.title.localeCompare(b.title);
  });
}

function filterFaqs(rows: FaqEntry[]): FaqEntry[] {
  return rows;
}

export async function listExperiments(options?: { sort?: string | null }): Promise<Experiment[]> {
  const sort = options?.sort;
  try {
    const db = getDb();
    const rows = await db.select().from(experiments).orderBy(asc(experiments.title));
    if (rows.length > 0) {
      return sortExperiments(rows.map(withoutDuplicateGalleryPhotos), sort);
    }
  } catch {
    // fall through to in-code seed
  }
  return sortExperiments(experimentSeeds.map(seedToExperiment), sort);
}

export async function getExperiment(id: string): Promise<Experiment | null> {
  try {
    const db = getDb();
    const rows = await db.select().from(experiments).where(eq(experiments.id, id)).limit(1);
    if (rows[0]) return withoutDuplicateGalleryPhotos(rows[0]);
  } catch {
    // fall through
  }
  const seed = experimentSeeds.find((e) => e.id === id);
  return seed ? seedToExperiment(seed) : null;
}

export async function getFeaturedExperiment(): Promise<Experiment | null> {
  const all = await listExperiments();
  return all.find((e) => e.status === "winner") ?? all.find((e) => e.featured) ?? all[0] ?? null;
}

export async function listFaqs(): Promise<FaqEntry[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(faqEntries).orderBy(asc(faqEntries.sortOrder));
    if (rows.length > 0) return filterFaqs(rows);
  } catch {
    // fall through
  }
  return filterFaqs(faqSeeds.map(seedToFaq));
}

export function statusLabel(status: string): string {
  switch (status) {
    case "tested":
      return "Tested at home";
    case "winner":
      return "Winner";
    case "planned":
      return "Planned";
    case "draft":
      return "Draft";
    case "idea":
      return "Idea";
    default:
      return status;
  }
}

export function difficultyLabel(n: number): string {
  switch (n) {
    case 1:
      return "Easy";
    case 2:
      return "Medium";
    case 3:
      return "Hard";
    default:
      return `Level ${n}`;
  }
}

export function messLabel(level: string): string {
  switch (level) {
    case "low":
      return "Low mess";
    case "medium":
      return "Medium mess";
    case "high":
      return "High mess";
    default:
      return level;
  }
}
