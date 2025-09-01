import { supabaseAuth } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { error } = await supabaseAuth.signOut();
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
