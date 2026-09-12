import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type SayThis = {
  age12?: string[];
  age35?: string[];
  lines?: string[];
};

export type RunTrack = {
  label: string;
  title: string;
  imageUrl: string;
  blurb: string;
};

export type RunThis = {
  overview?: string;
  setup?: string;
  tracks?: RunTrack[];
};

export type KnowThis = {
  mechanism: string;
  doesNotProve: string;
  goDeeper?: string;
  numbersNote?: string;
  nameForThis?: string;
};

export type Trap = {
  wrong: string;
  why: string;
  replace: string;
};

export const experiments = pgTable("experiments", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  difficulty: integer("difficulty").notNull().default(1),
  ageBands: text("age_bands").array().notNull().default([]),
  domains: text("domains").array().notNull().default([]),
  learningGoal: text("learning_goal").notNull().default(""),
  timeMinutes: integer("time_minutes").notNull().default(30),
  messLevel: text("mess_level").notNull().default("medium"),
  location: text("location").notNull().default("indoor"),
  materials: jsonb("materials").$type<string[]>().notNull().default([]),
  prep: text("prep").notNull().default(""),
  safety: text("safety").notNull().default(""),
  experience: text("experience").notNull().default(""),
  kidCanDo: jsonb("kid_can_do").$type<string[]>().notNull().default([]),
  adultRole: jsonb("adult_role").$type<string[]>().notNull().default([]),
  steps: jsonb("steps").$type<{ title: string; detail: string }[]>().notNull().default([]),
  notice: jsonb("notice").$type<string[]>().notNull().default([]),
  stretch: text("stretch").notNull().default(""),
  notesFromHome: text("notes_from_home").notNull().default(""),
  heroImageUrl: text("hero_image_url"),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  sayThis: jsonb("say_this").$type<SayThis>().notNull().default({}),
  runThis: jsonb("run_this").$type<RunThis>().notNull().default({}),
  knowThis: jsonb("know_this").$type<KnowThis>().notNull().default({
    mechanism: "",
    doesNotProve: "",
  }),
  traps: jsonb("traps").$type<Trap[]>().notNull().default([]),
  planUnit: text("plan_unit"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("website"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});


export const faqEntries = pgTable("faq_entries", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  message: text("message").notNull(),
  source: text("source").notNull().default("about"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Experiment = typeof experiments.$inferSelect;
export type FaqEntry = typeof faqEntries.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
