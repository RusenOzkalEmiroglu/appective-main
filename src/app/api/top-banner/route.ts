import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

// --- Public Handlers ---

// GET handler to fetch current banner data from Supabase
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('top_banner')
      .select('id, background_image, button_link')
      .eq('id', 1)
      .maybeSingle();
    
    if (error) {
      console.error('Banner fetch error:', error);
      return NextResponse.json({ imageUrl: null, targetUrl: null });
    }
    
    if (data) {
      return NextResponse.json({
        imageUrl: data.background_image,
        targetUrl: data.button_link
      });
    }
    
    return NextResponse.json({ imageUrl: null, targetUrl: null });
  } catch (error) {
    console.error('Banner yüklenirken hata:', error);
    return NextResponse.json({ imageUrl: null, targetUrl: null });
  }
}

// --- Protected Handlers ---

// POST handler for updating banner data in Supabase
async function postHandler(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetUrl = formData.get('targetUrl') as string;

    // Get current data
    const { data: currentData } = await supabase
      .from('top_banner')
      .select('background_image')
      .eq('id', 1)
      .maybeSingle();

    let imageUrl = currentData?.background_image || null;

    if (file) {
      // For now, we'll use a simple filename approach
      // In production, you might want to use a proper file upload service
      const uniqueFilename = `${Date.now()}-${file.name}`;
      imageUrl = `/images/banner/${uniqueFilename}`;
    }

    // Update or insert banner data
    const updateData = {
      background_image: imageUrl,
      button_link: targetUrl
    };

    const { data: existingRecord } = await supabase
      .from('top_banner')
      .select('id')
      .eq('id', 1)
      .maybeSingle();

    let result;
    if (existingRecord) {
      // Update existing record
      result = await supabase
        .from('top_banner')
        .update(updateData)
        .eq('id', 1)
        .select();
    } else {
      // Insert new record
      const insertData = {
        id: 1,
        title: 'Welcome to Appective',
        subtitle: 'Digital Marketing & Development',
        description: 'We create innovative digital solutions for your business',
        button_text: 'Get Started',
        ...updateData
      };
      result = await supabase
        .from('top_banner')
        .insert(insertData)
        .select();
    }

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({ success: true, imageUrl, targetUrl });
  } catch (error: any) {
    console.error('Failed to update banner:', error);
    return NextResponse.json({ error: 'Failed to update banner', details: error.message }, { status: 500 });
  }
}

// DELETE handler for removing banner from Supabase
async function deleteHandler(request: NextRequest) {
  try {
    const { error } = await supabase
      .from('top_banner')
      .update({ background_image: null, button_link: null })
      .eq('id', 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner', details: error.message }, { status: 500 });
  }
}

// Wrap protected handlers with authentication
export const POST = withAdminAuthSimple(postHandler);
export const DELETE = withAdminAuthSimple(deleteHandler);
