import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';
import { supabase } from '@/lib/supabase';
import { MastheadItem } from '@/types/masthead';

// --- Public Handlers ---

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('interactive_mastheads')
      .select('*')
      .order('id');
    
    if (error) throw error;
    
    // Supabase verilerini MastheadItem formatına dönüştür
    const formattedData = (data || []).map((item: any) => ({
      id: item.id,
      category: item.category,
      brand: item.brand,
      title: item.title,
      image: item.image,
      popupHtmlPath: item.popup_html_path,
      popupTitle: item.popup_title,
      popupDescription: item.popup_description || '',
      bannerDetails: {
        size: item.banner_size || '',
        platforms: item.banner_platforms || ''
      }
    }));
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('GET /api/mastheads error:', error);
    return NextResponse.json({ message: 'Error fetching masthead data' }, { status: 500 });
  }
}

// --- Protected Handlers ---

// POST handler artık kullanılmıyor - admin panel doğrudan Supabase ile çalışıyor
async function postHandler(request: NextRequest) {
  return NextResponse.json({ message: 'This endpoint is deprecated. Use admin panel for updates.' }, { status: 410 });
}

// Wrap the POST handler with authentication
export const POST = withAdminAuthSimple(postHandler);
