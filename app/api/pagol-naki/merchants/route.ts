import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const COOKIE_NAME = "admin-auth";

async function verifyRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const user = await verifyAdminToken(token);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export async function GET(request: NextRequest) {
  const user = await verifyRequest(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("role", "merchant")
    .order("username");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}