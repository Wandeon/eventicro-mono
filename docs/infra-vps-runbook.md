# Infra VPS Runbook (short)
- Reverse proxy: Caddy (only public 80/443). Internal services on 127.0.0.1.
- Compose stacks in infra/core and infra/automations.
- Env rendered from /srv/config/track-a-outputs.md to /etc/default/eventicro.env via outputs2env.
- Postgres: docker, 127.0.0.1:5432 via docker-proxy, auth SCRAM/MD5 (pg_hba at container path).
- Backups: WAL-G to MinIO s3://backups/postgres (see track-a-outputs for S3 env).
- Uptime Kuma proxied at status host; BasicAuth in Caddy.
