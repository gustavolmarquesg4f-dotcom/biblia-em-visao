import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(process.cwd(), "client");
const extensions = new Set([".ts", ".tsx", ".css"]);
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (extensions.has(entry.name.slice(entry.name.lastIndexOf(".")))) files.push(path);
  }
}
walk(root);
const source = files.map((path) => readFileSync(path, "utf8")).join("\n");
const paths = [...new Set([
  ...[...source.matchAll(/atlasAsset\(\"([^\"]+\.(?:png|jpg|jpeg|webp))\"\)/g)].map((match) => `/atlas-assets/${match[1]}`),
  ...[...source.matchAll(/\"(\/manus-storage\/[^\"']+\.(?:png|jpg|jpeg|webp))\"/g)].map((match) => match[1]),
])].sort();
const missing = [];
for (const asset of paths) {
  const local = join(process.cwd(), "client/public", asset.replace(/^\//, "").trim());
  const exists = (() => { try { return statSync(local).isFile(); } catch { return false; } })();
  console.log(`${exists ? "OK  " : "MISS"} ${asset}${exists ? ` ${statSync(local).size}` : ""}`);
  if (!exists) missing.push(asset);
}
console.log(`TOTAL=${paths.length} MISSING=${missing.length}`);
if (missing.length) process.exitCode = 1;
