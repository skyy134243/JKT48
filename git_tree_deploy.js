import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const token = process.argv[2] || process.env.GITHUB_TOKEN;

const OWNER = "skyy134243";
const REPO = "JKT48";
const BRANCH = "main";

const headers = {
  "Authorization": `token ${token}`,
  "User-Agent": "GitTreeDeployer",
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

async function api(endpoint, method = "GET", body = null) {
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${endpoint}`, opts);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${method} ${endpoint} failed: ${res.status} ${err}`);
  }
  return res.json();
}

async function main() {
  console.log("1. Getting current main ref...");
  const ref = await api(`/git/ref/heads/${BRANCH}`);
  const parentSha = ref.object.sha;
  console.log("Current commit SHA:", parentSha);

  console.log("2. Uploading file blobs in parallel...");
  const allFiles = getAllFiles(__dirname);
  console.log(`Found ${allFiles.length} files.`);

  // Upload blobs with concurrency
  const treeItems = [];
  const batchSize = 10;
  for (let i = 0; i < allFiles.length; i += batchSize) {
    const batch = allFiles.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(async (filePath) => {
      const relPath = path.relative(__dirname, filePath).replace(/\\/g, "/");
      const content = fs.readFileSync(filePath).toString("base64");
      const blob = await api("/git/blobs", "POST", { content, encoding: "base64" });
      return {
        path: relPath,
        mode: "100644",
        type: "blob",
        sha: blob.sha
      };
    }));
    treeItems.push(...results);
    process.stdout.write(`Uploaded ${treeItems.length}/${allFiles.length} blobs\r`);
  }

  console.log("\n3. Creating Git Tree...");
  const tree = await api("/git/trees", "POST", {
    tree: treeItems
  });
  console.log("Tree SHA:", tree.sha);

  console.log("4. Creating Git Commit...");
  const commit = await api("/git/commits", "POST", {
    message: "fix: accurate recent live history (Mikaela & Indah) and fix 404 IDN Live URL format",
    tree: tree.sha,
    parents: [parentSha]
  });
  console.log("Commit SHA:", commit.sha);

  console.log("5. Updating main branch ref...");
  await api(`/git/refs/heads/${BRANCH}`, "PATCH", {
    sha: commit.sha,
    force: true
  });

  console.log("\n SUCCESS! All files and dist/ bundled into commit " + commit.sha);
}

main().catch(console.error);