#!/usr/bin/env bash
set -euo pipefail
echo "Starting Zenith-OG dev server..."
cd "$(dirname "$0")/../Zenith-OG"
if [ -d node_modules ]; then
  echo "node_modules found"
else
  echo "Installing dependencies..."
  npm ci
fi

npm run dev
