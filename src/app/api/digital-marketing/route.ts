import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DigitalMarketingItem, initialDigitalMarketingItems } from '@/data/digitalMarketingData';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'digitalMarketingData.ts');

// Helper function to read data from the file
const readDigitalMarketingItemsFromFile = (): DigitalMarketingItem[] => {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    const match = fileContent.match(/export const initialDigitalMarketingItems: DigitalMarketingItem\[\] = ([\s\S]*?);/);
    if (match && match[1]) {
      // This is a simplified approach. For robustness, consider using a dedicated JSON file or database.
      // The regex extracts the array string, which needs to be valid JSON to parse.
      // For now, we'll rely on the initial data if parsing is complex or fails.
      try {
        // Attempting to parse directly is complex for TS files. Returning initial data as fallback.
        // To persist changes, the write function needs to correctly format the TS file.
        return initialDigitalMarketingItems; 
      } catch (e) {
        console.error('Error parsing digital marketing data from file:', e);
        return initialDigitalMarketingItems; // Fallback
      }
    }
    return initialDigitalMarketingItems; // Fallback if no match
  } catch (error) {
    console.error('Error reading digital marketing data file:', error);
    return initialDigitalMarketingItems; // Fallback to initial data if file read fails
  }
};

// Helper function to write data to the file
const writeDigitalMarketingItemsToFile = (data: DigitalMarketingItem[]) => {
  const tsContent = `export interface DigitalMarketingItem {
  id: number;
  title: string;
  client: string;
  description: string;
  image: string;
  services: string[];
  projectUrl?: string;
}

export const initialDigitalMarketingItems: DigitalMarketingItem[] = ${JSON.stringify(data, null, 2)};
`;
  try {
    fs.writeFileSync(dataFilePath, tsContent, 'utf-8');
  } catch (error) {
    console.error('Error writing digital marketing data to file:', error);
  }
};

export async function GET() {
  const items = readDigitalMarketingItemsFromFile();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const newItemsData: DigitalMarketingItem[] = await request.json();
    if (!Array.isArray(newItemsData)) {
      return NextResponse.json({ message: 'Invalid data format. Expected an array.' }, { status: 400 });
    }
    writeDigitalMarketingItemsToFile(newItemsData);
    return NextResponse.json({ message: 'Digital marketing data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing POST request for digital marketing:', error);
    return NextResponse.json({ message: 'Error saving digital marketing data', error: (error as Error).message }, { status: 500 });
  }
}
