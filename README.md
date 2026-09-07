# Weekend Experiments

Public web app for curated kids experiment ideas (ages 1–5).
Product bot: Little Lab. Content repo: `Nicolas-dovetta/little-lab`.
Domain: weekend-experiments.app

## Env (Vercel / local)

- `DATABASE_URL` — Neon Postgres connection string
- `RESEND_API_KEY` — optional; enables email notify on contact form submits (messages still save to DB without it)
- `CONTACT_TO_EMAIL` — optional; defaults to `nicolas.dovetta@gmail.com`
- `CONTACT_FROM_EMAIL` — optional; defaults to `onboarding@resend.dev`
