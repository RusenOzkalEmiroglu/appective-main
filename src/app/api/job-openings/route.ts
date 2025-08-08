// src/app/api/job-openings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { JobOpening } from '@/types/jobOpenings';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

const dataFilePath = path.join(process.cwd(), 'data', 'jobOpenings.json');

async function readData(): Promise<JobOpening[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // If the file doesn't exist, return an empty array.
    }
    // For other errors, re-throw them.
    console.error('Error reading job openings data:', error);
    throw error;
  }
}

async function writeData(data: JobOpening[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET handler to fetch all job openings - Publicly accessible
export async function GET() {
  try {
    const jobOpenings = await readData();
    return NextResponse.json(jobOpenings);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading job openings data' }, { status: 500 });
  }
}

// --- Protected Handler ---

// Original POST handler logic
async function postHandler(request: NextRequest) {
  try {
    const newJob: Omit<JobOpening, 'id'> = await request.json();
    
    if (!newJob.title || !newJob.details.fullTitle) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const jobOpenings = await readData();
    
    const jobWithId: JobOpening = {
      ...newJob,
      id: new Date().getTime().toString(), // Generate a unique ID
    };
    
    jobOpenings.push(jobWithId);
    await writeData(jobOpenings);
    
    return NextResponse.json(jobWithId, { status: 201 });
  } catch (error) {
    console.error('Failed to create job opening:', error);
    return NextResponse.json({ message: 'Error creating job opening' }, { status: 500 });
  }
}

// Wrap the protected handler with authentication. This is a static route, so we use `withAdminAuthSimple`.
export const POST = withAdminAuthSimple(postHandler);
