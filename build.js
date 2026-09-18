import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const entries = ["index.html", "manifest.json", "firebase-messaging-sw.js", "src"];
for (const entry of entries) {
  const fullSrc = path.join(__dirname, entry);
  const fullDest = path.join(distDir, entry);
  if (fs.existsSync(fullSrc)) {
    fs.cpSync(fullSrc, fullDest, { recursive: true, force: true });
  }
}

console.log("✓ Successfully created dist/ for Vercel!");