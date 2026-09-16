-- =============================================================================
-- CHECK ACTUAL STATUS VALUES IN DATABASE
-- =============================================================================

-- Show all unique status values
SELECT DISTINCT status, COUNT(*) as count
FROM cases
GROUP BY status
ORDER BY count DESC;

-- Show which case has "closed" status
SELECT 
  report_case_number,
  code,
  case_title,
  status
FROM cases
WHERE status = 'closed' OR status = 'Closed'
ORDER BY report_case_number;

-- Show full breakdown
SELECT 
  report_case_number,
  code,
  case_title,
  status,
  case_number
FROM cases
ORDER BY report_case_number;
