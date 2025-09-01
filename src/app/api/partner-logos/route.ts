import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET handler to fetch all partner logos
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('partner_logos')
      .select('*')
      .order('id');

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch partner logos:', error);
    return NextResponse.json({ message: 'Failed to fetch partner logos' }, { status: 500 });
  }
}

// POST handler to add a new partner logo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category_id, alt, src, url } = body;

    if (!category_id || !alt || !src) {
      return NextResponse.json({ message: 'category_id, alt, and src are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('partner_logos')
      .insert([{
        category_id: parseInt(category_id),
        alt,
        src,
        url: url || null
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Logo created successfully', data }, { status: 201 });
  } catch (error) {
    console.error('Error creating logo:', error);
    return NextResponse.json({ message: 'Error creating logo' }, { status: 500 });
  }
}

// DELETE handler to remove a partner logo
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('partner_logos')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Logo deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json({ message: 'Error deleting logo' }, { status: 500 });
  }
}
