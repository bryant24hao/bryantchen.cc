import assert from "node:assert/strict";
import { randomBytes, createCipheriv } from "node:crypto";
import { test } from "node:test";
import { onRequest } from "../functions/resume/[[path]].js";

const password = "test-only-password";
const key = randomBytes(32);
const files = Object.fromEntries(
  ["index.html", "motiff.webp", "斑马.webp", "有道卡搭.webp"].map((name) => [
    name,
    { mime: name.endsWith("webp") ? "image/webp" : "text/html", data: Buffer.from(name).toString("base64") },
  ]),
);
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const vault = Buffer.concat([iv, cipher.update(JSON.stringify({ files })), cipher.final(), cipher.getAuthTag()]);
const env = {
  RESUME_PASSWORD: password,
  RESUME_KEY: key.toString("hex"),
  ASSETS: { fetch: async () => new Response(vault) },
};

function request(path, params = {}, authorized = true) {
  return onRequest({
    request: new Request(`https://example.test/resume/${path}`, {
      headers: authorized ? { Authorization: `Basic ${Buffer.from(`:${password}`).toString("base64")}` } : {},
    }),
    params,
    env,
  });
}

for (const name of ["斑马.webp", "有道卡搭.webp"]) {
  test(`serves encoded asset ${name} through each route representation`, async () => {
    const encoded = encodeURIComponent(name);
    for (const params of [{ path: [encoded] }, { path: encoded }, { path: [name] }, {}]) {
      const response = await request(encoded, params);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("Content-Type"), "image/webp");
      assert.equal(await response.text(), name);
    }
  });
}

test("continues to serve the document and ASCII assets", async () => {
  for (const name of ["", "motiff.webp"]) {
    const response = await request(name);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), name || "index.html");
  }
});

test("rejects malformed escapes and encoded traversal", async () => {
  for (const path of ["%E6%96", "%2e%2e%2f斑马.webp", "%2f斑马.webp"]) {
    assert.equal((await request(path, { path })).status, 404);
  }
});

test("keeps logo requests behind the password gate", async () => {
  const response = await request(encodeURIComponent("斑马.webp"), {}, false);
  assert.notEqual(response.headers.get("Content-Type"), "image/webp");
  assert.match(await response.text(), /This resume is locked/);
});
