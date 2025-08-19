# EventiCRO Monorepo

## What’s inside
- apps/ui — SvelteKit UI (adapter-node)
- apps/api — API (placeholder if present)
- infra/core — Docker compose: Postgres, Redis, MinIO, Tileserver, Nominatim, Uptime-Kuma
- infra/automations — n8n & related compose files
- infra/config — captured /srv/config (if present)
- ops/systemd — systemd unit files (ui/api/caddy/etc.)
- ops/caddy — Caddyfile reverse proxy config
- ops/env/.env.sample — redacted environment template
- ops/audit/<timestamp>/ — evidence (compose renders, container/volume summaries)

## Secrets
Real secrets are **not** in Git. We saved your live env to: /root/repo-audit/secrets/eventicro.env.  
Copy and adapt ops/env/.env.sample to your deployment hosts.

## Bootstrap (server)
1) Render runtime env from outputs:
   /usr/local/bin/outputs2env /srv/config/track-a-outputs.md /etc/default/eventicro.env
2) Start/Restart UI:
   systemctl restart eventicro-ui.service
3) Quick DB probe (from UI host):
   node -e "const {Pool}=require('pg'); new Pool({connectionString:process.env.POSTGRES_URL}).query('select 1').then(x=>{console.log(x.rows);process.exit(0)}).catch(e=>{console.error(e);process.exit(1)})"
