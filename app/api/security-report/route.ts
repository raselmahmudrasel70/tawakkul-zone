import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          success: false,
          error: "Telegram credentials missing",
        },
        { status: 500 }
      );
    }

    const message = `🛡️ Client Security Report

━━━━━━━━━━━━━━━━━━

🖥 Platform
${body.platform}

🌐 Language
${body.language}

🌍 Timezone
${body.timezone}

━━━━━━━━━━━━━━━━━━

📏 Screen
${body.screen?.width} × ${body.screen?.height}

🖥 Viewport
${body.viewport?.width} × ${body.viewport?.height}

📐 DPR
${body.pixelRatio}

━━━━━━━━━━━━━━━━━━

🧠 CPU
${body.cpuCores} Cores

💾 RAM
${body.memory} GB

🎮 GPU
${body.gpu}

━━━━━━━━━━━━━━━━━━

📶 Network
${body.connection}

⚡ Downlink
${body.downlink}

⏱ RTT
${body.rtt}

━━━━━━━━━━━━━━━━━━

🍪 Cookies
${body.cookiesEnabled ? "Enabled" : "Disabled"}

🌙 Dark Mode
${body.darkMode ? "Yes" : "No"}

✋ Touch
${body.touch ? "Yes" : "No"}

🌐 Online
${body.online ? "Yes" : "No"}

━━━━━━━━━━━━━━━━━━

🖥 User Agent
${body.userAgent}
`;

    const res = await fetch(
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
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Telegram send failed",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}