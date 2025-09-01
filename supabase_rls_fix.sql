-- Supabase RLS (Row Level Security) hatalarını çözmek için tüm tablolara public erişim policy'si ekle

-- Web portals tablosu için RLS policy
ALTER TABLE web_portals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON web_portals FOR ALL USING (true);

-- Diğer tablolar için RLS policy'leri
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON newsletter_subscribers FOR ALL USING (true);

ALTER TABLE interactive_mastheads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON interactive_mastheads FOR ALL USING (true);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON services FOR ALL USING (true);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON contact_info FOR ALL USING (true);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON games FOR ALL USING (true);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON applications FOR ALL USING (true);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON social_links FOR ALL USING (true);

ALTER TABLE digital_marketing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON digital_marketing FOR ALL USING (true);

ALTER TABLE partner_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON partner_categories FOR ALL USING (true);

ALTER TABLE partner_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON partner_logos FOR ALL USING (true);
