-- =============================================================================
-- FIND ALL CASES - Let's see what's actually in the database
-- =============================================================================

-- Show ALL cases to find the Usigan case
SELECT 
  code,
  case_title,
  case_number,
  court,
  status,
  created_at
FROM cases
ORDER BY created_at DESC;

-- =============================================================================
-- If you see the Usigan case above, copy its CODE and run one of these:
-- =============================================================================

-- Option 1: Delete by exact code (RECOMMENDED)
-- Replace 'c-xxx' with the actual code from the results above
-- DELETE FROM cases WHERE code = 'c-xxx';

-- Option 2: Delete ALL cases with 'usigan' in the title (case insensitive)
-- DELETE FROM cases WHERE LOWER(case_title) LIKE '%usigan%';

-- Option 3: Delete ALL cases with 'dost-ro2' in the title (case insensitive)  
-- DELETE FROM cases WHERE LOWER(case_title) LIKE '%dost-ro2%';

-- Option 4: Delete the most recently created case
-- DELETE FROM cases WHERE id = (SELECT id FROM cases ORDER BY created_at DESC LIMIT 1);

-- =============================================================================
-- After you choose and run ONE of the delete options above, verify:
-- =============================================================================

SELECT * FROM case_stats;
