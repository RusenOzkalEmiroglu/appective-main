import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import { join } from 'path';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

async function cleanupHandler(request: NextRequest) {
  try {
    const { filePath } = await request.json();
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      );
    }

    // Only allow cleanup of HTML5 ad directories
    if (!filePath.includes('/interactive_mastheads_zips/')) {
      return NextResponse.json(
        { error: 'Invalid file path. Only HTML5 ad directories can be cleaned up.' },
        { status: 400 }
      );
    }

    // Extract the directory path from the HTML file path
    // The filePath will be something like "/interactive_mastheads_zips/category/brand/popup-html5-hash/index.html"
    const pathParts = filePath.split('/');
    // Remove "index.html" from the end
    if (pathParts[pathParts.length - 1] === 'index.html') {
      pathParts.pop();
    }
    const directoryPath = join(process.cwd(), 'public', ...pathParts);

    // Check if directory exists
    if (fs.existsSync(directoryPath)) {
      // Remove the directory and all its contents
      fs.rmSync(directoryPath, { recursive: true, force: true });
      
      return NextResponse.json({
        success: true,
        message: `Successfully removed directory: ${directoryPath}`
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Directory not found: ${directoryPath}`
      });
    }
  } catch (error: any) {
    console.error('Error cleaning up HTML5 ad directory:', error);
    return NextResponse.json(
      { error: `Failed to clean up directory: ${error.message}` },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuthSimple(cleanupHandler);
