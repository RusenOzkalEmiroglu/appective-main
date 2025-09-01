import { supabaseAuth } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, { status: 400 });
    }

    const { data, error } = await supabaseAuth.signIn(email, password);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication failed' 
      }, { status: 401 });
    }

    // Check if user has admin privileges
    const isAdmin = data.user.user_metadata?.role === 'admin' || 
                   data.user.email?.endsWith('@appective.net');

    if (!isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin access required' 
      }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || 'admin'
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
