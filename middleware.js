import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  const role = req.cookies.get("role");
  const url = req.nextUrl.clone();

  const isAuthPage =
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/register") ||
    url.pathname.startsWith("/doctor/login") ||
    url.pathname.startsWith("/doctor/register");

  // If no token → send to correct login page
  if (!token && !isAuthPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If logged in and trying to access auth pages
  if (token && isAuthPage) {
    if (role === "provider") {
      url.pathname = "/dashboard/doctor";
    } else {
      url.pathname = "/";
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};
