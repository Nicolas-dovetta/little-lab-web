import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const sql = neon(url);

  await sql`CREATE TABLE IF NOT EXISTS experiments (
    id text PRIMARY KEY,
    title text NOT NULL,
    status text NOT NULL,
    age_bands text[] NOT NULL DEFAULT '{}',
    domains text[] NOT NULL DEFAULT '{}',
    learning_goal text NOT NULL DEFAULT '',
    time_minutes integer NOT NULL DEFAULT 30,
    mess_level text NOT NULL DEFAULT 'medium',
    location text NOT NULL DEFAULT 'indoor',
    materials jsonb NOT NULL DEFAULT '[]'::jsonb,
    products jsonb NOT NULL DEFAULT '[]'::jsonb,
    prep text NOT NULL DEFAULT '',
    safety text NOT NULL DEFAULT '',
    experience text NOT NULL DEFAULT '',
    kid_can_do jsonb NOT NULL DEFAULT '[]'::jsonb,
    adult_role jsonb NOT NULL DEFAULT '[]'::jsonb,
    steps jsonb NOT NULL DEFAULT '[]'::jsonb,
    notice jsonb NOT NULL DEFAULT '[]'::jsonb,
    stretch text NOT NULL DEFAULT '',
    notes_from_home text NOT NULL DEFAULT '',
    hero_image_url text,
    gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
    featured boolean NOT NULL DEFAULT false,
    ran_on date,
    planned_for date,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    source text NOT NULL DEFAULT 'website',
    created_at timestamptz NOT NULL DEFAULT now()
  )`;


  await sql`CREATE TABLE IF NOT EXISTS faq_entries (
    id serial PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0
  )`;

  await sql`ALTER TABLE experiments ADD COLUMN IF NOT EXISTS products jsonb NOT NULL DEFAULT '[]'::jsonb`;
  await sql`ALTER TABLE experiments ADD COLUMN IF NOT EXISTS ran_on date`;
  await sql`ALTER TABLE experiments ADD COLUMN IF NOT EXISTS planned_for date`;

  await sql`CREATE TABLE IF NOT EXISTS poll_weeks (
    id text PRIMARY KEY,
    title text NOT NULL,
    closes_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS poll_options (
    id text PRIMARY KEY,
    week_id text NOT NULL REFERENCES poll_weeks (id),
    title text NOT NULL,
    challenge text NOT NULL,
    blurb text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    vote_count integer NOT NULL DEFAULT 0,
    CONSTRAINT poll_options_vote_count_nonneg CHECK (vote_count >= 0)
  )`;

  await sql`CREATE TABLE IF NOT EXISTS poll_ballots (
    id serial PRIMARY KEY,
    week_id text NOT NULL REFERENCES poll_weeks (id),
    option_id text NOT NULL REFERENCES poll_options (id),
    voter_token text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT poll_ballots_week_voter UNIQUE (week_id, voter_token)
  )`;

  console.log("Schema push OK (CREATE TABLE IF NOT EXISTS).");
}

main().catch((e) => {
  console.error("Schema push failed:", e instanceof Error ? e.message : "error");
  process.exit(1);
});
