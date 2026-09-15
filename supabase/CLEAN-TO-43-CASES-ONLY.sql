-- =============================================================================
-- NUCLEAR OPTION: DELETE ALL CASES AND START FRESH WITH 43 ONLY
-- =============================================================================
-- This will show you ALL cases, then give you option to delete everything
-- and keep only the 43 correct ones
-- =============================================================================

-- Step 1: Show ALL cases currently in database
SELECT 
  id,
  code,
  report_case_number,
  case_title,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = cases.id) as remarks_count
FROM cases
ORDER BY report_case_number, id;

-- Step 2: Show total count
SELECT COUNT(*) as total_cases FROM cases;

-- Step 3: Show duplicates by report_case_number
SELECT 
  report_case_number,
  COUNT(*) as duplicate_count,
  STRING_AGG(case_title, ' | ') as all_titles
FROM cases
WHERE report_case_number IS NOT NULL
GROUP BY report_case_number
HAVING COUNT(*) > 1
ORDER BY report_case_number;

-- =============================================================================
-- OPTION A: Delete EVERYTHING and start fresh
-- =============================================================================
-- Uncomment these lines if you want to delete EVERYTHING:
-- DELETE FROM case_status_updates;
-- DELETE FROM case_activity;
-- DELETE FROM case_files;
-- DELETE FROM cases;
-- Then run INSERT-ALL-43-CASES-VERBATIM.sql again

-- =============================================================================
-- OPTION B: Keep only ONE case per report_case_number (1-43)
-- =============================================================================
BEGIN;

-- Delete duplicate cases, keeping only the NEWEST one for each report_case_number
DELETE FROM cases
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      report_case_number,
      ROW_NUMBER() OVER (
        PARTITION BY report_case_number 
        ORDER BY id DESC
      ) as rn
    FROM cases
    WHERE report_case_number IS NOT NULL
  ) t
  WHERE rn > 1
);

-- Delete cases with NULL report_case_number (shouldn't exist)
DELETE FROM cases WHERE report_case_number IS NULL;

-- Delete cases with report_case_number > 43 (shouldn't exist)
DELETE FROM cases WHERE report_case_number > 43;

-- Delete orphaned status updates
DELETE FROM case_status_updates
WHERE case_id NOT IN (SELECT id FROM cases);

-- Delete orphaned activity
DELETE FROM case_activity
WHERE case_id NOT IN (SELECT id FROM cases);

-- Delete orphaned files
DELETE FROM case_files
WHERE case_id NOT IN (SELECT id FROM cases);

COMMIT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT '✅ CLEANUP COMPLETE!' AS message;

-- Should show exactly 43 cases
SELECT COUNT(*) as total_cases FROM cases;

-- Should show cases 1-43 with no gaps
SELECT 
  report_case_number,
  code,
  case_title,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = cases.id) as remarks_count
FROM cases
ORDER BY report_case_number;

-- Check for any missing case numbers (should be empty)
SELECT 
  generate_series as missing_case_number
FROM generate_series(1, 43)
WHERE generate_series NOT IN (SELECT report_case_number FROM cases)
ORDER BY generate_series;
