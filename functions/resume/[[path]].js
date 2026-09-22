const COOKIE = "resume_auth";
const MAX_AGE = 60 * 60 * 24 * 7;
const VAULT_PATH = "/.well-known/resume.vault";

let vaultCache = { fingerprint: "", files: null };

export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);

  if (!env.RESUME_PASSWORD || !env.RESUME_KEY) {
    return new Response("Resume is not configured.", {
      status: 503,
      headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }),
    });
  }

  if (url.searchParams.has("logout")) {
    return new Response(null, {
      status: 303,
      headers: securityHeaders({
        Location: "/resume/",
        "Set-Cookie": `${COOKIE}=; Path=/resume; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag(url)}`,
      }),
    });
  }

  if (request.method === "POST") {
    const password = await readPassword(request);
    if (password && timingSafeEqual(password, env.RESUME_PASSWORD)) {
      const token = await authToken(env);
      return new Response(null, {
        status: 303,
        headers: securityHeaders({
          Location: "/resume/",
          "Set-Cookie": `${COOKIE}=${token}; Path=/resume; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secureFlag(url)}`,
        }),
      });
    }
    return gateResponse(true);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: securityHeaders() });
  }

  const authorized =
    (await cookieOk(request, env)) || (await basicOk(request, env.RESUME_PASSWORD));
  if (!authorized) return gateResponse(false);

  try {
    const files = await loadFiles(context);
    const key = fileKey(params, url.pathname);
    const file = files[key];
    if (!file) {
      return new Response("Not found", {
        status: 404,
        headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }),
      });
    }
    const body = base64ToBytes(file.data);
    return new Response(request.method === "HEAD" ? null : body, {
      status: 200,
      headers: securityHeaders({
        "Content-Type": file.mime || "application/octet-stream",
        "Content-Length": String(body.byteLength),
      }),
    });
  } catch {
    return new Response("Resume is unavailable.", {
      status: 503,
      headers: securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }),
    });
  }
}

function fileKey(params, pathname) {
  const captured = Array.isArray(params.path) ? params.path.join("/") : params.path || "";
  let rel = (captured || pathname.replace(/^\/resume\/?/, "")).replace(/^\/+/, "");
  if (!rel || rel.endsWith("/")) rel = `${rel}index.html`.replace(/^\/+/, "");
  if (rel.includes("..") || rel.startsWith("/")) return "";
  return rel;
}

async function loadFiles(context) {
  const fingerprint = context.env.RESUME_KEY;
  if (vaultCache.files && vaultCache.fingerprint === fingerprint) return vaultCache.files;

  const vaultUrl = new URL(VAULT_PATH, context.request.url);
  const vaultReq = new Request(vaultUrl.toString(), { method: "GET" });
  const vaultRes = context.env.ASSETS
    ? await context.env.ASSETS.fetch(vaultReq)
    : await fetch(vaultReq);
  if (!vaultRes.ok) throw new Error("vault missing");

  const blob = new Uint8Array(await vaultRes.arrayBuffer());
  if (blob.byteLength < 29) throw new Error("vault too small");

  const key = await crypto.subtle.importKey(
    "raw",
    hexToBytes(context.env.RESUME_KEY),
    "AES-GCM",
    false,
    ["decrypt"],
  );
  const iv = blob.slice(0, 12);
  const data = blob.slice(12);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  const parsed = JSON.parse(new TextDecoder().decode(plain));
  if (!parsed?.files) throw new Error("vault shape");

  vaultCache = { fingerprint, files: parsed.files };
  return parsed.files;
}

async function readPassword(request) {
  const header = request.headers.get("Authorization") || "";
  const basic = parseBasic(header);
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

async function cookieOk(request, env) {
  const raw = request.headers.get("Cookie") || "";
  const match = raw.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  if (!match) return false;
  return timingSafeEqual(match[1], await authToken(env));
}

async function authToken(env) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`v1:${env.RESUME_PASSWORD}:${env.RESUME_KEY}`),
  );
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  const len = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;
  for (let i = 0; i < len; i++) {
    diff |= (left[i] || 0) ^ (right[i] || 0);
  }
  return diff === 0;
}

function hexToBytes(hex) {
  const clean = hex.trim();
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function secureFlag(url) {
  return url.protocol === "https:" ? "; Secure" : "";
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
  const err = failed
    ? `<p class="err">密码不对。Password is incorrect.</p>`
    : "";
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai">
  <title>Resume</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0; min-height: 100dvh; display: grid; place-items: center;
      font: 16px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      background: Canvas; color: CanvasText;
    }
    form {
      width: min(22rem, calc(100vw - 2.5rem));
      display: grid; gap: 0.85rem;
    }
    h1 { font-size: 1.05rem; font-weight: 600; margin: 0; letter-spacing: -0.02em; }
    p { margin: 0; color: color-mix(in srgb, CanvasText 58%, Canvas); font-size: 0.9rem; }
    input, button {
      font: inherit; box-sizing: border-box; width: 100%;
      border-radius: 10px; padding: 0.7rem 0.8rem;
    }
    input {
      border: 1px solid color-mix(in srgb, CanvasText 16%, Canvas);
      background: Canvas; color: CanvasText;
    }
    button {
      border: 0; cursor: pointer; font-weight: 600;
      background: CanvasText; color: Canvas;
    }
    .err { color: #c2410c; }
  </style>
</head>
<body>
  <form method="post" action="/resume/">
    <h1>简历需要密码</h1>
    <p>This resume is locked. Enter the password to continue.</p>
    ${err}
    <input type="password" name="password" autocomplete="current-password" autofocus required>
    <button type="submit">继续 / Continue</button>
  </form>
</body>
</html>`;
}
