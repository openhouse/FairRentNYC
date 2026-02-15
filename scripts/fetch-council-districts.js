const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { execFileSync } = require('child_process');

const repo = 'NewYorkCityCouncil/districts';
const ref = '24f4e1ae1541042de6bae27f4bcaef11e45707d4';
const tarballUrl = `https://codeload.github.com/${repo}/tar.gz/${ref}`;
const targetDir = path.resolve(__dirname, '..', 'node_modules', 'council-districts');
const packageJsonPath = path.join(targetDir, 'package.json');
const packageJsonStub = {
  name: 'council-districts',
  version: `0.0.0-${ref.slice(0, 7)}`,
  private: true,
  description: 'Vendored NYC Council district data (pinned GitHub archive)',
  repository: `https://github.com/${repo}`,
  councilDistrictsRef: ref,
};

function ensurePackageJson() {
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJsonStub, null, 2)}\n`);
}

function hasExpectedRef() {
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return pkg.councilDistrictsRef === ref;
  } catch (_error) {
    return false;
  }
}

function downloadTarball(destinationPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destinationPath);

    https
      .get(tarballUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${tarballUrl}: HTTP ${response.statusCode}`));
          response.resume();
          return;
        }

        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (error) => {
        fs.rmSync(destinationPath, { force: true });
        reject(error);
      });
  });
}

async function installCouncilDistricts() {
  if (hasExpectedRef()) {
    console.log(`council-districts already present at ${targetDir} (ref ${ref.slice(0, 7)})`);
    return;
  }

  const tmpTarball = path.join(os.tmpdir(), `council-districts-${ref}.tar.gz`);
  const tmpExtractDir = fs.mkdtempSync(path.join(os.tmpdir(), 'council-districts-'));

  console.log(`Downloading council-districts archive at ${ref.slice(0, 7)}...`);
  await downloadTarball(tmpTarball);

  execFileSync('tar', ['-xzf', tmpTarball, '--strip-components=1', '-C', tmpExtractDir], {
    stdio: 'inherit',
  });

  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  fs.renameSync(tmpExtractDir, targetDir);

  fs.rmSync(tmpTarball, { force: true });
  ensurePackageJson();

  console.log(`Installed council-districts to ${targetDir} (ref ${ref.slice(0, 7)}).`);
}

installCouncilDistricts().catch((error) => {
  throw new Error(`Failed to install council-districts from pinned ref ${ref}: ${error.message}`);
});
