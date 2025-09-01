import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

// GET handler - fetch services from Supabase
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching services from Supabase:', error);
      return NextResponse.json({ message: 'Failed to fetch services data' }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error reading services data:', error);
    return NextResponse.json({ message: 'Failed to read services data' }, { status: 500 });
  }
}

// --- Protected Handlers ---

// POST handler - add service to Supabase
async function postHandler(request: NextRequest) {
  try {
    const newService = await request.json();

    if (!newService || typeof newService.name !== 'string' || !newService.name.trim()) {
      return NextResponse.json({ message: 'Invalid service data. Name is required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('services')
      .insert([newService])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding service to Supabase:', error);
      return NextResponse.json({ message: 'Failed to add service' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error processing POST request for services:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error adding service', error: errorMessage }, { status: 500 });
  }
}

// Wrap the POST handler with authentication
export const POST = withAdminAuthSimple(postHandler);
