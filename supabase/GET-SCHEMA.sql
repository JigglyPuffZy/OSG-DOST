-- =============================================================================
-- GET DATABASE SCHEMA
-- =============================================================================
-- Run this to see what columns exist in your tables
-- =============================================================================

-- Get all columns from the cases table
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'cases'
ORDER BY ordinal_position;

-- Get all columns from case_status_updates table
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'case_status_updates'
ORDER BY ordinal_position;
