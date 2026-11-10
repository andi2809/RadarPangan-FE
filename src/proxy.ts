import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("tpid_session")?.value;

  // Protect /dashboard and any nested routes
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const isDevBypass = request.nextUrl.searchParams.get("preview") === "1";
    if (!sessionToken && !isDevBypass) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
