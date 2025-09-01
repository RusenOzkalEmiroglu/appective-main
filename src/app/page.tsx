export const dynamic = 'force-dynamic';

import TopBanner from '@/components/TopBanner';
import HomePageClient from './HomePageClient';
import { getSocialLinks, getContactInfo } from '@/lib/data';
import { supabase } from '@/lib/supabase';

interface BannerData {
  src: string;
  targetUrl: string;
  width: number;
  height: number;
}

// Supabase'den banner verilerini al
async function getBannerData(): Promise<BannerData | null> {
  try {
    const { data, error } = await supabase
      .from('top_banner')
      .select('id, background_image, button_link')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Banner yüklenirken hata:', error);
      return null;
    }
    
    if (data && data.background_image) {
      return {
        src: data.background_image,
        targetUrl: data.button_link || '',
        width: 1200, // Default width
        height: 200, // Default height
      };
    }
    
    return null;
  } catch (error) {
    console.error('Banner yüklenirken hata:', error);
    return null;
  }
}

const HomePage = async () => {
  const bannerData = await getBannerData();
  const socialLinks = await getSocialLinks();
  const contactInfo = await getContactInfo();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {bannerData && (
        <TopBanner 
          imageUrl={bannerData.src}
          targetUrl={bannerData.targetUrl || ''}
          width={bannerData.width}
          height={bannerData.height}
        />
      )}
      <HomePageClient socialLinks={socialLinks} contactInfo={contactInfo} />
    </main>
  );
};

export default HomePage;
