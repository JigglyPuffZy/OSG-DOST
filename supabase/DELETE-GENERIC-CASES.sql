-- =============================================================================
-- DELETE GENERIC PLACEHOLDER CASES
-- =============================================================================
-- Removes cases with generic names like "Case 22 - DOST-RO2 Legal Matter"
-- These should not exist - only named cases from the verbatim document
-- =============================================================================

BEGIN;

-- First, show which cases will be deleted
SELECT 
  report_case_number,
  code,
  case_title
FROM cases
WHERE case_title LIKE '%DOST-RO2 Legal Matter%'
ORDER BY report_case_number;

-- Delete the generic placeholder cases
DELETE FROM cases
WHERE case_title LIKE '%DOST-RO2 Legal Matter%';

-- Also delete any orphaned status updates
DELETE FROM case_status_updates
WHERE case_id NOT IN (SELECT id FROM cases);

COMMIT;

-- Verify - show remaining cases
SELECT 
  report_case_number,
  code,
  case_title,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = cases.id) as remarks_count
FROM cases
ORDER BY report_case_number;

-- Show total count
SELECT 
  COUNT(*) as total_cases,
  COUNT(CASE WHEN report_case_number IS NOT NULL THEN 1 END) as numbered_cases
FROM cases;

SELECT '✅ GENERIC PLACEHOLDER CASES DELETED!' AS message;
