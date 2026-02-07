const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoUrl = "https://github.com/NewYorkCityCouncil/districts.git";
const targetDir = path.resolve(__dirname, "..", "node_modules", "council-districts");
const packageJsonPath = path.join(targetDir, "package.json");
const packageJsonStub = {
  name: "council-districts",
  version: "0.0.0",
  private: true,
  description: "Vendored NYC Council district data (cloned from NewYorkCityCouncil/districts)"
};

const ensurePackageJson = () => {
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(
      packageJsonPath,
      `${JSON.stringify(packageJsonStub, null, 2)}\n`
    );
    console.log(`Wrote stub package.json to ${packageJsonPath}`);
  }
};

if (fs.existsSync(targetDir)) {
  console.log(`council-districts already present at ${targetDir}`);
  ensurePackageJson();
  process.exit(0);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
console.log(`Cloning council-districts from ${repoUrl}...`);
execSync(`git clone --depth=1 ${repoUrl} ${targetDir}`, {
  stdio: "inherit"
});
ensurePackageJson();
