-- SUPABASE TOP BANNER TAMAMEN DÜZELTİLMİŞ SQL KOMUTLARI
-- Bu komutları Supabase Dashboard > SQL Editor'da SIRASI İLE çalıştırın

-- 1. Background_image alanını ekle (eğer yoksa)
ALTER TABLE top_banner 
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- 2. RLS'yi tamamen kapat
ALTER TABLE top_banner DISABLE ROW LEVEL SECURITY;

-- 3. Tüm izinleri ver
GRANT ALL PRIVILEGES ON top_banner TO anon;
GRANT ALL PRIVILEGES ON top_banner TO authenticated;
GRANT ALL PRIVILEGES ON top_banner TO service_role;

-- 4. Mevcut politikaları sil
DROP POLICY IF EXISTS "Allow public read access" ON top_banner;
DROP POLICY IF EXISTS "Allow public update access" ON top_banner;
DROP POLICY IF EXISTS "Allow public insert access" ON top_banner;

-- 5. ID=1 kaydının var olduğundan emin ol
INSERT INTO top_banner (id, title, subtitle, description, button_text, button_link, background_image)
VALUES (1, 'Welcome to Appective', 'Digital Marketing & Development', 'We create innovative digital solutions for your business', 'Get Started', '#contact', '')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  button_text = EXCLUDED.button_text,
  button_link = EXCLUDED.button_link;

-- 6. Tabloyu kontrol et
SELECT * FROM top_banner WHERE id = 1;
