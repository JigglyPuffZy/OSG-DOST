-- =============================================================================
-- OSG DOST — Optional patch (existing Supabase projects only)
-- =============================================================================
-- The recent UI features do NOT need new tables or columns:
--   • Sign-out confirmation  → app only
--   • Delete confirmation    → app only
--   • Mary Ann profile photo → public/profile-mary-ann.png (React app, not DB)
--   • Archived tab           → already in case_status enum if you ran SETUP.sql
--
-- Run this ONLY if you already have a database and want to sync profile text.
-- Fresh install? Use supabase/SETUP.sql + supabase/create-login.sql instead.
-- =============================================================================

-- 1) Profile name / role (sidebar + Settings when using Supabase)
update public.profiles
set
  display_name = 'Mary Ann D. Carpiso',
  role = 'Supervising Science Research Specialist',
  organization = 'OSG DOST Task Force',
  updated_at = now()
where user_id is not null
   or id = (select id from public.profiles order by created_at limit 1);

-- 2) Verify Archived status exists (skip if no error on SETUP.sql)
-- If this fails, re-run the full SETUP.sql or add the enum value manually:
--   alter type public.case_status add value if not exists 'Archived';

-- 3) Quick check
select 'Profile + stats OK' as status;
select display_name, role, organization from public.profiles limit 3;
select * from public.case_stats;
