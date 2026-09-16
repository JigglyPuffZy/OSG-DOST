-- =============================================================================
-- 🔧 FIX DATABASE: REMOVE "CLOSED" STATUS - SET YAPIT TO "ONGOING"
-- =============================================================================
-- PROBLEM: Dashboard shows 1 closed case but there should be 0 closed cases
-- SOLUTION: Update Case #5 (Yapit) from "closed" to "ongoing"
-- EXPECTED RESULT: 35 pending, 7 ongoing, 0 closed, 1 archived
-- =============================================================================

-- 1️⃣ CHECK CURRENT STATUS DISTRIBUTION
SELECT '📊 BEFORE: Current status distribution' AS step;
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

-- 2️⃣ IDENTIFY WHICH CASE IS "CLOSED"
SELECT '🔍 Which case is marked as "closed"?' AS step;
SELECT 
  report_case_number,
  code,
  case_title,
  status,
  case_number,
  last_updated
FROM cases
WHERE status = 'closed' OR status = 'Closed'
ORDER BY report_case_number;

-- 3️⃣ UPDATE CASE #5 (YAPIT) FROM "CLOSED" TO "ONGOING"
SELECT '✏️ Updating Case #5 (Yapit) to "ongoing"...' AS step;
UPDATE cases
SET 
  status = 'ongoing',
  last_updated = NOW()
WHERE code = 'c-yapit-001';

-- 4️⃣ VERIFY THE UPDATE
SELECT '✅ AFTER: Case #5 (Yapit) is now:' AS step;
SELECT 
  report_case_number,
  code,
  case_title,
  status,
  case_number,
  last_updated
FROM cases
WHERE code = 'c-yapit-001';

-- 5️⃣ CHECK NEW STATUS DISTRIBUTION
SELECT '📊 AFTER: New status distribution (should be: 35 pending, 7 ongoing, 0 closed, 1 archived)' AS step;
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

-- 6️⃣ REFRESH THE CASE_STATS VIEW (Optional - view should auto-update)
SELECT '🔄 Checking case_stats view...' AS step;
SELECT * FROM case_stats;

-- 7️⃣ FINAL CONFIRMATION
SELECT '✅ ✅ ✅ FIX COMPLETE! Case #5 (Yapit) changed from "closed" to "ongoing"' AS message;
SELECT '📝 NOTE: Refresh your browser to see the updated stats in the UI' AS reminder;

