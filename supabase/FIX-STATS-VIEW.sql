-- =============================================================================
-- FIX CASE STATS VIEW
-- =============================================================================

-- Drop and recreate the case_stats view
DROP VIEW IF EXISTS case_stats CASCADE;

CREATE OR REPLACE VIEW case_stats AS
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending,
  COUNT(*) FILTER (WHERE status = 'ongoing') AS ongoing,
  COUNT(*) FILTER (WHERE status = 'closed') AS closed,
  COUNT(*) FILTER (WHERE status = 'archived') AS archived,
  COUNT(*) FILTER (WHERE case_number IS NULL OR case_number = '') AS without_number
FROM cases;

-- Test the view
SELECT * FROM case_stats;

-- Also check the raw data
SELECT 
  status,
  COUNT(*) as count
FROM cases
GROUP BY status
ORDER BY status;

SELECT '✅ Stats view recreated!' AS message;
