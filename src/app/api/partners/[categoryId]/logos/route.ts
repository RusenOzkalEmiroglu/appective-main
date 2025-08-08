import { NextRequest, NextResponse } from 'next/server';
import { 
  readPartnersData, 
  writePartnersData, 
  PartnerCategory, 
  LogoInfo 
} from '@/lib/partnersDataUtils';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { withAdminAuth } from '@/lib/withAdminAuth';

const PUBLIC_IMAGES_BASE_PATH = path.join(process.cwd(), 'public', 'images', 'is_ortaklari');

interface LogosRouteParams {
  params: {
    categoryId: string;
  }
}

// --- Protected Handlers ---

// Original POST handler logic to add a new logo
async function postHandler(request: NextRequest, { params }: LogosRouteParams) {
  const { categoryId } = params;

  try {
    const formData = await request.formData();
    const alt = formData.get('alt') as string;
    const logoImageFile = formData.get('logoImage') as File | null;
    const url = formData.get('url') as string | null;

    if (!alt || !logoImageFile) {
      return NextResponse.json({ message: 'Missing required fields: alt text and logo image file are required.' }, { status: 400 });
    }

    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(logoImageFile.type)) {
        return NextResponse.json({ message: `Invalid file type: ${logoImageFile.type}. Only SVG, PNG, JPG, GIF, WEBP are allowed.` }, { status: 400 });
    }
    if (logoImageFile.size > 2 * 1024 * 1024) { // Max 2MB
        return NextResponse.json({ message: 'File is too large. Maximum size is 2MB.' }, { status: 400 });
    }

    const partners = await readPartnersData();
    const categoryIndex = partners.findIndex((cat: PartnerCategory) => cat.id === categoryId);

    if (categoryIndex === -1) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    const targetCategory = partners[categoryIndex];

    const sanitizedAlt = alt.toLowerCase().replace(/[^a-z0-9_\-]+/g, '-').slice(0, 50);
    const uniqueSuffix = uuidv4().slice(0, 8);
    const fileExtension = path.extname(logoImageFile.name) || '.png';
    const filename = `${sanitizedAlt}-${uniqueSuffix}${fileExtension}`;
    
    const categoryDirectory = path.join(PUBLIC_IMAGES_BASE_PATH, targetCategory.originalPath);
    const imageDiskPath = path.join(categoryDirectory, filename);
    const publicImagePath = `/images/is_ortaklari/${targetCategory.originalPath}/${filename}`;

    await fs.mkdir(categoryDirectory, { recursive: true }); 

    const buffer = Buffer.from(await logoImageFile.arrayBuffer());
    await fs.writeFile(imageDiskPath, buffer);

    const newLogoEntry: LogoInfo = {
      id: uuidv4(),
      alt: alt,
      imagePath: publicImagePath, 
    };

    if (url && url.trim() !== '') {
      newLogoEntry.url = url.trim();
    }

    targetCategory.logos.push(newLogoEntry);
    await writePartnersData(partners);

    return NextResponse.json(newLogoEntry, { status: 201 });

  } catch (error) {
    console.error('Error adding new logo:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: `Failed to add logo: ${message}` }, { status: 500 });
  }
}

// Wrap the POST handler with authentication
export const POST = withAdminAuth(postHandler);

// Note: GET, PUT, DELETE for specific logos are in /api/partners/[categoryId]/logos/[logoId]/route.ts
