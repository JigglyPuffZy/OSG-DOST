-- =============================================================================
-- INSERT CASES #2, #3, AND #4
-- Source: Accomplishment Report
-- Period: January 1 to March 31, 2025
-- FIXED: Added filing_date values (required field)
-- =============================================================================

BEGIN;

-- =============================================================================
-- CASE #2
-- Republic of the Philippines, rep. by DOST-RO2 v. Spouses Reymund Y. Magana
-- and Monaliza T. Magana
-- =============================================================================
WITH new_case_2 AS (
  INSERT INTO cases (
    code, case_title, case_type, case_number, court, status,
    filing_date, last_updated, hearing_date, parties, story,
    payment_status, amount_due, amount_paid, remarks
  )
  VALUES (
    'c-magana-001',
    'Republic of the Philippines, rep. by DOST-RO2 v. Spouses Reymund Y. Magana and Monaliza T. Magana',
    'Civil Case',
    'Civil Case No. 9350',
    'RTC - Branch 3, Tuguegarao City, Cagayan',
    'Ongoing',
    '2024-01-01',  -- Added filing date
    '2025-01-07',
    NULL,
    'Republic of the Philippines, rep. by DOST-RO2 (Plaintiff) vs. Spouses Reymund Y. Magana and Monaliza T. Magana (Defendants)',
    NULL,
    'Not required',
    0,
    0,
    'Received on January 7, 2025 an Order admitting plaintiffs'' Exhibits "A" to "W" and thereafter submitting the case for resolution.'
  )
  RETURNING id
),
status_updates_2 AS (
  INSERT INTO case_status_updates (case_id, sort_order, body)
  SELECT id, 1, 'Received on January 7, 2025 an Order admitting plaintiffs'' Exhibits "A" to "W" and thereafter submitting the case for resolution.'
  FROM new_case_2
  RETURNING case_id
),
activity_log_2 AS (
  INSERT INTO case_activity (case_id, occurred_on, label)
  SELECT id, '2025-01-07'::date, 'Received Order admitting plaintiffs'' Exhibits "A" to "W" and submitted the case for resolution'
  FROM new_case_2
  RETURNING case_id
)
SELECT
  'Case #2 inserted successfully' AS message,
  c.code, c.case_title, c.case_number, c.court, c.status,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = c.id) AS updates_count,
  (SELECT COUNT(*) FROM case_activity WHERE case_id = c.id) AS activity_count
FROM new_case_2 n
JOIN cases c ON c.id = n.id;

-- =============================================================================
-- CASE #3
-- Republic of the Philippines, rep. by DOST-RO2 v. Jesus L. Mangaoang
-- =============================================================================
WITH new_case_3 AS (
  INSERT INTO cases (
    code, case_title, case_type, case_number, court, status,
    filing_date, last_updated, hearing_date, parties, story,
    payment_status, amount_due, amount_paid, remarks
  )
  VALUES (
    'c-mangaoang-001',
    'Republic of the Philippines, rep. by DOST-RO2 v. Jesus L. Mangaoang',
    'Civil Case',
    'Civil Case No. 9355',
    'RTC - Branch 1, Tuguegarao City, Cagayan',
    'Ongoing',
    '2024-01-01',  -- Added filing date
    '2025-03-14',
    NULL,
    'Republic of the Philippines, rep. by DOST-RO2 (Plaintiff) vs. Jesus L. Mangaoang (Defendant)',
    NULL,
    'Not required',
    0,
    0,
    'Discussed with RPMO the possible filing of a Motion for Clarification of the Court''s favorable decision.'
  )
  RETURNING id
),
status_updates_3 AS (
  INSERT INTO case_status_updates (case_id, sort_order, body)
  SELECT id, 1, 'Received Court''s Resolution dated February 10, 2025, which denied plaintiff''s exhibits and thereafter submitted the case for decision.'
  FROM new_case_3
  UNION ALL
  SELECT id, 2, 'Received from RPMO an advance copy of Decision dated March 14, 2025.'
  FROM new_case_3
  UNION ALL
  SELECT id, 3, 'Discussed with RPMO the possible filing of a Motion for Clarification of the Court''s favorable decision.'
  FROM new_case_3
  RETURNING case_id
),
activity_log_3 AS (
  INSERT INTO case_activity (case_id, occurred_on, label)
  SELECT id, '2025-02-10'::date, 'Received Court''s Resolution denying plaintiff''s exhibits and submitted the case for decision'
  FROM new_case_3
  UNION ALL
  SELECT id, '2025-03-14'::date, 'Received advance copy of Decision from RPMO'
  FROM new_case_3
  RETURNING case_id
)
SELECT
  'Case #3 inserted successfully' AS message,
  c.code, c.case_title, c.case_number, c.court, c.status,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = c.id) AS updates_count,
  (SELECT COUNT(*) FROM case_activity WHERE case_id = c.id) AS activity_count
FROM new_case_3 n
JOIN cases c ON c.id = n.id;

-- =============================================================================
-- CASE #4
-- In the Matter of Petition for Voluntary Rehabilitation pursuant to R.A. 10142
-- =============================================================================
WITH new_case_4 AS (
  INSERT INTO cases (
    code, case_title, case_type, case_number, court, status,
    filing_date, last_updated, hearing_date, parties, story,
    payment_status, amount_due, amount_paid, remarks
  )
  VALUES (
    'c-ranjo-001',
    'In the Matter of Petition for Voluntary Rehabilitation Pursuant to R.A. 10142 or "The Financial Rehabilitation and Insolvency Act of 2010" of: Spouses Carlo C. Ranjo and Lorelei S. Ranjo',
    'Special Proceedings',
    'SPL PROC NO. 2939',
    'RTC - Branch 16, City of Ilagan, Isabela',
    'Ongoing',
    '2024-01-01',  -- Added filing date
    '2025-02-24',
    '2025-06-03 14:00:00',
    'Spouses Carlo C. Ranjo and Lorelei S. Ranjo',
    NULL,
    'Not required',
    0,
    0,
    'Received Order dated February 24, 2025 resetting the February 27, 2025 hearing to June 3, 2025 at 2:00 p.m.'
  )
  RETURNING id
),
status_updates_4 AS (
  INSERT INTO case_status_updates (case_id, sort_order, body)
  SELECT id, 1, 'Conducted briefing and gave instructions relative to the scheduled February 27, 2025 hearing.'
  FROM new_case_4
  UNION ALL
  SELECT id, 2, 'Received Order dated February 24, 2025 resetting the February 27, 2025 hearing to June 3, 2025 at 2:00 p.m.'
  FROM new_case_4
  RETURNING case_id
),
activity_log_4 AS (
  INSERT INTO case_activity (case_id, occurred_on, label)
  SELECT id, '2025-02-24'::date, 'Received Order resetting February 27, 2025 hearing to June 3, 2025 at 2:00 p.m.'
  FROM new_case_4
  UNION ALL
  SELECT id, '2025-06-03'::date, 'Scheduled hearing at 2:00 p.m.'
  FROM new_case_4
  RETURNING case_id
)
SELECT
  'Case #4 inserted successfully' AS message,
  c.code, c.case_title, c.case_number, c.court, c.status,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = c.id) AS updates_count,
  (SELECT COUNT(*) FROM case_activity WHERE case_id = c.id) AS activity_count
FROM new_case_4 n
JOIN cases c ON c.id = n.id;

COMMIT;

-- =============================================================================
-- VERIFY THE 3 INSERTED CASES
-- =============================================================================
SELECT
  code, case_title, case_number, court, status, hearing_date, last_updated, filing_date
FROM cases
WHERE code IN ('c-magana-001', 'c-mangaoang-001', 'c-ranjo-001')
ORDER BY code;

-- =============================================================================
-- VERIFY ALL STATUS / REMARKS
-- =============================================================================
SELECT
  c.code,
  c.case_title,
  su.sort_order,
  su.body
FROM cases c
JOIN case_status_updates su ON su.case_id = c.id
WHERE c.code IN ('c-magana-001', 'c-mangaoang-001', 'c-ranjo-001')
ORDER BY c.code, su.sort_order;

-- =============================================================================
-- SHOW CASE STATS
-- =============================================================================
SELECT * FROM case_stats;
