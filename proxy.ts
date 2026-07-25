import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken, ADMIN_EMAIL } from "./lib/auth";
import { getIPLocation } from "./lib/ip-location";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("Request Path:", pathname);

  // ==========================
  // Telegram Alert
  // ==========================
  if (pathname.startsWith("/pagol-naki")) {
    const forwardedFor = request.headers.get("x-forwarded-for");

const realIp = request.headers.get("x-real-ip");

const cfIp = request.headers.get("cf-connecting-ip");

const visitorIp =
  cfIp ||
  forwardedFor?.split(",")[0]?.trim() ||
  realIp ||
  "Unknown IP";

    const location = await getIPLocation(visitorIp);

    const userAgent =
      request.headers.get("user-agent") || "Unknown";

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    });

    const debugHeaders = `
🔍 Debug Headers:

CF-IP: ${request.headers.get("cf-connecting-ip")}

Forwarded:
${request.headers.get("x-forwarded-for")}

Real-IP:
${request.headers.get("x-real-ip")}
`;

  const message = `🚨 Admin URL Access Attempt

🌐 Site: ${request.nextUrl.host}

📍 Route: ${pathname}

🌍 IP: ${visitorIp}

🌎 Country: ${location?.country ?? "Unknown"}
🏙 City: ${location?.city ?? "Unknown"}
📌 Region: ${location?.region ?? "Unknown"}
🏢 ISP: ${location?.isp ?? "Unknown"}

🖥 User Agent:
${userAgent}

⏰ Time:
${currentTime}

${debugHeaders}`;

    if (botToken && chatId) {
      fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        }
      ).catch((err) =>
        console.error("Telegram Error:", err)
      );
    }
  }

  // ==========================
  // Admin Protection
  // ==========================
  if (pathname.startsWith("/pagol-naki")) {
    if (
      pathname === "/pagol-naki/login" ||
      pathname === "/pagol-naki/logout"
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin-auth")?.value;

    const payload = token
      ? await verifyAuthToken(token)
      : null;

    if (!payload || payload.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(
        new URL("/pagol-naki/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pagol-naki/:path*"],
};