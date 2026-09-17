import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const token = process.argv[2] || process.env.GITHUB_TOKEN;

if (!token) {
  console.error("Token required");
  process.exit(1);
}

const OWNER = "skyy134243";
const REPO = "JKT48";
const BRANCH = "main";

const headers = {
  "Authorization": `token ${token}`,
  "User-Agent": "Fast-Deployer",
  "Content-Type": "application/json"
};

function getAllFiles(dir, fileList = []) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== "node_modules" && file !== ".git") getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function uploadFile(filePath) {
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, "/");
  const base64 = fs.readFileSync(filePath).toString("base64");

  let sha = null;
  try {
    const getRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${relativePath}?ref=${BRANCH}`, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch {}

  const body = {
    message: `feat: sync ${relativePath}`,
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
    console.error(`✗ [FAIL] ${relativePath}`);
    return false;
  }
}

async function runInBatches(items, batchSize, fn) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(fn));
  }
}

async function main() {
  console.log(`Deploying to ${OWNER}/${REPO}...`);
  const files = getAllFiles(__dirname);
  console.log(`Found ${files.length} files. Uploading with concurrency 6...`);
  await runInBatches(files, 6, uploadFile);
  console.log(`\nDeployment finished successfully!`);
}

main().catch(console.error);