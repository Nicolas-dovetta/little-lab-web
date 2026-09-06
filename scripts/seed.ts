import { config } from "dotenv";
config({ path: ".env.local" });

import { getDb } from "../src/db";
import { experiments, faqEntries } from "../src/db/schema";
import { experimentSeeds, faqSeeds } from "../src/data/seed";

async function main() {
  const db = getDb();

  for (const e of experimentSeeds) {
    await db
      .insert(experiments)
      .values({
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
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: experiments.id,
        set: {
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
          updatedAt: new Date(),
        },
      });
  }

  // Reset FAQ to seed set
  await db.delete(faqEntries);
  for (const f of faqSeeds) {
    await db.insert(faqEntries).values({
      question: f.question,
      answer: f.answer,
      sortOrder: f.sortOrder,
    });
  }

  console.log(`Seeded ${experimentSeeds.length} experiments and ${faqSeeds.length} FAQ entries.`);
}

main().catch((err) => {
  console.error("Seed failed:", err instanceof Error ? err.message : "unknown error");
  process.exit(1);
});
