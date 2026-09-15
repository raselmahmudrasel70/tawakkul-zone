import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const MAX_BODY_SIZE = 10 * 1024;
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;
const MAX_NAME_LENGTH = 100;

export async function POST(request: NextRequest) {
  if (!SETUP_SECRET) {
    return NextResponse.json(
      { error: "Admin setup is not configured." },
      { status: 503 }
    );
  }

  const secret = request.headers.get("x-pagol-naki-setup-secret");

  if (!secret || secret !== SETUP_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const contentLength = request.headers.get("content-length");

  if (
    contentLength &&
    Number(contentLength) > MAX_BODY_SIZE
  ) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const input = body as Record<string, unknown>;

  const email =
    typeof input.email === "string"
      ? input.email.trim().toLowerCase()
      : "";

  const password =
    typeof input.password === "string"
      ? input.password
      : "";

  const fullName =
    typeof input.full_name === "string"
      ? input.full_name.trim()
      : "Admin";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  if (email.length > 254) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 }
    );
  }

  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return NextResponse.json(
      {
        error: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  if (fullName.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: "Full name is too long." },
      { status: 400 }
    );
  }

  if (ADMIN_EMAIL && email !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json(
      { error: "Admin email mismatch." },
      { status: 400 }
    );
  }

  try {
    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "admin",
          full_name: fullName || "Admin",
        },
      });

    if (error) {
      return NextResponse.json(
        { error: "Unable to create admin account." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: data.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin setup error:", error);

    return NextResponse.json(
      { error: "Unable to complete admin setup." },
      { status: 500 }
    );
  }
}