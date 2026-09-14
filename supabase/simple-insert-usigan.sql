-- =============================================================================
-- SIMPLE INSERT USIGAN CASE (No transaction wrapper)
-- =============================================================================

-- Step 1: Delete old one if exists
DELETE FROM cases WHERE code = 'c-usigan-001';

-- Step 2: Insert the case
INSERT INTO cases (
  code,
  case_title,
  case_type,
  case_number,
  court,
  status,
  filing_date,
  last_updated,
  parties,
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
  '2024-01-01',
  CURRENT_DATE,
  'Republic of the Philippines, rep. by DOST-RO2 (plaintiff) vs. Florendo R. Usigan (defendant)',
  'Not required',
  0,
  0,
  'Formal Offer of Rebuttal Evidence filed'
);

-- Step 3: Add status updates
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  c.id,
  u.sort_order,
  u.body
FROM cases c
CROSS JOIN (
  VALUES
    (1, 'Received defendant''s Formal Offer of Evidence (FOE) on January 6, 2025 and thereafter filed on January 14, 2025 a Comment thereon.'),
    (2, 'Discussed with RPMO the possible rebuttal witness/es to be presented and the timeline of the taking of Judicial Affidavit (JA) until submission to the trial court.'),
    (3, 'Received on February 11, 2025 an Order resolving defendant''s formal offer of evidence and setting the presentation of rebuttal evidence on March 3 and 27, 2025. Under said Order, defendant''s Exhibits "1", "4" to "7", "10", "13" and "15" were admitted in evidence, while Exhibits "2", "3" (Certification of Lucio Calimag), "8", "11" and "14" were not admitted.'),
    (4, 'Attended virtual meetings with Clarenet Balderas in preparation for the taking of her Judicial Affidavit (JA).'),
    (5, 'Took the JA of Clarenet Balderas through videoconference and thereafter electronically filed the same before the Court under Submission dated February 25, 2025.'),
    (6, 'Conducted briefing with Clarenet Balderas on March 2, 2025 and presented her as a witness during the March 3, 2025 hearing.'),
    (7, 'Took the JA of Mary Ann Carpiso through videoconference and thereafter electronically filed the same before the Court under Submission dated March 19, 2025.'),
    (8, 'Conducted briefing with Mary Ann Carpiso and presented her as a witness during the March 27, 2025 hearing.'),
    (9, 'Electronically filed a Formal Offer of Rebuttal Evidence on March 31, 2025.')
) AS u(sort_order, body)
WHERE c.code = 'c-usigan-001';

-- Step 4: Add activity log
INSERT INTO case_activity (case_id, occurred_on, label)
SELECT 
  c.id,
  a.occurred_on::date,
  a.label
FROM cases c
CROSS JOIN (
  VALUES
    ('2024-01-01', 'Case created'),
    ('2024-01-01', 'Case number assigned'),
    (CURRENT_DATE::text, 'Status updated to Ongoing')
) AS a(occurred_on, label)
WHERE c.code = 'c-usigan-001';

-- Verify it worked
SELECT 
  '✓ Case inserted!' as status,
  code,
  case_title,
  case_number,
  status
FROM cases 
WHERE code = 'c-usigan-001';

-- Check counts
SELECT 
  (SELECT COUNT(*) FROM cases) as total_cases,
  (SELECT COUNT(*) FROM case_status_updates WHERE case_id = (SELECT id FROM cases WHERE code = 'c-usigan-001')) as status_updates,
  (SELECT COUNT(*) FROM case_activity WHERE case_id = (SELECT id FROM cases WHERE code = 'c-usigan-001')) as activity_entries;

-- Show stats
SELECT * FROM case_stats;
