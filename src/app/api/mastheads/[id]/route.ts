import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { MastheadItem } from '@/types/masthead';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'interactiveMastheadsData.json');

// Helper to ensure the data directory and file exist
async function ensureFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    // If the file doesn't exist, it's an issue because it should have been created by the bulk endpoint.
    // However, for robustness, we can create an empty one.
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
  }
}

// Helper function to read data from the JSON file
async function readMastheadsData(): Promise<MastheadItem[]> {
  await ensureFileExists();
  const fileContent = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Helper function to write data to the JSON file
async function writeMastheadsData(data: MastheadItem[]) {
  await ensureFileExists();
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Public Handlers ---

// GET a single masthead by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await readMastheadsData();
    const masthead = data.find(item => item.id === id);

    if (!masthead) {
      return NextResponse.json({ message: 'Masthead not found' }, { status: 404 });
    }

    return NextResponse.json(masthead);
  } catch (error) {
    console.error(`GET /api/mastheads/${params.id} error:`, error);
    return NextResponse.json({ message: 'Error fetching masthead data' }, { status: 500 });
  }
}

// --- Protected Handlers ---

// PUT (update) a single masthead by ID
async function putHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updatedItem: MastheadItem = await request.json();
    let data = await readMastheadsData();

    const itemIndex = data.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ message: 'Masthead not found' }, { status: 404 });
    }

    // Ensure the ID is not changed
    data[itemIndex] = { ...updatedItem, id };
    await writeMastheadsData(data);

    return NextResponse.json(data[itemIndex]);
  } catch (error) {
    console.error(`PUT /api/mastheads/${params.id} error:`, error);
    return NextResponse.json({ message: 'Error updating masthead data' }, { status: 500 });
  }
}

// DELETE a single masthead by ID
async function deleteHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    let data = await readMastheadsData();
    const filteredData = data.filter(item => item.id !== id);

    if (data.length === filteredData.length) {
      return NextResponse.json({ message: 'Masthead not found' }, { status: 404 });
    }

    await writeMastheadsData(filteredData);

    return NextResponse.json({ message: 'Masthead deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/mastheads/${params.id} error:`, error);
    return NextResponse.json({ message: 'Error deleting masthead data' }, { status: 500 });
  }
}

// Wrap protected handlers with authentication
export const PUT = withAdminAuth(putHandler);
export const DELETE = withAdminAuth(deleteHandler);
