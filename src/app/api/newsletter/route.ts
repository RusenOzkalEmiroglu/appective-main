import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the newsletter subscribers JSON file
const dataFilePath = path.join(process.cwd(), 'src/data/newsletterSubscribers.json');

// Ensure the data file exists
const ensureDataFileExists = () => {
  const dirPath = path.dirname(dataFilePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Create file with empty array if it doesn't exist
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

// Ensure the data file exists
ensureDataFileExists();

// Get all subscribers
export async function GET() {
  try {
    ensureDataFileExists();
    
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const subscribers = JSON.parse(data);
    
    return NextResponse.json({ subscribers }, { status: 200 });
  } catch (error) {
    console.error('Error reading newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// Add a new subscriber
export async function POST(request: Request) {
  try {
    ensureDataFileExists();
    
    const { email } = await request.json();
    
    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Read existing subscribers
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const subscribers = JSON.parse(data);
    
    // Check if email already exists
    if (subscribers.some((sub: { email: string }) => sub.email === email)) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }
    
    // Add new subscriber with timestamp
    const newSubscriber = {
      id: Date.now().toString(),
      email,
      subscribedAt: new Date().toISOString(),
    };
    
    subscribers.push(newSubscriber);
    
    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(subscribers, null, 2));
    
    return NextResponse.json({ success: true, subscriber: newSubscriber }, { status: 201 });
  } catch (error) {
    console.error('Error adding newsletter subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
}

// Delete a subscriber
export async function DELETE(request: Request) {
  try {
    ensureDataFileExists();
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }
    
    // Read existing subscribers
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const subscribers = JSON.parse(data);
    
    // Filter out the subscriber to delete
    const updatedSubscribers = subscribers.filter((sub: { id: string }) => sub.id !== id);
    
    // Check if any subscriber was removed
    if (subscribers.length === updatedSubscribers.length) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedSubscribers, null, 2));
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}
