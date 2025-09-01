/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Gelişmiş resim optimizasyonu
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  
  // Performans optimizasyonları
  compiler: {
    // Kullanılmayan kodu kaldır
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Üretim kaynak haritalarını devre dışı bırak
  productionBrowserSourceMaps: false,
  
  // Gzip sıkıştırma
  compress: true,
  
  // Statik varlıklar için önbellek başlıkları
  poweredByHeader: false,
};

module.exports = nextConfig;
