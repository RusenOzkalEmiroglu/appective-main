import { supabaseAuth } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        isAuthenticated: false, 
        isAdmin: false 
      });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAuth.getUser();

    if (error || !user) {
      return NextResponse.json({ 
        isAuthenticated: false, 
        isAdmin: false 
      });
    }

    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.email?.endsWith('@appective.net');

    return NextResponse.json({ 
      isAuthenticated: true,
      isAdmin,
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'admin'
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ 
      isAuthenticated: false, 
      isAdmin: false 
    });
  }
}
