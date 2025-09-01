-- Admin kullanıcıları için Supabase Auth setup
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- 1. Admin kullanıcısı oluşturmak için önce Supabase Dashboard > Authentication > Users bölümünden
-- manuel olarak bir kullanıcı oluşturun veya aşağıdaki adımları takip edin:

-- 2. Kullanıcı metadata'sına admin role eklemek için trigger oluşturalım
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Eğer email @appective.com ile bitiyorsa admin yap
  IF NEW.email LIKE '%@appective.com' THEN
    NEW.raw_user_meta_data = COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı auth.users tablosuna ekle
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Mevcut kullanıcıları admin yapmak için (isteğe bağlı)
-- Bu komutu çalıştırmadan önce admin@appective.com kullanıcısını manuel olarak oluşturun
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email LIKE '%@appective.com';

-- 4. RLS Policy'lerini güncelle - Admin kullanıcıları için tam erişim
-- Team Members tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to team_members" ON team_members;
CREATE POLICY "Admin full access to team_members" ON team_members
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Job Openings tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to job_openings" ON job_openings;
CREATE POLICY "Admin full access to job_openings" ON job_openings
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Job Applications tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to job_applications" ON job_applications;
CREATE POLICY "Admin full access to job_applications" ON job_applications
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Web Portals tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to web_portals" ON web_portals;
CREATE POLICY "Admin full access to web_portals" ON web_portals
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Digital Marketing tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to digital_marketing" ON digital_marketing;
CREATE POLICY "Admin full access to digital_marketing" ON digital_marketing
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Games tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to games" ON games;
CREATE POLICY "Admin full access to games" ON games
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Applications tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to applications" ON applications;
CREATE POLICY "Admin full access to applications" ON applications
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Partner Categories tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to partner_categories" ON partner_categories;
CREATE POLICY "Admin full access to partner_categories" ON partner_categories
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Partner Logos tablosu için admin policy
DROP POLICY IF EXISTS "Admin full access to partner_logos" ON partner_logos;
CREATE POLICY "Admin full access to partner_logos" ON partner_logos
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  (auth.jwt() ->> 'email') LIKE '%@appective.com'
);

-- Public read access for frontend (mevcut public policy'leri koru)
-- Bu policy'ler frontend'in veri okuması için gerekli

-- NOTLAR:
-- 1. Supabase Dashboard > Authentication > Users bölümünden admin@appective.com kullanıcısı oluşturun
-- 2. Bu SQL'i Supabase SQL Editor'da çalıştırın
-- 3. Admin panelinde admin@appective.com ve belirlediğiniz şifre ile giriş yapın
