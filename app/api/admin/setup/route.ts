import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-setup-secret");
  if (!SETUP_SECRET || secret !== SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const email = String(body.email || "").trim();
  const password = String(body.password || "").trim();
  const fullName = String(body.full_name || "Admin").trim();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (ADMIN_EMAIL && email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Admin email mismatch." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "admin",
      full_name: fullName,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data.user });
}
