import { signAccessToken, passwordMatches } from "../_lib/ge-auth.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch (err) {
    return json({ ok: false, error: "Bad request" }, 400);
  }

  const expectedPassword = env.GE_PASSWORD;
  const cookieSecret = env.GE_COOKIE_SECRET;

  if (!expectedPassword || !cookieSecret) {
    return json({ ok: false, error: "Server not configured" }, 500);
  }

  const valid = await passwordMatches(password, expectedPassword);
  if (!valid) {
    return json({ ok: false }, 401);
  }

  const token = await signAccessToken(cookieSecret);
  const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days
  const cookie = `ge_access=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;

  return json({ ok: true }, 200, { "set-cookie": cookie });
}

function json(payload, status, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}
