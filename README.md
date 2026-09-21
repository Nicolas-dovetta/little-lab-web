# Weekend Experiments

Public web app for curated kids experiment ideas (ages 1–5).
Product bot: Little Lab. Content repo: `Nicolas-dovetta/little-lab`.
Domain: weekend-experiments.app

## Env (Vercel / local)

- `DATABASE_URL` — Neon Postgres connection string
- `RESEND_API_KEY` — optional; enables email notify on contact form submits (messages still save to DB without it)
- `CONTACT_TO_EMAIL` — optional; defaults to `nicolas.dovetta@gmail.com`
- `CONTACT_FROM_EMAIL` — optional; defaults to `onboarding@resend.dev`

## Experiment dates (`ranOn`)

`ranOn` is the Saturday session date shown to parents (America/Los_Angeles calendar date), **not** `created_at`.

1. Set `ranOn: "YYYY-MM-DD"` on the experiment in `src/data/seed.ts`. Omit the field or use `null` when the Saturday is unknown — do not invent a date.
2. Apply the column on Neon (idempotent):
   - `scripts/migrate-ran-on.sql` (`ALTER TABLE experiments ADD COLUMN IF NOT EXISTS ran_on date;`), or
   - `npm run db:push` (same `ALTER` is in `scripts/push-schema.ts`).
3. Reseed: `npm run db:seed`

Known seed dates: Density Layers `2026-09-05`, Salt ice fishing `2026-09-12`, Baking-soda volcano `2026-09-19`. Cinnamon soap rush and cornstarch thickening fluid are left null.
