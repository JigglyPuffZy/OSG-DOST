-- =============================================================================
-- FIX CASE STATUSES AND DOCKET NUMBERS
-- =============================================================================

-- Check current status distribution
SELECT status, COUNT(*) as count
FROM cases
GROUP BY status;

-- Check cases without case_number (NO DOCKET)
SELECT 
  report_case_number,
  code,
  case_title,
  case_number,
  status
FROM cases
WHERE case_number IS NULL OR case_number = ''
ORDER BY report_case_number;

-- Update NULL/empty statuses to 'pending'
UPDATE cases
SET status = 'pending'
WHERE status IS NULL OR status = '';

-- Verify the fix
SELECT status, COUNT(*) as count
FROM cases
GROUP BY status
ORDER BY status;

SELECT '✅ Case statuses fixed!' AS message;
