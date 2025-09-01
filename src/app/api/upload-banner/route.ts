import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Banner klasörünü oluştur
    const bannerDir = path.join(process.cwd(), 'public', 'images', 'banner');
    try {
      await mkdir(bannerDir, { recursive: true });
    } catch (error) {
      // Klasör zaten varsa hata verme
    }

    // Dosya adını temizle ve benzersiz yap
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${cleanFileName}`;
    const filePath = path.join(bannerDir, fileName);

    // Dosyayı kaydet
    await writeFile(filePath, buffer);

    // URL'i döndür
    const fileUrl = `/images/banner/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      message: 'File uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'File upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
