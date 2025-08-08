import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';
import { MastheadItem } from '@/types/masthead';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'interactiveMastheadsData.json');

// Helper to ensure the data directory and file exist
async function ensureFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    try {
      await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
    } catch (setupError) {
      console.error('Failed to create mastheads data file or directory:', setupError);
      throw new Error('Failed to initialize mastheads data storage.');
    }
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

export async function GET(request: NextRequest) {
  try {
    const data = await readMastheadsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/mastheads error:', error);
    return NextResponse.json({ message: 'Error fetching masthead data' }, { status: 500 });
  }
}

// --- Protected Handlers ---

// Original POST handler logic to update the entire dataset
async function postHandler(request: NextRequest) {
  try {
    const newData: MastheadItem[] = await request.json();
    // Optional: Add validation for the incoming data array here
    await writeMastheadsData(newData);
    return NextResponse.json({ message: 'Masthead data updated successfully' });
  } catch (error) {
    console.error('POST /api/mastheads error:', error);
    return NextResponse.json({ message: 'Error updating masthead data' }, { status: 500 });
  }
}

// Wrap the POST handler with authentication
export const POST = withAdminAuthSimple(postHandler);
