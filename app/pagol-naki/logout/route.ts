import { NextResponse } from "next/server";

function logoutResponse() {
  const response = NextResponse.redirect(new URL("/pagol-naki/login", process.env.NEXT_URL || "http://localhost:3000"));
  response.cookies.set("admin-auth", "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/pagol-naki",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function GET() {
  return logoutResponse();
}

export async function POST() {
  return logoutResponse();
}
