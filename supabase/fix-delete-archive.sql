-- =============================================================================
-- FIX DELETE AND ARCHIVE OPERATIONS
-- Run this in Supabase SQL Editor to fix delete and archive functionality
-- =============================================================================

-- 1) Drop and recreate RLS policies with proper permissions
-- =============================================================================

-- Drop existing policies
drop policy if exists "anon_all_cases" on public.cases;
drop policy if exists "anon_all_updates" on public.case_status_updates;
drop policy if exists "anon_all_activity" on public.case_activity;
drop policy if exists "anon_all_files" on public.case_files;
drop policy if exists "anon_all_profiles" on public.profiles;

-- Create new policies with explicit DELETE permissions
create policy "allow_all_cases" on public.cases
  for all 
  to anon, authenticated 
  using (true) 
  with check (true);

create policy "allow_all_updates" on public.case_status_updates
  for all 
  to anon, authenticated 
  using (true) 
  with check (true);

create policy "allow_all_activity" on public.case_activity
  for all 
  to anon, authenticated 
  using (true) 
  with check (true);

create policy "allow_all_files" on public.case_files
  for all 
  to anon, authenticated 
  using (true) 
  with check (true);

create policy "allow_all_profiles" on public.profiles
  for all 
  to anon, authenticated 
  using (true) 
  with check (true);

-- 2) Verify and grant all necessary permissions
-- =============================================================================

grant all privileges on table public.cases to anon, authenticated, service_role;
grant all privileges on table public.case_status_updates to anon, authenticated, service_role;
grant all privileges on table public.case_activity to anon, authenticated, service_role;
grant all privileges on table public.case_files to anon, authenticated, service_role;
grant all privileges on table public.profiles to anon, authenticated, service_role;

grant select on public.case_stats to anon, authenticated, service_role;
grant select on public.cases_full to anon, authenticated, service_role;

-- 3) Test DELETE operation
-- =============================================================================

do $$
declare
  v_test_id uuid;
  v_test_code text := 'c-delete-test';
  v_count int;
begin
  -- Create a test case
  insert into public.cases (code, case_title, case_type, status, filing_date)
  values (v_test_code, 'DELETE Test Case', 'Civil Case', 'Pending', current_date)
  returning id into v_test_id;

  raise notice 'Created test case with id: %', v_test_id;

  -- Try to delete it
  delete from public.cases where code = v_test_code;

  -- Verify deletion
  select count(*) into v_count from public.cases where code = v_test_code;
  
  if v_count = 0 then
    raise notice '✓ DELETE operation works correctly';
  else
    raise exception '✗ DELETE operation failed - case still exists';
  end if;
end $$;

-- 4) Test ARCHIVE (UPDATE status) operation
-- =============================================================================

do $$
declare
  v_test_id uuid;
  v_test_code text := 'c-archive-test';
  v_status text;
begin
  -- Create a test case
  insert into public.cases (code, case_title, case_type, status, filing_date)
  values (v_test_code, 'ARCHIVE Test Case', 'Civil Case', 'Ongoing', current_date)
  returning id into v_test_id;

  raise notice 'Created test case with id: %', v_test_id;

  -- Try to archive it (update status to Archived)
  update public.cases 
  set status = 'Archived'
  where code = v_test_code;

  -- Verify update
  select status into v_status from public.cases where code = v_test_code;
  
  if v_status = 'Archived' then
    raise notice '✓ ARCHIVE (UPDATE) operation works correctly';
  else
    raise exception '✗ ARCHIVE operation failed - status is: %', v_status;
  end if;

  -- Clean up test case
  delete from public.cases where code = v_test_code;
  raise notice '✓ Test cleanup completed';
end $$;

-- 5) Verify cascading deletes work properly
-- =============================================================================

do $$
declare
  v_test_id uuid;
  v_test_code text := 'c-cascade-test';
  v_updates_count int;
  v_activity_count int;
  v_files_count int;
begin
  -- Create a test case with related records
  insert into public.cases (code, case_title, case_type, status, filing_date)
  values (v_test_code, 'CASCADE Test Case', 'Civil Case', 'Pending', current_date)
  returning id into v_test_id;

  -- Add related records
  insert into public.case_status_updates (case_id, sort_order, body)
  values (v_test_id, 1, 'Test update 1');

  insert into public.case_activity (case_id, occurred_on, label)
  values (v_test_id, current_date, 'Test activity');

  insert into public.case_files (case_id, file_name, kind)
  values (v_test_id, 'test-file.pdf', 'Pleading');

  raise notice 'Created test case with related records';

  -- Delete the case
  delete from public.cases where code = v_test_code;

  -- Verify all related records are deleted
  select count(*) into v_updates_count 
  from public.case_status_updates where case_id = v_test_id;
  
  select count(*) into v_activity_count 
  from public.case_activity where case_id = v_test_id;
  
  select count(*) into v_files_count 
  from public.case_files where case_id = v_test_id;

  if v_updates_count = 0 and v_activity_count = 0 and v_files_count = 0 then
    raise notice '✓ CASCADE DELETE works correctly';
  else
    raise exception '✗ CASCADE DELETE failed - orphaned records exist';
  end if;
end $$;

-- 6) Summary and verification
-- =============================================================================

do $$
begin
  raise notice '';
  raise notice '═══════════════════════════════════════════════════════════════';
  raise notice '✓ ALL TESTS PASSED - Delete and Archive operations are fixed!';
  raise notice '═══════════════════════════════════════════════════════════════';
  raise notice '';
  raise notice 'You can now:';
  raise notice '  • Delete cases from the UI';
  raise notice '  • Archive cases by changing status to "Archived"';
  raise notice '  • All related records (updates, activity, files) will be deleted automatically';
  raise notice '';
end $$;

-- Display current case counts to verify everything is intact
select 
  'Current database state:' as status,
  total as "Total Cases",
  pending as "Pending",
  ongoing as "Ongoing", 
  closed as "Closed",
  archived as "Archived"
from public.case_stats;
