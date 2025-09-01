import { supabase } from './supabase';
import { NextRequest, NextResponse } from 'next/server';

// Type for handlers with dynamic route params (e.g., /api/items/[id])
type HandlerWithContext = (req: NextRequest, context: { params: any }) => Promise<NextResponse> | NextResponse;

// Type for handlers without dynamic route params (e.g., /api/items)
type HandlerWithoutContext = (req: NextRequest) => Promise<NextResponse> | NextResponse;

/**
 * Check if user is authenticated admin using Supabase Auth
 */
async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return false;
    }

    // Check if user has admin role in user metadata
    return user.user_metadata?.role === 'admin' || user.email?.endsWith('@appective.net') || false;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

/**
 * A Higher-Order Component to protect DYNAMIC API routes that have a `context` object.
 * It checks for a valid admin session before executing the handler.
 */
export function withAdminAuth(handler: HandlerWithContext): HandlerWithContext {
  return async (req, context) => {
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return handler(req, context);
  };
}

/**
 * A Higher-Order Component to protect STATIC API routes that do not have a `context` object.
 * It checks for a valid admin session before executing the handler.
 */
export function withAdminAuthSimple(handler: HandlerWithoutContext): HandlerWithoutContext {
  return async (req) => {
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return handler(req);
  };
}
