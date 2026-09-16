SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

SELECT 'If you see no results above, run schema.sql first!' AS instruction;
