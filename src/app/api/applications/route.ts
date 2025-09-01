import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

// GET: Fetch all applications from Supabase
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching applications from Supabase:', error);
      return NextResponse.json({ message: 'Failed to fetch applications' }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error reading applications data:', error);
    return NextResponse.json({ message: 'Failed to read applications data' }, { status: 500 });
  }
}

// POST: Add a new application to Supabase
async function postHandler(request: NextRequest) {
  try {
    const newApplicationData = await request.json();
    if (!newApplicationData.title || !newApplicationData.description) {
      return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([newApplicationData])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding application to Supabase:', error);
      return NextResponse.json({ message: 'Failed to add application' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create application:', error);
    return NextResponse.json({ message: 'Error creating application', errorDetails: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// PUT: Update an existing application in Supabase
async function putHandler(request: NextRequest) {
  try {
    const updatedApplication = await request.json();
    if (!updatedApplication.id) {
      return NextResponse.json({ message: 'Application ID is required for update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updatedApplication)
      .eq('id', updatedApplication.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating application in Supabase:', error);
      return NextResponse.json({ message: 'Failed to update application' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json({ message: 'Error updating application', errorDetails: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// DELETE: Remove an application from Supabase
async function deleteHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: 'Application ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', parseInt(id, 10));
    
    if (error) {
      console.error('Error deleting application from Supabase:', error);
      return NextResponse.json({ message: 'Failed to delete application' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Application deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete application:', error);
    return NextResponse.json({ message: 'Error deleting application', errorDetails: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// Wrap handlers with authentication
export const POST = withAdminAuthSimple(postHandler);
export const PUT = withAdminAuthSimple(putHandler);
export const DELETE = withAdminAuthSimple(deleteHandler);
