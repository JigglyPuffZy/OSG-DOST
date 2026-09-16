SELECT status, COUNT(*) as count
FROM cases
GROUP BY status;

SELECT 
  report_case_number,
  code,
  case_title,
  case_number,
  status
FROM cases
WHERE case_number IS NULL OR case_number = ''
ORDER BY report_case_number;

UPDATE cases
SET status = 'pending'
WHERE status IS NULL OR status = '';

SELECT status, COUNT(*) as count
FROM cases
GROUP BY status
ORDER BY status;

SELECT '✅ Case statuses fixed!' AS message;
