import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ADMIN_EMAIL, createAdminToken } from "@/lib/admin-auth";

const COOKIE_NAME = "admin-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24;

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || "").trim();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
console.log("SERVICE ROLE EXISTS:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log(
  "SERVICE ROLE PREFIX:",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20)
);
 const { data, error } = await supabaseAdmin.auth.signInWithPassword({
  email,
  password,
});

console.log("Supabase Login Error:", error);
console.log("Supabase User:", data?.user);

if (error || !data.user) {
  return NextResponse.json(
    {
      error: error?.message ?? "Invalid credentials.",
    },
    { status: 401 }
  );
}

  const token = await createAdminToken(email);
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, getCookieOptions());
  return response;
}
