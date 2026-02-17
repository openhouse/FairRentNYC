#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3100}"
SERVER_LOG="/tmp/fairrentnyc-fastboot.log"
RESPONSE_HEADERS="/tmp/fairrentnyc-fastboot-response.headers"
RESPONSE_BODY="/tmp/fairrentnyc-fastboot-response.html"
LAST_HTTP_CODE=""
CURL_SUCCEEDED="false"
SERVER_PID=""

print_debug_artifacts() {
  echo "--- Server log (first 80 lines) ---"
  if [[ -f "$SERVER_LOG" ]]; then
    sed -n '1,80p' "$SERVER_LOG"
  else
    echo "(missing: $SERVER_LOG)"
  fi

  echo "--- Response status + headers ---"
  if [[ -s "$RESPONSE_HEADERS" ]]; then
    sed -n '1,80p' "$RESPONSE_HEADERS"
  else
    echo "(missing or empty: $RESPONSE_HEADERS)"
  fi

  echo "--- Response body (first 80 lines) ---"
  if [[ -s "$RESPONSE_BODY" ]]; then
    sed -n '1,80p' "$RESPONSE_BODY"
  else
    echo "(missing or empty: $RESPONSE_BODY)"
  fi
}

cleanup() {
  if [[ -n "$SERVER_PID" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

fail() {
  local message="$1"
  echo "FastBoot smoke test failed: $message"
  [[ -n "$LAST_HTTP_CODE" ]] && echo "Last observed HTTP code: $LAST_HTTP_CODE"
  print_debug_artifacts
  exit 1
}

echo "[1/5] Cleaning previous build output"
rm -rf dist


echo "[2/5] Building production FastBoot dist"
npm run build

if [[ ! -f dist/package.json ]]; then
  fail "This does not look like a FastBoot build; missing dist/package.json (did you run ember fastboot:build?)"
fi

echo "[3/5] Pruning devDependencies"
npm prune --omit=dev


echo "[4/5] Starting FastBoot server on port $PORT"
PORT="$PORT" npm start >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!


echo "[5/5] Waiting for a successful HTTP response"
for _ in {1..30}; do
  set +e
  LAST_HTTP_CODE=$(curl -sS -D "$RESPONSE_HEADERS" -o "$RESPONSE_BODY" -w '%{http_code}' "http://127.0.0.1:${PORT}/")
  curl_exit=$?
  set -e

  if [[ "$curl_exit" -eq 0 ]]; then
    CURL_SUCCEEDED="true"
    if [[ "$LAST_HTTP_CODE" == "200" ]]; then
      break
    fi
  fi

  if [[ -n "$SERVER_PID" ]] && ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    fail "server exited before returning a 200 response"
  fi

  sleep 1
done

if [[ "$CURL_SUCCEEDED" != "true" ]]; then
  fail "server never responded successfully within timeout"
fi

if [[ "$LAST_HTTP_CODE" != "200" ]]; then
  fail "expected HTTP 200 from /, got $LAST_HTTP_CODE"
fi

if [[ ! -s "$RESPONSE_BODY" ]]; then
  fail "response body missing or empty"
fi

if ! grep -qi 'type="fastboot/shoebox"' "$RESPONSE_BODY"; then
  fail "FastBoot shoebox marker not found in response"
fi

if ! grep -qi 'commercial rent stabilization' "$RESPONSE_BODY"; then
  fail "expected homepage phrase not found in response"
fi

echo "FastBoot smoke test passed on port ${PORT}."
