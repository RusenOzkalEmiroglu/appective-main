// src/app/api/test/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'jobOpenings.json');
    console.log('Data file path:', dataFilePath);
    
    // Check if file exists
    try {
      await fs.access(dataFilePath);
      console.log('File exists');
    } catch (error) {
      console.log('File does not exist');
      return NextResponse.json({ 
        error: 'File does not exist',
        path: dataFilePath,
        cwd: process.cwd()
      });
    }
    
    // Try to read the file
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      console.log('File content length:', fileContent.length);
      
      // Try to parse the JSON
      try {
        const parsed = JSON.parse(fileContent);
        return NextResponse.json({ 
          success: true, 
          path: dataFilePath,
          items: Array.isArray(parsed) ? parsed.length : 'not an array',
          sample: Array.isArray(parsed) && parsed.length > 0 ? parsed[0].title : null
        });
      } catch (parseError: any) {
        return NextResponse.json({ 
          error: 'JSON parse error', 
          message: parseError.message,
          content: fileContent.substring(0, 100) + '...'
        });
      }
    } catch (readError: any) {
      return NextResponse.json({ 
        error: 'File read error', 
        code: readError.code,
        message: readError.message
      });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Unknown error', 
      message: error.message 
    });
  }
}
