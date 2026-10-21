-- =============================================================================
-- FIX: "Database not set up" sa app — SAFE, HINDI BINUBURA ANG MGA CASE
-- =============================================================================
-- Gamitin ito kung may data ka na (hal. 43 cases) at biglang hindi na-load ang app.
-- HUWAG i-run ang SETUP.sql / schema.sql dito — buburahin ang lahat ng cases.
--
-- Supabase Dashboard → SQL Editor → paste buong file → RUN
-- Pagkatapos: i-refresh ang app (o hard refresh sa browser)
-- =============================================================================

-- Optional columns used by newer app versions (no-op if already exist)
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS report_case_number integer;

DROP VIEW IF EXISTS public.case_stats CASCADE;
DROP VIEW IF EXISTS public.cases_full CASCADE;

CREATE OR REPLACE VIEW public.case_stats AS
SELECT
  count(*)::int AS total,
  count(*) FILTER (WHERE status::text = 'Pending')::int AS pending,
  count(*) FILTER (WHERE status::text = 'Ongoing')::int AS ongoing,
  count(*) FILTER (WHERE status::text = 'Closed')::int AS closed,
  count(*) FILTER (WHERE status::text = 'Archived')::int AS archived,
  count(*) FILTER (
    WHERE case_number IS NULL OR btrim(case_number) = ''
  )::int AS without_number
FROM public.cases
WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW public.cases_full AS
SELECT
  c.*,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object('body', u.body, 'sort_order', u.sort_order)
        ORDER BY u.sort_order
      )
      FROM public.case_status_updates u
      WHERE u.case_id = c.id
    ),
    '[]'::json
  ) AS status_updates,
  COALESCE(
    (
      SELECT json_agg(u.body ORDER BY u.sort_order)
      FROM public.case_status_updates u
      WHERE u.case_id = c.id
    ),
    '[]'::json
  ) AS updates,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object('date', a.occurred_on, 'label', a.label)
        ORDER BY a.occurred_on, a.created_at
      )
      FROM public.case_activity a
      WHERE a.case_id = c.id
    ),
    '[]'::json
  ) AS activity,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object('id', f.id, 'name', f.file_name, 'kind', f.kind)
        ORDER BY f.created_at
      )
      FROM public.case_files f
      WHERE f.case_id = c.id
    ),
    '[]'::json
  ) AS files
FROM public.cases c
WHERE c.deleted_at IS NULL;

-- Permissions (app uses anon key)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.cases,
  public.case_status_updates,
  public.case_activity,
  public.case_files,
  public.profiles
TO anon, authenticated, service_role;

GRANT SELECT ON public.case_stats, public.cases_full
TO anon, authenticated, service_role;

-- RLS policies (idempotent)
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all_cases" ON public.cases;
DROP POLICY IF EXISTS "allow_all_cases" ON public.cases;
CREATE POLICY "anon_all_cases" ON public.cases
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_updates" ON public.case_status_updates;
DROP POLICY IF EXISTS "allow_all_updates" ON public.case_status_updates;
CREATE POLICY "anon_all_updates" ON public.case_status_updates
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_activity" ON public.case_activity;
CREATE POLICY "anon_all_activity" ON public.case_activity
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_files" ON public.case_files;
CREATE POLICY "anon_all_files" ON public.case_files
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_profiles" ON public.profiles;
CREATE POLICY "anon_all_profiles" ON public.profiles
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

SELECT 'OK — cases_full and case_stats ready. Refresh the app.' AS message;
SELECT * FROM public.case_stats;
