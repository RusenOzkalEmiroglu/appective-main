export const dynamic = 'force-dynamic';

import TopBanner from '@/components/TopBanner';
import HomePageClient from './HomePageClient';
import { getSocialLinks, getContactInfo } from '@/lib/data';
import sizeOf from 'image-size';
import path from 'path';
import fs from 'fs/promises';
// ResponsiveTester kaldırıldı

interface BannerData {
  src: string;
  targetUrl: string;
  width: number;
  height: number;
}

// This function reads directly from the filesystem. No more fragile API calls.
async function getBannerData(): Promise<BannerData | null> {
  const bannerDir = path.join(process.cwd(), 'public', 'images', 'ust');
  const metadataPath = path.join(bannerDir, 'banner.json');

  try {
    await fs.access(bannerDir);
    const files = await fs.readdir(bannerDir);
    const imageFile = files.find(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file));

    if (!imageFile) {
      return null; // No image found in the directory
    }

    const imagePath = path.join(bannerDir, imageFile);
    const imageBuffer = await fs.readFile(imagePath);
    const dimensions = sizeOf(imageBuffer);

    let metadata = { targetUrl: '' };
    try {
      const metaContent = await fs.readFile(metadataPath, 'utf-8');
      metadata = JSON.parse(metaContent);
    } catch (e) {
      // Metadata file might not exist, which is fine.
    }

    return {
      src: `/images/ust/${imageFile}`,
      targetUrl: metadata.targetUrl,
      width: dimensions.width ?? 1200, // Provide a fallback width
      height: dimensions.height ?? 200, // Provide a fallback height
    };

  } catch (error) {
    // This catches if the directory doesn't exist or other fs errors.
    // We can safely return null as it means there's no banner to show.
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
