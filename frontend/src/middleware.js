// Middleware to handle Vite client requests and other common issues
export default function middleware(request) {
  const { pathname } = new URL(request.url);

  // Handle Vite client requests (404 errors)
  if (pathname.includes('/@vite/client')) {
    return new Response(null, { status: 204 });
  }

  // Continue to next middleware/route handler
  return;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all paths
    '/(.*)',
  ],
};