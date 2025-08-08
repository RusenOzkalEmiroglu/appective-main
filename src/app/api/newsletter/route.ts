import { NextResponse } from 'next/server';

// Newsletter subscription handler for Vercel deployment
// Since Vercel has read-only filesystem, we'll use a simple validation approach

// Get all subscribers - returns empty array for Vercel compatibility
export async function GET() {
  try {
    // Return empty array since we can't persist data in Vercel
    return NextResponse.json({ subscribers: [] }, { status: 200 });
  } catch (error) {
    console.error('Error reading newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// Add a new subscriber - validates email and returns success
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Create subscriber object
    const newSubscriber = {
      id: Date.now().toString(),
      email,
      subscribedAt: new Date().toISOString(),
    };
    
    // Log the subscription (for debugging)
    console.log('Newsletter subscription:', newSubscriber);
    
    // Return success - in a real app, you'd save to a database here
    return NextResponse.json({ 
      success: true, 
      subscriber: newSubscriber,
      message: 'Successfully subscribed to newsletter!' 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error adding newsletter subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
}

// Delete a subscriber - placeholder for Vercel compatibility
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }
    
    // Log the deletion attempt
    console.log('Newsletter unsubscription attempt:', id);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}
