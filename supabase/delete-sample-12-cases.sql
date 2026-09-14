-- =============================================================================
-- DELETE THE 12 ORIGINAL SAMPLE CASES
-- This will remove all the dummy/sample cases from the schema.sql
-- and keep only your real cases (like the Usigan case)
-- =============================================================================

-- Option 1: Delete by specific codes (SAFEST - Recommended)
-- =============================================================================
-- This deletes only the 12 original sample cases from schema.sql

DELETE FROM cases 
WHERE code IN (
  'c-001',  -- DOST vs. ABC Corporation
  'c-002',  -- Administrative Complaint - XYZ
  'c-003',  -- People of the Philippines vs. Reyes
  'c-004',  -- DOST vs. Northern Supply Inc.
  'c-005',  -- Petition for Review - Grant Disbursement
  'c-006',  -- OSG vs. MetroTech Solutions
  'c-007',  -- Administrative Case - Procurement Irregularity
  'c-008',  -- Civil Action for Recovery of Public Funds
  'c-009',  -- DOST vs. Pacific Research Group
  'c-010',  -- Injunction - Unauthorized Use of Research Data
  'c-011',  -- Complaint for Collection of Sum of Money
  'c-012'   -- Special Civil Action - Mandamus
);

-- Verify deletion
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ All 12 sample cases deleted successfully!'
    ELSE CONCAT('⚠ Still ', COUNT(*), ' sample cases remaining')
  END as result
FROM cases 
WHERE code IN ('c-001','c-002','c-003','c-004','c-005','c-006',
               'c-007','c-008','c-009','c-010','c-011','c-012');

-- Show remaining cases (should only show your real cases like Usigan)
SELECT 
  code,
  case_title,
  case_number,
  status
FROM cases
ORDER BY created_at DESC;

-- Show updated statistics
SELECT 
  'After deleting 12 sample cases' as info,
  total as "Total Cases",
  pending as "Pending",
  ongoing as "Ongoing",
  closed as "Closed",
  archived as "Archived"
FROM case_stats;

-- =============================================================================
-- Option 2: Nuclear option - Delete ALL cases except Usigan (use with caution)
-- =============================================================================
-- Uncomment below if you want to delete EVERYTHING except Usigan

/*
DELETE FROM cases 
WHERE code != 'c-usigan-001';

SELECT 'Deleted all cases except Usigan' as result;
SELECT * FROM case_stats;
*/

-- =============================================================================
-- Option 3: Keep some sample cases, delete others
-- =============================================================================
-- For example, if you want to keep c-001 and c-002 but delete the rest:

/*
DELETE FROM cases 
WHERE code IN (
  'c-003','c-004','c-005','c-006','c-007','c-008',
  'c-009','c-010','c-011','c-012'
);
*/
