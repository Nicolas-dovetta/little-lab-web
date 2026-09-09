-- Three-message lesson fields for experiment detail pages
ALTER TABLE experiments ADD COLUMN IF NOT EXISTS say_this jsonb DEFAULT '{}'::jsonb;
ALTER TABLE experiments ADD COLUMN IF NOT EXISTS run_this jsonb DEFAULT '{}'::jsonb;
ALTER TABLE experiments ADD COLUMN IF NOT EXISTS know_this jsonb DEFAULT '{}'::jsonb;
ALTER TABLE experiments ADD COLUMN IF NOT EXISTS traps jsonb DEFAULT '[]'::jsonb;
ALTER TABLE experiments ADD COLUMN IF NOT EXISTS plan_unit text;
