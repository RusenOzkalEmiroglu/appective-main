import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

const SOCIAL_LINKS_PATH = path.join(process.cwd(), 'data', 'socialLinks.json');

// Function to ensure the data directory and file exist to prevent errors
async function ensureFileExists() {
  try {
    await fs.access(SOCIAL_LINKS_PATH);
  } catch {
    // If the file doesn't exist, create the directory and then the file
    try {
      await fs.mkdir(path.dirname(SOCIAL_LINKS_PATH), { recursive: true });
      await fs.writeFile(SOCIAL_LINKS_PATH, JSON.stringify([], null, 2));
    } catch (setupError) {
      console.error('Failed to create social links file or directory:', setupError);
      // This is a critical setup error, rethrow or handle appropriately
      throw new Error('Failed to initialize social links storage.');
    }
  }
}

// --- Public Handlers ---

// GET handler remains public
export async function GET() {
  try {
    await ensureFileExists();
    const fileContent = await fs.readFile(SOCIAL_LINKS_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read social links:', error);
    return NextResponse.json({ error: 'Failed to read links' }, { status: 500 });
  }
}

// --- Protected Handlers ---

// Original POST handler logic
async function postHandler(req: NextRequest) {
  try {
    await ensureFileExists(); // Ensure file and directory exist before writing
    const links = await req.json();
    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    await fs.writeFile(SOCIAL_LINKS_PATH, JSON.stringify(links, null, 2), 'utf-8');
    return NextResponse.json({ success: true, message: 'Social links saved successfully.' });
  } catch (error) {
    console.error('Failed to save social links:', error);
    return NextResponse.json({ error: 'Failed to save social links', details: String(error) }, { status: 500 });
  }
}

// Wrap the POST handler with authentication
export const POST = withAdminAuthSimple(postHandler);
