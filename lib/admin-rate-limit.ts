import { supabaseAdmin } from "@/lib/supabase-admin";

const MAX_ATTEMPTS = 3;
const BLOCK_MINUTES = 15;

export async function getLoginAttempt(ip: string) {
  const { data } = await supabaseAdmin
    .from("admin_login_attempts")
    .select("*")
    .eq("ip", ip)
    .maybeSingle();

  return data;
}

export async function isIPBlocked(ip: string) {
  const record = await getLoginAttempt(ip);

  if (!record) {
    return {
      blocked: false,
      permanent: false,
    };
  }

  if (record.permanent_block) {
    return {
      blocked: true,
      permanent: true,
    };
  }

  if (
    record.blocked_until &&
    new Date(record.blocked_until) > new Date()
  ) {
    return {
      blocked: true,
      permanent: false,
    };
  }

  return {
    blocked: false,
    permanent: false,
  };
}

export async function recordFailedLogin(ip: string, email: string) {
  const record = await getLoginAttempt(ip);

  const attempts = (record?.failed_attempts ?? 0) + 1;

  if (attempts >= MAX_ATTEMPTS) {
    const blockedUntil = new Date(
      Date.now() + BLOCK_MINUTES * 60 * 1000
    ).toISOString();

    const { data, error } = await supabaseAdmin
      .from("admin_login_attempts")
      .upsert(
        {
          ip,
          email,
          failed_attempts: attempts,
          blocked_until: blockedUntil,
        },
        {
          onConflict: "ip",
        }
      )
      .select();

    

    return {
      attempts,
      blocked: true,
      blockedUntil,
    };
  }

  const { data, error } = await supabaseAdmin
    .from("admin_login_attempts")
    .upsert(
      {
        ip,
        email,
        failed_attempts: attempts,
        blocked_until: null,
      },
      {
        onConflict: "ip",
      }
    )
    .select();

  return {
    attempts,
    blocked: false,
  };
}

export async function resetLoginAttempts(ip: string) {
  await supabaseAdmin
    .from("admin_login_attempts")
    .upsert(
      {
        ip,
        failed_attempts: 0,
        blocked_until: null,
      },
      {
        onConflict: "ip",
      }
    );
}