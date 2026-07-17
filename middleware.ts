import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, ADMIN_EMAIL } from "./lib/admin-auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/pagol-naki")) {
    if (pathname === "/pagol-naki/login" || pathname === "/pagol-naki/logout") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin-auth")?.value;
    const payload = token ? await verifyAdminToken(token) : null;

    if (!payload || payload.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/pagol-naki/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pagol-naki/:path*"],
};
