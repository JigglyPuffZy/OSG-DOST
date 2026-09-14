-- =============================================================================
-- RUN THIS FIRST: Fix RLS Policies to Allow Delete
-- Then you can delete the Usigan case
-- =============================================================================

-- STEP 1: Fix Row Level Security Policies
-- =============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "anon_all_cases" ON public.cases;
DROP POLICY IF EXISTS "anon_all_updates" ON public.case_status_updates;
DROP POLICY IF EXISTS "anon_all_activity" ON public.case_activity;
DROP POLICY IF EXISTS "anon_all_files" ON public.case_files;
DROP POLICY IF EXISTS "allow_all_cases" ON public.cases;
DROP POLICY IF EXISTS "allow_all_updates" ON public.case_status_updates;
DROP POLICY IF EXISTS "allow_all_activity" ON public.case_activity;
DROP POLICY IF EXISTS "allow_all_files" ON public.case_files;

-- Create new permissive policies that allow DELETE
CREATE POLICY "enable_all_operations_cases" ON public.cases
  FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "enable_all_operations_updates" ON public.case_status_updates
  FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "enable_all_operations_activity" ON public.case_activity
  FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "enable_all_operations_files" ON public.case_files
  FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

-- Grant full permissions
GRANT ALL ON TABLE public.cases TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.case_status_updates TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.case_activity TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.case_files TO anon, authenticated, service_role;

-- =============================================================================
-- STEP 2: Now Delete the Usigan Case
-- =============================================================================

DO $$
DECLARE
  v_count_before INT;
  v_count_after INT;
BEGIN
  -- Count before
  SELECT COUNT(*) INTO v_count_before
  FROM cases 
  WHERE case_title LIKE '%Usigan%' OR case_title LIKE '%DOST-RO2%';
  
  RAISE NOTICE 'Cases matching Usigan before delete: %', v_count_before;
  
  -- Delete the case
  DELETE FROM cases 
  WHERE case_title = 'Republic of the Philippines, rep. by DOST-RO2 v. Florendo R. Usigan';
  
  -- Count after
  SELECT COUNT(*) INTO v_count_after
  FROM cases 
  WHERE case_title LIKE '%Usigan%' OR case_title LIKE '%DOST-RO2%';
  
  RAISE NOTICE 'Cases matching Usigan after delete: %', v_count_after;
  
  IF v_count_before > v_count_after THEN
    RAISE NOTICE '✓ SUCCESS: Deleted % case(s)', (v_count_before - v_count_after);
  ELSIF v_count_before = 0 THEN
    RAISE NOTICE '⚠ No Usigan cases found - nothing to delete';
  ELSE
    RAISE NOTICE '✗ DELETE FAILED - RLS may still be blocking';
  END IF;
END $$;

-- =============================================================================
-- STEP 3: Verify Results
-- =============================================================================

-- Show remaining cases
SELECT 
  code,
  case_title,
  case_number,
  status
FROM cases
ORDER BY created_at DESC;

-- Show updated statistics
SELECT 
  '✓ Delete operation completed' as status,
  total as "Total Cases",
  pending as "Pending",
  ongoing as "Ongoing",
  closed as "Closed",
  archived as "Archived"
FROM case_stats;

-- =============================================================================
-- BONUS: Test that delete now works
-- =============================================================================

DO $$
DECLARE
  v_test_id UUID;
BEGIN
  -- Create test case
  INSERT INTO cases (code, case_title, case_type, status, filing_date)
  VALUES ('c-delete-test-999', 'TEST DELETE CASE', 'Civil Case', 'Pending', CURRENT_DATE)
  RETURNING id INTO v_test_id;
  
  RAISE NOTICE 'Created test case';
  
  -- Try to delete it
  DELETE FROM cases WHERE code = 'c-delete-test-999';
  
  -- Check if deleted
  IF NOT EXISTS (SELECT 1 FROM cases WHERE id = v_test_id) THEN
    RAISE NOTICE '✓✓✓ DELETE IS NOW WORKING! You can now delete cases from the UI.';
  ELSE
    RAISE EXCEPTION '✗✗✗ DELETE STILL NOT WORKING - Contact support';
  END IF;
END $$;
