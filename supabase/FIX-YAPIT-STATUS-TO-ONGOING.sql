-- =============================================================================
-- FIX CASE #5 (YAPIT) STATUS FROM "CLOSED" TO "ONGOING"
-- =============================================================================
-- Per user instruction: NO cases should be marked as "closed"
-- Case #5 has a Judgment Based on Compromise dated November 13, 2024
-- But it should still be marked as "ongoing" not "closed"
-- =============================================================================

-- Check current status
SELECT 
  report_case_number,
  code,
  case_title,
  status,
  case_number
FROM cases
WHERE code = 'c-yapit-001';

-- Update Case #5 (Yapit) from "closed" to "ongoing"
UPDATE cases
SET status = 'ongoing',
    last_updated = NOW()
WHERE code = 'c-yapit-001';

-- Verify the change
SELECT 
  report_case_number,
  code,
  case_title,
  status,
  case_number
FROM cases
WHERE code = 'c-yapit-001';

-- Check overall status counts (should now be: 35 pending, 7 ongoing, 0 closed, 1 archived)
SELECT 
  status,
  COUNT(*) as count
FROM cases
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'ongoing' THEN 2
    WHEN 'closed' THEN 3
    WHEN 'archived' THEN 4
  END;

SELECT '✅ Case #5 (Yapit) status changed from "closed" to "ongoing"!' AS message;
