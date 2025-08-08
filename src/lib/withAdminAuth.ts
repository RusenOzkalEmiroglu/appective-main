import { getSession } from './session';
import { NextRequest, NextResponse } from 'next/server';

// Type for handlers with dynamic route params (e.g., /api/items/[id])
type HandlerWithContext = (req: NextRequest, context: { params: any }) => Promise<NextResponse> | NextResponse;

// Type for handlers without dynamic route params (e.g., /api/items)
type HandlerWithoutContext = (req: NextRequest) => Promise<NextResponse> | NextResponse;

/**
 * A Higher-Order Component to protect DYNAMIC API routes that have a `context` object.
 * It checks for a valid admin session before executing the handler.
 */
export function withAdminAuth(handler: HandlerWithContext): HandlerWithContext {
  return async (req, context) => {
    const session = await getSession();
    if (!session.isAdmin) {
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
    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    return handler(req);
  };
}
