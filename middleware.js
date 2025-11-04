// middleware.js
import { de } from "date-fns/locale/de";
import { NextResponse } from "next/server";

 function  middleware(req) {
  const token = req.cookies.get("token");
  const url = req.nextUrl.clone();

  const isAuthPage = url.pathname.startsWith("/login") || url.pathname.startsWith("/register") || url.pathname.startsWith("/doctor/login") || url.pathname.startsWith("/doctor/register");

  if (!token && !isAuthPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"], // applies to all pages except static/api files
};

export default middleware;
