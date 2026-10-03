#!/usr/bin/env bash
# Renders the link-preview card and the home-screen icon with Microsoft Edge on Windows (WSL).
# Run from the repo root: bash scripts/og/render.sh
set -euo pipefail
EDGE="/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
WIN_TMP_WSL="/mnt/c/Users/$(cmd.exe /c 'echo %USERNAME%' 2>/dev/null | tr -d '\r')/AppData/Local/Temp/og-render"
mkdir -p "$WIN_TMP_WSL"
cp scripts/og/og.html scripts/og/icon.html "$WIN_TMP_WSL/"
WIN_TMP="$(wslpath -w "$WIN_TMP_WSL")"

shot() { # $1 html file, $2 width, $3 height, $4 output png name
  "$EDGE" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --user-data-dir="$WIN_TMP\\profile" --virtual-time-budget=5000 \
    --window-size="$2,$3" --screenshot="$WIN_TMP\\$4" "file:///${WIN_TMP//\\//}/$1" >/dev/null 2>&1 || true
  cp "$WIN_TMP_WSL/$4" "public/$4"
  echo "wrote public/$4"
}

shot og.html 1200 630 og.png
shot icon.html 180 180 apple-touch-icon.png
