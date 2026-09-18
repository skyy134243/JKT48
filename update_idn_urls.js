import fs from "node:fs";

const filePath = "./src/data/members.js";
let content = fs.readFileSync(filePath, "utf8");

// Replace idnSlug: "jkt48-xyz" -> idnSlug: "jkt48_xyz"
content = content.replace(/idnSlug:\s*"jkt48-([^"]+)"/g, 'idnSlug: "jkt48_$1"');

// Replace idnUrl: "https://www.idn.app/@jkt48-xyz" -> idnUrl: "https://www.idn.app/jkt48_xyz"
content = content.replace(/idnUrl:\s*"https:\/\/www\.idn\.app\/@jkt48-([^"]+)"/g, 'idnUrl: "https://www.idn.app/jkt48_$1"');

// Also update comments at the top if any
content = content.replace(/\/\/ IDN Live: https:\/\/www\.idn\.app\/@jkt48-\[nickname\]/g, '// IDN Live: https://www.idn.app/jkt48_[nickname]');

fs.writeFileSync(filePath, content);
console.log("SUCCESS: All member IDN URLs updated to official format without @ and without hyphen!");
