import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

const contactInfoPath = path.join(process.cwd(), 'data', 'contactInfo.json');

// Function to ensure the data directory and file exist
async function ensureFileExists() {
  try {
    await fs.access(contactInfoPath);
  } catch {
    try {
      await fs.mkdir(path.dirname(contactInfoPath), { recursive: true });
      // Create with a default empty object structure
      await fs.writeFile(contactInfoPath, JSON.stringify({}, null, 2));
    } catch (setupError) {
      console.error('Failed to create contact info file or directory:', setupError);
      throw new Error('Failed to initialize contact info storage.');
    }
  }
}

// --- Public Handlers ---

// GET handler remains public
export async function GET() {
  try {
    await ensureFileExists();
    const fileContents = await fs.readFile(contactInfoPath, 'utf8');
    const contactInfo = JSON.parse(fileContents);
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Failed to read contact info:', error);
    return NextResponse.json({ message: 'Failed to read contact info' }, { status: 500 });
  }
}

// --- Protected Handlers ---

// Original POST handler logic
async function postHandler(request: NextRequest) {
  try {
    await ensureFileExists();
    const data = await request.json();
    await fs.writeFile(contactInfoPath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ message: 'Contact info updated successfully' });
  } catch (error) {
    console.error('Failed to write contact info:', error);
    return NextResponse.json({ message: 'Failed to write contact info' }, { status: 500 });
  }
}

// Wrap the POST handler with authentication
export const POST = withAdminAuthSimple(postHandler);
