SELECT DISTINCT status, COUNT(*) as count
FROM cases
GROUP BY status
ORDER BY count DESC;

SELECT 
  report_case_number,
  code,
  case_title,
  status
FROM cases
WHERE status = 'closed' OR status = 'Closed'
ORDER BY report_case_number;

SELECT 
  report_case_number,
  code,
  case_title,
  status,
  case_number
FROM cases
ORDER BY report_case_number;
