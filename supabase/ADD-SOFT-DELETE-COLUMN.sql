ALTER TABLE cases 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS cases_deleted_at_idx ON cases (deleted_at);

SELECT 'Soft delete column added successfully!' AS message;

SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'cases' 
  AND column_name = 'deleted_at';
