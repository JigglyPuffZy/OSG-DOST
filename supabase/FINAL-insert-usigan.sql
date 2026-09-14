-- =============================================================================
-- INSERT CASE: Republic of the Philippines, rep. by DOST-RO2 v. Florendo R. Usigan
-- CORRECTED VERSION - Ready to run
-- =============================================================================

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
    '2024-01-01',  -- UPDATE THIS with actual filing date if you know it
    CURRENT_DATE,
    NULL,
    'Republic of the Philippines, rep. by DOST-RO2 (plaintiff) vs. Florendo R. Usigan (defendant)',
    NULL,
    'Not required',
    0,
    0,
    'Formal Offer of Rebuttal Evidence filed'
  )
  RETURNING id, code
)

-- Insert 9 Status/Remarks Updates
, status_updates AS (
  INSERT INTO case_status_updates (case_id, sort_order, body)
  SELECT id, 1, 'Received defendant''s Formal Offer of Evidence (FOE) on January 6, 2025 and thereafter filed on January 14, 2025 a Comment thereon.'
  FROM new_case
  UNION ALL
  SELECT id, 2, 'Discussed with RPMO the possible rebuttal witness/es to be presented and the timeline of the taking of Judicial Affidavit (JA) until submission to the trial court.'
  FROM new_case
  UNION ALL
  SELECT id, 3, 'Received on February 11, 2025 an Order resolving defendant''s formal offer of evidence and setting the presentation of rebuttal evidence on March 3 and 27, 2025. Under said Order, defendant''s Exhibits "1", "4" to "7", "10", "13" and "15" were admitted in evidence, while Exhibits "2", "3" (Certification of Lucio Calimag), "8", "11" and "14" were not admitted.'
  FROM new_case
  UNION ALL
  SELECT id, 4, 'Attended virtual meetings with Clarenet Balderas in preparation for the taking of her Judicial Affidavit (JA).'
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
)

-- Insert Activity Log (simple timeline)
, activity_log AS (
  INSERT INTO case_activity (case_id, occurred_on, label)
  SELECT id, '2024-01-01'::date, 'Case created'
  FROM new_case
  UNION ALL
  SELECT id, '2024-01-01'::date, 'Case number assigned'
  FROM new_case
  UNION ALL
  SELECT id, CURRENT_DATE, 'Status updated to Ongoing'
  FROM new_case
  RETURNING case_id
)

-- Return verification
SELECT 
  'SUCCESS! Case inserted' as message,
  c.code,
  c.case_title,
  c.case_number,
  c.status,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = c.id) as status_updates_count,
  (SELECT COUNT(*) FROM case_activity WHERE case_id = c.id) as activity_count
FROM new_case n
JOIN cases c ON c.id = n.id;

COMMIT;

-- Verify the new case appears in the list
SELECT 
  code,
  case_title,
  case_number,
  status
FROM cases 
WHERE code = 'c-usigan-001';

-- Show updated statistics (should now be 13 total cases)
SELECT 
  'Updated Statistics' as info,
  total as "Total (should be 13)",
  pending as "Pending",
  ongoing as "Ongoing (should be 6)",
  closed as "Closed",
  archived as "Archived"
FROM case_stats;
