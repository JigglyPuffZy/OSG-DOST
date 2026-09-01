-- =============================================================================
-- OSG DOST TASK FORCE — SQL REFERENCE (optional queries)
-- =============================================================================
--
-- PARA I-SETUP ANG SYSTEM (MINSAN LANG):
--   → Gamitin ang supabase/SETUP.sql — isang file lang, kopyahin lahat, RUN
--
-- Ang file na ito ay para sa verify at individual queries lang (optional).
--
-- LOGIN:  admindost@gmail.com  /  Admin123  (Mary Ann D. Carpiso)
--
-- =============================================================================


-- =============================================================================
-- A) VERIFY — run this block first (read-only, safe)
-- =============================================================================

do $$
begin
  if to_regclass('public.cases') is null then
    raise exception 'Missing tables — run supabase/SETUP.sql (full file) first.';
  end if;
  if to_regclass('public.cases_full') is null then
    raise exception 'Missing cases_full view — run supabase/SETUP.sql again.';
  end if;
  if to_regclass('public.case_stats') is null then
    raise exception 'Missing case_stats view — run supabase/SETUP.sql again.';
  end if;
  raise notice 'Database structure OK.';
end $$;

-- Dashboard stats (used by app)
select * from public.case_stats;

-- All cases — simple list
select
  code,
  case_title,
  coalesce(case_number, 'Not Assigned') as case_number,
  coalesce(court, 'Not Assigned') as court,
  status,
  last_updated
from public.cases
order by last_updated desc;

-- Full case file with remarks + timeline + files (used by app on load)
select * from public.cases_full order by last_updated desc;

-- Login user check
select u.id, u.email, u.email_confirmed_at, p.display_name, p.role
from auth.users u
left join public.profiles p on p.user_id = u.id
where u.email = 'admindost@gmail.com';

-- Settings profile
select * from public.profiles;


-- =============================================================================
-- B) SEARCH & FILTER QUERIES (read-only)
-- =============================================================================

-- Search by title or case number
select code, case_title, case_number, status
from public.cases
where case_title ilike '%DOST%'
   or case_number ilike '%DOST%';

-- Pending without case number
select code, case_title, status, case_number
from public.cases
where status = 'Pending'
  and (case_number is null or btrim(case_number) = '');

-- Filter by status
select code, case_title, status, last_updated
from public.cases
where status = 'Ongoing'
order by last_updated desc;

-- Filter by court
select code, case_title, court, status
from public.cases
where court = 'RTC Branch 5';

-- Filing date range
select code, case_title, filing_date, status
from public.cases
where filing_date between '2026-01-01' and '2026-12-31'
order by filing_date desc;

-- Unpaid cases
select code, case_title, payment_status, amount_due, amount_paid
from public.cases
where payment_status = 'Unpaid';

-- Remark bullets for one case
select c.code, u.sort_order, u.body
from public.case_status_updates u
join public.cases c on c.id = u.case_id
where c.code = 'c-001'
order by u.sort_order;

-- Activity timeline for one case
select c.code, a.occurred_on, a.label
from public.case_activity a
join public.cases c on c.id = a.case_id
where c.code = 'c-001'
order by a.occurred_on, a.created_at;

-- Attached files for one case
select c.code, f.file_name, f.kind
from public.case_files f
join public.cases c on c.id = f.case_id
where c.code = 'c-001';


-- =============================================================================
-- C) INSERT — ADD CASE (run ONE block at a time — do not run whole file)
-- =============================================================================

-- insert into public.cases (
--   code, case_title, case_type, case_number, court, status, remarks,
--   filing_date, parties, story, payment_status, amount_due, amount_paid
-- ) values (
--   'c-' || to_char(extract(epoch from now())::bigint, 'FM9999999999'),
--   'New case title here',
--   'Civil Case',
--   null,
--   null,
--   'Pending',
--   'Awaiting case number',
--   current_date,
--   'Plaintiff vs Defendant',
--   'Write the full case story here.',
--   'Unpaid',
--   0,
--   0
-- )
-- returning id, code, case_title, case_number, status;

-- Add remark bullets (replace YOUR_CASE_UUID from returning id above)
-- insert into public.case_status_updates (case_id, sort_order, body) values
--   ('YOUR_CASE_UUID', 1, 'First status remark.'),
--   ('YOUR_CASE_UUID', 2, 'Second status remark.');

-- Add activity log entry
-- insert into public.case_activity (case_id, occurred_on, label) values
--   ('YOUR_CASE_UUID', current_date, 'Case created');


-- =============================================================================
-- D) UPDATE QUERIES (run ONE block at a time)
-- =============================================================================

-- update public.cases
-- set
--   case_title = 'DOST vs. ABC Corporation',
--   status = 'Ongoing',
--   payment_status = 'Unpaid'
-- where code = 'c-001';

-- update public.cases
-- set case_number = '2026-099', court = 'RTC Branch 5'
-- where code = 'c-002' and case_number is null;

-- update public.cases set status = 'Ongoing' where code = 'c-002';
-- insert into public.case_activity (case_id, occurred_on, label)
-- select id, current_date, 'Status updated to Ongoing'
-- from public.cases where code = 'c-002';

-- insert into public.case_status_updates (case_id, sort_order, body)
-- select c.id, coalesce(max(u.sort_order), 0) + 1, 'New status remark here.'
-- from public.cases c
-- left join public.case_status_updates u on u.case_id = c.id
-- where c.code = 'c-001'
-- group by c.id;

-- update public.profiles
-- set
--   display_name = 'Mary Ann D. Carpiso',
--   role = 'Supervising Science Research Specialist',
--   organization = 'OSG DOST Task Force',
--   start_page = 'dashboard',
--   compact_table = false,
--   show_awaiting = true,
--   keep_local_data = false
-- where id = (select id from public.profiles order by created_at limit 1);

-- Link profile to auth user manually (if needed)
-- update public.profiles
-- set user_id = 'PASTE_USER_UUID_FROM_auth.users'
-- where id = (select id from public.profiles order by created_at limit 1);


-- =============================================================================
-- E) DELETE QUERIES
-- =============================================================================

-- Delete one case (remarks, activity, files delete automatically)
-- delete from public.cases where code = 'c-012';

-- Delete all remark lines for a case
-- delete from public.case_status_updates
-- where case_id = (select id from public.cases where code = 'c-001');


-- =============================================================================
-- F) TABLES CREATED BY schema.sql (reference)
-- =============================================================================
-- public.cases                  — main docket
-- public.case_status_updates    — Status/Remarks bullet list
-- public.case_activity          — timeline entries
-- public.case_files             — attachments
-- public.profiles               — user settings (linked to auth.users)
-- public.case_stats             — VIEW: dashboard counts
-- public.cases_full             — VIEW: cases + updates + activity + files JSON
--
-- ENUMS: case_status, payment_status, file_kind, start_page
-- =============================================================================
