-- =============================================================================
-- FIND WHICH CASES ARE MISSING (Should be 43, you have 39)
-- =============================================================================

-- Show which case numbers are MISSING
SELECT 
  generate_series as missing_case_number
FROM generate_series(1, 43)
WHERE generate_series NOT IN (SELECT report_case_number FROM cases WHERE report_case_number IS NOT NULL)
ORDER BY generate_series;

-- Show what you currently have (all 39 cases)
SELECT 
  report_case_number,
  code,
  case_title
FROM cases
ORDER BY report_case_number;

-- Count total
SELECT COUNT(*) as total_cases FROM cases;
