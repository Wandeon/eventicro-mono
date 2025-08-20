#!/usr/bin/env bash
set -Eeuo pipefail
: "${NVM_DIR:=/root/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use --lts >/dev/null 2>&1 || true
cd /srv/app/ui
exec pnpm run preview -- --host 127.0.0.1 --port 3000
