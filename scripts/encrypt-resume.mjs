import crypto from "crypto";
import fs from "fs";
import path from "path";

const root = process.cwd();
const srcDir = path.join(root, "private", "resume");
const outFile = path.join(root, "public", ".well-known", "resume.vault");

function loadDevVars() {
  const file = path.join(root, ".dev.vars");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

function mimeOf(file) {
  const ext = path.extname(file).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".png": "image/png",
      ".webp": "image/webp",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".woff2": "font/woff2",
      ".json": "application/json",
    }[ext] || "application/octet-stream"
  );
}

function walk(dir, prefix, files) {
  for (const name of fs.readdirSync(dir)) {
    if (name === ".DS_Store") continue;
    const full = path.join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (fs.statSync(full).isDirectory()) walk(full, rel, files);
    else files[rel] = { mime: mimeOf(rel), data: fs.readFileSync(full).toString("base64") };
  }
}

function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, ct, tag]);
}

function decrypt(blob, key) {
  const iv = blob.subarray(0, 12);
  const tag = blob.subarray(blob.length - 16);
  const ct = blob.subarray(12, blob.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]);
}

loadDevVars();

const keyHex = process.env.RESUME_KEY;
if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
  console.error("RESUME_KEY missing or not 32-byte hex. Put it in .dev.vars or the environment.");
  process.exit(1);
}
if (!fs.existsSync(srcDir)) {
  console.error(`Missing ${srcDir}. Put the resume HTML and assets there, then re-run.`);
  process.exit(1);
}

const files = {};
walk(srcDir, "", files);
if (!files["index.html"]) {
  console.error("private/resume/index.html is required.");
  process.exit(1);
}

const key = Buffer.from(keyHex, "hex");
const plaintext = Buffer.from(JSON.stringify({ v: 1, files }), "utf8");
const blob = encrypt(plaintext, key);
const roundtrip = JSON.parse(decrypt(blob, key).toString("utf8"));
if (!roundtrip.files["index.html"]?.data) {
  console.error("Encrypt round-trip failed.");
  process.exit(1);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, blob);
console.log(`Wrote ${path.relative(root, outFile)} (${blob.length} bytes, ${Object.keys(files).length} files)`);
