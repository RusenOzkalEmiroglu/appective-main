import fs from 'fs/promises';
import path from 'path';

export const dataFilePath = path.join(process.cwd(), 'data', 'partnersData.json');
export const partnerLogosBasePath = path.join(process.cwd(), 'public', 'images', 'is_ortaklari');

export interface LogoInfo {
  id: string;
  alt: string;
  imagePath: string; // Relative to /public, e.g., /images/is_ortaklari/category/logo.png
  url?: string; // URL for the logo link
}

export interface PartnerCategory {
  id: string; // a-z, 0-9, _ only, unique
  name: string;
  originalPath: string; // folder name, unique
  logos: LogoInfo[];
}

export async function readPartnersData(): Promise<PartnerCategory[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(jsonData) as PartnerCategory[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File does not exist, return empty array (or create it with default structure)
      return [];
    }
    console.error('Error reading partners data:', error);
    throw new Error('Failed to read partners data.');
  }
}

export async function writePartnersData(data: PartnerCategory[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing partners data:', error);
    throw new Error('Failed to write partners data.');
  }
}
