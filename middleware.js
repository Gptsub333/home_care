// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  const url = req.nextUrl.clone();

  // Define auth pages
  const isAuthPage = 
    url.pathname.startsWith("/login") || 
    url.pathname.startsWith("/register") || 
    url.pathname.startsWith("/doctor/login") || 
    url.pathname.startsWith("/doctor/register");

  // Optional: Debug logging (remove in production)
  // console.log('Middleware check:', {
  //   path: url.pathname,
  //   hasToken: !!token,
  //   isAuthPage
  // });

  // If no token and trying to access protected page → redirect to login
  if (!token && !isAuthPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If has token and trying to access auth page → redirect to home
  if (token && isAuthPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};