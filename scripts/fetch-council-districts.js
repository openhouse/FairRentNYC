const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoUrl = "https://github.com/NewYorkCityCouncil/districts.git";
const targetDir = path.resolve(__dirname, "..", "node_modules", "council-districts");

if (fs.existsSync(targetDir)) {
  console.log(`council-districts already present at ${targetDir}`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
console.log(`Cloning council-districts from ${repoUrl}...`);
execSync(`git clone --depth=1 ${repoUrl} ${targetDir}`, {
  stdio: "inherit"
});
