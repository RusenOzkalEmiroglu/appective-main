-- Top Banner RLS Policy Fix
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- Top banner tablosu için RLS enable et (zaten enabled olabilir)
ALTER TABLE top_banner ENABLE ROW LEVEL SECURITY;

-- Public read access policy ekle
CREATE POLICY "Allow public read access to top_banner" ON top_banner
    FOR SELECT USING (true);

-- Admin write access policy ekle (authenticated users için)
CREATE POLICY "Allow authenticated write access to top_banner" ON top_banner
    FOR ALL USING (auth.role() = 'authenticated');

-- Alternatif olarak, tüm işlemler için public access (daha basit)
-- CREATE POLICY "Allow public access to top_banner" ON top_banner
--     FOR ALL USING (true);
