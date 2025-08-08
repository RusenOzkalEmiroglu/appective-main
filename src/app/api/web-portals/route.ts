import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { initialWebPortalItems, WebPortalItem } from '@/data/webPortalsData';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'webPortalsData.ts');

async function readWebPortalsData(): Promise<WebPortalItem[]> {
  try {
    const fileContent = await fs.promises.readFile(dataFilePath, 'utf-8');
    const match = fileContent.match(/export const initialWebPortalItems: WebPortalItem\[\] = ([\s\S]*?);/);
    if (match && match[1]) {
      // This is a simplified parser. It's not a full JS parser.
      // It expects a JSON-like array structure.
      const arrayString = match[1].trim();
      // A bit of a hack to make it valid JSON by ensuring keys are quoted.
      const jsonString = arrayString.replace(/([{,])\s*([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":');
      return JSON.parse(jsonString);
    }
    return initialWebPortalItems;
  } catch (error) {
    console.error('Error reading web portals data file, falling back to initial data:', error);
    return initialWebPortalItems;
  }
}

async function writeWebPortalsData(data: WebPortalItem[]): Promise<void> {
  const fileContent = `export interface WebPortalItem {
  id: number;
  title: string;
  client: string;
  description: string;
  image: string;
  projectUrl?: string;
}

export const initialWebPortalItems: WebPortalItem[] = ${JSON.stringify(data, null, 2)};
`;
  await fs.promises.writeFile(dataFilePath, fileContent, 'utf-8');
}

export async function GET() {
  try {
    const items = await readWebPortalsData();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading data', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: 'Invalid data format. Expected an array.' }, { status: 400 });
    }
    await writeWebPortalsData(body);
    return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error writing data', error: (error as Error).message }, { status: 500 });
  }
}
