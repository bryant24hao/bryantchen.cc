const COOKIE = "talk_360_student";
const MAX_AGE = 60 * 60 * 24 * 30;
const PREFIX = "/talk/360-hackathon-2026-11-03-student";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const password = env.TALK_360_STUDENT_PASSWORD;

  if (!password) {
    return new Response("This page is not configured.", {
      status: 503,
      headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }),
    });
  }

  if (url.searchParams.has("logout")) {
    return new Response(null, {
      status: 303,
      headers: securityHeaders({
        Location: `${PREFIX}/`,
        "Set-Cookie": clearCookie(url),
      }),
    });
  }

  if (request.method === "POST") {
    const submitted = await readPassword(request);
    if (submitted && timingSafeEqual(submitted, password)) {
      const token = await authToken(password);
      return new Response(null, {
        status: 303,
        headers: securityHeaders({
          Location: `${PREFIX}/`,
          "Set-Cookie": `${COOKIE}=${token}; Path=${PREFIX}; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secureFlag(url)}`,
        }),
      });
    }
    return gateResponse(true);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: securityHeaders() });
  }

  const authorized =
    (await cookieOk(request, password)) || (await basicOk(request, password));
  if (!authorized) return gateResponse(false);

  const asset = await context.env.ASSETS.fetch(request);
  const headers = new Headers(asset.headers);
  headers.set("Cache-Control", "private, max-age=3600");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.delete("X-Frame-Options");
  return new Response(asset.body, { status: asset.status, statusText: asset.statusText, headers });
}

async function readPassword(request) {
  const basic = parseBasic(request.headers.get("Authorization") || "");
  if (basic) return basic;
  const type = request.headers.get("Content-Type") || "";
  if (type.includes("form")) {
    const form = await request.formData();
    return String(form.get("password") || "");
  }
  return "";
}

function parseBasic(header) {
  if (!header.toLowerCase().startsWith("basic ")) return "";
  try {
    const decoded = atob(header.slice(6).trim());
    const colon = decoded.indexOf(":");
    return colon >= 0 ? decoded.slice(colon + 1) : decoded;
  } catch {
    return "";
  }
}

async function basicOk(request, password) {
  const submitted = parseBasic(request.headers.get("Authorization") || "");
  return Boolean(submitted) && timingSafeEqual(submitted, password);
}

async function cookieOk(request, password) {
  const raw = request.headers.get("Cookie") || "";
  const match = raw.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  if (!match) return false;
  return timingSafeEqual(match[1], await authToken(password));
}

async function authToken(password) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`talk-360-student-v1:${password}`),
  );
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  const len = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;
  for (let i = 0; i < len; i++) diff |= (left[i] || 0) ^ (right[i] || 0);
  return diff === 0;
}

function secureFlag(url) {
  return url.protocol === "https:" ? "; Secure" : "";
}

function clearCookie(url) {
  return `${COOKIE}=; Path=${PREFIX}; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag(url)}`;
}

function securityHeaders(extra = {}) {
  return {
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...extra,
  };
}

function gateResponse(failed) {
  return new Response(gateHtml(failed), {
    status: 401,
    headers: securityHeaders({ "Content-Type": "text/html; charset=utf-8" }),
  });
}

function gateHtml(failed) {
  const err = failed ? `<p class="err">密码不对。</p>` : "";
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
  <title>做不止于黑客松的产品</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0; min-height: 100dvh; display: grid; place-items: center;
      font: 16px/1.5 -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif;
      background: #f6f8fa; color: #1f2328;
    }
    form { width: min(22rem, calc(100vw - 2.5rem)); display: grid; gap: 0.85rem; }
    h1 { font-size: 1.25rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
    p { margin: 0; color: #656d76; font-size: 0.92rem; }
    input, button { font: inherit; box-sizing: border-box; width: 100%; border-radius: 10px; padding: 0.7rem 0.85rem; }
    input { border: 1px solid #d0d7de; background: #fff; color: #1f2328; }
    button { border: 0; cursor: pointer; font-weight: 700; background: #00a848; color: #fff; }
    .err { color: #cf222e; }
  </style>
</head>
<body>
  <form method="post" action="${PREFIX}/">
    <h1>做不止于黑客松的产品</h1>
    <p>学生版。输入密码后继续。</p>
    ${err}
    <input type="password" name="password" autocomplete="current-password" autofocus required>
    <button type="submit">进入</button>
  </form>
</body>
</html>`;
}
