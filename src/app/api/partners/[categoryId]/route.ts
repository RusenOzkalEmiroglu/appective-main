import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { 
  readPartnersData, 
  writePartnersData, 
  PartnerCategory, 
  partnerLogosBasePath 
} from '@/lib/partnersDataUtils';
import { withAdminAuth } from '@/lib/withAdminAuth';

interface CategoryRouteParams {
  params: {
    categoryId: string;
  };
}

// --- Protected Handlers ---

// Original GET handler logic
async function getHandler(request: NextRequest, { params }: CategoryRouteParams) {
  const { categoryId } = params;
  try {
    const partners = await readPartnersData();
    const category = partners.find(cat => cat.id === categoryId);
    if (!category) {
      return NextResponse.json({ message: `Category with id '${categoryId}' not found.` }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Failed to fetch category ${categoryId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch category data' }, { status: 500 });
  }
}

// Original PUT handler logic
async function putHandler(request: NextRequest, { params }: CategoryRouteParams) {
  const { categoryId } = params;
  try {
    const updatedData = await request.json() as Partial<Omit<PartnerCategory, 'id' | 'logos' | 'originalPath'>>;
    const partners = await readPartnersData();
    const categoryIndex = partners.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
      return NextResponse.json({ message: `Category with id '${categoryId}' not found.` }, { status: 404 });
    }

    if (updatedData.name) {
      partners[categoryIndex].name = updatedData.name;
    }

    await writePartnersData(partners);
    return NextResponse.json({ message: `Category '${categoryId}' updated successfully.`, data: partners[categoryIndex] });

  } catch (error) {
    console.error(`Failed to update category ${categoryId}:`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update category data' }, { status: 500 });
  }
}

// Original DELETE handler logic
async function deleteHandler(request: NextRequest, { params }: CategoryRouteParams) {
  const { categoryId } = params;
  try {
    let partners = await readPartnersData();
    const categoryIndex = partners.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
      return NextResponse.json({ message: `Category with id '${categoryId}' not found.` }, { status: 404 });
    }

    const categoryToDelete = partners[categoryIndex];
    partners.splice(categoryIndex, 1);

    await writePartnersData(partners);

    const logoDir = path.join(partnerLogosBasePath, categoryToDelete.originalPath);
    try {
      await fs.rm(logoDir, { recursive: true, force: true });
    } catch (dirError) {
      console.error(`Failed to delete directory ${logoDir}:`, dirError);
      // Log the error, but don't fail the request as the JSON data has been updated.
    }

    return NextResponse.json({ message: `Category '${categoryId}' and its associated directory deleted successfully.` });

  } catch (error) {
    console.error(`Failed to delete category ${categoryId}:`, error);
    return NextResponse.json({ message: 'Failed to delete category data' }, { status: 500 });
  }
}

// Wrap all handlers with authentication
export const GET = withAdminAuth(getHandler);
export const PUT = withAdminAuth(putHandler);
export const DELETE = withAdminAuth(deleteHandler);
