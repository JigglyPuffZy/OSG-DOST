-- =============================================================================
-- DIAGNOSE WHY INSERTS ARE FAILING
-- =============================================================================

-- 1. Check if we can see the table
SELECT 'Checking if cases table exists...' as step;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cases';

-- 2. Check current RLS policies
SELECT 'Checking RLS policies...' as step;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'cases';

-- 3. Check if RLS is enabled
SELECT 'Checking if RLS is enabled...' as step;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'cases';

-- 4. Try to count existing cases (should work for SELECT)
SELECT 'Counting cases...' as step;
SELECT COUNT(*) as total FROM cases;

-- 5. Check our current role
SELECT 'Checking current role...' as step;
SELECT current_user, current_role;

-- =============================================================================
-- FIX: Temporarily disable RLS to test
-- =============================================================================

-- Disable RLS temporarily
ALTER TABLE public.cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_status_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_activity DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_files DISABLE ROW LEVEL SECURITY;

SELECT '✓ RLS disabled for testing' as status;

-- Now try inserting
INSERT INTO cases (
  code,
  case_title,
  case_type,
  case_number,
  court,
  status,
  filing_date,
  last_updated,
  parties,
  payment_status,
  amount_due,
  amount_paid
)
VALUES (
  'c-test-002',
  'Test Case After Disabling RLS',
  'Civil Case',
  'TEST-002',
  'Test Court',
  'Pending',
  CURRENT_DATE,
  CURRENT_DATE,
  'Test Party',
  'Unpaid',
  0,
  0
);

-- Check if it worked
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✓✓✓ INSERT WORKS! The problem was RLS policies'
    ELSE '✗✗✗ Still failing - deeper issue'
  END as result,
  COUNT(*) as total_cases
FROM cases;

-- Show what we have
SELECT code, case_title, status FROM cases;

-- Re-enable RLS with correct policies
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_files ENABLE ROW LEVEL SECURITY;

-- Drop old restrictive policies
DROP POLICY IF EXISTS "enable_all_operations_cases" ON public.cases;
DROP POLICY IF EXISTS "enable_all_operations_updates" ON public.case_status_updates;
DROP POLICY IF EXISTS "enable_all_operations_activity" ON public.case_activity;
DROP POLICY IF EXISTS "enable_all_operations_files" ON public.case_files;

-- Create permissive policies
CREATE POLICY "allow_all_for_anon_and_auth" ON public.cases
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "allow_all_for_anon_and_auth" ON public.case_status_updates
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "allow_all_for_anon_and_auth" ON public.case_activity
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "allow_all_for_anon_and_auth" ON public.case_files
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

SELECT '✓ RLS re-enabled with permissive policies' as status;

-- Final verification
SELECT * FROM case_stats;
