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

SELECT '✏️ Updating Case #5 (Yapit) to "ongoing"...' AS step;
UPDATE cases
SET 
  status = 'ongoing',
  last_updated = NOW()
WHERE code = 'c-yapit-001';

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

SELECT '🔄 Checking case_stats view...' AS step;
SELECT * FROM case_stats;

SELECT '✅ ✅ ✅ FIX COMPLETE! Case #5 (Yapit) changed from "closed" to "ongoing"' AS message;
SELECT '📝 NOTE: Refresh your browser to see the updated stats in the UI' AS reminder;
