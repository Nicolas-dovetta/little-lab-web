-- Saturday session date published to parents (not created_at)
ALTER TABLE experiments ADD COLUMN IF NOT EXISTS ran_on date;
