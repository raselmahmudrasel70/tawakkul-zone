import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // শুধু Admin Route protect করবে
  if (pathname.startsWith("/pagol-naki")) {
    // Login page সবাই দেখতে পারবে
    if (pathname === "/pagol-naki/login") {
      return NextResponse.next();
    }

    const adminAuth = request.cookies.get("admin-auth")?.value;

    if (adminAuth !== "true") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pagol-naki/:path*"],
};