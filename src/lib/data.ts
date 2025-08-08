import fs from 'fs/promises';
import path from 'path';

export interface ContactInfo {
  icon: string;
  title: string;
  details: string;
  link: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'socialLinks.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Could not read social links:', error);
    return []; // Return empty array on error
  }
}

export async function getContactInfo(): Promise<ContactInfo[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'contactInfo.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Could not read contact info:', error);
    return []; // Return empty array on error
  }
}
