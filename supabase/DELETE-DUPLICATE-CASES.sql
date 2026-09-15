-- =============================================================================
-- DELETE DUPLICATE CASES (Keep only 43 cases)
-- =============================================================================
-- This will show duplicates then delete them
-- =============================================================================

BEGIN;

-- First, let's see what duplicates exist
SELECT 
  code,
  case_title,
  COUNT(*) as duplicate_count
FROM cases
GROUP BY code, case_title
HAVING COUNT(*) > 1
ORDER BY code;

-- Show all 54 cases to see what's wrong
SELECT 
  id,
  code,
  report_case_number,
  case_title
FROM cases
ORDER BY report_case_number, id;

-- Delete duplicate cases, keeping only the one with the highest ID (most recent)
DELETE FROM cases
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY code 
        ORDER BY id DESC
      ) as rn
    FROM cases
  ) t
  WHERE rn > 1
);

-- Also delete any orphaned status updates (updates with no case)
DELETE FROM case_status_updates
WHERE case_id NOT IN (SELECT id FROM cases);

COMMIT;

-- Verify we now have exactly 43 cases
SELECT 
  COUNT(*) as total_cases,
  MIN(report_case_number) as min_case_num,
  MAX(report_case_number) as max_case_num
FROM cases;

-- Show final list
SELECT 
  report_case_number,
  code,
  case_title,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = cases.id) as remarks_count
FROM cases
ORDER BY report_case_number;

SELECT '✅ DUPLICATE CASES DELETED! Should have 43 cases now.' AS message;
