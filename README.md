# Appective - Modern Web Agency Platform

Appective, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir ajans web sitesidir. Next.js, Supabase ve TypeScript ile inşa edilmiştir.

## 🚀 Özellikler

- **Modern UI/UX**: Framer Motion animasyonları ile dinamik kullanıcı deneyimi
- **Admin Panel**: Tüm içerikleri yönetmek için kapsamlı admin paneli
- **Supabase Entegrasyonu**: Gerçek zamanlı veri yönetimi
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Performance Optimizasyonu**: Next.js ile optimize edilmiş performans
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom admin authentication
- **Deployment**: Vercel Ready

## 📦 Kurulum

1. Repository'yi klonlayın:
```bash
git clone <repository-url>
cd appective-main
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables'ları ayarlayın:
```bash
cp env.example .env.local
```

4. Supabase credentials'larını `.env.local` dosyasına ekleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🗄️ Veritabanı Yapısı

Proje aşağıdaki Supabase tablolarını kullanır:

- `team_members` - Takım üyeleri
- `job_openings` - İş ilanları
- `job_applications` - İş başvuruları
- `web_portals` - Web portal projeleri
- `digital_marketing` - Dijital pazarlama projeleri
- `games` - Oyun projeleri
- `applications` - Uygulama projeleri
- `partner_categories` - Partner kategorileri
- `partner_logos` - Partner logoları

## 🎯 Admin Panel

Admin paneline `/admin` adresinden erişebilirsiniz. Aşağıdaki bölümleri yönetebilirsiniz:

- **Team Members**: Takım üyelerini yönetme
- **Job Openings**: İş ilanlarını yönetme
- **Job Applications**: İş başvurularını görüntüleme
- **Our Works**: Proje portföyünü yönetme
  - Web Portals
  - Digital Marketing
  - Games
  - Applications
- **Partners**: Partner logolarını yönetme
- **Newsletter**: Newsletter abonelerini yönetme

## 🚀 Deployment

### Vercel'e Deploy Etme

1. GitHub'a push edin
2. Vercel'de projeyi import edin
3. Environment variables'ları Vercel dashboard'unda ayarlayın
4. Deploy edin

### Environment Variables (Production)

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-anon-key
```

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel sayfaları
│   ├── api/               # API routes
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   ├── admin/            # Admin panel bileşenleri
│   └── ...               # Diğer bileşenler
├── lib/                  # Utility fonksiyonları
│   ├── supabase.ts       # Supabase client ve types
│   └── ...
└── data/                 # Static veri dosyaları
```

## 🔧 Geliştirme

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

## 📝 Lisans

Bu proje özel bir projedir ve telif hakkı korunmaktadır.
