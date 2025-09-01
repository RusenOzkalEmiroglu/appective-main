import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, stat } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import AdmZip from 'adm-zip';

// Helper function to ensure directory exists
async function ensureDirectoryExists(directory: string) {
  try {
    await stat(directory);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await mkdir(directory, { recursive: true });
    } else {
      throw error;
    }
  }
}

import { withAdminAuthSimple } from '@/lib/withAdminAuth';

async function uploadHandler(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const category = data.get('category') as string || 'uncategorized';
    const brand = data.get('brand') as string || 'unknown';
    const type = data.get('type') as string || 'preview';
    const isZip = (data.get('isZip') as string) === 'true';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    // Sanitize category and brand for safe file paths
    const sanitizedCategory = category.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedBrand = brand.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Generate a unique filename
    const fileExtension = path.extname(file.name);
    const uniqueId = uuidv4();
    const uniqueFilename = `${uniqueId}${fileExtension}`;

    // Define the path based on file type
    let baseDir, publicPath;
    
    if (isZip) {
      // For ZIP files (HTML5 ads)
      baseDir = path.join(process.cwd(), 'public', 'interactive_mastheads_zips', sanitizedCategory, sanitizedBrand);
      publicPath = `/interactive_mastheads_zips/${sanitizedCategory}/${sanitizedBrand}/${uniqueFilename.replace('.zip', '')}`;
    } else {
      // For images - use uploads directory for applications
      baseDir = path.join(process.cwd(), 'public', 'uploads');
      publicPath = `/uploads/${uniqueFilename}`;
    }

    // Ensure the directory exists
    await ensureDirectoryExists(baseDir);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isZip) {
      // For ZIP files, extract the contents
      const extractDir = path.join(baseDir, uniqueFilename.replace('.zip', ''));
      await ensureDirectoryExists(extractDir);
      
      // Save the zip file temporarily
      const tempZipPath = path.join(baseDir, `temp-${uniqueFilename}`);
      await writeFile(tempZipPath, buffer);
      
      // Extract the zip
      try {
        const zip = new AdmZip(tempZipPath);
        zip.extractAllTo(extractDir, true);
        
        // Check if index.html exists
        const indexPath = path.join(extractDir, 'index.html');
        try {
          await stat(indexPath);
        } catch (error) {
          return NextResponse.json({ 
            success: false, 
            error: 'The ZIP file must contain an index.html file at the root level.' 
          }, { status: 400 });
        }
        
        // Return the path to the index.html file
        return NextResponse.json({ 
          success: true, 
          filePath: `${publicPath}/index.html` 
        });
      } catch (error) {
        console.error('Error extracting ZIP file:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to extract the ZIP file. Make sure it is a valid ZIP archive.' 
        }, { status: 400 });
      }
    } else {
      // For regular image files
      const filePath = path.join(baseDir, uniqueFilename);
      await writeFile(filePath, buffer);
      
      return NextResponse.json({ 
        success: true, 
        filePath: publicPath,
        url: publicPath
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'An unexpected error occurred during upload.' 
    }, { status: 500 });
  }
}

export const POST = withAdminAuthSimple(uploadHandler);
