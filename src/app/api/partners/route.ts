import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { 
  readPartnersData, 
  writePartnersData, 
  PartnerCategory, 
  partnerLogosBasePath 
} from '@/lib/partnersDataUtils';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

// --- Public API Handlers ---

// GET handler to fetch all partner categories (Publicly accessible)
export async function GET() {
  try {
    const partners = await readPartnersData();
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Failed to fetch partners data:', error);
    return NextResponse.json({ message: 'Failed to fetch partners data' }, { status: 500 });
  }
}

// --- Protected API Handlers ---

// Original POST handler logic to add a new partner category
async function postHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, originalPath } = body as { name: string, originalPath: string };

    if (!name || !originalPath) {
      return NextResponse.json({ message: 'Missing required category fields: name and originalPath are required.' }, { status: 400 });
    }

    const newCategoryData: PartnerCategory = {
      id: uuidv4(),
      name,
      originalPath,
      logos: [], // New categories start with no logos
    };

    const partners = await readPartnersData();

    if (partners.some(cat => cat.id === newCategoryData.id) || partners.some(cat => cat.originalPath === newCategoryData.originalPath)) {
      return NextResponse.json({ message: `Category with this ID or originalPath already exists.` }, { status: 409 });
    }

    partners.push(newCategoryData);

    const logoDir = path.join(partnerLogosBasePath, newCategoryData.originalPath);
    try {
      await fs.mkdir(logoDir, { recursive: true });
    } catch (dirError) {
      console.error(`Failed to create directory ${logoDir}:`, dirError);
      // Proceeding even if directory creation fails, as JSON update is the primary goal.
    }

    await writePartnersData(partners);
    return NextResponse.json(newCategoryData, { status: 201 });

  } catch (error) {
    console.error('Failed to create partner category:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create partner category' }, { status: 500 });
  }
}

// Wrap the protected POST handler with authentication
export const POST = withAdminAuthSimple(postHandler);

// Note: PUT and DELETE for categories are in /api/partners/[categoryId]/route.ts
