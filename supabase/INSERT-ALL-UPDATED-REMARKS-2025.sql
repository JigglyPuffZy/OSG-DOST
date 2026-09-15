-- =============================================================================
-- INSERT ALL UPDATED REMARKS (2025 Latest Report)
-- =============================================================================
-- This adds the most recent status updates for all 43 cases
-- Based on the Cases-1-to-43-Status-and-Remarks document
-- =============================================================================

BEGIN;

-- =============================================================================
-- CASE #1: USIGAN - Civil Case No. 8851
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received defendant''s Formal Offer of Evidence (FOE) on January 6, 2025 and filed a Comment thereon on January 14, 2025.'),
  ('Discussed with RPMO the rebuttal witnesses and timeline for taking Judicial Affidavits.'),
  ('Received Order dated February 11, 2025 resolving defendant''s FOE and setting rebuttal hearings.'),
  ('Took the Judicial Affidavit of Clarenet Balderas and electronically filed the same.'),
  ('Presented Clarenet Balderas as witness during the March 3, 2025 hearing.'),
  ('Took the Judicial Affidavit of Mary Ann Carpiso and electronically filed the same.'),
  ('Presented Mary Ann Carpiso as witness during the March 27, 2025 hearing.'),
  ('Electronically filed Formal Offer of Rebuttal Evidence on March 31, 2025.'),
  ('Electronically filed Memorandum on May 21, 2025.'),
  ('Under Order dated May 28, 2025, the case was submitted for resolution.'),
  ('Filed Notice of Appeal on December 5, 2025.')
) AS updates(remark)
WHERE code = 'c-usigan-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #2: MAGANA - Civil Case No. 9350
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received Order admitting plaintiffs'' Exhibits "A" to "W" and submitting the case for resolution.'),
  ('Received favorable judgment through email on May 13, 2025.'),
  ('Transmitted copies of the judgment to RPMO and RD on May 20 and 21, 2025.')
) AS updates(remark)
WHERE code = 'c-magana-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #3: MANGAOANG - Civil Case No. 9355
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received Resolution dated February 10, 2025 denying plaintiff''s exhibits and submitting the case for decision.'),
  ('Received advance copy of Decision dated March 14, 2025.'),
  ('Discussed with RPMO possible Motion for Clarification.'),
  ('Electronically filed Motion for Clarification on April 14, 2025.'),
  ('Received Notice of Appeal filed by Mangaoang.'),
  ('Attended May 29, 2025 hearing on the Motion for Clarification.'),
  ('Under Order dated July 23, 2025, the Notice of Appeal was given due course.'),
  ('OSG received Notice to File Brief dated October 22, 2025.')
) AS updates(remark)
WHERE code = 'c-mangaoang-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #4: RANJO - SPL PROC No. 2939
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Conducted briefing and gave instructions relative to the scheduled hearing.'),
  ('Received Order resetting the hearing.'),
  ('Travelled to Tuguegarao City for the scheduled hearing.'),
  ('State Solicitor Ramos attended scheduled hearings on June 3, September 4, and November 13, 2025.'),
  ('Next scheduled hearing is March 17, 2026 at 2:00 P.M.')
) AS updates(remark)
WHERE code = 'c-ranjo-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #6: CARABACAN - Civil Case No. 8856
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Hearing scheduled on September 16, 2024 at 8:30 A.M.'),
  ('For filing of Motion for Issuance of Writ of Execution, provided defendant received the Decision and failed to file a motion for reconsideration or notice of appeal.'),
  ('For checking RTC records regarding defendant''s receipt of the Decision and any motion for reconsideration or notice of appeal.'),
  ('DOST-RO2 to secure Certificate of Finality and refer to OSG for finalization of the Motion for Issuance of Writ of Execution.'),
  ('Earlier referred to Ma''am Lydia.')
) AS updates(remark)
WHERE code = 'c-carabacan-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #9: CHAVEZ - Civil Case No. 3344
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Requested DOST-RO2 to personally serve and file the previous Motion.'),
  ('Received information that the Omnibus Motion was filed on July 31, 2024.'),
  ('Received Return of Summons/Manifestation dated September 22, 2023.'),
  ('Received letter from Clerk of Court regarding the Summons/Manifestation.'),
  ('Filed Manifestation and Motion dated January 17, 2024 praying that judgment be rendered in favor of plaintiff.'),
  ('Received subpoena for Regional Director Dr. Virginia D. Bilgera to appear for hearing on February 16, 2024.')
) AS updates(remark)
WHERE code = 'c-chavez-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #19: ABALOS
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'SETUP proponents could no longer be located. DOST-RO2 was advised under letter dated November 8, 2022 that complaints should not be drafted at present since the cases would most likely not proceed or may be archived for failure to serve summons.'
FROM cases
WHERE code = 'c-abalos-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = 'SETUP proponents could no longer be located. DOST-RO2 was advised under letter dated November 8, 2022 that complaints should not be drafted at present since the cases would most likely not proceed or may be archived for failure to serve summons.'
);

-- =============================================================================
-- CASE #30: MALLARE
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Sent Demand Letter dated March 30, 2023 to DOST-RO2 via LBC for the signature of Regional Director Virginia G. Bilgera.'
FROM cases
WHERE code = 'c-mallare-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = 'Sent Demand Letter dated March 30, 2023 to DOST-RO2 via LBC for the signature of Regional Director Virginia G. Bilgera.'
);

-- =============================================================================
-- CASE #31: LAMIRE
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Awaiting response anent Mr. Capurian''s available schedule.'
FROM cases
WHERE code = 'c-lamire-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = 'Awaiting response anent Mr. Capurian''s available schedule.'
);

-- =============================================================================
-- CASE #32: PUA
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received November 10, 2023 Endorsement with attached documents from Regional Director Virginia G. Bilgera.'),
  ('For scheduling of meeting by RPMO with concerned PSTO personnel.')
) AS updates(remark)
WHERE code = 'c-pua-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #33: DELOS SANTOS
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received November 10, 2023 Endorsement with attached documents from Regional Director Virginia G. Bilgera.'),
  ('For scheduling of meeting by RPMO with concerned PSTO personnel.')
) AS updates(remark)
WHERE code = 'c-delossantos-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #34: BARIEN
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received November 10, 2023 Endorsement with attached documents from Regional Director Virginia G. Bilgera.'),
  ('For scheduling of meeting by RPMO with concerned PSTO personnel.')
) AS updates(remark)
WHERE code = 'c-barien-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #35: NAVIS
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Upon update of PD Nuestro, the OSG was informed that the Small Claims Case was not filed.'),
  ('For RPMO''s action.')
) AS updates(remark)
WHERE code = 'c-navis-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #36: PINZON
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Conducted virtual meeting last May 15, 2023.'),
  ('Awaiting documents for Judicial Affidavit and Complaint.')
) AS updates(remark)
WHERE code = 'c-pinzon-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #37: PABLO
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Drafted the Judicial Affidavit of Mr. Angelo Capurian but awaiting documents for completion.'),
  ('Received documents from Ms. Nancy Guimmayen.'),
  ('As soon as documents are received from Mr. Capurian, his Judicial Affidavit and that of Ms. Guimmayen will be taken.')
) AS updates(remark)
WHERE code = 'c-pablo-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #38: BASE
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('As discussed during the virtual meeting, the PSTO will consult with the Regional Office to check the accuracy of the computation of the final amount of the proponent''s SETUP obligation. Thereafter, the PSTO will meet with Mr. Base, Jr.'),
  ('Awaiting update from PSTO.')
) AS updates(remark)
WHERE code = 'c-base-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #39: MONTILLA/TAQUIQUI
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Conducted meeting on August 18, 2023 via MS Teams with project-in-charge.'),
  ('PSTO was advised that the filing of a case against Anthony L. Lasam (Kiko''s Farm Products Wholesaling) is governed by the Small Claims Cases procedure.')
) AS updates(remark)
WHERE code = 'c-montilla-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #41: LASAM (Anthony)
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'For two other SETUP accounts, awaiting documents and information in order to start drafting the Judicial Affidavits and Complaints.'
FROM cases
WHERE code = 'c-lasam-002'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = 'For two other SETUP accounts, awaiting documents and information in order to start drafting the Judicial Affidavits and Complaints.'
);

-- =============================================================================
-- CASE #42: GUZMAN
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Transmitted in 2019 the duly signed Complaint with annexes but, for unknown reason, the OSG learned that the same was not filed in court.'),
  ('For RPMO''s action.')
) AS updates(remark)
WHERE code = 'c-guzman-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- =============================================================================
-- CASE #43: ANDRES
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Sent two email requests on January 15, 2024 to Ms. Daisy Simon. Ms. Simon replied on January 29, 2024, and a reply was sent on the same date requesting Ms. Simon to coordinate with the Regional Office.'),
  ('Awaiting documents and clarifications from both PSTO and DOST-RO2.')
) AS updates(remark)
WHERE code = 'c-andres-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body = remark
);

-- Update last_updated dates for cases with new remarks
UPDATE cases
SET last_updated = CURRENT_DATE
WHERE code IN (
  'c-usigan-001', 'c-magana-001', 'c-mangaoang-001', 'c-ranjo-001',
  'c-carabacan-001', 'c-chavez-001', 'c-abalos-001', 'c-mallare-001',
  'c-lamire-001', 'c-pua-001', 'c-delossantos-001', 'c-barien-001',
  'c-navis-001', 'c-pinzon-001', 'c-pablo-001', 'c-base-001',
  'c-montilla-001', 'c-lasam-002', 'c-guzman-001', 'c-andres-001'
);

COMMIT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT '✅ ALL 2025 UPDATED REMARKS ADDED SUCCESSFULLY!' AS message;

-- Show count of status updates per case
SELECT 
  c.report_case_number,
  c.case_title,
  COUNT(csu.id) AS total_status_updates
FROM cases c
LEFT JOIN case_status_updates csu ON c.id = csu.case_id
GROUP BY c.id, c.report_case_number, c.case_title
ORDER BY c.report_case_number;
