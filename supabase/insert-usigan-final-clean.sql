-- =============================================================================
-- INSERT CASE
-- Republic of the Philippines, rep. by DOST-RO2 v. Florendo R. Usigan
-- Source: Accomplishment Report of the OSG-DOST-TT1 Task Force
-- Period: January 1 to March 31, 2025
-- =============================================================================

-- Delete existing case if it exists (to avoid duplicate key error)
DELETE FROM cases WHERE code = 'c-usigan-001';

BEGIN;

WITH new_case AS (
  INSERT INTO cases (
    code,
    case_title,
    case_type,
    case_number,
    court,
    status,
    filing_date,
    last_updated,
    hearing_date,
    parties,
    story,
    payment_status,
    amount_due,
    amount_paid,
    remarks
  )
  VALUES (
    'c-usigan-001',
    'Republic of the Philippines, rep. by DOST-RO2 v. Florendo R. Usigan',
    'Civil Case',
    'Civil Case No. 8851',
    'Regional Trial Court (RTC), Branch 2, Tuguegarao City, Cagayan',
    'Ongoing',
    NULL,
    '2025-03-31',
    NULL,
    'Republic of the Philippines, rep. by DOST-RO2 (Plaintiff) vs. Florendo R. Usigan (Defendant)',
    NULL,
    'Not required',
    0,
    0,
    'Electronically filed a Formal Offer of Rebuttal Evidence on March 31, 2025.'
  )
  RETURNING id, code
),

-- =============================================================================
-- STATUS / REMARKS — EXACTLY 9 ENTRIES
-- =============================================================================
status_updates AS (
  INSERT INTO case_status_updates (case_id, sort_order, body)
  SELECT id, 1, 'Received defendant''s Formal Offer of Evidence (FOE) on January 6, 2025 and thereafter filed on January 14, 2025 a Comment thereon.'
  FROM new_case
  UNION ALL
  SELECT id, 2, 'Discussed with RPMO the rebuttal witness/es to be presented and the timeline of the taking of Judicial Affidavit (JA) until submission to the trial court.'
  FROM new_case
  UNION ALL
  SELECT id, 3, 'Received on February 11, 2025 an Order resolving defendant''s formal offer of evidence and setting the presentation of rebuttal evidence on March 3 and 27, 2025. Under said Order, defendant''s Exhibits "1", "4" to "7", "10", "13" and "15" were admitted in evidence, while Exhibits "2", "3" (Certification of Lucio Calimag), "8", "11" and "14" were not admitted.'
  FROM new_case
  UNION ALL
  SELECT id, 4, 'Attended virtual meetings with Clarenet Balderas in preparation for the taking of her JA.'
  FROM new_case
  UNION ALL
  SELECT id, 5, 'Took the JA of Clarenet Balderas through videoconference and thereafter electronically filed the same before the Court under Submission dated February 25, 2025.'
  FROM new_case
  UNION ALL
  SELECT id, 6, 'Conducted briefing with Clarenet Balderas on March 2, 2025 and presented her as a witness during the March 3, 2025 hearing.'
  FROM new_case
  UNION ALL
  SELECT id, 7, 'Took the JA of Mary Ann Carpiso through videoconference and thereafter electronically filed the same before the Court under Submission dated March 19, 2025.'
  FROM new_case
  UNION ALL
  SELECT id, 8, 'Conducted briefing with Mary Ann Carpiso and presented her as a witness during the March 27, 2025 hearing.'
  FROM new_case
  UNION ALL
  SELECT id, 9, 'Electronically filed a Formal Offer of Rebuttal Evidence on March 31, 2025.'
  FROM new_case
  RETURNING case_id
),

-- =============================================================================
-- ACTIVITY TIMELINE
-- =============================================================================
activity_log AS (
  INSERT INTO case_activity (case_id, occurred_on, label)
  SELECT id, '2025-01-06'::date, 'Received defendant''s Formal Offer of Evidence'
  FROM new_case
  UNION ALL
  SELECT id, '2025-01-14'::date, 'Filed Comment on defendant''s Formal Offer of Evidence'
  FROM new_case
  UNION ALL
  SELECT id, '2025-02-11'::date, 'Received Order resolving defendant''s formal offer of evidence'
  FROM new_case
  UNION ALL
  SELECT id, '2025-02-25'::date, 'Filed Judicial Affidavit of Clarenet Balderas'
  FROM new_case
  UNION ALL
  SELECT id, '2025-03-02'::date, 'Conducted briefing with Clarenet Balderas'
  FROM new_case
  UNION ALL
  SELECT id, '2025-03-03'::date, 'Presented Clarenet Balderas as a witness'
  FROM new_case
  UNION ALL
  SELECT id, '2025-03-19'::date, 'Filed Judicial Affidavit of Mary Ann Carpiso'
  FROM new_case
  UNION ALL
  SELECT id, '2025-03-27'::date, 'Presented Mary Ann Carpiso as a witness'
  FROM new_case
  UNION ALL
  SELECT id, '2025-03-31'::date, 'Filed Formal Offer of Rebuttal Evidence'
  FROM new_case
  RETURNING case_id
)

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT
  c.code,
  c.case_title,
  c.case_number,
  c.court,
  c.status,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = c.id) AS updates_count,
  (SELECT COUNT(*) FROM case_activity WHERE case_id = c.id) AS activity_count
FROM new_case n
JOIN cases c ON c.id = n.id;

COMMIT;

-- =============================================================================
-- VERIFY CASE
-- =============================================================================
SELECT
  'Case inserted successfully!' AS message,
  code,
  case_title,
  case_number,
  court,
  status,
  last_updated,
  payment_status,
  amount_due,
  amount_paid,
  remarks
FROM cases
WHERE code = 'c-usigan-001';

-- =============================================================================
-- VERIFY ALL 9 STATUS / REMARKS
-- =============================================================================
SELECT
  sort_order,
  body
FROM case_status_updates
WHERE case_id = (SELECT id FROM cases WHERE code = 'c-usigan-001')
ORDER BY sort_order;

-- =============================================================================
-- CASE STATS
-- =============================================================================
SELECT * FROM case_stats;
