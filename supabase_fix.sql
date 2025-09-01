-- Supabase Top Banner Tablosu Düzeltme Scripti
-- Bu komutları Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. Önce background_image alanını ekleyin (eğer yoksa)
ALTER TABLE top_banner 
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- 2. RLS politikalarını kaldırın (geçici olarak)
ALTER TABLE top_banner DISABLE ROW LEVEL SECURITY;

-- 3. Anonim kullanıcılar için okuma izni verin
GRANT SELECT ON top_banner TO anon;
GRANT SELECT ON top_banner TO authenticated;

-- 4. Güncelleme izni verin (admin için)
GRANT UPDATE ON top_banner TO anon;
GRANT UPDATE ON top_banner TO authenticated;

-- 5. Insert izni verin (gerekirse)
GRANT INSERT ON top_banner TO anon;
GRANT INSERT ON top_banner TO authenticated;

-- 6. Mevcut kaydı kontrol edin ve gerekirse oluşturun
INSERT INTO top_banner (id, title, subtitle, description, button_text, button_link, background_image)
VALUES (1, 'Welcome to Appective', 'Digital Marketing & Development', 'We create innovative digital solutions for your business', 'Get Started', '#contact', '')
ON CONFLICT (id) DO NOTHING;

-- 7. Alternatif: Eğer RLS'yi açık tutmak istiyorsanız, bu politikaları kullanın
-- ALTER TABLE top_banner ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow public read access" ON top_banner
-- FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow public update access" ON top_banner
-- FOR UPDATE USING (true);
-- 
-- CREATE POLICY "Allow public insert access" ON top_banner
-- FOR INSERT WITH CHECK (true);
