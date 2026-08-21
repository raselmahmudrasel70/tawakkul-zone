import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createAuthToken } from "@/lib/auth";
import { getIPLocation } from "@/lib/ip-location";
import {
  isIPBlocked,
  recordFailedLogin,
  resetLoginAttempts,
} from "@/lib/admin-rate-limit";

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
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      }
    );

    if (!res.ok) {
      console.error("Telegram notification failed:", res.status);
    }
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

  if (
    process.env.NODE_ENV === "production" &&
    ip !== "::1" &&
    ip !== "127.0.0.1" &&
    country !== "Bangladesh"
  ) {
    await supabaseAdmin.from("admin_login_attempts").upsert(
      {
        ip,
        email,
        permanent_block: true,
      },
      {
        onConflict: "ip",
      }
    );

    await sendTelegram(`🚨 FOREIGN ADMIN LOGIN BLOCKED

📧 Email: ${email}

🌍 IP: ${ip}

🌎 Country: ${country}
🏙 City: ${city}
🏢 ISP: ${isp}

🖥 User Agent:
${ua}

⛔ This IP has been permanently blocked.`);

    return NextResponse.json(
      {
        error: "Vpn off kor... Shaalaaa.🤣🤣",
      },
      { status: 403 }
    );
  }

  const blockStatus = await isIPBlocked(ip);

  if (blockStatus.blocked) {
    await sendTelegram(`🚫 BLOCKED LOGIN ATTEMPT

📧 Email: ${email}

🌍 IP: ${ip}

🌎 Country: ${country}
🏙 City: ${city}
🏢 ISP: ${isp}

🖥 User Agent:
${ua}

⛔ This IP is temporarily blocked for 15 minutes.`);

    return NextResponse.json(
      {
        error: blockStatus.permanent
          ? "This IP has been permanently blocked."
          : "Too many failed login attempts. Please try again after 15 minutes.",
      },
      {
        status: blockStatus.permanent ? 403 : 429,
      }
    );
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    const result = await recordFailedLogin(ip, email);

    let message = `🚨 FAILED ADMIN LOGIN

📧 Email: ${email}

🌍 IP: ${ip}

🌎 Country: ${country}
🏙 City: ${city}
🏢 ISP: ${isp}

🔢 Failed Attempts: ${result.attempts}/3

🖥 User Agent:
${ua}`;

    if (result.blocked) {
      message += `

🚫 IP BLOCKED

⏳ Block Duration: 15 Minutes`;
    }

    await sendTelegram(message);

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

  await sendTelegram(`✅ ADMIN LOGIN SUCCESS

📧 Email: ${email}

👤 Role: ${profile.role}

🌍 IP: ${ip}

🌎 Country: ${country}
🏙 City: ${city}
🏢 ISP: ${isp}

🖥 User Agent:
${ua}`);

  await resetLoginAttempts(ip);

  const response = NextResponse.json({
    success: true,
    role: profile.role,
  });

  response.cookies.set(COOKIE_NAME, token, getCookieOptions());

  return response;
}