-- =============================================================================
-- INSERT COMPLETE 2025 REMARKS FOR CASES 1-21
-- =============================================================================
-- This adds all the detailed 2025 status updates for cases 1-21
-- Run this after the basic case data is inserted
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
WHERE code = 'c-usigan-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = TRIM(remark)
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
  ('Received on January 7, 2025 an Order admitting plaintiffs'' Exhibits "A" to "W" and thereafter submitting the case for resolution.'),
  ('Received through email on May 13, 2025 the favorable judgment in the case.'),
  ('Transmitted a copy thereof, both electronic and physical, to RPMO and RD on May 20 and 21, 2025, respectively.')
) AS updates(remark)
WHERE code = 'c-magana-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = TRIM(remark)
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
  ('Received Court''s Resolution dated February 10, 2025, which denied plaintiff''s exhibits and thereafter submitted the case for decision.'),
  ('Received from RPMO an advance copy of Decision dated March 14, 2025.'),
  ('Discussed with RPMO the possible filing of a Motion for Clarification of the Court''s favorable decision.'),
  ('After discussion with RPMO, a Motion for Clarification of the Court''s favorable decision was electronically filed on April 14, 2025.'),
  ('Received from RPMO a copy of the Notice of Appeal filed by Mangaoang.'),
  ('Attended the May 29, 2025 hearing on the motion for clarification.'),
  ('Under Order dated July 23, 2025, the RTC has given due course the Notice of Appeal filed by the defendant.'),
  ('On November 6, 2025, the OSG received a copy of the Notice to File Brief dated October 22, 2025, requiring the counsel for defendant-appellant to file Appellant''s Brief within 45 days from notice. Appellee Republic was likewise given the same period from receipt of the appellant''s brief to file its Appellee''s Brief.')
) AS updates(remark)
WHERE code = 'c-mangaoang-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = TRIM(remark)
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
  ('Conducted briefing and gave instructions relative to the scheduled February 27, 2025 hearing.'),
  ('Received Order dated February 24, 2025 resetting the February 27, 2025 hearing to June 3, 2025 at 2:00 p.m.'),
  ('Travelled to Tuguegarao City on May 29, 2025 for the scheduled June 3, 2025 hearing.'),
  ('On June 3, 2025, State Solicitor Ramos attended the scheduled hearing.'),
  ('On September 4, 2025, State Solicitor Ramos attended the scheduled hearing.'),
  ('On November 13, 2025, State Solicitor Ramos attended the scheduled hearing.'),
  ('The next scheduled hearing is on March 17, 2026 at 2:00 p.m.')
) AS updates(remark)
WHERE code = 'c-ranjo-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = TRIM(remark)
);

-- =============================================================================
-- CASE #5: DUERME
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Personally made a follow-up with Mr. Patrick Cristobal on the document he was previously requested to submit.'
FROM cases
WHERE code = 'c-duerme-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = 'Personally made a follow-up with Mr. Patrick Cristobal on the document he was previously requested to submit.'
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
  ('The hearing is scheduled on September 16, 2024 at 8:30 A.M.'),
  ('For filing of Motion for Issuance of Writ of Execution, provided that defendant has received a copy of the Decision and failed to file any motion for reconsideration or notice of appeal within 15 days therefrom.'),
  ('For checking in the RTC records by DOST-RO2 regarding defendant''s receipt of the Decision or if any motion for reconsideration or notice of appeal was filed by defendant. If there is none, DOST-RO2 to secure Certificate of Finality and refer to the OSG for the finalization of the Motion for Issuance of Writ of Execution.'),
  ('Please note that this was earlier referred to Ma''am Lydia.')
) AS updates(remark)
WHERE code = 'c-carabacan-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = TRIM(remark)
);

-- =============================================================================
-- CASE #7: MAGANA (Duplicate entry - different case details)
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Pending verification as whether defendant filed an Answer. OSG received on July 11, 2024 an Order dated June 28, 2024, dismissing the case without prejudice on the ground of plaintiff''s failure to prosecute.'),
  ('Prepared an Omnibus Motion dated July 17, 2024, praying that the Court declare defendant in default and thereafter render judgment granting to plaintiff the relief prayed for in its Complaint.'),
  ('Under letter dated July 17, 2024, the DOST-RO2 requested to personally serve and file said Omnibus Motion on or before July 26, 2024. Considering that the request cannot be accomplished before the due date, the OSG served and filed on July 26, 2024 the Omnibus Motion via registered mail.')
) AS updates(remark)
WHERE code = 'c-magana-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = TRIM(remark)
);

-- =============================================================================
-- CASE #8: MANGAOANG (Additional remarks)
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Prepared an Omnibus Motion dated July 17, 2024, praying that the Court declare defendant in default and thereafter render judgment granting to plaintiff the relief prayed for in its Complaint.'
FROM cases
WHERE code = 'c-mangaoang-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = 'Prepared an Omnibus Motion dated July 17, 2024, praying that the Court declare defendant in default and thereafter render judgment granting to plaintiff the relief prayed for in its Complaint.'
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
  ('Under letter dated July 17, 2024, the DOST-RO2 was requested to personally serve and file the previous Motion.'),
  ('Received information that the Omnibus Motion was filed on July 31, 2024.'),
  ('Received on November 17, 2023 a Return of Summons/Manifestation dated September 22, 2023.'),
  ('Received on January 12, 2024 a letter from the Clerk of Court regarding the Summons/Manifestation dated September 22, 2023.'),
  ('Filed a Manifestation and Motion dated January 17, 2024 praying that the Court render judgment in favor of the plaintiff.'),
  ('Received on January 24, 2024 a Subpoena to Regional Director Dr. Virginia D. Bilgera to appear in court for the hearing of plaintiff''s Manifestation and Motion on February 16, 2024 at 1:30 P.M.')
) AS updates(remark)
WHERE code = 'c-chavez-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = TRIM(remark)
);

-- =============================================================================
-- CASE #10: RANJO (Additional remarks)
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + ROW_NUMBER() OVER (),
  remark
FROM cases
CROSS JOIN (VALUES
  ('Filed a Supplement to the Manifestation and Motion, praying that plaintiff''s Manifestation and Motion be resolved sans hearing or appearance from RD Bilgera and plaintiff''s counsel.'),
  ('Received on February 2, 2024 an Order dated January 31, 2024 which states that for failure of defendant to file her Answer within the reglementary period from receipt of Summons, judgment will be rendered by the Court pursuant to the Rules on Expedited Procedure.'),
  ('Received on February 27, 2024 a Judgment dated February 20, 2024, which granted the reliefs prayed for plaintiff in its Complaint.'),
  ('Transmitted said Judgment to DOST-RO2 through a letter dated March 4, 2024.'),
  ('Gave briefing and instructions to ARD Sylvia Lacambra and Mr. Jude Magora in preparation of the April 4, 2024 hearing. Also sent notes via e-mail.'),
  ('Still awaiting for DOST-RO2 to name a nominee for the ad interim rehabilitation receiver, if any.'),
  ('The next hearing is scheduled on September 30, 2024 at 2:00 P.M.')
) AS updates(remark)
WHERE code = 'c-ranjo-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = TRIM(remark)
);

-- =============================================================================
-- CASE #12: ROSENDO
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Sent Demand Letter dated May 5, 2022 on the same day.'
FROM cases
WHERE code = 'c-rosendo-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = 'Sent Demand Letter dated May 5, 2022 on the same day.'
);

-- =============================================================================
-- CASE #13: MAMAUAG
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Awaiting further instructions from DOST-RO2.'
FROM cases
WHERE code = 'c-mamauag-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = 'Awaiting further instructions from DOST-RO2.'
);

-- =============================================================================
-- CASE #19: ABALOS
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Per narrative report attached to submitted documents, SETUP proponents cannot be located anymore. Hence, under letter dated November 8, 2022, the DOST-RO2 was advised that it is prudent that the complaints for said cases be not drafted at present, since they will most likely not proceed or may just be archived by the court for failure to serve summons.'
FROM cases
WHERE code = 'c-abalos-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = 'Per narrative report attached to submitted documents, SETUP proponents cannot be located anymore. Hence, under letter dated November 8, 2022, the DOST-RO2 was advised that it is prudent that the complaints for said cases be not drafted at present, since they will most likely not proceed or may just be archived by the court for failure to serve summons.'
);

-- =============================================================================
-- CASE #20: CUBACUB
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Awaiting information and further instructions from DOST-RO2.'
FROM cases
WHERE code = 'c-cubacub-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND TRIM(body) = 'Awaiting information and further instructions from DOST-RO2.'
);

-- =============================================================================
-- CASE #21: VILLANUEVA
-- =============================================================================
INSERT INTO case_status_updates (case_id, sort_order, body)
SELECT 
  id,
  COALESCE((SELECT MAX(sort_order) FROM case_status_updates WHERE case_id = cases.id), 0) + 1,
  'Informed the DOST-RO2 under letter dated November 8, 2022 that these are Small Claims Cases, where the appearance of attorneys is not allowed. However, the OSG will assist in the preparation of the Statement of Claim (SCC Form) and the affidavits of the witness/es.'
FROM cases
WHERE code = 'c-villanueva-001'
AND NOT EXISTS (
  SELECT 1 FROM case_status_updates 
  WHERE case_id = cases.id 
  AND body LIKE '%Small Claims Cases%'
);

-- Update last_updated dates for all cases with new remarks
UPDATE cases
SET last_updated = CURRENT_DATE
WHERE code IN (
  'c-usigan-001', 'c-magana-001', 'c-mangaoang-001', 'c-ranjo-001',
  'c-duerme-001', 'c-carabacan-001', 'c-chavez-001', 'c-rosendo-001',
  'c-mamauag-001', 'c-abalos-001', 'c-cubacub-001', 'c-villanueva-001'
);

COMMIT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT '✅ ALL 2025 REMARKS FOR CASES 1-21 ADDED SUCCESSFULLY!' AS message;

-- Show count of status updates per case
SELECT 
  c.report_case_number,
  c.case_title,
  COUNT(csu.id) AS total_status_updates,
  c.last_updated
FROM cases c
LEFT JOIN case_status_updates csu ON c.id = csu.case_id
WHERE c.report_case_number BETWEEN 1 AND 21
GROUP BY c.id, c.report_case_number, c.case_title, c.last_updated
ORDER BY c.report_case_number;
