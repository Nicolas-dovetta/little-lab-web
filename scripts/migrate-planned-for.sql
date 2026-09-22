-- Upcoming Saturday, separate from ran_on (the Saturday it was actually run)
ALTER TABLE experiments ADD COLUMN IF NOT EXISTS planned_for date;
