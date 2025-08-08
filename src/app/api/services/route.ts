import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ServiceCategory } from '@/types/service';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'servicesData.json');

// Helper to ensure the data directory and file exist
async function ensureFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    try {
      await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
    } catch (setupError) {
      console.error('Failed to create services data file or directory:', setupError);
      throw new Error('Failed to initialize services data storage.');
    }
  }
}

// Helper function to read data from the JSON file
async function readServicesData(): Promise<ServiceCategory[]> {
  await ensureFileExists();
  const fileContent = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Helper function to write data to the JSON file
async function writeServicesData(data: ServiceCategory[]) {
  await ensureFileExists();
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Public Handlers ---

// GET handler remains public
export async function GET() {
  try {
    const services = await readServicesData();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error reading services data:', error);
    return NextResponse.json({ message: 'Failed to read services data' }, { status: 500 });
  }
}

// --- Protected Handlers ---

// Original POST handler logic
async function postHandler(request: NextRequest) {
  try {
    const newService: Omit<ServiceCategory, 'id'> = await request.json();

    if (!newService || typeof newService.name !== 'string' || !newService.name.trim()) {
      return NextResponse.json({ message: 'Invalid service data. Name is required.' }, { status: 400 });
    }

    const services = await readServicesData();
    
    const newServiceWithId: ServiceCategory = {
      ...newService,
      id: uuidv4(), // Assign a new unique ID
    };

    const updatedServices = [...services, newServiceWithId];
    await writeServicesData(updatedServices);

    return NextResponse.json(newServiceWithId, { status: 201 });
  } catch (error) {
    console.error('Error processing POST request for services:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error adding service', error: errorMessage }, { status: 500 });
  }
}

// Wrap the POST handler with authentication
export const POST = withAdminAuthSimple(postHandler);
