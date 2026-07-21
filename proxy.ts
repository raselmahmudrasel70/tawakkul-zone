import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken, ADMIN_EMAIL } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("Request Path:", pathname);

  if (pathname.startsWith("/pagol-naki")) {
    // শুধুমাত্র লগইন পেজে প্রথমবার ঢোকার সময় অ্যালার্ট যাবে (লুপ ঠেকানোর জন্য)
    if (pathname === "/pagol-naki/login") {
      const visitorIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown IP';
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

      const message = `👀 *Admin Page Accessed*\n\n🌐 *Site:* ${request.nextUrl.host}\n📍 *Visitor IP:* ${visitorIp}\n🔗 *Path:* ${pathname}\n⏰ *Time:* ${currentTime}\n🛡️ *Status:* Login Page Displayed`;

      // ব্যাকগ্রাউন্ডে টেলিগ্রামে মেসেজ পাঠানো
      if (botToken && chatId) {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        }).catch((err) => console.error('Telegram Log Error:', err));
      }
    }

    // আপনার আগের অরজিনাল টোকেন ভ্যালিডেশন লজিক (যা আইডি-পাসওয়ার্ড চেক করে)
    if (
      pathname === "/pagol-naki/login" ||
      pathname === "/pagol-naki/logout"
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin-auth")?.value;
    console.log("Admin Token:", token);

    const payload = token ? await verifyAuthToken(token) : null;
    console.log("Token Payload:", payload);
    console.log("Expected Admin:", ADMIN_EMAIL);

    if (!payload || payload.email !== ADMIN_EMAIL) {
      console.log("❌ Unauthorized - Redirecting to login");
      return NextResponse.redirect(
        new URL("/pagol-naki/login", request.url)
      );
    }

    console.log("✅ Admin authenticated");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pagol-naki/:path*"],
};