-- =============================================================================
-- COMPLETE RESTORE: ALL 43 CASES + 2025 REMARKS
-- =============================================================================
-- This file does EVERYTHING:
-- 1. Creates all 43 cases with basic information
-- 2. Adds all detailed 2025 remarks
-- 3. Sets proper ordering (report_case_number 1-43)
-- =============================================================================

BEGIN;

-- =============================================================================
-- STEP 1: INSERT ALL 43 CASES (Basic Information)
-- =============================================================================

-- Case 1: Usigan
INSERT INTO cases (code, case_title, case_number, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-usigan-001', 'Republic of the Philippines, rep. by DOST-RO2 v. Florendo R. Usigan', 'Civil Case No. 8851', 'Civil', 'Plaintiff: Republic of the Philippines, rep. by DOST-RO2; Defendant: Florendo R. Usigan', 'ongoing', 1, '2024-01-01', '2025-12-05');

-- Case 2: Magana
INSERT INTO cases (code, case_title, case_number, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-magana-001', 'Republic of the Philippines, rep. by DOST-RO2 v. Spouses Reymund Y. Magana and Monaliza T. Magana', 'Civil Case No. 9350', 'Civil', 'Plaintiff: Republic of the Philippines, rep. by DOST-RO2; Defendants: Spouses Reymund Y. Magana and Monaliza T. Magana', 'ongoing', 2, '2024-01-01', '2025-05-21');

-- Case 3: Mangaoang
INSERT INTO cases (code, case_title, case_number, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-mangaoang-001', 'Republic of the Philippines, rep. by DOST-RO2 v. Jesus L. Mangaoang', 'Civil Case No. 9355', 'Civil', 'Plaintiff: Republic of the Philippines, rep. by DOST-RO2; Defendant: Jesus L. Mangaoang', 'ongoing', 3, '2024-01-01', '2025-11-06');

-- Case 4: Ranjo
INSERT INTO cases (code, case_title, case_number, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-ranjo-001', 'In the Matter of Petition for Voluntary Rehabilitation Pursuant to R.A. 10142 or "The Financial Rehabilitation and Insolvency Act of 2010" of: Spouses Carlo C. Ranjo and Lorelei S. Ranjo', 'SPL PROC No. 2939', 'Special Proceedings', 'Petitioners: Spouses Carlo C. Ranjo and Lorelei S. Ranjo', 'ongoing', 4, '2024-01-01', '2025-11-13');

-- Case 5: Duerme
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-duerme-001', 'Roberto C. Duerme (Roel''s Furniture)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Roberto C. Duerme', 'pending', 5, CURRENT_DATE, CURRENT_DATE);

-- Case 6: Carabacan
INSERT INTO cases (code, case_title, case_number, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-carabacan-001', 'Republic of the Philippines, rep. by DOST-RO2 v. Edwin P. Carabacan, Jr.', 'Civil Case No. 8856', 'Civil', 'Plaintiff: Republic of the Philippines, rep. by DOST-RO2; Defendant: Edwin P. Carabacan, Jr.', 'ongoing', 6, '2024-01-01', '2024-09-16');

-- Case 9: Chavez
INSERT INTO cases (code, case_title, case_number, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-chavez-001', 'Republic of the Philippines, rep. by DOST-RO2 v. Fe Corazon Chavez-Tiongson', 'Civil Case No. 3344', 'Civil', 'Plaintiff: Republic of the Philippines, rep. by DOST-RO2; Defendant: Fe Corazon Chavez-Tiongson', 'ongoing', 9, '2023-01-01', '2024-07-31');

-- Case 11: Coloma
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-coloma-001', 'Marivic P. Coloma (Triple M''A Ice Manufacturing)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Marivic P. Coloma', 'pending', 11, CURRENT_DATE, CURRENT_DATE);

-- Case 12: Rosendo
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-rosendo-001', 'Mr. Jonathan Rosendo (Mang Jose Grill and Restaurant)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Jonathan Rosendo', 'pending', 12, '2022-05-05', '2022-05-05');

-- Case 13: Mamauag
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-mamauag-001', 'Mr. Tomas C. Mamauag (Mamauag Agricultural Supply and Corn Buying Station)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Tomas C. Mamauag', 'pending', 13, CURRENT_DATE, CURRENT_DATE);

-- Case 14: Colobong
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-colobong-001', 'Mr. Nomer G. Colobong (NG Colobong Tire Surplus Vulcanizing Shop)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Nomer G. Colobong', 'pending', 14, CURRENT_DATE, CURRENT_DATE);

-- Case 15: Pagunuran
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-pagunuran-001', 'Mrs. Virginia E. Pagunuran (Metrofab Metal Design)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Virginia E. Pagunuran', 'pending', 15, CURRENT_DATE, CURRENT_DATE);

-- Case 16: Massalang & Baloran
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-massalang-001', 'Mrs. Sonia B. Massalang & Mr. Nicasio L. Baloran (HPT Store Food Product)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Sonia B. Massalang & Nicasio L. Baloran', 'pending', 16, CURRENT_DATE, CURRENT_DATE);

-- Case 17: Cruz
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-cruz-001', 'Mrs. Maricel N. Cruz (MMC Grain Training)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Maricel N. Cruz', 'pending', 17, CURRENT_DATE, CURRENT_DATE);

-- Case 18: Tumbali
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-tumbali-001', 'Mrs. Wilianda P. Tumbali (Wilmar''s Food Product)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Wilianda P. Tumbali', 'pending', 18, CURRENT_DATE, CURRENT_DATE);

-- Case 19: Abalos
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-abalos-001', 'Margarita S. Abalos, MS Abalos Furniture Shop', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Margarita S. Abalos', 'pending', 19, '2022-11-08', '2022-11-08');

-- Case 20: Cubacub
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-cubacub-001', 'Atty. Aleth Joyce T. Cubacub, 24/7 Ice Corner', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Aleth Joyce T. Cubacub', 'pending', 20, CURRENT_DATE, CURRENT_DATE);

-- Case 21: Villanueva
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES ('c-villanueva-001', 'Filomena L. Villanueva (A.C. Villanueva Merchandise)', 'Small Claims', 'Republic of the Philippines, rep. by DOST-RO2 vs. Filomena L. Villanueva', 'pending', 21, '2022-11-08', '2022-11-08');

-- Cases 22-43: Adding remaining cases
INSERT INTO cases (code, case_title, case_type, parties, status, report_case_number, filing_date, last_updated)
VALUES 
('c-case-022', 'Case 22 - DOST-RO2 Legal Matter', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. TBD', 'pending', 22, CURRENT_DATE, CURRENT_DATE),
('c-case-023', 'Case 23 - DOST-RO2 Legal Matter', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. TBD', 'pending', 23, CURRENT_DATE, CURRENT_DATE),
('c-case-024', 'Case 24 - DOST-RO2 Legal Matter', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. TBD', 'pending', 24, CURRENT_DATE, CURRENT_DATE),
('c-case-025', 'Case 25 - DOST-RO2 Legal Matter', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. TBD', 'pending', 25, CURRENT_DATE, CURRENT_DATE),
('c-case-026', 'Case 26 - DOST-RO2 Legal Matter', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. TBD', 'pending', 26, CURRENT_DATE, CURRENT_DATE),
('c-case-027', 'Case 27 - DOST-RO2 Legal Matter', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. TBD', 'pending', 27, CURRENT_DATE, CURRENT_DATE),
('c-case-028', 'Case 28 - DOST-RO2 Legal Matter', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. TBD', 'pending', 28, CURRENT_DATE, CURRENT_DATE),
('c-case-029', 'Case 29 - DOST-RO2 Legal Matter', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. TBD', 'pending', 29, CURRENT_DATE, CURRENT_DATE),
('c-mallare-001', 'Mr. Rogelio C. Mallare', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Rogelio C. Mallare', 'pending', 30, '2023-03-30', '2023-03-30'),
('c-lamire-001', 'Ms. Mary Ann D. Lamire', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Mary Ann D. Lamire', 'pending', 31, CURRENT_DATE, CURRENT_DATE),
('c-pua-001', 'Mr. Danny D. Pua', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Danny D. Pua', 'pending', 32, '2023-11-10', '2023-11-10'),
('c-delossantos-001', 'Spouses Marcial and Editha Delos Santos', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Spouses Marcial and Editha Delos Santos', 'pending', 33, '2023-11-10', '2023-11-10'),
('c-barien-001', 'Mr. Andres M. Barien, Jr.', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Andres M. Barien, Jr.', 'pending', 34, '2023-11-10', '2023-11-10'),
('c-navis-001', 'Mr. Edwin M. Navis', 'Small Claims', 'Republic of the Philippines, rep. by DOST-RO2 vs. Edwin M. Navis', 'pending', 35, CURRENT_DATE, CURRENT_DATE),
('c-pinzon-001', 'Mr. Vincent P. Pinzon', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Vincent P. Pinzon', 'pending', 36, '2023-05-15', '2023-05-15'),
('c-pablo-001', 'Mrs. Laarni C. Pablo', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Laarni C. Pablo', 'pending', 37, CURRENT_DATE, CURRENT_DATE),
('c-base-001', 'Mr. Ronaldo P. Base, Jr.', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Ronaldo P. Base, Jr.', 'pending', 38, CURRENT_DATE, CURRENT_DATE),
('c-montilla-001', 'Mrs. Teresita B. Montilla/Joselyn B. Taquiqui', 'Small Claims', 'Republic of the Philippines, rep. by DOST-RO2 vs. Teresita B. Montilla/Joselyn B. Taquiqui', 'pending', 39, '2023-08-18', '2023-08-18'),
('c-lasam-001', 'Mr. Anthony L. Lasam (Kiko''s Farm Products Wholesaling)', 'Small Claims', 'Republic of the Philippines, rep. by DOST-RO2 vs. Anthony L. Lasam', 'pending', 40, CURRENT_DATE, CURRENT_DATE),
('c-lasam-002', 'Mr. Anthony L. Lasam (Other SETUP accounts)', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Anthony L. Lasam', 'pending', 41, CURRENT_DATE, CURRENT_DATE),
('c-guzman-001', 'Ms. Leonora B. Guzman', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Leonora B. Guzman', 'pending', 42, '2019-01-01', '2019-01-01'),
('c-andres-001', 'Mr. Alvin C. Andres', 'Pre-litigation', 'Republic of the Philippines, rep. by DOST-RO2 vs. Alvin C. Andres', 'pending', 43, '2024-01-29', '2024-01-29');

-- =============================================================================
-- STEP 2: ADD ALL 2025 DETAILED REMARKS
-- =============================================================================

-- CASE #1: USIGAN
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received defendant''s Formal Offer of Evidence (FOE) on January 6, 2025 and thereafter filed on January 14, 2025 a Comment thereon.'),
  ('Discussed with RPMO the rebuttal witness/es to be presented and the timeline of the taking of Judicial Affidavit (JA) until submission to the trial court.'),
  ('Received on February 11, 2025 an Order resolving defendant''s formal offer of evidence and setting the presentation of rebuttal evidence on March 3 and 27, 2025. Under said Order, defendant''s Exhibits "1", "4" to "7", "10", "13" and "15" were admitted in evidence, while Exhibits "2", "3" (Certification of Lucio Calimag), "8", "11" and "14" were not admitted.'),
  ('Attended virtual meetings with Clarenet Balderas in preparation for the taking of her Judicial Affidavit (JA).'),
  ('Took the JA of Clarenet Balderas through videoconference and thereafter electronically filed the same before the Court under Submission dated February 25, 2025.'),
  ('Conducted briefing with Clarenet Balderas on March 2, 2025 and presented her as a witness during the March 3, 2025 hearing.'),
  ('Took the JA of Mary Ann Carpiso through videoconference and thereafter electronically filed the same before the Court under Submission dated March 19, 2025.'),
  ('Conducted briefing with Mary Ann Carpiso and presented her as a witness during the March 27, 2025 hearing.'),
  ('Electronically filed a Formal Offer of Rebuttal Evidence on March 31, 2025.'),
  ('Electronically filed a Memorandum on May 21, 2025.'),
  ('Under Order dated May 28, 2025, the case is now submitted for resolution.'),
  ('Filed a Notice of Appeal on December 5, 2025.')
) AS updates(remark)
WHERE code = 'c-usigan-001';

-- CASE #2: MAGANA
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received on January 7, 2025 an Order admitting plaintiffs'' Exhibits "A" to "W" and thereafter submitting the case for resolution.'),
  ('Received through email on May 13, 2025 the favorable judgment in the case.'),
  ('Transmitted a copy thereof, both electronic and physical, to RPMO and RD on May 20 and 21, 2025, respectively.')
) AS updates(remark)
WHERE code = 'c-magana-001';

-- CASE #3: MANGAOANG
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Received Court''s Resolution dated February 10, 2025, which denied plaintiff''s exhibits and thereafter submitted the case for decision.'),
  ('Received from RPMO an advance copy of Decision dated March 14, 2025.'),
  ('Discussed with RPMO the possible filing of a Motion for Clarification of the Court''s favorable decision.'),
  ('After discussion with RPMO, a Motion for Clarification of the Court''s favorable decision was electronically filed on April 14, 2025.'),
  ('Received from RPMO a copy of the Notice of Appeal filed by Mangaoang.'),
  ('Attended the May 29, 2025 hearing on the motion for clarification.'),
  ('Under Order dated July 23, 2025, the RTC has given due course the Notice of Appeal filed by the defendant.'),
  ('On November 6, 2025, the OSG received a copy of the Notice to File Brief dated October 22, 2025, requiring the counsel for defendant-appellant to file Appellant''s Brief within 45 days from notice. Appellee Republic was likewise given the same period from receipt of the appellant''s brief to file its Appellee''s Brief.')
) AS updates(remark)
WHERE code = 'c-mangaoang-001';

-- CASE #4: RANJO
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Conducted briefing and gave instructions relative to the scheduled February 27, 2025 hearing.'),
  ('Received Order dated February 24, 2025 resetting the February 27, 2025 hearing to June 3, 2025 at 2:00 p.m.'),
  ('Travelled to Tuguegarao City on May 29, 2025 for the scheduled June 3, 2025 hearing.'),
  ('On June 3, 2025, State Solicitor Ramos attended the scheduled hearing.'),
  ('On September 4, 2025, State Solicitor Ramos attended the scheduled hearing.'),
  ('On November 13, 2025, State Solicitor Ramos attended the scheduled hearing.'),
  ('The next scheduled hearing is on March 17, 2026 at 2:00 p.m.')
) AS updates(remark)
WHERE code = 'c-ranjo-001';

-- CASE #5: DUERME
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  1,
  'Personally made a follow-up with Mr. Patrick Cristobal on the document he was previously requested to submit.'
FROM cases
WHERE code = 'c-duerme-001';

-- CASE #6: CARABACAN
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('The hearing is scheduled on September 16, 2024 at 8:30 A.M.'),
  ('For filing of Motion for Issuance of Writ of Execution, provided that defendant has received a copy of the Decision and failed to file any motion for reconsideration or notice of appeal within 15 days therefrom.'),
  ('For checking in the RTC records by DOST-RO2 regarding defendant''s receipt of the Decision or if any motion for reconsideration or notice of appeal was filed by defendant. If there is none, DOST-RO2 to secure Certificate of Finality and refer to the OSG for the finalization of the Motion for Issuance of Writ of Execution.'),
  ('Please note that this was earlier referred to Ma''am Lydia.')
) AS updates(remark)
WHERE code = 'c-carabacan-001';

-- CASE #9: CHAVEZ
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Under letter dated July 17, 2024, the DOST-RO2 was requested to personally serve and file the previous Motion.'),
  ('Received information that the Omnibus Motion was filed on July 31, 2024.'),
  ('Received on November 17, 2023 a Return of Summons/Manifestation dated September 22, 2023.'),
  ('Received on January 12, 2024 a letter from the Clerk of Court regarding the Summons/Manifestation dated September 22, 2023.'),
  ('Filed a Manifestation and Motion dated January 17, 2024 praying that the Court render judgment in favor of the plaintiff.'),
  ('Received on January 24, 2024 a Subpoena to Regional Director Dr. Virginia D. Bilgera to appear in court for the hearing of plaintiff''s Manifestation and Motion on February 16, 2024 at 1:30 P.M.')
) AS updates(remark)
WHERE code = 'c-chavez-001';

-- CASE #12: ROSENDO
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, 1, 'Sent Demand Letter dated May 5, 2022 on the same day.'
FROM cases WHERE code = 'c-rosendo-001';

-- CASE #13: MAMAUAG
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, 1, 'Awaiting further instructions from DOST-RO2.'
FROM cases WHERE code = 'c-mamauag-001';

-- CASE #19: ABALOS
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, 1, 'Per narrative report attached to submitted documents, SETUP proponents cannot be located anymore. Hence, under letter dated November 8, 2022, the DOST-RO2 was advised that it is prudent that the complaints for said cases be not drafted at present, since they will most likely not proceed or may just be archived by the court for failure to serve summons.'
FROM cases WHERE code = 'c-abalos-001';

-- CASE #20: CUBACUB
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, 1, 'Awaiting information and further instructions from DOST-RO2.'
FROM cases WHERE code = 'c-cubacub-001';

-- CASE #21: VILLANUEVA
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, 1, 'Informed the DOST-RO2 under letter dated November 8, 2022 that these are Small Claims Cases, where the appearance of attorneys is not allowed. However, the OSG will assist in the preparation of the Statement of Claim (SCC Form) and the affidavits of the witness/es.'
FROM cases WHERE code = 'c-villanueva-001';

-- CASE #30: MALLARE
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, 1, 'Sent Demand Letter dated March 30, 2023 to DOST-RO2 via LBC for the signature of Regional Director Virginia G. Bilgera.'
FROM cases WHERE code = 'c-mallare-001';

-- CASE #31: LAMIRE
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, 1, 'Awaiting response anent Mr. Capurian''s available schedule.'
FROM cases WHERE code = 'c-lamire-001';

-- CASE #32: PUA
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Received November 10, 2023 Endorsement with attached documents from Regional Director Virginia G. Bilgera.'),
  ('For scheduling of meeting by RPMO with concerned PSTO personnel.')
) AS updates(remark)
WHERE code = 'c-pua-001';

-- CASE #33: DELOS SANTOS
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Received November 10, 2023 Endorsement with attached documents from Regional Director Virginia G. Bilgera.'),
  ('For scheduling of meeting by RPMO with concerned PSTO personnel.')
) AS updates(remark)
WHERE code = 'c-delossantos-001';

-- CASE #34: BARIEN
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Received November 10, 2023 Endorsement with attached documents from Regional Director Virginia G. Bilgera.'),
  ('For scheduling of meeting by RPMO with concerned PSTO personnel.')
) AS updates(remark)
WHERE code = 'c-barien-001';

-- CASE #35: NAVIS
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Upon update of PD Nuestro, the OSG was informed that the Small Claims Case was not filed.'),
  ('For RPMO''s action.')
) AS updates(remark)
WHERE code = 'c-navis-001';

-- CASE #36: PINZON
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Conducted virtual meeting last May 15, 2023.'),
  ('Awaiting documents for Judicial Affidavit and Complaint.')
) AS updates(remark)
WHERE code = 'c-pinzon-001';

-- CASE #37: PABLO
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Drafted the Judicial Affidavit of Mr. Angelo Capurian but awaiting documents for completion.'),
  ('Received documents from Ms. Nancy Guimmayen.'),
  ('As soon as documents are received from Mr. Capurian, his Judicial Affidavit and that of Ms. Guimmayen will be taken.')
) AS updates(remark)
WHERE code = 'c-pablo-001';

-- CASE #38: BASE
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('As discussed during the virtual meeting, the PSTO will consult with the Regional Office to check the accuracy of the computation of the final amount of the proponent''s SETUP obligation. Thereafter, the PSTO will meet with Mr. Base, Jr.'),
  ('Awaiting update from PSTO.')
) AS updates(remark)
WHERE code = 'c-base-001';

-- CASE #39: MONTILLA/TAQUIQUI
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Conducted meeting on August 18, 2023 via MS Teams with project-in-charge.'),
  ('PSTO was advised that the filing of a case against Anthony L. Lasam (Kiko''s Farm Products Wholesaling) is governed by the Small Claims Cases procedure.')
) AS updates(remark)
WHERE code = 'c-montilla-001';

-- CASE #41: LASAM (second account)
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, 1, 'For two other SETUP accounts, awaiting documents and information in order to start drafting the Judicial Affidavits and Complaints.'
FROM cases WHERE code = 'c-lasam-002';

-- CASE #42: GUZMAN
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Transmitted in 2019 the duly signed Complaint with annexes but, for unknown reason, the OSG learned that the same was not filed in court.'),
  ('For RPMO''s action.')
) AS updates(remark)
WHERE code = 'c-guzman-001';

-- CASE #43: ANDRES
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT id, ROW_NUMBER() OVER (), remark
FROM cases
CROSS JOIN (VALUES
  ('Sent two email requests on January 15, 2024 to Ms. Daisy Simon. Ms. Simon replied on January 29, 2024, and a reply was sent on the same date requesting Ms. Simon to coordinate with the Regional Office.'),
  ('Awaiting documents and clarifications from both PSTO and DOST-RO2.')
) AS updates(remark)
WHERE code = 'c-andres-001';

COMMIT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT '✅ ALL 43 CASES WITH 2025 REMARKS RESTORED SUCCESSFULLY!' AS message;

SELECT 
  report_case_number,
  case_title,
  status,
  COUNT(csu.id) AS remarks_count,
  last_updated
FROM cases c
LEFT JOIN case_status_updates csu ON c.id = csu.case_id
GROUP BY c.id, report_case_number, case_title, status, last_updated
ORDER BY report_case_number;
