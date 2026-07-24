import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createAuthToken } from "@/lib/auth";
import { getIPLocation } from "@/lib/ip-location";

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

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });
  } catch (err) {
    console.error("Telegram Error:", err);
  }
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

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "Unknown";

  const ua = request.headers.get("user-agent") || "Unknown";

  const location = await getIPLocation(ip);

  const country = location?.country ?? "Unknown";
  const city = location?.city ?? "Unknown";
  const isp = location?.isp ?? "Unknown";

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  // ❌ Failed Login
  if (error || !data.user) {
    await sendTelegram(`🚨 FAILED ADMIN LOGIN

📧 Email: ${email}

🌍 IP: ${ip}

🌎 Country: ${country}
🏙 City: ${city}
🏢 ISP: ${isp}

🖥 User Agent:
${ua}`);

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

  const authToken = await createAuthToken(
    data.user.id,
    data.user.email!,
    profile.role
  );

  // ✅ Successful Login
  await sendTelegram(`✅ ADMIN LOGIN SUCCESS

📧 Email: ${email}

👤 Role: ${profile.role}

🌍 IP: ${ip}

🌎 Country: ${country}
🏙 City: ${city}
🏢 ISP: ${isp}

🖥 User Agent:
${ua}`);

  const response = NextResponse.json({
    success: true,
    role: profile.role,
  });

  response.cookies.set(COOKIE_NAME, authToken, getCookieOptions());

  return response;
}