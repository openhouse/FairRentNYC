#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3100}"
LOG_FILE="/tmp/fairrentnyc-fastboot.log"
RESPONSE_FILE="/tmp/fairrentnyc-fastboot-response.html"

assert_fastboot_response() {
  local label="$1"

  : > "$LOG_FILE"
  PORT="$PORT" npm start > "$LOG_FILE" 2>&1 &
  local server_pid=$!

  cleanup() {
    kill "$server_pid" >/dev/null 2>&1 || true
  }
  trap cleanup RETURN

  for _ in {1..30}; do
    if curl -fsS "http://127.0.0.1:${PORT}/" > "$RESPONSE_FILE"; then
      break
    fi
    sleep 1
  done

  if ! kill -0 "$server_pid" >/dev/null 2>&1; then
    echo "FastBoot smoke test (${label}) failed: server exited before responding."
    echo "--- Server log ---"
    cat "$LOG_FILE"
    exit 1
  fi

  if grep -qiE "TypeError:.*arrayLikeToArray|FastBoot setup failed|Error while processing route" "$LOG_FILE"; then
    echo "FastBoot smoke test (${label}) failed: runtime errors detected in server log."
    echo "--- Server log ---"
    cat "$LOG_FILE"
    exit 1
  fi

  if ! grep -qi "commercial rent stabilization" "$RESPONSE_FILE"; then
    echo "FastBoot smoke test (${label}) failed: expected SSR marker not found."
    echo "--- Server log ---"
    cat "$LOG_FILE"
    exit 1
  fi

  if grep -qi "<script type=\"x/boundary\" id=\"fastboot-body-start\"></script>[[:space:]]*<script type=\"x/boundary\" id=\"fastboot-body-end\"></script>" "$RESPONSE_FILE"; then
    echo "FastBoot smoke test (${label}) failed: FastBoot body appears empty."
    echo "--- Server log ---"
    cat "$LOG_FILE"
    exit 1
  fi

  echo "FastBoot smoke test (${label}) passed on port ${PORT}."
}

npm run build

assert_fastboot_response "before prune"

npm prune --omit=dev

assert_fastboot_response "after prune"
