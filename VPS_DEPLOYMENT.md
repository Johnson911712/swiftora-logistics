# VPS Deployment Guide for swiftoralogistics.online

This guide walks you through deploying Swiftora Logistics to a VPS (DigitalOcean, AWS EC2, Linode, etc.).

## Prerequisites

- VPS with Ubuntu 22.04 or 24.04
- Domain: swiftoralogistics.online (pointed to your VPS IP)
- SSH access to your VPS
- At least 1GB RAM, 1 CPU (2GB RAM recommended)

## Quick Deploy (Automated)

1. **Upload deploy.sh to your VPS:**
   ```bash
   scp deploy.sh root@your-vps-ip:/root/
   ```

2. **SSH into your VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

3. **Run the deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Edit the .env file:**
   ```bash
   nano /var/www/swiftora-logistics/backend/.env
   ```
   Set a strong JWT_SECRET.

5. **Restart PM2:**
   ```bash
   cd /var/www/swiftora-logistics
   pm2 restart all
   ```

## Manual Deployment Steps

### 1. Initial Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y curl git nginx certbot python3-certbot-nginx ufw

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2
```

### 2. Configure DNS

At your domain registrar, set DNS records:
- **A Record:** `@` → Your VPS IP
- **A Record:** `www` → Your VPS IP

Wait for DNS to propagate (can take 5-30 minutes).

### 3. Deploy Application

```bash
# Create project directory
mkdir -p /var/www/swiftora-logistics
cd /var/www/swiftora-logistics

# Clone your repository
git clone https://github.com/your-username/swiftora-logistics.git .

# Or upload files manually using SCP/SFTP
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install --production
cp .env.example .env
nano .env  # Set JWT_SECRET to a strong random string

# Frontend
cd ../frontend
npm install
npm run build
```

### 5. Configure Environment

Edit `/var/www/swiftora-logistics/backend/.env`:
```env
PORT=5000
JWT_SECRET=your-very-secure-random-string-here
NODE_ENV=production
```

Generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Start Application with PM2

```bash
cd /var/www/swiftora-logistics
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 7. Configure Nginx

```bash
# Copy nginx config
cp nginx.conf /etc/nginx/sites-available/swiftoralogistics

# Enable site
ln -sf /etc/nginx/sites-available/swiftoralogistics /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Restart nginx
systemctl restart nginx
```

### 8. Setup SSL Certificate

```bash
# Make sure DNS is pointing to your VPS
certbot --nginx -d swiftoralogistics.online -d www.swiftoralogistics.online
```

### 9. Configure Firewall

```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw --force enable
```

### 10. Setup Database Backup

```bash
# Create backup directory
mkdir -p /backups

# Add daily backup to crontab
echo "0 2 * * * cp /var/www/swiftora-logistics/backend/swiftora.db /backups/swiftora-$(date +\%Y\%m\%d).db" | crontab -
```

## VPS Providers

### DigitalOcean (Recommended - $6/month)
1. Create Droplet (Ubuntu 22.04, 1GB RAM, 1 CPU)
2. Note the IP address
3. Point DNS to this IP
4. Follow deployment steps above

### AWS EC2 (Free tier available)
1. Launch EC2 instance (t2.micro, Ubuntu 22.04)
2. Configure Security Group (allow 22, 80, 443)
3. Allocate Elastic IP (optional but recommended)
4. Follow deployment steps above

### Linode (Starting at $5/month)
1. Create Linode (Ubuntu 22.04, 1GB RAM)
2. Note the IP address
3. Point DNS to this IP
4. Follow deployment steps above

## Management Commands

### Check application status
```bash
pm2 status
pm2 logs swiftora-backend
pm2 monit
```

### Restart application
```bash
cd /var/www/swiftora-logistics
pm2 restart all
```

### Update application
```bash
cd /var/www/swiftora-logistics
git pull
cd backend && npm install
cd ../frontend && npm install && npm run build
pm2 restart all
```

### View nginx logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Renew SSL (auto-renewal is configured by certbot)
```bash
certbot renew --dry-run
```

## Troubleshooting

### Application not starting
```bash
pm2 logs swiftora-backend
# Check if port 5000 is available
netstat -tlnp | grep 5000
```

### Nginx 502 Bad Gateway
```bash
# Check if backend is running
pm2 status
# Check nginx error log
tail -f /var/log/nginx/error.log
```

### SSL Certificate issues
```bash
certbot certonly --nginx -d swiftoralogistics.online -d www.swiftoralogistics.online
```

### Database issues
```bash
# Check database file permissions
ls -la /var/www/swiftora-logistics/backend/swiftora.db
# Fix if needed
chown www-data:www-data /var/www/swiftora-logistics/backend/swiftora.db
```

## Security Best Practices

1. **Use strong passwords** for SSH and JWT_SECRET
2. **Disable root login** after setup:
   ```bash
   # Create user with sudo access
   adduser deploy
   usermod -aG sudo deploy
   # Configure SSH key authentication
   # Disable password authentication in /etc/ssh/sshd_config
   ```
3. **Keep system updated:**
   ```bash
   apt update && apt upgrade -y
   ```
4. **Monitor logs regularly:**
   ```bash
   tail -f /var/log/auth.log
   tail -f /var/log/nginx/error.log
   ```
5. **Setup fail2ban** (optional):
   ```bash
   apt install fail2ban
   ```

## Performance Optimization

For higher traffic, consider:
- Use Redis for caching
- Add CDN for static assets
- Enable nginx caching
- Use load balancer with multiple instances
- Migrate from SQLite to PostgreSQL

## Estimated Costs

- **DigitalOcean:** $6/month (1GB RAM)
- **AWS EC2:** Free tier (t2.micro, 750 hours/month)
- **Linode:** $5/month (1GB RAM)
- **Domain:** ~$10-15/year
- **SSL:** Free (Let's Encrypt)

Total: **$5-6/month + domain cost**

## Support

For issues, check:
- PM2 logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- Application logs: `/var/log/swiftora-backend-*.log`
