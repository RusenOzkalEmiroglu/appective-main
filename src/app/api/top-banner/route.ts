import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'top-banner.json');

async function getBannerData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return default empty state
    return { imageUrl: null, targetUrl: null };
  }
}

async function saveBannerData(data: any) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// --- Public Handlers ---

// GET handler to fetch current banner data
export async function GET() {
  const data = await getBannerData();
  return NextResponse.json(data);
}

// --- Protected Handlers ---

// Original POST handler logic
async function postHandler(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetUrl = formData.get('targetUrl') as string;

    let imageUrl = (await getBannerData()).imageUrl; // Keep old image if new one isn't provided

    if (file) {
      const publicDir = path.join(process.cwd(), 'public', 'images', 'ust');
      await fs.mkdir(publicDir, { recursive: true });

      // Clean up old banner image if it exists
      const oldData = await getBannerData();
      if (oldData.imageUrl) {
        const oldImagePath = path.join(process.cwd(), 'public', oldData.imageUrl);
        try {
          await fs.unlink(oldImagePath);
        } catch (e) {
          console.warn(`Could not delete old banner image: ${oldImagePath}`, e);
        }
      }

      // Save new image
      const uniqueFilename = `${Date.now()}-${file.name}`;
      const imagePath = path.join(publicDir, uniqueFilename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(imagePath, buffer);
      imageUrl = `/images/ust/${uniqueFilename}`;
    }

    await saveBannerData({ imageUrl, targetUrl });

    return NextResponse.json({ success: true, imageUrl, targetUrl });
  } catch (error: any) {
    console.error('Failed to update banner:', error);
    return NextResponse.json({ error: 'Failed to update banner', details: error.message }, { status: 500 });
  }
}

// Original DELETE handler logic
async function deleteHandler(request: NextRequest) {
  try {
    const oldData = await getBannerData();
    if (oldData.imageUrl) {
      const imagePath = path.join(process.cwd(), 'public', oldData.imageUrl);
      try {
        await fs.unlink(imagePath);
      } catch (e) {
        console.warn(`Could not delete banner image: ${imagePath}`, e);
      }
    }

    await saveBannerData({ imageUrl: null, targetUrl: null });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner', details: error.message }, { status: 500 });
  }
}

// Wrap protected handlers with authentication
export const POST = withAdminAuthSimple(postHandler);
export const DELETE = withAdminAuthSimple(deleteHandler);
