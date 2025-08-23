# EventiCRO Monorepo

A modern event management platform for Croatia, built with SvelteKit and PostgreSQL.

## What's inside

- **apps/ui** — SvelteKit UI application (adapter-node)
- **apps/api** — API application (placeholder for future external API)
- **infra/core** — Core infrastructure: Postgres, Redis, MinIO, Tileserver, Nominatim, Uptime-Kuma
- **infra/automations** — n8n workflow automation & related compose files
- **infra/config** — Configuration management and outputs
- **ops/systemd** — Systemd unit files for services (ui/api/caddy/etc.)
- **ops/caddy** — Caddyfile reverse proxy configuration
- **ops/env/env.sample** — Environment template (copy to .env and configure)
- **ops/audit/<timestamp>/** — Deployment evidence and monitoring data

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ and pnpm
- PostgreSQL (if running locally)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd eventicro-mono
   cd apps/ui
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp ops/env/env.sample ops/env/.env
   # Edit ops/env/.env with your configuration
   ```

3. **Start infrastructure:**
   ```bash
   cd infra/core
   docker-compose up -d
   ```

4. **Start the UI:**
   ```bash
   cd apps/ui
   pnpm dev
   ```

### Production Deployment

1. **Render runtime environment from outputs:**
   ```bash
   /usr/local/bin/outputs2env /srv/config/track-a-outputs.md /etc/default/eventicro.env
   ```

2. **Start/Restart UI service:**
   ```bash
   systemctl restart eventicro-ui.service
   ```

3. **Verify database connection:**
   ```bash
   node -e "const {Pool}=require('pg'); new Pool({connectionString:process.env.POSTGRES_URL}).query('select 1').then(x=>{console.log(x.rows);process.exit(0)}).catch(e=>{console.error(e);process.exit(1)})"
   ```

## Architecture

### API Strategy
The application currently uses **internal API routes** within SvelteKit for simplicity. The UI connects to `/api/events` endpoints that handle database operations directly.

### Database Schema
Events are stored in the `app.events` table with the following structure:
- `id` (UUID, primary key)
- `title` (text, required)
- `city` (text, required)
- `venue_name` (text, required)
- `start_time` (timestamptz, required)
- `price_text` (text, optional)
- `category` (text, optional)

## Environment Variables

Copy `ops/env/env.sample` to `ops/env/.env` and configure:

- **Database**: `POSTGRES_URL` - PostgreSQL connection string
- **Redis**: `REDIS_PASSWORD` - Redis authentication
- **MinIO**: `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` - Object storage
- **n8n**: `N8N_BASIC_AUTH_USER`, `N8N_BASIC_AUTH_PASSWORD` - Workflow automation
- **AWS S3**: For WAL-G database backups

## Security Notes

- Real secrets are **not** stored in Git
- Live environment is saved to: `/root/repo-audit/secrets/eventicro.env`
- All services bind to `127.0.0.1` for security
- Database connections use SSL in production

## Troubleshooting

### Database Connection Issues
- Verify `POSTGRES_URL` is set correctly
- Check if PostgreSQL container is running: `docker ps | grep postgres`
- Test connection: `docker exec -it core-postgres-1 psql -U postgres -d eventicro`

### UI Not Loading
- Check if UI service is running: `systemctl status eventicro-ui.service`
- Verify port 3000 is accessible: `curl http://127.0.0.1:3000`
- Check logs: `journalctl -u eventicro-ui.service -f`

## Contributing

1. Follow the existing code structure
2. Add proper error handling and validation
3. Update documentation for new features
4. Test thoroughly before deployment
