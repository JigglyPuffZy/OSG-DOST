-- =============================================================================
-- CHECK DATABASE DATA
-- =============================================================================
-- Run this to see if your data was inserted correctly
-- =============================================================================

-- Check how many cases exist
SELECT 'Total cases:' AS info, COUNT(*) AS count FROM cases;

-- Check how many status updates exist
SELECT 'Total status updates:' AS info, COUNT(*) AS count FROM case_status_updates;

-- Check first 10 cases with their status update counts
SELECT 
  c.report_case_number,
  c.code,
  c.case_title,
  c.status,
  COUNT(csu.id) AS status_updates_count
FROM cases c
LEFT JOIN case_status_updates csu ON c.id = csu.case_id
GROUP BY c.id, c.report_case_number, c.code, c.case_title, c.status
ORDER BY c.report_case_number
LIMIT 10;

-- Check if any status updates exist for case 1 (Usigan)
SELECT 
  c.code,
  c.case_title,
  csu.sort_order,
  LEFT(csu.body, 100) AS remark_preview
FROM cases c
LEFT JOIN case_status_updates csu ON c.id = csu.case_id
WHERE c.code = 'c-usigan-001'
ORDER BY csu.sort_order;
