-- =============================================================================
-- NUCLEAR RESET: Delete everything and insert clean 43 cases
-- =============================================================================
-- This will give you a fresh start with exactly 43 cases
-- =============================================================================

-- Step 1: Delete EVERYTHING
DELETE FROM case_status_updates;
DELETE FROM case_activity;
DELETE FROM case_files;
DELETE FROM cases;

SELECT '✅ Database cleared! Now run INSERT-ALL-43-CASES-VERBATIM.sql' AS message;
SELECT COUNT(*) as remaining_cases FROM cases;
