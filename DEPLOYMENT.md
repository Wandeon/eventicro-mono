# EventiCRO Production Deployment Guide

This guide covers deploying the complete EventiCRO system to VPS-01 and GPU-01 servers.

## 🏗️ Architecture Overview

### Components
- **UI Application**: SvelteKit frontend (port 3000)
- **API Application**: Express.js backend (port 8787)
- **Database**: PostgreSQL with WAL-G backups
- **Cache**: Redis for session storage
- **Storage**: MinIO for file uploads
- **Maps**: TileServer GL + Nominatim geocoding
- **Monitoring**: Uptime Kuma
- **Automation**: n8n workflows
- **Reverse Proxy**: Caddy

### Server Distribution
- **VPS-01**: Primary application servers + infrastructure
- **GPU-01**: Backup/redundancy + GPU-accelerated services

## 🚀 Pre-Deployment Setup

### 1. Server Preparation

#### VPS-01 Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application user
sudo useradd -m -s /bin/bash eventicro
sudo usermod -aG docker eventicro

# Create application directory
sudo mkdir -p /opt/eventicro-mono
sudo chown eventicro:eventicro /opt/eventicro-mono
```

#### GPU-01 Setup
```bash
# Same as VPS-01, plus:
# Install CUDA drivers if needed for GPU services
sudo apt install nvidia-driver-535 nvidia-cuda-toolkit
```

### 2. Environment Configuration

#### Copy Environment Template
```bash
# On both servers
sudo cp /opt/eventicro-mono/ops/env/env.sample /etc/default/eventicro.env
sudo chown eventicro:eventicro /etc/default/eventicro.env
sudo chmod 600 /etc/default/eventicro.env
```

#### Configure Environment Variables
Edit `/etc/default/eventicro.env` with your production values:

```bash
# Database
POSTGRES_URL=postgresql://postgres:your_secure_password@127.0.0.1:5432/eventicro

# Security
JWT_SECRET=your_super_long_random_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
FRONTEND_URL=https://your-domain.com

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### 3. Database Setup

#### Run Migrations
```bash
# On VPS-01
cd /opt/eventicro-mono/apps/api
npm install
npm run migrate:dev
```

#### Create Admin User
```bash
# Connect to database
psql postgresql://postgres:your_password@127.0.0.1:5432/eventicro

# Create admin user (replace with your details)
INSERT INTO app.users (email, password_hash, first_name, last_name, role, is_active, email_verified)
VALUES (
  'admin@eventicro.com',
  '$2a$12$your_hashed_password_here',
  'Admin',
  'User',
  'admin',
  true,
  true
);
```

## 🐳 Docker Deployment

### 1. Start Core Infrastructure

#### VPS-01
```bash
cd /opt/eventicro-mono/infra/core
docker-compose up -d

# Verify all services are running
docker-compose ps
```

#### GPU-01
```bash
cd /opt/eventicro-mono/infra/core
docker-compose up -d postgres redis minio
```

### 2. Start Automation Services

#### VPS-01 Only
```bash
cd /opt/eventicro-mono/infra/automations
docker-compose up -d
```

### 3. Deploy Applications

#### Build and Deploy UI
```bash
# On VPS-01
cd /opt/eventicro-mono/apps/ui
npm install
npm run build

# Start UI service
sudo systemctl enable eventicro-ui.service
sudo systemctl start eventicro-ui.service
```

#### Build and Deploy API
```bash
# On VPS-01
cd /opt/eventicro-mono/apps/api
npm install
npm run build

# Start API service
sudo systemctl enable eventicro-api.service
sudo systemctl start eventicro-api.service
```

## 🔧 Systemd Services

### UI Service Configuration
```bash
# Copy service file
sudo cp /opt/eventicro-mono/ops/systemd/eventicro-ui.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable eventicro-ui.service
```

### API Service Configuration
```bash
# Copy service file
sudo cp /opt/eventicro-mono/ops/systemd/eventicro-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable eventicro-api.service
```

## 🌐 Reverse Proxy Setup

### Caddy Configuration
```bash
# Copy Caddyfile
sudo cp /opt/eventicro-mono/ops/caddy/Caddyfile /etc/caddy/

# Start Caddy
sudo systemctl enable caddy
sudo systemctl start caddy
```

### SSL Certificates
Caddy will automatically obtain and renew SSL certificates for your domain.

## 📊 Monitoring Setup

### Uptime Kuma
- Access: `http://your-server:3002`
- Initial setup: Create admin account
- Add monitors for:
  - UI: `https://your-domain.com`
  - API: `https://your-domain.com/api/health`
  - Database: PostgreSQL connection
  - Redis: Redis connection

### Log Monitoring
```bash
# View application logs
sudo journalctl -u eventicro-ui.service -f
sudo journalctl -u eventicro-api.service -f

# View Docker logs
docker-compose logs -f
```

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

1. **Add Repository Secrets**:
   - `VPS_01_HOST`: Your VPS-01 IP/hostname
   - `VPS_01_USER`: SSH username (eventicro)
   - `VPS_01_SSH_KEY`: SSH private key
   - `GPU_01_HOST`: Your GPU-01 IP/hostname
   - `GPU_01_USER`: SSH username (eventicro)
   - `GPU_01_SSH_KEY`: SSH private key

2. **Enable GitHub Actions**:
   - Push to main branch triggers automatic deployment
   - Pull requests trigger testing only

### Manual Deployment
```bash
# Pull latest changes
cd /opt/eventicro-mono
git pull origin main

# Restart services
sudo systemctl restart eventicro-ui.service
sudo systemctl restart eventicro-api.service

# Update Docker images
docker-compose -f infra/core/compose.yml pull
docker-compose -f infra/core/compose.yml up -d
```

## 🔒 Security Hardening

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Database Security
```bash
# Configure PostgreSQL for production
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "CREATE DATABASE eventicro;"
```

### Application Security
- All services bind to `127.0.0.1` only
- External access through Caddy reverse proxy
- Rate limiting enabled on API
- JWT tokens with secure secrets
- HTTPS enforced

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add performance indexes
CREATE INDEX CONCURRENTLY idx_events_search ON app.events USING gin(search_vector);
CREATE INDEX CONCURRENTLY idx_events_start_time ON app.events(start_time);
CREATE INDEX CONCURRENTLY idx_events_city ON app.events(city);
```

### Application Optimization
- Enable compression in Caddy
- Use Redis for session storage
- Implement caching headers
- Optimize images with Sharp

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql postgresql://postgres:password@127.0.0.1:5432/eventicro
```

#### Application Won't Start
```bash
# Check logs
sudo journalctl -u eventicro-api.service -n 50

# Check environment
sudo cat /etc/default/eventicro.env
```

#### Docker Services Down
```bash
# Check Docker status
docker ps -a
docker-compose logs

# Restart services
docker-compose restart
```

### Health Checks
```bash
# API health
curl http://127.0.0.1:8787/health

# UI health
curl http://127.0.0.1:3000

# Database health
docker exec core-postgres-1 pg_isready -U postgres
```

## 📋 Maintenance

### Regular Tasks
- Monitor disk space: `df -h`
- Check logs for errors
- Update system packages monthly
- Backup database daily
- Monitor SSL certificate expiration

### Backup Strategy
```bash
# Database backup (automated via WAL-G)
# Check backup status
docker exec core-postgres-1 wal-g backup-list

# Manual backup
docker exec core-postgres-1 wal-g backup-push /var/lib/postgresql/data
```

### Updates
```bash
# Update application
cd /opt/eventicro-mono
git pull origin main
npm install
npm run build
sudo systemctl restart eventicro-ui.service eventicro-api.service

# Update infrastructure
docker-compose -f infra/core/compose.yml pull
docker-compose -f infra/core/compose.yml up -d
```

## 🎯 Production Checklist

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Admin user created
- [ ] SSL certificates obtained
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] CI/CD pipeline working
- [ ] Health checks passing
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Documentation updated

## 📞 Support

For deployment issues:
1. Check logs first
2. Verify environment configuration
3. Test individual components
4. Review this documentation
5. Contact system administrator

---

**Last Updated**: January 2025
**Version**: 1.0.0
