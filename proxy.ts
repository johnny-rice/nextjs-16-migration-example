import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js 16: middleware.ts renamed to proxy.ts
// Export a 'proxy' value instead of 'middleware' function
export const proxy = async (request: NextRequest) => {
  // Example: Add a custom header
  const response = NextResponse.next()
  response.headers.set('x-proxy-version', '16')
  
  // Example: Simple path-based logic
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('x-api-route', 'true')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

