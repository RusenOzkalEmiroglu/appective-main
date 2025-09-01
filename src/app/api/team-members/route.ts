import { NextRequest, NextResponse } from 'next/server';
import { supabase, TeamMember } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle single item creation/update
    const item = body;
    
    // Validate required fields
    if (!item.name || !item.position || !item.image) {
      return NextResponse.json({ error: 'Name, position, and image are required' }, { status: 400 });
    }

    // Prepare data for Supabase
    const teamMemberData = {
      name: item.name,
      position: item.position,
      image: item.image,
      bio: item.bio || null,
      display_order: item.display_order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true,
      ...(item.id && item.id !== 0 && { id: item.id }), // Only include valid id
    };

    let result;
    if (item.id && item.id !== 0) {
      // Update existing item
      const { data, error } = await supabase
        .from('team_members')
        .update(teamMemberData)
        .eq('id', item.id)
        .select();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new item
      const { data, error } = await supabase
        .from('team_members')
        .insert([teamMemberData])
        .select();
      
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ message: 'Team member saved successfully', data: result });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to save team member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
