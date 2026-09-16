SELECT 
  id,
  code,
  case_title,
  case_number,
  status,
  deleted_at
FROM cases
WHERE deleted_at IS NOT NULL
ORDER BY deleted_at DESC;

SELECT COUNT(*) as deleted_count
FROM cases
WHERE deleted_at IS NOT NULL;
