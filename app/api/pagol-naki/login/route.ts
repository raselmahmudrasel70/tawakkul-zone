import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createAuthToken } from "@/lib/auth";

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
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
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

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profile not found." },
      { status: 401 }
    );
  }

  if (!["admin", "merchant"].includes(profile.role)) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 403 }
    );
  }

  const token = await createAuthToken(
  data.user.id,
  data.user.email!,
  profile.role
);

  const response = NextResponse.json({
    success: true,
    role: profile.role,
  });

  response.cookies.set(COOKIE_NAME, token, getCookieOptions());

  return response;
}