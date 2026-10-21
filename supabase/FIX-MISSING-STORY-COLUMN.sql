-- Quick fix: "Could not find the 'story' column of 'cases' in the schema cache"
-- Safe — does not delete cases. Run in Supabase SQL Editor.

ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS story text;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS hearing_date date;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS parties text;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS assigned_to text;

NOTIFY pgrst, 'reload schema';

SELECT 'story column added — wait ~10 seconds, then refresh the app.' AS message;
