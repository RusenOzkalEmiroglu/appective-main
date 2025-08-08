import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GameItem, initialGames as initialGamesData } from '@/data/gamesData';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'gamesData.ts');

// Helper function to read data from the file
const readGamesFromFile = (): GameItem[] => {
  try {
    // Read the raw file content
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    // Extract the JSON-like array part from the file content
    // This is a simplified approach and might need to be more robust
    // depending on the exact structure of your data file.
    const match = fileContent.match(/export const initialGames: GameItem\[\] = ([\s\S]*?);/);
    if (match && match[1]) {
      // The matched group is a string representation of the array.
      // We need to make it valid JSON before parsing.
      // This typically involves ensuring keys and string values are in double quotes.
      // For this specific structure, it might be complex to parse directly as JSON.
      // A more robust solution would be to store data in actual JSON files or a database.
      
      // For now, returning initialGamesData if parsing fails or is too complex
      // This means changes won't persist across server restarts without a proper DB or JSON file handling
      try {
        // Attempt to parse if the structure is simple enough (e.g. using eval, which is not recommended for security reasons)
        // A safer way would be to use a proper JSON parser or a more structured data storage.
        // For simplicity in this example, we will rely on the initial data and not persist changes to the .ts file directly in this manner.
        // To properly persist, you would write back to the file in the correct TypeScript format.
        return initialGamesData; // Fallback to initial data as direct TS file parsing/writing is complex here
      } catch (e) {
        console.error('Error parsing games data from file:', e);
        return initialGamesData; // Fallback
      }
    }
    return initialGamesData; // Fallback if no match
  } catch (error) {
    console.error('Error reading games data file:', error);
    return initialGamesData; // Fallback to initial data if file read fails
  }
};

// Helper function to write data to the file
// IMPORTANT: Directly writing to a .ts file like this is generally not recommended for production
// as it can lead to issues with module caching, build processes, and is error-prone.
// A database or a dedicated JSON file for data is a much better approach.
const writeGamesToFile = (data: GameItem[]) => {
  const tsContent = `export interface GameItem {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
  platforms: string;
  projectUrl?: string;
}

export const initialGames: GameItem[] = ${JSON.stringify(data, null, 2)};
`;
  try {
    fs.writeFileSync(dataFilePath, tsContent, 'utf-8');
  } catch (error) {
    console.error('Error writing games data to file:', error);
    // Handle error appropriately
  }
};

export async function GET() {
  const games = readGamesFromFile();
  return NextResponse.json(games);
}

export async function POST(request: Request) {
  try {
    const newGamesData: GameItem[] = await request.json();
    // Basic validation (you might want to add more thorough validation)
    if (!Array.isArray(newGamesData)) {
      return NextResponse.json({ message: 'Invalid data format. Expected an array.' }, { status: 400 });
    }
    writeGamesToFile(newGamesData);
    return NextResponse.json({ message: 'Games data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing POST request for games:', error);
    return NextResponse.json({ message: 'Error saving games data', error: (error as Error).message }, { status: 500 });
  }
}
