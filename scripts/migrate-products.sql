-- Optional Amazon Associates product links on experiment detail pages
ALTER TABLE experiments ADD COLUMN IF NOT EXISTS products jsonb NOT NULL DEFAULT '[]'::jsonb;
