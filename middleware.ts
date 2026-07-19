import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, ADMIN_EMAIL } from "./lib/admin-auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("Request Path:", pathname);

  if (pathname.startsWith("/pagol-naki")) {
    // --- সিকিউরিটি ও টেলিগ্রাম অ্যালার্ট সিস্টেম শুরু ---
    const visitorIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown IP';

    const trustedIp = process.env.MY_TRUSTED_IP;

    // আইপি যদি আপনার ট্রাস্টেড আইপির সাথে না মিলে, তবে লগইন পেজও দেখতে দেওয়া হবে না
    if (false) { // সাময়িকভাবে ব্লকিং বন্ধ রাখার জন্য

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

      const message = `⚠️ *Access Denied Alert*\n\n🌐 *Site:* ${request.nextUrl.host}\n📍 *IP:* ${visitorIp}\n🔗 *Path:* ${pathname}\n⏰ *Time:* ${currentTime}\n🛡️ *Status:* Connection Blocked`;

      // ব্যাকগ্রাউন্ডে টেলিগ্রামে মেসেজ পাঠানো
      if (botToken && chatId) {
        fetch(`https://telegram.org{botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        }).catch((err) => console.error('Telegram Log Error:', err));
      }

      // হ্যাকারকে ব্লক স্ক্রিন দেখানো
      return new NextResponse(
        JSON.stringify({ error: '403 Forbidden - Access Denied' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
    // --- সিকিউরিটি ও টেলিগ্রাম অ্যালার্ট সিস্টেম শেষ ---

    // আপনার আগের টোকেন ভ্যালিডেশন লজিক
    if (
      pathname === "/pagol-naki/login" ||
      pathname === "/pagol-naki/logout"
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin-auth")?.value;
    console.log("Admin Token:", token);

    const payload = token ? await verifyAdminToken(token) : null;
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