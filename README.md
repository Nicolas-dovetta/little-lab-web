# Weekend Experiments

Public web app for curated kids experiment ideas (ages 1–5).
Product bot: Little Lab. Content repo: `Nicolas-dovetta/little-lab`.
Domain: weekend-experiments.app

## Env (Vercel / local)

- `DATABASE_URL` — Neon Postgres connection string
- `RESEND_API_KEY` — optional; enables email notify on contact form submits (messages still save to DB without it)
- `CONTACT_TO_EMAIL` — optional; defaults to `nicolas.dovetta@gmail.com`
- `CONTACT_FROM_EMAIL` — optional; defaults to `onboarding@resend.dev`

## Experiment dates (`ranOn` and `plannedFor`)

Both are America/Los_Angeles calendar dates, **not** `created_at`.

- `ranOn` — the Saturday the experiment was actually run.
- `plannedFor` — the upcoming Saturday for a `planned` session. Independent of `ranOn`.

1. Set `ranOn` and/or `plannedFor` as `"YYYY-MM-DD"` on the experiment in `src/data/seed.ts`. Omit the field or use `null` when the Saturday is unknown — do not invent a date.
2. Apply the columns on Neon (idempotent):
   - `scripts/migrate-ran-on.sql` and `scripts/migrate-planned-for.sql`, or
   - `npm run db:push` (both `ALTER`s are in `scripts/push-schema.ts`).
3. Reseed: `npm run db:seed`

Known `ranOn` dates: Density Layers `2026-09-05`, Salt ice fishing `2026-09-12`, Baking-soda volcano `2026-09-19`. Cinnamon soap rush is left null.

Known `plannedFor` dates: Cornstarch thickening fluid `2026-09-26`, Water-bottle rocket `2026-10-03`.

The experiments index **Done** filter groups `winner` and `tested`. **Planned** filters `status === "planned"`. A planned chip includes the Saturday when `plannedFor` is set (`Planned · Sat Sep 26`). Winner chips stay Winner.
