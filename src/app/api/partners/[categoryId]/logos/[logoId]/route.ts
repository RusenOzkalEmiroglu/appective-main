import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { 
  readPartnersData, 
  writePartnersData, 
  LogoInfo 
} from '@/lib/partnersDataUtils';
import { withAdminAuth } from '@/lib/withAdminAuth';

interface LogoRouteParams {
  params: {
    categoryId: string;
    logoId: string;
  };
}

// --- Protected Handlers ---

// Original PUT handler logic
async function putHandler(request: NextRequest, { params }: LogoRouteParams) {
  const { categoryId, logoId } = params;
  try {
    const updatedLogoData = await request.json() as Partial<Omit<LogoInfo, 'id'>>;
    const partners = await readPartnersData();
    const categoryIndex = partners.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
      return NextResponse.json({ message: `Category with id '${categoryId}' not found.` }, { status: 404 });
    }

    const logoIndex = partners[categoryIndex].logos.findIndex(logo => logo.id === logoId);
    if (logoIndex === -1) {
      return NextResponse.json({ message: `Logo with id '${logoId}' not found in category '${categoryId}'.` }, { status: 404 });
    }

    const oldImagePath = partners[categoryIndex].logos[logoIndex].imagePath;

    if (typeof updatedLogoData.alt === 'string') {
      partners[categoryIndex].logos[logoIndex].alt = updatedLogoData.alt;
    }

    if (typeof updatedLogoData.url === 'string') {
      if (updatedLogoData.url.trim() === '') {
        delete partners[categoryIndex].logos[logoIndex].url;
      } else {
        partners[categoryIndex].logos[logoIndex].url = updatedLogoData.url.trim();
      }
    } else if (updatedLogoData.url === null) {
        delete partners[categoryIndex].logos[logoIndex].url;
    }

    if (updatedLogoData.imagePath && updatedLogoData.imagePath !== oldImagePath) {
      partners[categoryIndex].logos[logoIndex].imagePath = updatedLogoData.imagePath;
      const fullOldPath = path.join(process.cwd(), 'public', oldImagePath);
      try {
        await fs.unlink(fullOldPath);
      } catch (fileError: any) {
        if (fileError.code !== 'ENOENT') {
          console.error(`Failed to delete old image file ${fullOldPath}:`, fileError);
        }
      }
    }

    await writePartnersData(partners);
    return NextResponse.json({ message: 'Logo updated successfully.', data: partners[categoryIndex].logos[logoIndex] });

  } catch (error) {
    console.error(`Failed to update logo ${logoId} in category ${categoryId}:`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update logo' }, { status: 500 });
  }
}

// Original DELETE handler logic
async function deleteHandler(request: NextRequest, { params }: LogoRouteParams) {
  const { categoryId, logoId } = params;
  try {
    const partners = await readPartnersData();
    const categoryIndex = partners.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
      return NextResponse.json({ message: `Category with id '${categoryId}' not found.` }, { status: 404 });
    }

    const logoIndex = partners[categoryIndex].logos.findIndex(logo => logo.id === logoId);
    if (logoIndex === -1) {
      return NextResponse.json({ message: `Logo with id '${logoId}' not found in category '${categoryId}'.` }, { status: 404 });
    }

    const logoToDelete = partners[categoryIndex].logos[logoIndex];
    partners[categoryIndex].logos.splice(logoIndex, 1);

    await writePartnersData(partners);

    const imageFilePath = path.join(process.cwd(), 'public', logoToDelete.imagePath);
    try {
      await fs.unlink(imageFilePath);
    } catch (fileError: any) {
      if (fileError.code !== 'ENOENT') {
        console.error(`Failed to delete image file ${imageFilePath}:`, fileError);
      }
    }

    return NextResponse.json({ message: `Logo '${logoId}' deleted successfully from category '${categoryId}'.` });

  } catch (error) {
    console.error(`Failed to delete logo ${logoId} from category ${categoryId}:`, error);
    return NextResponse.json({ message: 'Failed to delete logo' }, { status: 500 });
  }
}

// Wrap all handlers with authentication
export const PUT = withAdminAuth(putHandler);
export const DELETE = withAdminAuth(deleteHandler);
