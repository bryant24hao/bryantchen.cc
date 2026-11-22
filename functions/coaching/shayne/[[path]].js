// Password gate for /coaching/shayne.
// The page lives in the public repo only as an AES-GCM vault whose key is
// derived from the password (PBKDF2-SHA256). Nothing about the password is
// stored here: a wrong password simply fails GCM authentication. After a
// successful login the derived key is kept in an HttpOnly cookie scoped to
// this path, so later visits skip the PBKDF2 step.
const PREFIX = "/coaching/shayne";
const VAULT_PATH = "/coaching/shayne/page.vault";
const COOKIE = "coaching_shayne";
const MAX_AGE = 60 * 60 * 24 * 30;
const ROBOTS = "noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname !== PREFIX && url.pathname !== `${PREFIX}/`) {
    return new Response(null, { status: 303, headers: securityHeaders({ Location: PREFIX }) });
  }

  if (url.searchParams.has("logout")) {
    return new Response(null, {
      status: 303,
      headers: securityHeaders({ Location: PREFIX, "Set-Cookie": cookie("", 0, url) }),
    });
  }

  let vault;
  try {
    vault = await loadVault(context);
  } catch {
    return text("This page is unavailable.", 503);
  }

  if (request.method === "POST") {
    const password = await readPassword(request);
    if (password && password.length <= 256) {
      const rawKey = await deriveKey(password, vault);
      if (await tryDecrypt(rawKey, vault)) {
        return new Response(null, {
          status: 303,
          headers: securityHeaders({ Location: PREFIX, "Set-Cookie": cookie(toB64u(rawKey), MAX_AGE, url) }),
        });
      }
    }
    return gate(true);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return text("Method not allowed", 405);
  }

  const token = readCookie(request);
  const rawKey = token ? fromB64u(token) : null;
  const html = rawKey && rawKey.byteLength === 32 ? await tryDecrypt(rawKey, vault) : null;
  if (!html) return gate(false);

  return new Response(request.method === "HEAD" ? null : html, {
    status: 200,
    headers: securityHeaders({ "Content-Type": "text/html; charset=utf-8" }),
  });
}

async function loadVault(context) {
  const req = new Request(new URL(VAULT_PATH, context.request.url).toString(), { method: "GET" });
  const res = await context.env.ASSETS.fetch(req);
  if (!res.ok) throw new Error("vault missing");
  const parsed = JSON.parse(await res.text());
  return {
    iterations: parsed.iterations,
    salt: fromB64u(parsed.salt),
    iv: fromB64u(parsed.iv),
    data: fromB64u(parsed.data),
  };
}

async function deriveKey(password, vault) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: vault.salt, iterations: vault.iterations },
    base,
    256,
  );
  return new Uint8Array(bits);
}

async function tryDecrypt(rawKey, vault) {
  try {
    const key = await crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: vault.iv }, key, vault.data);
    return new TextDecoder().decode(plain);
  } catch {
    return null;
  }
}

async function readPassword(request) {
  const type = request.headers.get("Content-Type") || "";
  if (!type.includes("form")) return "";
  try {
    const form = await request.formData();
    return String(form.get("password") || "");
  } catch {
    return "";
  }
}

function readCookie(request) {
  const raw = request.headers.get("Cookie") || "";
  const match = raw.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([A-Za-z0-9_-]+)`));
  return match ? match[1] : "";
}

function cookie(value, maxAge, url) {
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${value}; Path=${PREFIX}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function toB64u(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64u(s) {
  try {
    const bin = atob(String(s).replace(/-/g, "+").replace(/_/g, "/"));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

function securityHeaders(extra = {}) {
  return {
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": ROBOTS,
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...extra,
  };
}

function text(body, status) {
  return new Response(body, { status, headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }) });
}

function gate(failed) {
  return new Response(gateHtml(failed), {
    status: 401,
    headers: securityHeaders({ "Content-Type": "text/html; charset=utf-8" }),
  });
}

function gateHtml(failed) {
  const msg = failed ? `<p class="err" role="alert">密码不对，再试一次。</p>` : `<p class="hint">请输入密码</p>`;
  return `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
<meta name="referrer" content="no-referrer">
<meta name="color-scheme" content="light only">
<title>陪跑 · Coaching</title>
<style>
:root { color-scheme: only light; }
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; min-height: 100dvh;
  display: flex; align-items: center; justify-content: center;
  background: #F4F2EE; color: #2C2C2A;
  font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "PingFang SC", "Noto Sans SC", "Noto Sans CJK SC", sans-serif;
  font-size: 14px; line-height: 2; letter-spacing: 0.04em;
  padding: 2rem 28px;
}
main { width: min(320px, 100%); }
.mark { font-size: 10px; letter-spacing: 0.32em; color: #8A8A86; margin: 0 0 4.5rem; }
.num { font-weight: 200; font-size: 5.5rem; line-height: 0.8; letter-spacing: -0.06em; color: #D8D6D1; margin: 0 0 2.6rem;
  font-family: "Hiragino Sans", "PingFang SC", "Helvetica Neue", "Noto Sans SC", sans-serif; }
h1 { font-size: 1.15rem; font-weight: 400; letter-spacing: 0.18em; margin: 0 0 0.3rem; }
.hint, .err { font-size: 12px; letter-spacing: 0.12em; margin: 0 0 2.2rem; color: #8A8A86; }
.err { color: #B5402B; }
form { display: grid; gap: 1.6rem; }
input {
  font: inherit; font-size: 16px; letter-spacing: 0.2em; width: 100%;
  border: 0; border-bottom: 1px solid #C9C6C0; border-radius: 0;
  background: transparent; color: #2C2C2A; padding: 0.5rem 0; outline: none;
}
input:focus { border-bottom-color: #2C2C2A; }
button {
  justify-self: start; font: inherit; font-size: 12px; letter-spacing: 0.32em;
  background: none; border: 0; padding: 0.4rem 0; color: #2C2C2A; cursor: pointer;
  border-bottom: 1px solid #2C2C2A;
}
.dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #B5402B; margin-right: 0.7em; vertical-align: 0.2em; }
.foot { margin-top: 5rem; font-size: 10px; letter-spacing: 0.28em; color: #B0AEA9; }
</style>
</head>
<body>
<main>
  <p class="mark">COACHING · 陪跑</p>
  <p class="num" aria-hidden="true">30</p>
  <h1>一起把产品做上线</h1>
  ${msg}
  <form method="post" action="${PREFIX}">
    <input type="password" name="password" aria-label="密码" placeholder="密码" autocomplete="current-password" autofocus required>
    <button type="submit"><span class="dot"></span>进入</button>
  </form>
  <p class="foot">BRYANTCHEN.CC</p>
</main>
</body>
</html>`;
}
