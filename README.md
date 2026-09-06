# Little Lab

Free curated experiment ideas for parents of kids ages 1-5. Built with Next.js App Router, Tailwind, Neon, and Drizzle.

## Setup

1. Ensure `.env.local` has your Neon connection string.
2. Install dependencies.
3. Run the `db:push` script to apply schema.
4. Run the `db:seed` script to load experiments and FAQ.
5. Run the `dev` script for local development.

## Scripts

- `dev` — local server
- `build` / `start` — production
- `db:push` — apply schema with drizzle-kit
- `db:seed` — upsert experiments + FAQ

## Notes

- In-code seed at `src/data/seed.ts` (also re-exported from `data/seed.ts`) backs the UI if the DB is empty or unavailable.
- Never commit `.env.local`.
