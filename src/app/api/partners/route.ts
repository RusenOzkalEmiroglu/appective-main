import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET handler to fetch all partner categories from Supabase
export async function GET() {
  try {
    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('partner_categories')
      .select('*')
      .order('id');
    
    if (categoriesError) throw categoriesError;

    // Fetch logos for each category
    const { data: logosData, error: logosError } = await supabase
      .from('partner_logos')
      .select('*')
      .order('id');
    
    if (logosError) throw logosError;

    // Combine categories with their logos
    const categoriesWithLogos = (categoriesData || []).map(category => ({
      id: category.id.toString(),
      name: category.name,
      originalPath: category.original_path,
      logos: (logosData || [])
        .filter(logo => logo.category_id === category.id)
        .map(logo => ({
          id: logo.id.toString(),
          alt: logo.alt,
          imagePath: logo.image_path,
          url: logo.url || undefined
        }))
    }));

    return NextResponse.json(categoriesWithLogos);
  } catch (error) {
    console.error('Failed to fetch partners data:', error);
    return NextResponse.json({ message: 'Failed to fetch partners data' }, { status: 500 });
  }
}

// POST handler - Admin panel already uses Supabase directly, so this is not needed
// But keeping it for consistency with other API routes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, original_path } = body;

    if (!name || !original_path) {
      return NextResponse.json({ message: 'Name and original_path are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('partner_categories')
      .insert([{
        name,
        original_path
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Category created successfully', data }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Error creating category' }, { status: 500 });
  }
}
