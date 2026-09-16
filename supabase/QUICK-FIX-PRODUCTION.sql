ALTER TABLE cases 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS cases_deleted_at_idx ON cases (deleted_at);

SELECT 'Column added! Now run UPDATE-VIEWS-FOR-SOFT-DELETE.sql' AS next_step;
