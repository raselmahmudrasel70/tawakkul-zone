import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, ADMIN_EMAIL } from "./lib/admin-auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("Request Path:", pathname);

  if (pathname.startsWith("/pagol-naki")) {
    if (
      pathname === "/pagol-naki/login" ||
      pathname === "/pagol-naki/logout"
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin-auth")?.value;

    console.log("Admin Token:", token);

    const payload = token ? await verifyAdminToken(token) : null;

    console.log("Token Payload:", payload);
    console.log("Expected Admin:", ADMIN_EMAIL);

    if (!payload || payload.email !== ADMIN_EMAIL) {
      console.log("❌ Unauthorized - Redirecting to login");
      return NextResponse.redirect(
        new URL("/pagol-naki/login", request.url)
      );
    }

    console.log("✅ Admin authenticated");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pagol-naki/:path*"],
};