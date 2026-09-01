-- =============================================================================
-- OSG DOST — GAMITIN ANG SETUP.sql (ISANG FILE LANG)
-- =============================================================================
--
-- Ang file na ito ay VERIFY lang. Para i-setup ang buong system:
--
--   → Buksan:  supabase/SETUP.sql
--   → Kopyahin LAHAT → Supabase SQL Editor → RUN (minsan lang)
--
-- LOGIN:  admindost@gmail.com  /  Admin123  (Mary Ann D. Carpiso)
-- =============================================================================

do $$
begin
  if to_regclass('public.cases') is null then
    raise exception
      'Hindi pa naka-setup. I-run ang BUONG supabase/SETUP.sql sa SQL Editor.';
  end if;

  if to_regclass('public.cases_full') is null then
    raise exception
      'Kulang ang views. I-run ulit ang BUONG supabase/SETUP.sql.';
  end if;

  raise notice 'OK — handa na ang database.';
end $$;

select 'Database OK' as status;
select * from public.case_stats;

select code, case_title, status, coalesce(case_number, 'Not Assigned') as case_number
from public.cases
order by last_updated desc
limit 5;
