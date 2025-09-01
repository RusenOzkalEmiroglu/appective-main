import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all subscribers
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw error;
    
    // Format for compatibility with existing frontend
    const formattedSubscribers = (data || []).map(sub => ({
      id: sub.id.toString(),
      email: sub.email,
      subscribedAt: sub.subscribed_at
    }));
    
    return NextResponse.json({ subscribers: formattedSubscribers }, { status: 200 });
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
    const { email } = await request.json();
    
    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta adresi' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kayıtlı' },
        { status: 409 }
      );
    }
    
    // Create new subscriber
    const { data: newSubscriber, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        subscribed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      subscriber: {
        id: newSubscriber.id.toString(),
        email: newSubscriber.email,
        subscribedAt: newSubscriber.subscribed_at
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Newsletter abonelik hatası:', error);
    return NextResponse.json(
      { error: 'Abone eklenemedi' },
      { status: 500 }
    );
  }
}

// Delete a subscriber
export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Abone ID\'leri gerekli' },
        { status: 400 }
      );
    }
    
    // Delete subscribers
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .in('id', ids.map(id => parseInt(id)));
    
    if (error) throw error;
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Newsletter abonesi silme hatası:', error);
    return NextResponse.json(
      { error: 'Abone silinemedi' },
      { status: 500 }
    );
  }
}
