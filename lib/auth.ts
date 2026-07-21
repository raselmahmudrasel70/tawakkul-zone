const AUTH_SECRET =
  process.env.ADMIN_AUTH_SECRET || "tawakkul-zone-admin-secret";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

const TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 24;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function requireAuthSecret() {
  if (!AUTH_SECRET) {
    throw new Error("Missing ADMIN_AUTH_SECRET environment variable.");
  }

  return AUTH_SECRET;
}

function base64UrlEncode(value: string) {
  const bytes = encoder.encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const base64 =
    typeof btoa === "function"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");

  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  const binary =
    typeof atob === "function"
      ? atob(padded)
      : Buffer.from(padded, "base64").toString("binary");

  const bytes = new Uint8Array(
    binary.split("").map((char) => char.charCodeAt(0))
  );

  return decoder.decode(bytes);
}

async function computeHmac(payload: string) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto is required for auth token signing.");
  }

  const authSecret = requireAuthSecret();

  const keyData = encoder.encode(authSecret);
  const payloadData = encoder.encode(payload);

  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signatureBuffer = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    payloadData
  );

  return Array.from(new Uint8Array(signatureBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAuthToken(
  id: string,
  email: string,
  role: string
) {
  const payload = JSON.stringify({
    id,
    email,
    role,
    iat: Date.now(),
  });

  const payloadBase64 = base64UrlEncode(payload);
  const signature = await computeHmac(payloadBase64);

  return `${payloadBase64}.${signature}`;
}

export async function verifyAuthToken(token: string) {
  try {
    const [payloadBase64, signature] = token.split(".");

    if (!payloadBase64 || !signature) {
      return null;
    }

    const expectedSignature = await computeHmac(payloadBase64);

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(payloadBase64));

    if (typeof payload.iat !== "number") {
      return null;
    }

    if (Date.now() - payload.iat > TOKEN_LIFETIME_MS) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}