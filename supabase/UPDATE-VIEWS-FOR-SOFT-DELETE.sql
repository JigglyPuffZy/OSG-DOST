DROP VIEW IF EXISTS cases_full CASCADE;

CREATE OR REPLACE VIEW cases_full AS
SELECT
  c.id,
  c.code,
  c.case_title,
  c.case_number,
  c.case_type,
  c.court,
  c.parties,
  c.status,
  c.report_case_number,
  c.filing_date,
  c.hearing_date,
  c.payment_status,
  c.amount_due,
  c.amount_paid,
  c.remarks,
  c.last_updated,
  c.created_at,
  c.deleted_at,
  COALESCE(
    json_agg(
      json_build_object(
        'body', csu.body,
        'sort_order', csu.sort_order
      ) ORDER BY csu.sort_order
    ) FILTER (WHERE csu.id IS NOT NULL),
    '[]'::json
  ) AS status_updates,
  COALESCE(
    json_agg(
      json_build_object(
        'date', ca.occurred_on,
        'label', ca.label
      ) ORDER BY ca.occurred_on DESC, ca.created_at DESC
    ) FILTER (WHERE ca.id IS NOT NULL),
    '[]'::json
  ) AS activity,
  COALESCE(
    json_agg(
      json_build_object(
        'name', cf.file_name,
        'kind', cf.kind
      ) ORDER BY cf.created_at
    ) FILTER (WHERE cf.id IS NOT NULL),
    '[]'::json
  ) AS files
FROM cases c
LEFT JOIN case_status_updates csu ON c.id = csu.case_id
LEFT JOIN case_activity ca ON c.id = ca.case_id
LEFT JOIN case_files cf ON c.id = cf.case_id
WHERE c.deleted_at IS NULL
GROUP BY c.id;

DROP VIEW IF EXISTS case_stats CASCADE;

CREATE OR REPLACE VIEW case_stats AS
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending,
  COUNT(*) FILTER (WHERE status = 'ongoing') AS ongoing,
  COUNT(*) FILTER (WHERE status = 'closed') AS closed,
  COUNT(*) FILTER (WHERE status = 'archived') AS archived,
  COUNT(*) FILTER (WHERE case_number IS NULL OR case_number = '') AS without_number
FROM cases
WHERE deleted_at IS NULL;

SELECT 'Views updated for soft delete!' AS message;
