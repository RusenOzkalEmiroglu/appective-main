import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

// Disable caching for this route
export const dynamic = 'force-dynamic';

const bannerDir = path.join(process.cwd(), 'public', 'images', 'ust');
const metadataPath = path.join(bannerDir, 'banner.json');

async function getBannerData() {
    try {
        await fs.access(bannerDir);
        const files = await fs.readdir(bannerDir);
        const imageFile = files.find(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.gif') || file.endsWith('.webp'));

        if (!imageFile) return null;

        let metadata = { targetUrl: '' };
        try {
            const metaContent = await fs.readFile(metadataPath, 'utf-8');
            metadata = JSON.parse(metaContent);
        } catch (e) {
            // Metadata file doesn't exist, which is fine
        }

        return {
            src: `/images/ust/${imageFile}`,
            targetUrl: metadata.targetUrl
        };

    } catch (error) {
        // Directory doesn't exist
        return null;
    }
}

// --- Public Handlers ---

// GET - Fetches the current banner
export async function GET(req: NextRequest) {
    const banner = await getBannerData();
    if (banner) {
        return NextResponse.json(banner);
    }
    return NextResponse.json({ message: 'No banner found' }, { status: 404 });
}

// --- Protected Handlers ---

// Original POST handler logic
async function postHandler(req: NextRequest) {
    const formData = await req.formData();
    const image = formData.get('bannerImage') as File | null;
    const targetUrl = formData.get('targetUrl') as string || '';

    try {
        // Ensure directory exists
        await fs.mkdir(bannerDir, { recursive: true });

        // If a new image is uploaded, process it
        if (image) {
            // Delete old images
            const files = await fs.readdir(bannerDir);
            for (const file of files) {
                if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.gif') || file.endsWith('.webp')) {
                    await fs.unlink(path.join(bannerDir, file));
                }
            }
            // Save new image
            const imagePath = path.join(bannerDir, image.name);
            await fs.writeFile(imagePath, Buffer.from(await image.arrayBuffer()));
        }

        // Save metadata
        await fs.writeFile(metadataPath, JSON.stringify({ targetUrl }));

        // Revalidate cache for the homepage
        revalidatePath('/');

        const newBanner = await getBannerData();
        return NextResponse.json(newBanner);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Failed to update banner:', errorMessage);
        return NextResponse.json({ message: 'Failed to update banner', error: errorMessage }, { status: 500 });
    }
}

// Original DELETE handler logic
async function deleteHandler(req: NextRequest) {
    try {
        const files = await fs.readdir(bannerDir);
        for (const file of files) {
            // Delete image files and the metadata json
            await fs.unlink(path.join(bannerDir, file));
        }
        
        // Revalidate cache for the homepage
        revalidatePath('/');

        return NextResponse.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Failed to delete banner:', errorMessage);
        // If directory doesn't exist, it's already 'deleted'
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
             return NextResponse.json({ message: 'Banner already deleted' });
        }
        return NextResponse.json({ message: 'Failed to delete banner', error: errorMessage }, { status: 500 });
    }
}

// Wrap protected handlers with authentication
export const POST = withAdminAuthSimple(postHandler);
export const DELETE = withAdminAuthSimple(deleteHandler);
