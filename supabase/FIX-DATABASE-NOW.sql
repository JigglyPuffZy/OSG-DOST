UPDATE public.cases
SET status = 'ongoing', last_updated = NOW()
WHERE code = 'c-yapit-001';

SELECT 
  status,
  COUNT(*) as count
FROM public.cases
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'ongoing' THEN 2
    WHEN 'closed' THEN 3
    WHEN 'archived' THEN 4
  END;

SELECT '✅ Fixed! Case #5 (Yapit) changed from closed to ongoing' AS message;
