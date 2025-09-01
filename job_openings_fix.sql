-- JOB OPENINGS TABLOSU DÜZELTMESİ
-- Bu komutları Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. Details alanını JSON olarak ekle
ALTER TABLE job_openings 
ADD COLUMN IF NOT EXISTS details JSONB;

-- 2. RLS'yi devre dışı bırak (geçici olarak)
ALTER TABLE job_openings DISABLE ROW LEVEL SECURITY;

-- 3. Tüm izinleri ver
GRANT ALL PRIVILEGES ON job_openings TO anon;
GRANT ALL PRIVILEGES ON job_openings TO authenticated;
GRANT ALL PRIVILEGES ON job_openings TO service_role;

-- 4. Mevcut kayıtlar için boş details ekle
UPDATE job_openings 
SET details = '{
  "fullTitle": "",
  "description": "",
  "whatYouWillDo": [],
  "whatWereLookingFor": [],
  "whyJoinUs": []
}'::jsonb 
WHERE details IS NULL;

-- 5. Tabloyu kontrol et
SELECT id, title, details FROM job_openings LIMIT 5;
