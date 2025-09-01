import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GameItem, initialGames as initialGamesData } from '@/data/gamesData';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      // Return file data as fallback
      return NextResponse.json(initialGamesData);
    }

    // Map Supabase field names to frontend interface
    const mappedData = (data || []).map(item => ({
      ...item,
      projectUrl: item.project_url
    }));

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error fetching games data:', error);
    return NextResponse.json(initialGamesData);
  }
}

export async function POST(request: Request) {
  try {
    const itemData = await request.json();
    
    // Handle single item (not bulk update)
    if (!itemData.title || !itemData.description) {
      return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
    }

    let result;
    if (itemData.id && itemData.id !== 0) {
      // Update existing item
      const { data, error } = await supabase
        .from('games')
        .update({
          title: itemData.title,
          description: itemData.description,
          image: itemData.image,
          features: itemData.features,
          platforms: itemData.platforms,
          project_url: itemData.projectUrl
        })
        .eq('id', itemData.id)
        .select();
      
      result = { data, error };
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('games')
        .insert({
          title: itemData.title,
          description: itemData.description,
          image: itemData.image,
          features: itemData.features,
          platforms: itemData.platforms,
          project_url: itemData.projectUrl
        })
        .select();
      
      result = { data, error };
    }

    if (result.error) {
      console.error('Supabase error:', result.error);
      return NextResponse.json({ message: 'Database error', error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Item saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ message: 'Error saving data', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing DELETE request:', error);
    return NextResponse.json({ message: 'Error deleting data', error: (error as Error).message }, { status: 500 });
  }
}
