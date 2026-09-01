-- =============================================================================
-- Run this ONLY if you see: relation "public.cases_full" does not exist
-- but public.cases already exists (partial schema run).
-- Safe to run multiple times.
-- =============================================================================

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

grant select on public.case_stats, public.cases_full
to anon, authenticated, service_role;

select 'Views repaired: case_stats and cases_full are ready.' as message;
select * from public.case_stats;
