-- Vote ballot for the weekend of Oct 10, 2026.
-- Closes Saturday Oct 3, 2026, 11:59:59 PM America/Los_Angeles (PDT).
-- Open while now() <= closes_at. Idempotent: safe to re-run.
--
-- Starter votes use mulberry32 seed 20261003 (each option starts at 2,
-- then the rest are scattered across six options). Totals sum to 30:
--   cartesian-diver      4
--   instant-ice          4
--   milk-fireworks       4
--   balloon-hovercraft   9
--   walking-water        5
--   candle               4
-- Re-running replaces seed-* ballots only. Real voter tokens stay.

CREATE TABLE IF NOT EXISTS poll_weeks (
  id text PRIMARY KEY,
  title text NOT NULL,
  closes_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poll_options (
  id text PRIMARY KEY,
  week_id text NOT NULL REFERENCES poll_weeks (id),
  title text NOT NULL,
  challenge text NOT NULL,
  blurb text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  vote_count integer NOT NULL DEFAULT 0,
  CONSTRAINT poll_options_vote_count_nonneg CHECK (vote_count >= 0)
);

CREATE TABLE IF NOT EXISTS poll_ballots (
  id serial PRIMARY KEY,
  week_id text NOT NULL REFERENCES poll_weeks (id),
  option_id text NOT NULL REFERENCES poll_options (id),
  voter_token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT poll_ballots_week_voter UNIQUE (week_id, voter_token)
);

INSERT INTO poll_weeks (id, title, closes_at)
VALUES (
  '2026-10-10',
  'What we build the weekend of Oct 10',
  TIMESTAMPTZ '2026-10-03 23:59:59 America/Los_Angeles'
)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    closes_at = EXCLUDED.closes_at;

INSERT INTO poll_options (id, week_id, title, challenge, blurb, sort_order)
VALUES
  (
    'cartesian-diver',
    '2026-10-10',
    'Cartesian diver',
    'Sink a diver without touching it',
    'Squeeze a closed bottle and watch an eyedropper dive and float. Pressure + buoyancy.',
    1
  ),
  (
    'instant-ice',
    '2026-10-10',
    'Instant ice',
    'Freeze water by pouring it',
    'Supercooled bottle water turns to ice the moment it hits ice or you slap it. Phase change drama.',
    2
  ),
  (
    'milk-fireworks',
    '2026-10-10',
    'Milk fireworks',
    'Make colors explode on milk',
    'Food coloring dots on milk, then a soap drop — colors race as surface tension collapses.',
    3
  ),
  (
    'balloon-hovercraft',
    '2026-10-10',
    'Balloon hovercraft',
    'Ride a CD on air',
    'Balloon + old CD + bottle cap = a hovercraft that glides on a cushion of air.',
    4
  ),
  (
    'walking-water',
    '2026-10-10',
    'Walking-water rainbow',
    'Make water climb between cups',
    'Paper towels bridge colored cups; water walks and mixes into a rainbow. Capillary action.',
    5
  ),
  (
    'candle',
    '2026-10-10',
    'Candle in a glass',
    'Make a candle pull water up',
    'Light a candle under a jar over a dish of water; when the flame goes out, water climbs. Air, pressure, and cooling — the classic kids demo.',
    6
  )
ON CONFLICT (id) DO UPDATE
SET week_id = EXCLUDED.week_id,
    title = EXCLUDED.title,
    challenge = EXCLUDED.challenge,
    blurb = EXCLUDED.blurb,
    sort_order = EXCLUDED.sort_order;

DELETE FROM poll_ballots
WHERE week_id = '2026-10-10'
  AND voter_token LIKE 'seed-2026-10-10-%';

INSERT INTO poll_ballots (week_id, option_id, voter_token)
VALUES
  ('2026-10-10', 'cartesian-diver', 'seed-2026-10-10-01'),
  ('2026-10-10', 'cartesian-diver', 'seed-2026-10-10-02'),
  ('2026-10-10', 'cartesian-diver', 'seed-2026-10-10-03'),
  ('2026-10-10', 'cartesian-diver', 'seed-2026-10-10-04'),
  ('2026-10-10', 'instant-ice', 'seed-2026-10-10-05'),
  ('2026-10-10', 'instant-ice', 'seed-2026-10-10-06'),
  ('2026-10-10', 'instant-ice', 'seed-2026-10-10-07'),
  ('2026-10-10', 'instant-ice', 'seed-2026-10-10-08'),
  ('2026-10-10', 'milk-fireworks', 'seed-2026-10-10-09'),
  ('2026-10-10', 'milk-fireworks', 'seed-2026-10-10-10'),
  ('2026-10-10', 'milk-fireworks', 'seed-2026-10-10-11'),
  ('2026-10-10', 'milk-fireworks', 'seed-2026-10-10-12'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-13'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-14'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-15'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-16'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-17'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-18'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-19'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-20'),
  ('2026-10-10', 'balloon-hovercraft', 'seed-2026-10-10-21'),
  ('2026-10-10', 'walking-water', 'seed-2026-10-10-22'),
  ('2026-10-10', 'walking-water', 'seed-2026-10-10-23'),
  ('2026-10-10', 'walking-water', 'seed-2026-10-10-24'),
  ('2026-10-10', 'walking-water', 'seed-2026-10-10-25'),
  ('2026-10-10', 'walking-water', 'seed-2026-10-10-26'),
  ('2026-10-10', 'candle', 'seed-2026-10-10-27'),
  ('2026-10-10', 'candle', 'seed-2026-10-10-28'),
  ('2026-10-10', 'candle', 'seed-2026-10-10-29'),
  ('2026-10-10', 'candle', 'seed-2026-10-10-30')
ON CONFLICT (week_id, voter_token) DO NOTHING;

UPDATE poll_options AS option
SET vote_count = (
  SELECT COUNT(*)::int
  FROM poll_ballots AS ballot
  WHERE ballot.option_id = option.id
    AND ballot.week_id = option.week_id
)
WHERE option.week_id = '2026-10-10';
