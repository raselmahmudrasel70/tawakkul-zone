import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function maskValue(value?: string) {
  if (!value) return null;
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

async function verifySupabaseClient(url: string, key: string, mode: "public" | "admin") {
  try {
    const client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    if (mode === "public") {
      const { data, error } = await client.auth.getSession();
      return {
        ok: !error,
        error: error?.message ?? null,
        session: data?.session ? "present" : "none",
      };
    }

    const { error } = await client.auth.getUser();
    return {
      ok: !error,
      error: error?.message ?? null,
      session: "admin-check",
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Supabase error",
      session: "failed",
    };
  }
}

export async function GET() {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const serviceUrl = process.env.SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const publicCheck = await verifySupabaseClient(publicUrl, publicAnonKey, "public");
  const adminCheck = await verifySupabaseClient(serviceUrl || publicUrl, serviceRoleKey || publicAnonKey, "admin");

  return NextResponse.json({
    ok: publicCheck.ok && adminCheck.ok,
    environment: {
      nodeEnv: process.env.NODE_ENV || "undefined",
      hasNextPublicSupabaseUrl: Boolean(publicUrl),
      hasNextPublicSupabaseAnonKey: Boolean(publicAnonKey),
      hasSupabaseUrl: Boolean(serviceUrl),
      hasSupabaseServiceRoleKey: Boolean(serviceRoleKey),
      hasAdminAuthSecret: Boolean(process.env.ADMIN_AUTH_SECRET),
      hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
      hasAdminSetupSecret: Boolean(process.env.ADMIN_SETUP_SECRET),
      nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
      nextUrl: process.env.NEXT_URL || null,
    },
    values: {
      NEXT_PUBLIC_SUPABASE_URL: maskValue(publicUrl),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: maskValue(publicAnonKey),
      SUPABASE_URL: maskValue(serviceUrl),
      SUPABASE_SERVICE_ROLE_KEY: maskValue(serviceRoleKey),
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "set" : null,
      ADMIN_AUTH_SECRET: process.env.ADMIN_AUTH_SECRET ? "set" : null,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || null,
      NEXT_URL: process.env.NEXT_URL || null,
    },
    supabase: {
      public: publicCheck,
      admin: adminCheck,
    },
  });
}
