-- =============================================================================
-- OSG DOST TASK FORCE — Supabase schema + seed
-- Paste this entire file into: Supabase → SQL Editor → New query → Run
-- Safe to re-run: it drops old objects first.
-- =============================================================================
-- Deep check vs the React app:
--   cases.case_number and cases.court are NULLABLE (Pending / not yet assigned)
--   Never auto-generate a case number
--   Status: Pending | Ongoing | Closed | Archived
--   Payment: Unpaid | Partial | Paid | Not required
--   Status/Remarks = ordered bullets in case_status_updates
--   Timeline     = case_activity
--   Attachments  = case_files (optional)
--   Settings     = profiles (matches Settings page)
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1) Reset (ignore errors if first run)
-- -----------------------------------------------------------------------------
drop view if exists public.case_stats cascade;
drop view if exists public.cases_full cascade;

drop table if exists public.case_files cascade;
drop table if exists public.case_activity cascade;
drop table if exists public.case_status_updates cascade;
drop table if exists public.cases cascade;
drop table if exists public.profiles cascade;

drop function if exists public.set_updated_at() cascade;
drop function if exists public.touch_case_last_updated() cascade;

drop type if exists public.case_status cascade;
drop type if exists public.payment_status cascade;
drop type if exists public.file_kind cascade;
drop type if exists public.start_page cascade;

-- -----------------------------------------------------------------------------
-- 2) Enums (locked to the UI dropdowns)
-- -----------------------------------------------------------------------------
create type public.case_status as enum ('Pending', 'Ongoing', 'Closed', 'Archived');
create type public.payment_status as enum ('Unpaid', 'Partial', 'Paid', 'Not required');
create type public.file_kind as enum (
  'Pleading',
  'Order',
  'Evidence',
  'Correspondence',
  'Case record'
);
create type public.start_page as enum ('dashboard', 'cases', 'reports');

-- -----------------------------------------------------------------------------
-- 3) Tables
-- -----------------------------------------------------------------------------

-- 3a. Main docket
create table public.cases (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,                 -- app id e.g. c-001
  case_title      text not null check (length(trim(case_title)) > 0),
  case_type       text not null default 'Civil Case',
  case_number     text,                                 -- NULL = Not Assigned
  court           text,                                 -- NULL = Not Assigned
  status          public.case_status not null default 'Pending',
  remarks         text,                                 -- first-line summary
  filing_date     date not null,
  last_updated    date not null default current_date,
  hearing_date    date,
  parties         text,
  story           text,                                 -- full case file narrative
  payment_status  public.payment_status not null default 'Unpaid',
  amount_due      numeric(14,2) not null default 0 check (amount_due >= 0),
  amount_paid     numeric(14,2) not null default 0 check (amount_paid >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint amount_paid_not_over_due check (amount_paid <= amount_due)
);

comment on column public.cases.case_number is
  'Nullable. Do not invent a number. UI shows Not Assigned when null/blank.';
comment on column public.cases.court is
  'Nullable. UI shows Not Assigned when null/blank.';

-- Unique case number only when a number exists (many rows may be NULL)
create unique index cases_case_number_unique
  on public.cases (case_number)
  where case_number is not null and btrim(case_number) <> '';

create index cases_status_idx on public.cases (status);
create index cases_court_idx on public.cases (court);
create index cases_filing_date_idx on public.cases (filing_date desc);
create index cases_last_updated_idx on public.cases (last_updated desc);
create index cases_title_search_idx on public.cases using gin (to_tsvector('simple', case_title));

-- 3b. Status / Remarks bullets (table column in the UI)
create table public.case_status_updates (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases(id) on delete cascade,
  sort_order  integer not null default 0,
  body        text not null check (length(trim(body)) > 0),
  created_at  timestamptz not null default now()
);

create index case_status_updates_case_idx
  on public.case_status_updates (case_id, sort_order);

-- 3c. Case activity timeline (View File)
create table public.case_activity (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases(id) on delete cascade,
  occurred_on date not null default current_date,
  label       text not null,
  created_at  timestamptz not null default now()
);

create index case_activity_case_idx
  on public.case_activity (case_id, occurred_on, created_at);

-- 3d. Optional attachments (not shown as the View File page; stored for later)
create table public.case_files (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases(id) on delete cascade,
  file_name   text not null,
  kind        public.file_kind not null default 'Case record',
  added_on    date not null default current_date,
  created_at  timestamptz not null default now()
);

create index case_files_case_idx on public.case_files (case_id);

-- 3e. Settings page
create table public.profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid unique references auth.users(id) on delete cascade,
  display_name    text not null default 'Atty. M. Santos',
  role            text not null default 'Supervising Science Research Specialist',
  organization    text not null default 'OSG DOST Task Force',
  start_page      public.start_page not null default 'dashboard',
  compact_table   boolean not null default false,
  show_awaiting   boolean not null default true,
  keep_local_data boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 4) updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cases_set_updated_at
  before update on public.cases
  for each row execute procedure public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Keep last_updated in sync when a case row changes
create or replace function public.touch_case_last_updated()
returns trigger
language plpgsql
as $$
begin
  new.last_updated = current_date;
  return new;
end;
$$;

create trigger cases_touch_last_updated
  before update on public.cases
  for each row
  when (old is distinct from new)
  execute procedure public.touch_case_last_updated();

-- -----------------------------------------------------------------------------
-- 5) Views used by the dashboard
-- -----------------------------------------------------------------------------
create or replace view public.case_stats as
select
  count(*)::int as total,
  count(*) filter (where status = 'Pending')::int as pending,
  count(*) filter (where status = 'Ongoing')::int as ongoing,
  count(*) filter (where status = 'Closed')::int as closed,
  count(*) filter (where status = 'Archived')::int as archived,
  count(*) filter (
    where case_number is null or btrim(case_number) = ''
  )::int as without_number
from public.cases;

create or replace view public.cases_full as
select
  c.*,
  coalesce(
    (
      select json_agg(u.body order by u.sort_order)
      from public.case_status_updates u
      where u.case_id = c.id
    ),
    '[]'::json
  ) as updates,
  coalesce(
    (
      select json_agg(
        json_build_object('date', a.occurred_on, 'label', a.label)
        order by a.occurred_on, a.created_at
      )
      from public.case_activity a
      where a.case_id = c.id
    ),
    '[]'::json
  ) as activity,
  coalesce(
    (
      select json_agg(
        json_build_object('id', f.id, 'name', f.file_name, 'kind', f.kind)
        order by f.created_at
      )
      from public.case_files f
      where f.case_id = c.id
    ),
    '[]'::json
  ) as files
from public.cases c;

-- -----------------------------------------------------------------------------
-- 6) Seed — 12 sample cases from the app
-- -----------------------------------------------------------------------------
insert into public.cases (
  code, case_title, case_type, case_number, court, status, remarks,
  filing_date, last_updated, hearing_date, parties, story,
  payment_status, amount_due, amount_paid
) values
(
  'c-001',
  'DOST vs. ABC Corporation',
  'Civil Case',
  '2026-001',
  'RTC Branch 5',
  'Ongoing',
  'For hearing',
  '2026-08-20',
  '2026-08-26',
  '2026-09-03',
  'Republic of the Philippines, represented by DOST (plaintiff) vs. ABC Corporation (defendant)',
  'DOST filed this civil action to recover project funds released to ABC Corporation after the agency found that deliverables were not completed as agreed. The complaint asks the court to order payment of the outstanding amount, plus legal interest.

The case is now ongoing before RTC Branch 5. A hearing is set for 3 September 2026. ABC Corporation has not settled the claimed amount, so the money due remains unpaid.

Counsel should be ready with the contract, disbursement records, and inspection reports for the hearing.',
  'Unpaid',
  1850000,
  0
),
(
  'c-002',
  'Administrative Complaint - XYZ',
  'Administrative Case',
  null,
  null,
  'Pending',
  'Awaiting case number',
  '2026-08-25',
  '2026-08-25',
  null,
  'Complainant vs. XYZ (respondent)',
  'This administrative complaint against XYZ was received by the Task Force but is still waiting for a case number and court assignment. Filing fees have not been paid, so the matter cannot move to raffle.

Until the docket number is issued and fees are settled, the complaint stays pending. No hearing date has been set.',
  'Unpaid',
  25000,
  0
),
(
  'c-003',
  'People of the Philippines vs. Reyes',
  'Criminal Case',
  '2026-014',
  'RTC Branch 12',
  'Ongoing',
  'Pre-trial conference scheduled',
  '2026-07-11',
  '2026-08-18',
  '2026-09-08',
  'People of the Philippines vs. Reyes (accused)',
  'This is a criminal case against Reyes, now docketed as 2026-014 before RTC Branch 12. Pre-trial is scheduled. There is no civil collection attached at this stage, so payment of a judgment amount is not yet required.

The Task Force is monitoring appearances and the pre-trial conference set for 8 September 2026.',
  'Not required',
  0,
  0
),
(
  'c-004',
  'DOST vs. Northern Supply Inc.',
  'Civil Case',
  '2025-088',
  'Sandiganbayan',
  'Closed',
  'Judgment rendered; for execution',
  '2025-11-03',
  '2026-06-12',
  null,
  'DOST vs. Northern Supply Inc.',
  'Judgment has been rendered in favor of DOST. The case is closed for trial purposes and is now in the execution stage before the Sandiganbayan.

Northern Supply Inc. has paid part of the award (₱1,500,000 of ₱4,200,000). The balance remains outstanding and should be followed through a writ of execution.',
  'Partial',
  4200000,
  1500000
),
(
  'c-005',
  'Petition for Review - Grant Disbursement',
  'Special Civil Action',
  null,
  'Court of Appeals',
  'Pending',
  'Awaiting raffle and case number',
  '2026-08-22',
  '2026-08-24',
  null,
  'Petitioner vs. concerned DOST office',
  'A petition for review on grant disbursement was filed with the Court of Appeals. It is still awaiting raffle and a case number. Docket fees have not been paid.

Until fees are paid and a number is assigned, the petition cannot proceed.',
  'Unpaid',
  4000,
  0
),
(
  'c-006',
  'OSG vs. MetroTech Solutions',
  'Civil Case',
  '2026-033',
  'RTC Branch 5',
  'Ongoing',
  'Motion to dismiss under consideration',
  '2026-05-19',
  '2026-08-15',
  null,
  'Office of the Solicitor General vs. MetroTech Solutions',
  'OSG is defending this civil matter against MetroTech Solutions before RTC Branch 5. Filing fees were paid. A motion to dismiss is under consideration.

No money claim is currently outstanding against the government side. Next action depends on the court’s ruling on the motion.',
  'Paid',
  12000,
  12000
),
(
  'c-007',
  'Administrative Case - Procurement Irregularity',
  'Administrative Case',
  null,
  null,
  'Pending',
  'Documents for docketing',
  '2026-08-27',
  '2026-08-27',
  null,
  'Administrative complainant vs. concerned officials',
  'This administrative case on procurement irregularity was just docketed internally. There is no case number and no court yet. Required filing and processing fees have not been paid.

Papers are still being prepared for docketing. The matter stays pending until fees are settled and the case is raffled.',
  'Unpaid',
  25000,
  0
),
(
  'c-008',
  'Civil Action for Recovery of Public Funds',
  'Civil Case',
  '2024-201',
  'RTC Branch 21',
  'Archived',
  'Archived pending related criminal case',
  '2024-09-08',
  '2026-03-02',
  null,
  'Republic vs. respondents in recovery of public funds',
  'This civil action seeks recovery of public funds. It is archived while a related criminal case proceeds before RTC Branch 21.

No payment has been collected. When the related case allows, this file should be revived for execution or further proceedings.',
  'Unpaid',
  9800000,
  0
),
(
  'c-009',
  'DOST vs. Pacific Research Group',
  'Civil Case',
  '2026-041',
  'RTC Branch 12',
  'Closed',
  'Settled; dismissal with prejudice',
  '2026-02-14',
  '2026-07-30',
  null,
  'DOST vs. Pacific Research Group',
  'The parties settled. Pacific Research Group paid the agreed amount in full, and the case was dismissed with prejudice.

The file is closed. No balance remains.',
  'Paid',
  760000,
  760000
),
(
  'c-010',
  'Injunction - Unauthorized Use of Research Data',
  'Special Civil Action',
  '2026-052',
  'RTC Branch 21',
  'Ongoing',
  'TRO hearing on 3 September 2026',
  '2026-08-04',
  '2026-08-21',
  '2026-09-03',
  'DOST (applicant) vs. parties using research data without authority',
  'DOST applied for injunctive relief against unauthorized use of research data. Filing fees were paid. A TRO hearing is set for 3 September 2026 before RTC Branch 21.

The brief for the hearing should cover ownership of the data, the acts complained of, and the harm if the TRO is not issued.',
  'Paid',
  8000,
  8000
),
(
  'c-011',
  'Complaint for Collection of Sum of Money',
  'Civil Case',
  '2025-167',
  'Sandiganbayan',
  'Ongoing',
  'Presentation of evidence for plaintiff',
  '2025-12-16',
  '2026-08-10',
  '2026-09-15',
  'Republic / DOST vs. debtor for collection of sum of money',
  'This is a collection case. The government is presenting evidence for the plaintiff before the Sandiganbayan. The defendant has not paid the claimed sum of ₱2,650,000.

The next hearing for presentation of evidence is on 15 September 2026. Non-payment should be clearly shown in the record and in the prayer for judgment.',
  'Unpaid',
  2650000,
  0
),
(
  'c-012',
  'Special Civil Action - Mandamus',
  'Special Civil Action',
  null,
  'Court of Appeals',
  'Pending',
  'Awaiting case number from clerk of court',
  '2026-08-19',
  '2026-08-23',
  null,
  'Petitioner in mandamus vs. public respondent',
  'This special civil action for mandamus is with the Court of Appeals but still has no case number from the clerk of court. Docket fees remain unpaid.

The petition cannot be acted upon until the number is issued and fees are paid.',
  'Unpaid',
  4000,
  0
);

-- Status / Remarks bullets
insert into public.case_status_updates (case_id, sort_order, body)
select c.id, u.sort_order, u.body
from public.cases c
join (
  values
    ('c-001', 1, 'Received defendant''s Formal Offer of Evidence (FOE) on January 6, 2025 and thereafter filed on January 14, 2025 a Comment thereon.'),
    ('c-001', 2, 'Discussed with RPMO the possible rebuttal witness/es to be presented and the timeline of the taking of Judicial Affidavit (JA) until submission to the trial court.'),
    ('c-001', 3, 'Received on February 11, 2025 an Order resolving defendant''s formal offer of evidence and setting the presentation of rebuttal evidence on March 3 and 27, 2025. Under said Order, defendant''s Exhibits "1," "4" to "7," "10," "13" and "15" were admitted in evidence, while Exhibits "2," "3" (Certification of Lucio Calimag), "8," "11" and "14" were not admitted.'),
    ('c-001', 4, 'Attended virtual meetings with Clarenet Balderas in preparation for the taking of her JA.'),
    ('c-002', 1, 'Complaint received and encoded pending assignment of a case number.'),
    ('c-002', 2, 'Filing fees remain unpaid; matter cannot yet be raffled.'),
    ('c-002', 3, 'No court has been designated.'),
    ('c-003', 1, 'Pre-trial conference is scheduled.'),
    ('c-003', 2, 'Appearances of counsel are being monitored.'),
    ('c-003', 3, 'Next setting is 8 September 2026.'),
    ('c-004', 1, 'Judgment rendered; case is closed for trial.'),
    ('c-004', 2, 'Partial payment received; balance is for execution.'),
    ('c-004', 3, 'Writ of execution to be followed.'),
    ('c-005', 1, 'Petition filed with the Court of Appeals.'),
    ('c-005', 2, 'Awaiting raffle and case number.'),
    ('c-005', 3, 'Docket fees have not been paid.'),
    ('c-006', 1, 'Motion to dismiss is under consideration.'),
    ('c-006', 2, 'Filing fees were paid.'),
    ('c-006', 3, 'Awaiting the court''s ruling on the motion.'),
    ('c-007', 1, 'Documents are being prepared for docketing.'),
    ('c-007', 2, 'No case number and no court yet.'),
    ('c-007', 3, 'Processing fees have not been paid.'),
    ('c-008', 1, 'Archived pending a related criminal case.'),
    ('c-008', 2, 'No collection has been made on the civil award.'),
    ('c-008', 3, 'File to be revived when the related case allows.'),
    ('c-009', 1, 'Parties settled; amount paid in full.'),
    ('c-009', 2, 'Dismissed with prejudice.'),
    ('c-009', 3, 'No further action required.'),
    ('c-010', 1, 'TRO hearing is set for 3 September 2026.'),
    ('c-010', 2, 'Filing fees were paid.'),
    ('c-010', 3, 'Hearing brief on data ownership and irreparable injury is being prepared.'),
    ('c-011', 1, 'Presentation of evidence for the plaintiff is ongoing.'),
    ('c-011', 2, 'Defendant has not paid the claimed amount.'),
    ('c-011', 3, 'Next hearing is 15 September 2026.'),
    ('c-012', 1, 'Awaiting case number from the clerk of court.'),
    ('c-012', 2, 'Docket fees remain unpaid.'),
    ('c-012', 3, 'Petition cannot proceed until both are completed.')
) as u(code, sort_order, body)
  on c.code = u.code;

-- Activity
insert into public.case_activity (case_id, occurred_on, label)
select c.id, a.occurred_on::date, a.label
from public.cases c
join (
  values
    ('c-001', '2026-08-20', 'Case created'),
    ('c-001', '2026-08-20', 'Case number assigned'),
    ('c-001', '2026-08-26', 'Status updated to Ongoing'),
    ('c-001', '2026-08-26', 'Remarks updated'),
    ('c-002', '2026-08-25', 'Case created'),
    ('c-003', '2026-07-11', 'Case created'),
    ('c-003', '2026-07-11', 'Case number assigned'),
    ('c-003', '2026-08-18', 'Remarks updated'),
    ('c-004', '2025-11-03', 'Case created'),
    ('c-004', '2025-11-03', 'Case number assigned'),
    ('c-004', '2026-06-12', 'Status updated to Closed'),
    ('c-005', '2026-08-22', 'Case created'),
    ('c-005', '2026-08-24', 'Remarks updated'),
    ('c-006', '2026-05-19', 'Case created'),
    ('c-006', '2026-05-19', 'Case number assigned'),
    ('c-006', '2026-08-15', 'Status updated to Ongoing'),
    ('c-007', '2026-08-27', 'Case created'),
    ('c-008', '2024-09-08', 'Case created'),
    ('c-008', '2024-09-08', 'Case number assigned'),
    ('c-008', '2026-03-02', 'Status updated to Archived'),
    ('c-009', '2026-02-14', 'Case created'),
    ('c-009', '2026-02-14', 'Case number assigned'),
    ('c-009', '2026-07-30', 'Status updated to Closed'),
    ('c-010', '2026-08-04', 'Case created'),
    ('c-010', '2026-08-04', 'Case number assigned'),
    ('c-010', '2026-08-21', 'Remarks updated'),
    ('c-011', '2025-12-16', 'Case created'),
    ('c-011', '2025-12-16', 'Case number assigned'),
    ('c-011', '2026-08-10', 'Status updated to Ongoing'),
    ('c-012', '2026-08-19', 'Case created'),
    ('c-012', '2026-08-23', 'Remarks updated')
) as a(code, occurred_on, label)
  on c.code = a.code;

-- Files
insert into public.case_files (case_id, file_name, kind)
select c.id, f.file_name, f.kind::public.file_kind
from public.cases c
join (
  values
    ('c-001', 'Complaint-ABC-Corporation.pdf', 'Pleading'),
    ('c-001', 'Hearing-Notice-Sept-3.pdf', 'Order'),
    ('c-007', 'Procurement-Complaint-Draft.pdf', 'Pleading')
) as f(code, file_name, kind)
  on c.code = f.code;

insert into public.profiles (
  display_name, role, organization, start_page, compact_table, show_awaiting
) values (
  'Atty. M. Santos',
  'Supervising Science Research Specialist',
  'OSG DOST Task Force',
  'dashboard',
  false,
  true
);

-- -----------------------------------------------------------------------------
-- 7) Row Level Security
--    Current React app has no login yet.
--    For local/dev: policies below allow anon read/write so the UI can connect.
--    Tighten these before production (auth.uid() = profile id, etc.).
-- -----------------------------------------------------------------------------
alter table public.cases enable row level security;
alter table public.case_status_updates enable row level security;
alter table public.case_activity enable row level security;
alter table public.case_files enable row level security;
alter table public.profiles enable row level security;

create policy "anon_all_cases" on public.cases
  for all to anon, authenticated using (true) with check (true);
create policy "anon_all_updates" on public.case_status_updates
  for all to anon, authenticated using (true) with check (true);
create policy "anon_all_activity" on public.case_activity
  for all to anon, authenticated using (true) with check (true);
create policy "anon_all_files" on public.case_files
  for all to anon, authenticated using (true) with check (true);
create policy "anon_all_profiles" on public.profiles
  for all to anon, authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on
  public.cases,
  public.case_status_updates,
  public.case_activity,
  public.case_files,
  public.profiles
to anon, authenticated, service_role;

grant select on
  public.case_stats,
  public.cases_full
to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 8) Self-check — this FAILS the run if seed is wrong
-- -----------------------------------------------------------------------------
do $$
declare
  v_total int;
  v_pending int;
  v_ongoing int;
  v_closed int;
  v_archived int;
  v_without int;
  v_updates int;
  v_activity int;
  v_files int;
  v_profiles int;
  v_null_codes text;
  v_test_id uuid;
begin
  select total, pending, ongoing, closed, archived, without_number
  into v_total, v_pending, v_ongoing, v_closed, v_archived, v_without
  from public.case_stats;

  if v_total is distinct from 12 then
    raise exception 'case_stats.total expected 12, got %', v_total;
  end if;
  if v_pending is distinct from 4 then
    raise exception 'pending expected 4, got %', v_pending;
  end if;
  if v_ongoing is distinct from 5 then
    raise exception 'ongoing expected 5, got %', v_ongoing;
  end if;
  if v_closed is distinct from 2 then
    raise exception 'closed expected 2, got %', v_closed;
  end if;
  if v_archived is distinct from 1 then
    raise exception 'archived expected 1, got %', v_archived;
  end if;
  if v_without is distinct from 4 then
    raise exception 'without_number expected 4, got %', v_without;
  end if;

  select string_agg(code, ',' order by code)
  into v_null_codes
  from public.cases
  where case_number is null;

  if v_null_codes is distinct from 'c-002,c-005,c-007,c-012' then
    raise exception 'null case_number codes expected c-002,c-005,c-007,c-012 got %', v_null_codes;
  end if;

  select count(*) into v_updates from public.case_status_updates;
  if v_updates is distinct from 37 then
    raise exception 'status updates expected 37, got %', v_updates;
  end if;

  select count(*) into v_activity from public.case_activity;
  if v_activity is distinct from 31 then
    raise exception 'activity expected 31, got %', v_activity;
  end if;

  select count(*) into v_files from public.case_files;
  if v_files is distinct from 3 then
    raise exception 'files expected 3, got %', v_files;
  end if;

  select count(*) into v_profiles from public.profiles;
  if v_profiles < 1 then
    raise exception 'profiles seed missing';
  end if;

  insert into public.cases (code, case_title, status, filing_date)
  values ('c-selfcheck', 'Self-check pending without number', 'Pending', current_date)
  returning id into v_test_id;

  if (select case_number from public.cases where id = v_test_id) is not null then
    raise exception 'new pending case must allow null case_number';
  end if;

  delete from public.cases where id = v_test_id;

  raise notice 'OSG DOST schema OK: 12 cases, 4 without numbers, remarks/activity/files seeded.';
end $$;

-- -----------------------------------------------------------------------------
-- 9) Default login user (safe to re-run — skips if email already exists)
--    Sign in to the app with:
--      Email:    officer@osgdost.gov.ph
--      Password: OsgDost@2026
--    Change the password after first login (Supabase → Authentication → Users).
--    Also disable public sign-up: Authentication → Providers → Email → off.
-- -----------------------------------------------------------------------------
do $$
declare
  v_user_id uuid;
  v_email text := 'officer@osgdost.gov.ph';
  v_password text := 'OsgDost@2026';
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Atty. M. Santos","role":"Supervising Science Research Specialist"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    begin
      insert into auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) values (
        v_user_id,
        v_user_id,
        v_email,
        jsonb_build_object(
          'sub', v_user_id::text,
          'email', v_email,
          'email_verified', true,
          'phone_verified', false
        ),
        'email',
        now(),
        now(),
        now()
      );
    exception
      when others then
        insert into auth.identities (
          provider_id,
          user_id,
          identity_data,
          provider
        ) values (
          v_user_id::text,
          v_user_id,
          jsonb_build_object('sub', v_user_id::text, 'email', v_email),
          'email'
        );
    end;
  end if;

  update public.profiles
  set
    user_id = v_user_id,
    display_name = 'Atty. M. Santos',
    role = 'Supervising Science Research Specialist',
    organization = 'OSG DOST Task Force'
  where id = (
    select id from public.profiles order by created_at limit 1
  );

  raise notice 'LOGIN READY — Email: % | Password: OsgDost@2026', v_email;
end $$;

select * from public.case_stats;
