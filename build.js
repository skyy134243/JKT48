import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const entries = ["index.html", "manifest.json", "firebase-messaging-sw.js", "src"];
for (const entry of entries) {
  const fullSrc = path.join(__dirname, entry);
  if (fs.existsSync(fullSrc)) {
    copyRecursiveSync(fullSrc, path.join(distDir, entry));
  }
}

console.log("✓ Successfully created dist/ for Vercel!");