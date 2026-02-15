#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3100}"

npm run build

PORT="$PORT" npm start > /tmp/fairrentnyc-fastboot.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in {1..30}; do
  if curl -fsS "http://127.0.0.1:${PORT}/" > /tmp/fairrentnyc-fastboot-response.html; then
    break
  fi
  sleep 1
done

if ! grep -qi "commercial rent stabilization" /tmp/fairrentnyc-fastboot-response.html; then
  echo "FastBoot smoke test failed: expected SSR marker not found."
  echo "--- Server log ---"
  cat /tmp/fairrentnyc-fastboot.log
  exit 1
fi

echo "FastBoot smoke test passed on port ${PORT}."
