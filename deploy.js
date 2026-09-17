// GitHub REST API Deployer for JKT48 Live Radar
// Pushes all project files to skyy134243/JKT48 repository
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const token = process.argv[2] || process.env.GITHUB_TOKEN;

if (!token) {
  console.error("Usage: node deploy.js <GITHUB_PERSONAL_ACCESS_TOKEN>");
  process.exit(1);
}

const OWNER = "skyy134243";
const REPO = "JKT48";
const BRANCH = "main";

const headers = {
  "Authorization": `token ${token}`,
  "User-Agent": "Node-Deployment-Script",
  "Content-Type": "application/json"
};

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git") {
        getAllFiles(fullPath, fileList);
      }
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function uploadFile(filePath) {
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, "/");
  const content = fs.readFileSync(filePath);
  const base64 = content.toString("base64");

  // Get current SHA if exists
  let sha = null;
  try {
    const getRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${relativePath}?ref=${BRANCH}`, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch {}

  const body = {
    message: `feat: sync ${relativePath} for JKT48 Live Radar`,
    content: base64,
    branch: BRANCH
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${relativePath}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });

  if (putRes.ok) {
    console.log(`✓ [OK] ${relativePath}`);
    return true;
  } else {
    const errText = await putRes.text();
    console.error(`✗ [FAIL] ${relativePath}:`, errText);
    return false;
  }
}

async function main() {
  console.log(`Deploying JKT48 Live Radar to https://github.com/${OWNER}/${REPO}...`);
  const files = getAllFiles(__dirname);
  console.log(`Found ${files.length} files to upload.`);

  let success = 0;
  for (const file of files) {
    const ok = await uploadFile(file);
    if (ok) success++;
  }

  console.log(`\nDeployment finished: ${success}/${files.length} files pushed successfully.`);
}

main().catch(console.error);
