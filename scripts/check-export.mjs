import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";

const root = resolve("out");
const basePath = process.env.PAGES_BASE_PATH || "";
const routes = ["", "dashboard", "signup", "login", "profile", "wishlist", "questionnaire", "results", "profile/alex", "profile/olivia", "profile/james", "profile/sophie"];
for (const route of routes) {
  assert.ok((await stat(join(root, route, "index.html"))).isFile(), `Missing exported route: /${route}`);
}
assert.ok((await stat(join(root, "404.html"))).isFile());
assert.ok((await stat(join(root, "icon.svg"))).isFile());

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert.ok(!entry.isSymbolicLink(), `Unexpected symlink: ${entry.name}`);
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path));
    else files.push(path);
  }
  return files;
}

const files = await listFiles(root);
assert.ok(files.some((file) => file.endsWith(".css")), "Missing CSS assets");
assert.ok(files.some((file) => file.endsWith(".js")), "Missing JavaScript assets");
let references = 0;
for (const file of files) {
  const name = relative(root, file).replaceAll("\\", "/");
  const parts = relative(root, file).split(sep);
  const segment = parts.findIndex((part) => part.startsWith("__next."));
  if (segment !== -1 && segment < parts.length - 1) {
    const flat = join(root, ...parts.slice(0, segment), parts.slice(segment).join("."));
    assert.deepEqual(await readFile(flat), await readFile(file), `Missing or mismatched static segment: ${name}`);
  }
  assert.ok(!/(^|\/)(node_modules|src|tests|\.git|\.next|\.env[^/]*)(\/|$)|\.map$/.test(name), `Development artifact in export: ${name}`);
  if (!/\.(html|txt|json|js|css|svg)$/.test(file)) continue;
  const text = await readFile(file, "utf8");
  assert.ok(!/gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|[A-Za-z]:\\Users\\|\/Users\/|\/home\//.test(text), `Potential credential or machine path in ${name}`);
  assert.ok(!/Taylor Test|Taylor Updated|taylor@example\.com|test-password-482!|GiftNest-test-482!/.test(text), `Private test fixture in ${name}`);
  if (!file.endsWith(".html")) continue;
  for (const match of text.matchAll(/(?:src|href)="([^\"]+)"/g)) {
    const reference = match[1].replaceAll("&amp;", "&");
    if (!reference.startsWith("/") || reference.startsWith("//")) continue;
    const pathname = new URL(reference, "https://static.example").pathname;
    assert.ok(!basePath || pathname === basePath || pathname.startsWith(`${basePath}/`), `Root-relative reference outside ${basePath}: ${reference}`);
    assert.ok(!pathname.includes("/_next/image"), "Server image optimizer required");
    let target = resolve(root, `.${decodeURIComponent(pathname.slice(basePath.length))}`);
    if ((await stat(target)).isDirectory()) target = join(target, "index.html");
    assert.ok((await stat(target)).isFile(), `Missing referenced file: ${reference}`);
    references++;
  }
}
console.log(`Static export verified: ${routes.length} routes, ${files.length} files, ${references} local references. Base path: ${basePath || "/"}. No development data detected.`);