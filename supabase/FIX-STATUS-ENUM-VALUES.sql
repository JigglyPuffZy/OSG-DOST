-- Normalize lowercase status values (fixes 400 errors when saving from the app)
-- Safe to run multiple times.

UPDATE public.cases SET status = 'Pending'::public.case_status
WHERE lower(status::text) = 'pending' AND status::text <> 'Pending';

UPDATE public.cases SET status = 'Ongoing'::public.case_status
WHERE lower(status::text) = 'ongoing' AND status::text <> 'Ongoing';

UPDATE public.cases SET status = 'Closed'::public.case_status
WHERE lower(status::text) = 'closed' AND status::text <> 'Closed';

UPDATE public.cases SET status = 'Archived'::public.case_status
WHERE lower(status::text) = 'archived' AND status::text <> 'Archived';

SELECT status::text, count(*) FROM public.cases GROUP BY 1 ORDER BY 1;
