import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

const homePage = read("app/[lang]/page.tsx");
const postsPage = read("app/[lang]/posts/page.tsx");
const postCard = read("components/post-card.tsx");
const nextConfig = read("next.config.ts");

test("static export serves Next images without an optimizer endpoint", () => {
  assert.match(nextConfig, /images:\s*\{\s*unoptimized:\s*true\s*\}/);
});

test("homepage presents the wide brand cover", () => {
  assert.match(homePage, /from ["']next\/image["']/);
  assert.match(homePage, /src=["']\/images\/brand\/blog-cover-hero-v1\.png["']/);
  assert.match(homePage, /priority/);
});

test("PostCard offers the list cover as an optional presentation", () => {
  assert.match(postCard, /showCover\?: boolean/);
  assert.match(postCard, /src=["']\/images\/brand\/blog-cover-thumb-v1\.png["']/);
  assert.match(postCard, /showCover\s*&&/);
});

test("post lists stay text-only until thumbnails are explicitly enabled", () => {
  assert.doesNotMatch(postsPage, /<PostCard[\s\S]*?showCover[\s\S]*?\/>/);
  assert.doesNotMatch(homePage, /<PostCard[\s\S]*?showCover[\s\S]*?\/>/);
});
