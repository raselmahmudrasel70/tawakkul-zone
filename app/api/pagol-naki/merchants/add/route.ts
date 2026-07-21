import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const COOKIE_NAME = "admin-auth";

async function verifyRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const user = await verifyAuthToken(token);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export async function POST(request: NextRequest) {
  const admin = await verifyRequest(request);

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const {
      full_name,
      email,
      password,
      phone,
      address,
    } = await request.json();

    if (
      !full_name ||
      !email ||
      !password ||
      !phone ||
      !address
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "merchant",
        },
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    const user = authUser.user;

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create merchant." },
        { status: 500 }
      );
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: user.id,
        full_name,
        email,
        phone,
        address,
        role: "merchant",
      });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(user.id);

      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Merchant created successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}