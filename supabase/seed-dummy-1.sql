-- =============================================================================
-- OSG DOST — Seed 1 dummy case (when tables exist but docket is empty)
-- Run in Supabase SQL Editor AFTER schema.sql (or when cases table is empty).
-- Safe to re-run: skips if any case already exists.
-- =============================================================================

do $$
begin
  if to_regclass('public.cases') is null then
    raise exception 'Run supabase/schema.sql first.';
  end if;

  if exists (select 1 from public.cases limit 1) then
    raise notice 'Cases already exist — skipping dummy seed.';
    return;
  end if;
end $$;

insert into public.cases (
  code, case_title, case_type, case_number, court, status, remarks,
  filing_date, last_updated, hearing_date, parties, story,
  payment_status, amount_due, amount_paid
)
select
  'c-001',
  'DOST vs. ABC Corporation',
  'Civil Case',
  '2026-001',
  'RTC Branch 5',
  'Ongoing',
  'For hearing',
  '2026-08-20'::date,
  '2026-08-26'::date,
  '2026-09-03'::date,
  'Republic of the Philippines, represented by DOST (plaintiff) vs. ABC Corporation (defendant)',
  'DOST filed this civil action to recover project funds released to ABC Corporation after the agency found that deliverables were not completed as agreed.',
  'Unpaid',
  1850000,
  0
where not exists (select 1 from public.cases limit 1);

insert into public.case_status_updates (case_id, sort_order, body)
select c.id, u.sort_order, u.body
from public.cases c
cross join (
  values
    (1, 'Complaint filed and docketed as 2026-001.'),
    (2, 'Hearing set for 3 September 2026 before RTC Branch 5.'),
    (3, 'Defendant has not paid the claimed amount of ₱1,850,000.')
) as u(sort_order, body)
where c.code = 'c-001'
  and not exists (
    select 1 from public.case_status_updates x where x.case_id = c.id
  );

insert into public.case_activity (case_id, occurred_on, label)
select c.id, a.occurred_on::date, a.label
from public.cases c
cross join (
  values
    ('2026-08-20', 'Case created'),
    ('2026-08-20', 'Case number assigned'),
    ('2026-08-26', 'Status updated to Ongoing')
) as a(occurred_on, label)
where c.code = 'c-001'
  and not exists (
    select 1 from public.case_activity x where x.case_id = c.id
  );

insert into public.case_files (case_id, file_name, kind)
select c.id, f.file_name, f.kind::public.file_kind
from public.cases c
cross join (
  values
    ('Complaint-ABC-Corporation.pdf', 'Pleading'),
    ('Hearing-Notice-Sept-3.pdf', 'Order')
) as f(file_name, kind)
where c.code = 'c-001'
  and not exists (
    select 1 from public.case_files x where x.case_id = c.id
  );

select 'Dummy case seeded.' as message;
select code, case_title, status, case_number from public.cases;
select * from public.case_stats;
