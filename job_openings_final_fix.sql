-- JOB OPENINGS TABLOSU SORUNSUZ ÇALIŞMASI İÇİN SQL KOMUTLARI
-- Bu komutları Supabase Dashboard > SQL Editor'da sırayla çalıştırın

-- 1. RLS'yi devre dışı bırak
ALTER TABLE job_openings DISABLE ROW LEVEL SECURITY;

-- 2. Tüm izinleri ver
GRANT ALL PRIVILEGES ON job_openings TO anon;
GRANT ALL PRIVILEGES ON job_openings TO authenticated;
GRANT ALL PRIVILEGES ON job_openings TO service_role;

-- 3. Tabloyu kontrol et - hangi alanlar var?
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'job_openings' 
ORDER BY ordinal_position;

-- 4. Örnek kayıt ekle (test için)
INSERT INTO job_openings (title, short_description, icon_name, slug, is_remote, is_tr)
VALUES ('Frontend Developer', 'React ve TypeScript ile modern web uygulamaları geliştirin', 'Code', 'frontend-developer', true, false)
ON CONFLICT DO NOTHING;
