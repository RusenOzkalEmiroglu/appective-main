// src/app/api/job-openings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { JobOpening } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

// Supabase'den job openings verilerini al
async function getJobOpeningsFromSupabase(): Promise<JobOpening[]> {
  try {
    const { data, error } = await supabase
      .from('job_openings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase job openings fetch error:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching job openings from Supabase:', error);
    throw error;
  }
}

// GET handler to fetch all job openings - Publicly accessible
export async function GET() {
  try {
    const data = await getJobOpeningsFromSupabase();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading job openings data' }, { status: 500 });
  }
}

// --- Protected Handler ---

// POST handler to create new job opening via Supabase
async function postHandler(request: NextRequest) {
  try {
    const newJob = await request.json();
    
    if (!newJob.title || !newJob.full_title) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique ID for new job
    const generateId = () => {
      return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    const jobWithId = {
      ...newJob,
      id: generateId(),
    };
    
    const { data, error } = await supabase
      .from('job_openings')
      .insert([jobWithId])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ message: 'Error creating job opening' }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create job opening:', error);
    return NextResponse.json({ message: 'Error creating job opening' }, { status: 500 });
  }
}

// Wrap the protected handler with authentication. This is a static route, so we use `withAdminAuthSimple`.
export const POST = withAdminAuthSimple(postHandler);
