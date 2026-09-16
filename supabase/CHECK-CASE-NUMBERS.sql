SELECT 
  report_case_number,
  case_title,
  case_number,
  status
FROM cases
ORDER BY report_case_number;

SELECT 
  'Cases WITH case numbers' as category,
  COUNT(*) as count
FROM cases
WHERE case_number IS NOT NULL AND case_number != ''
UNION ALL
SELECT 
  'Cases WITHOUT case numbers (Pre-litigation)' as category,
  COUNT(*) as count
FROM cases
WHERE case_number IS NULL OR case_number = '';
