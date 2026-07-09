const COOKIE_NAME = "ge_access";
const TOKEN_MESSAGE = "ge-healthcare-access-v1";

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  const maxLen = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < maxLen; i++) {
    const x = i < a.length ? a.charCodeAt(i) : 0;
    const y = i < b.length ? b.charCodeAt(i) : 0;
    diff |= x ^ y;
  }
  return diff === 0;
}

export async function signAccessToken(secret) {
  return hmacHex(secret, TOKEN_MESSAGE);
}

export async function verifyAccessToken(token, secret) {
  if (!token || !secret) {
    return false;
  }
  const expected = await hmacHex(secret, TOKEN_MESSAGE);
  return constantTimeEqual(token, expected);
}

export function readCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    const key = eq === -1 ? trimmed : trimmed.slice(0, eq);
    if (key === name) {
      return eq === -1 ? "" : decodeURIComponent(trimmed.slice(eq + 1));
    }
  }
  return null;
}

export async function passwordMatches(submitted, expected) {
  if (!expected) {
    return false;
  }
  // Hash both sides before comparing so branch timing doesn't depend on raw string content.
  const [a, b] = await Promise.all([hmacHex("compare", submitted || ""), hmacHex("compare", expected)]);
  return constantTimeEqual(a, b);
}

export { COOKIE_NAME };
