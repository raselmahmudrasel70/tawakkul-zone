import { NextRequest, NextResponse } from "next/server";

function logoutResponse(request: NextRequest) {
  const redirectOrigin =
    request.nextUrl.origin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_URL ||
    "http://localhost:3000";

  const response = NextResponse.redirect(new URL("/pagol-naki/login", redirectOrigin));
  response.cookies.set("admin-auth", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/pagol-naki",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function GET(request: NextRequest) {
  return logoutResponse(request);
}

export async function POST(request: NextRequest) {
  return logoutResponse(request);
}
