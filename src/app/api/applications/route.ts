import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { ApplicationItem } from '@/data/types';

// Path to the data file
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'applicationsData.ts');

// Helper function to read data from the file
async function readData(): Promise<ApplicationItem[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const jsonMatch = fileContent.match(/export const applicationsData: ApplicationItem\[\] = ([\s\S]*?);/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return new Function(`return ${jsonMatch[1]}`)();
      } catch (e) {
        console.error('Could not parse data from file:', e);
        return [];
      }
    }
    return [];
  } catch (error) {
    return [];
  }
}

// Helper function to write data to the file
async function writeData(data: ApplicationItem[]): Promise<void> {
  const fileContent = `// This file is managed by the API. Do not edit directly.
import { ApplicationItem } from '@/data/types';

export const applicationsData: ApplicationItem[] = ${JSON.stringify(data, null, 2)};
`;
  await fs.writeFile(dataFilePath, fileContent, 'utf-8');
}

// GET: Fetch all applications
export async function GET() {
  const applications = await readData();
  return NextResponse.json(applications);
}

// POST: Add a new application
export async function POST(request: NextRequest) {
  try {
    const newApplicationData: Omit<ApplicationItem, 'id'> = await request.json();
    if (!newApplicationData.title || !newApplicationData.description) {
      return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
    }
    const applications = await readData();
    
    const maxId = applications.reduce((max, app) => app.id > max ? app.id : max, 0);
    const newId = maxId + 1;

    const applicationWithId: ApplicationItem = { ...newApplicationData, id: newId };
    
    applications.push(applicationWithId);
    await writeData(applications);
    
    return NextResponse.json(applicationWithId, { status: 201 });
  } catch (error) {
    console.error('Failed to create application:', error);
    return NextResponse.json({ message: 'Error creating application', errorDetails: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// PUT: Update an existing application
export async function PUT(request: NextRequest) {
  try {
    const updatedApplication: ApplicationItem = await request.json();
    if (!updatedApplication.id) {
      return NextResponse.json({ message: 'Application ID is required for update' }, { status: 400 });
    }
    let applications = await readData();
    
    const index = applications.findIndex(app => app.id === updatedApplication.id);
    
    if (index === -1) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    
    applications[index] = updatedApplication;
    await writeData(applications);
    
    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json({ message: 'Error updating application', errorDetails: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// DELETE: Remove an application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: 'Application ID is required' }, { status: 400 });
    }

    const applicationId = parseInt(id, 10);
    let applications = await readData();
    
    const initialLength = applications.length;
    const filteredApplications = applications.filter(app => app.id !== applicationId);
    
    if (initialLength === filteredApplications.length) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    
    await writeData(filteredApplications);
    
    return NextResponse.json({ message: 'Application deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete application:', error);
    return NextResponse.json({ message: 'Error deleting application', errorDetails: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
