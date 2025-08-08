// src/app/api/job-openings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { JobOpening } from '@/types/jobOpenings';
import { withAdminAuth } from '@/lib/withAdminAuth';

const dataFilePath = path.join(process.cwd(), 'data', 'jobOpenings.json');

async function readData(): Promise<JobOpening[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeData(data: JobOpening[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET handler for a single job opening - Publicly accessible
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const jobOpenings = await readData();
    const job = jobOpenings.find(j => j.id === params.id);
    if (job) {
      return NextResponse.json(job);
    } else {
      return NextResponse.json({ message: 'Job opening not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Failed to read job opening ${params.id}:`, error);
    return NextResponse.json({ message: 'Error reading job opening data' }, { status: 500 });
  }
}

// --- Protected Handlers ---

async function putHandler(request: NextRequest, { params }: { params: { id: string } }) {
  const updatedJobData: Partial<JobOpening> = await request.json();
  const jobOpenings = await readData();
  const jobIndex = jobOpenings.findIndex(j => j.id === params.id);

  if (jobIndex === -1) {
    return NextResponse.json({ message: 'Job opening not found' }, { status: 404 });
  }

  jobOpenings[jobIndex] = { ...jobOpenings[jobIndex], ...updatedJobData, id: params.id };
  await writeData(jobOpenings);

  return NextResponse.json(jobOpenings[jobIndex]);
}

async function deleteHandler(request: NextRequest, { params }: { params: { id: string } }) {
  const jobOpenings = await readData();
  const filteredJobOpenings = jobOpenings.filter(j => j.id !== params.id);

  if (jobOpenings.length === filteredJobOpenings.length) {
    return NextResponse.json({ message: 'Job opening not found' }, { status: 404 });
  }

  await writeData(filteredJobOpenings);

  return new NextResponse(null, { status: 204 }); // No Content
}

// Wrap the protected handlers with authentication. This is a dynamic route, so we use `withAdminAuth`.
export const PUT = withAdminAuth(putHandler);
export const DELETE = withAdminAuth(deleteHandler);
