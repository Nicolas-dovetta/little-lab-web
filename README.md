# Weekend Experiments

Public web app for curated kids experiment ideas (ages 1 and up).
Product bot: Little Lab. Content repo: `Nicolas-dovetta/little-lab`.
Domain: weekend-experiments.app

## Env (Vercel / local)

- `DATABASE_URL` — Neon Postgres connection string
- `RESEND_API_KEY` — optional; enables email notify on contact form submits (messages still save to DB without it)
- `CONTACT_TO_EMAIL` — optional; defaults to `nicolas.dovetta@gmail.com`
- `CONTACT_FROM_EMAIL` — optional; defaults to `onboarding@resend.dev`

## Vote (`/vote`)

Parents pick the next experiment. Nav order is Experiments, Plan, Simulators, Vote, About.

One vote per browser: httpOnly cookie `we_vote_token`, plus `localStorage` key `we_vote` so a second click does not count again. Tallies are `poll_options.vote_count` in Neon, backed by one `poll_ballots` row per voter. Unknown option ids are rejected. A light in-memory rate limit (20 POSTs / 10 minutes / IP) sits in front.

Closed is computed from `poll_weeks.closes_at`, not a date baked only into the page. This week closes Saturday Oct 3, 2026, 11:59:59 PM America/Los_Angeles (`TIMESTAMPTZ '2026-10-03 23:59:59 America/Los_Angeles'`). After that, POSTs are rejected and the page shows the winner.

Apply on Neon (idempotent — safe to re-run):

- `scripts/migrate-vote.sql`, or
- `npm run db:vote` with `DATABASE_URL` in `.env.local`

`npm run db:push` creates the empty tables. The SQL file also seeds them. If this week's ballot is missing, the first `/vote` or `/api/vote` request runs that same SQL file (create + seed) and then serves the tallies. Re-running it does not reset votes that are already stored.

Starter votes use mulberry32 seed `20261003` (each option starts at 2, then 20 more are scattered). They sum to 30: Cartesian diver 6, Instant ice 4, Milk fireworks 8, Balloon hovercraft 7, Walking-water rainbow 5. These five are not experiment pages.

## Experiment dates (`ranOn` and `plannedFor`)

Both are America/Los_Angeles calendar dates, **not** `created_at`.

- `ranOn` — the Saturday the experiment was actually run.
- `plannedFor` — the upcoming Saturday for a `planned` session. Independent of `ranOn`.

1. Set `ranOn` and/or `plannedFor` as `"YYYY-MM-DD"` on the experiment in `src/data/seed.ts`. Omit the field or use `null` when the Saturday is unknown — do not invent a date.
2. Apply the columns on Neon (idempotent):
   - `scripts/migrate-ran-on.sql` and `scripts/migrate-planned-for.sql`, or
   - `npm run db:push` (both `ALTER`s are in `scripts/push-schema.ts`).
3. Reseed: `npm run db:seed`

Known `ranOn` dates: Density Layers `2026-09-05`, Salt ice fishing `2026-09-12`, Baking-soda volcano `2026-09-19`, Cornstarch thickening fluid `2026-09-26`. Cinnamon soap rush is left null.

Known `plannedFor` dates: Water-bottle rocket `2026-10-03`.

The experiments index **Done** filter groups `winner` and `tested`. **Planned** filters `status === "planned"`. A planned chip includes the Saturday when `plannedFor` is set (`Planned · Sat Sep 26`). Winner chips stay Winner.

## Physics sketches in Mechanism (`knowThis.panels`)

Each sketch panel renders full width of the text column directly above its own walk-through paragraphs (the "Bear with me" Mechanism section).

- `knowThis.mechanism` is plain paragraphs (blank line between them) with `<!-- panel:N -->` on its own line where panel N starts. These are the same markers the little-lab-mechanics `physics-rewrite.md` files use, so the approved Mechanism text pastes in unchanged.
- `knowThis.panels[N - 1]` is panel N: `{ imageUrl (PNG fallback), webpUrl, alt, width, height }`. Rendered as `<picture>` (WebP source + PNG `<img>`, served as-is so labels stay crisp) with width/height set (no layout shift).
- Text before the first marker is the intro (incl. the arrow key). Panels with no marker show first; without `panels` the old `diagram` layout still works.
- Logic: `src/lib/mechanism.ts` (`mechanismBlocks`), UI: `src/components/MechanismWalkthrough.tsx`, tests: `src/lib/mechanism.test.ts`.

To add a sketched experiment: copy `panel-N-*.png/.webp` to `public/images/experiments/<slug>-physics-panel-N-*.{png,webp}`, paste the rewrite's Mechanism (with markers) into `mechanism`, add the `panels` array in `src/data/seed.ts`, add the slug to `SKETCHED` in `mechanism.test.ts`, and mirror it in Neon (`know_this = know_this || '{"mechanism": …, "panels": […]}'::jsonb`).

## Interactive sims ("Try it" box)

An experiment page can carry an inline sim (lazy iframe): on the volcano pilot spine right after "Bear with me"; on the other pages (rocket, salt ice fishing, density layers) right after the "Bear with me" card.

- Mapping (slug → sim, title, sentence, button, iframe title): `src/lib/sims.ts`. Code-side, no DB change. UI: `src/components/SimTryIt.tsx`.
- The sim is a self-contained static file at `public/sims/<slug>/index.html`, copied from `little-lab-mechanics/sims/<slug>/index.html`. **After any fix to the sim there, re-copy it:**

  ```sh
  node scripts/sync-sims.mjs            # expects ../little-lab-mechanics; or MECHANICS_DIR=/path/to/little-lab-mechanics
  npm test                              # checks the copy is noindex, self-contained and posts its height
  ```

- The copy step adds `<meta name="robots" content="noindex">` (if missing) and a tiny script that posts the sim's height to the page, so the iframe grows to fit (no scroll box inside the page). Until the first message arrives the iframe uses `fallbackHeight`. The iframe is `sandbox="allow-scripts"`.
