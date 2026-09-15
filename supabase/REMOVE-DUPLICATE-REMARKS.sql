-- =============================================================================
-- REMOVE DUPLICATE REMARKS
-- =============================================================================
-- This removes duplicate status updates while keeping one copy
-- =============================================================================

BEGIN;

-- First, let's see what duplicates exist
SELECT 
  c.code,
  c.case_title,
  csu.body,
  COUNT(*) as duplicate_count
FROM case_status_updates csu
JOIN cases c ON c.id = csu.case_id
GROUP BY c.code, c.case_title, csu.body
HAVING COUNT(*) > 1
ORDER BY c.code, duplicate_count DESC;

-- Now delete the duplicates, keeping only the one with the lowest ID (first inserted)
DELETE FROM case_status_updates
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY case_id, TRIM(body) 
        ORDER BY id ASC
      ) as rn
    FROM case_status_updates
  ) t
  WHERE rn > 1
);

-- Reorder the sort_order for all cases to ensure they're sequential
WITH ordered_updates AS (
  SELECT 
    id,
    case_id,
    ROW_NUMBER() OVER (PARTITION BY case_id ORDER BY sort_order, id) as new_sort_order
  FROM case_status_updates
)
UPDATE case_status_updates csu
SET sort_order = ou.new_sort_order
FROM ordered_updates ou
WHERE csu.id = ou.id;

COMMIT;

-- Verify the cleanup
SELECT 
  c.report_case_number,
  c.case_title,
  COUNT(csu.id) AS remarks_count
FROM cases c
LEFT JOIN case_status_updates csu ON c.id = csu.case_id
GROUP BY c.id, c.report_case_number, c.case_title
ORDER BY c.report_case_number;

SELECT '✅ DUPLICATES REMOVED AND SORT ORDER FIXED!' AS message;
