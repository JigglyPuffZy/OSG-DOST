-- =============================================================================
-- DELETE USIGAN CASE (if it was inserted with errors)
-- This will remove the case and all related records (status updates, activity, files)
-- =============================================================================

-- Option 1: Delete by case title (if you inserted it before)
-- =============================================================================
DELETE FROM cases 
WHERE case_title = 'Republic of the Philippines, rep. by DOST-RO2 v. Florendo R. Usigan';

-- Option 2: Delete by code (if it was inserted with the code c-usigan-001)
-- =============================================================================
-- DELETE FROM cases 
-- WHERE code = 'c-usigan-001';

-- Option 3: Find and delete - this will show you all matching cases first
-- =============================================================================
-- First, run this to see what will be deleted:
SELECT 
  id,
  code,
  case_title,
  case_number,
  status,
  created_at
FROM cases 
WHERE case_title LIKE '%Usigan%'
   OR case_title LIKE '%DOST-RO2%';

-- If you see the wrong case in the results above, copy its code and use:
-- DELETE FROM cases WHERE code = 'paste-the-code-here';

-- =============================================================================
-- VERIFY DELETION
-- =============================================================================
-- Check that the case is gone
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ Case successfully deleted'
    ELSE '✗ Case still exists - check the case_title or code'
  END as result,
  COUNT(*) as remaining_count
FROM cases 
WHERE case_title = 'Republic of the Philippines, rep. by DOST-RO2 v. Florendo R. Usigan';

-- Show updated case statistics
SELECT * FROM case_stats;
