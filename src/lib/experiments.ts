import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { experiments, faqEntries, type Experiment, type FaqEntry } from "@/db/schema";
import { experimentSeeds, faqSeeds, type ExperimentSeed, type FaqSeed } from "@/data/seed";

function seedToExperiment(e: ExperimentSeed): Experiment {
  const now = new Date();
  return {
    id: e.id,
    title: e.title,
    status: e.status,
    ageBands: e.ageBands,
    domains: e.domains,
    learningGoal: e.learningGoal,
    timeMinutes: e.timeMinutes,
    messLevel: e.messLevel,
    location: e.location,
    materials: e.materials,
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
    createdAt: now,
    updatedAt: now,
  };
}

function seedToFaq(f: FaqSeed, idx: number): FaqEntry {
  return {
    id: idx + 1,
    question: f.question,
    answer: f.answer,
    sortOrder: f.sortOrder,
  };
}

export async function listExperiments(): Promise<Experiment[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(experiments).orderBy(asc(experiments.title));
    if (rows.length > 0) return rows;
  } catch {
    // fall through to in-code seed
  }
  return experimentSeeds.map(seedToExperiment);
}

export async function getExperiment(id: string): Promise<Experiment | null> {
  try {
    const db = getDb();
    const rows = await db.select().from(experiments).where(eq(experiments.id, id)).limit(1);
    if (rows[0]) return rows[0];
  } catch {
    // fall through
  }
  const seed = experimentSeeds.find((e) => e.id === id);
  return seed ? seedToExperiment(seed) : null;
}

export async function getFeaturedExperiment(): Promise<Experiment | null> {
  const all = await listExperiments();
  return all.find((e) => e.featured) ?? all[0] ?? null;
}

export async function listFaqs(): Promise<FaqEntry[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(faqEntries).orderBy(asc(faqEntries.sortOrder));
    if (rows.length > 0) return rows;
  } catch {
    // fall through
  }
  return faqSeeds.map(seedToFaq);
}

export function statusLabel(status: string): string {
  switch (status) {
    case "tested":
      return "Tested at home";
    case "winner":
      return "Winner";
    case "draft":
      return "Draft";
    case "idea":
      return "Idea";
    default:
      return status;
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
