import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ServiceCategory } from '@/types/service';
import { withAdminAuth } from '@/lib/withAdminAuth';

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

interface RouteParams {
  params: { id: string };
}

// --- Public Handlers ---

// GET handler remains public
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const services = await readServicesData();
    const service = services.find(s => s.id === id);

    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error(`Error processing GET request for service ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Error fetching service' }, { status: 500 });
  }
}

// --- Protected Handlers ---

// Original PUT handler logic
async function putHandler(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const updatedServiceData: Partial<Omit<ServiceCategory, 'id'>> = await request.json();

    if (!updatedServiceData) {
      return NextResponse.json({ message: 'Invalid service data.' }, { status: 400 });
    }

    let services = await readServicesData();
    const serviceIndex = services.findIndex(s => s.id === id);

    if (serviceIndex === -1) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    // Update the service, ensuring ID is not changed
    services[serviceIndex] = { 
      ...services[serviceIndex], 
      ...updatedServiceData,
      id: id, // Preserve original ID
    };
    
    await writeServicesData(services);
    return NextResponse.json(services[serviceIndex]);
  } catch (error) {
    console.error(`Error processing PUT request for service ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Error updating service' }, { status: 500 });
  }
}

// Original DELETE handler logic
async function deleteHandler(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    let services = await readServicesData();
    const initialLength = services.length;
    
    const updatedServices = services.filter(s => s.id !== id);

    if (updatedServices.length === initialLength) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    await writeServicesData(updatedServices);

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(`Error processing DELETE request for service ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Error deleting service' }, { status: 500 });
  }
}

// Wrap protected handlers with authentication
export const PUT = withAdminAuth(putHandler);
export const DELETE = withAdminAuth(deleteHandler);
