-- Mevcut verileri yedekle
CREATE TABLE web_portals_backup AS SELECT * FROM web_portals;

-- Eski tabloyu sil
DROP TABLE web_portals;

-- Yeni tabloyu integer ID ile oluştur
CREATE TABLE web_portals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  project_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mevcut verileri geri yükle (ID'leri integer'a çevirerek)
INSERT INTO web_portals (id, title, client, description, image, project_url)
SELECT 
  CAST(id AS INTEGER),
  title,
  client,
  description,
  image,
  project_url
FROM web_portals_backup
WHERE id::text ~ '^[0-9]+$'; -- Sadece sayısal ID'leri al

-- Sequence'i doğru değere ayarla
SELECT setval('web_portals_id_seq', (SELECT MAX(id) FROM web_portals));

-- Backup tablosunu sil
DROP TABLE web_portals_backup;
