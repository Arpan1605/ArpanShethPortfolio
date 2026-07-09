import { verifyAccessToken, readCookie, COOKIE_NAME } from "./_lib/ge-auth.js";
import { protectedBody } from "./_lib/ge-healthcare-content.js";
import { lockedBody, renderPage } from "./_lib/ge-healthcare-shell.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const secret = env.GE_COOKIE_SECRET;
  const token = readCookie(request, COOKIE_NAME);
  const authed = Boolean(secret) && (await verifyAccessToken(token, secret));

  const html = authed
    ? renderPage(protectedBody)
    : renderPage(lockedBody(false), { bodyClass: "ge-case-page ge-case-page--locked" });

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=UTF-8",
      // The unlocked version is per-visitor (cookie-gated); never let a CDN or browser cache it
      // for someone else.
      "cache-control": "private, no-store",
    },
  });
}
