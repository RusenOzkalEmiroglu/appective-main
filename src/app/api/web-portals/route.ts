import { NextResponse } from 'next/server';
import { WebPortalItem } from '@/data/webPortalsData';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('web_portals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data to match WebPortalItem interface
    const transformedData: WebPortalItem[] = data.map(item => ({
      id: item.id,
      title: item.title,
      client: item.client,
      description: item.description,
      image: item.image,
      projectUrl: item.project_url
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching web portals:', error);
    return NextResponse.json({ message: 'Error reading data', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (Array.isArray(body)) {
      // Bulk update - replace all data
      const { error: deleteError } = await supabase
        .from('web_portals')
        .delete()
        .neq('id', '');

      if (deleteError) {
        throw deleteError;
      }

      const transformedData = body.map(item => ({
        id: item.id,
        title: item.title,
        client: item.client,
        description: item.description,
        image: item.image,
        project_url: item.projectUrl || null
      }));

      const { error: insertError } = await supabase
        .from('web_portals')
        .insert(transformedData);

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
    } else {
      // Single item create/update
      const item = body as WebPortalItem;
      const transformedItem = {
        ...(item.id && item.id !== 0 && { id: item.id }), // Only include valid id
        title: item.title,
        client: item.client,
        description: item.description,
        image: item.image,
        project_url: item.projectUrl || null
      };

      const { error } = await supabase
        .from('web_portals')
        .upsert(transformedItem);

      if (error) {
        throw error;
      }

      return NextResponse.json({ message: 'Item saved successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error saving web portal data:', error);
    return NextResponse.json({ message: 'Error saving data', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('web_portals')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting web portal:', error);
    return NextResponse.json({ message: 'Error deleting data', error: (error as Error).message }, { status: 500 });
  }
}
