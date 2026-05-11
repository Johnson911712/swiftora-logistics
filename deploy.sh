#!/bin/bash

# Swiftora Logistics VPS Deployment Script
# Run this on your VPS after SSHing in

set -e

echo "🚀 Swiftora Logistics VPS Deployment Script"
echo "============================================"

# Configuration
DOMAIN="swiftoralogistics.online"
PROJECT_DIR="/var/www/swiftora-logistics"
REPO_URL=""  # Add your GitHub repository URL here

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
apt update
apt install -y curl git nginx certbot python3-certbot-nginx

echo -e "${YELLOW}Step 2: Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo -e "${YELLOW}Step 3: Installing PM2 globally...${NC}"
npm install -g pm2

echo -e "${YELLOW}Step 4: Creating project directory...${NC}"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

echo -e "${YELLOW}Step 5: Cloning repository...${NC}"
if [ -z "$REPO_URL" ]; then
    echo "⚠️  No repository URL provided. Please upload files manually or set REPO_URL variable."
    echo "   Upload your project files to: $PROJECT_DIR"
else
    if [ -d ".git" ]; then
        git pull origin main
    else
        git clone $REPO_URL .
    fi
fi

echo -e "${YELLOW}Step 6: Installing backend dependencies...${NC}"
cd backend
npm install --production
cp .env.example .env
echo "⚠️  Please edit $PROJECT_DIR/backend/.env and set your JWT_SECRET"
nano $PROJECT_DIR/backend/.env || echo "Skipping .env edit"

echo -e "${YELLOW}Step 7: Building frontend...${NC}"
cd ../frontend
npm install
npm run build

echo -e "${YELLOW}Step 8: Setting up PM2...${NC}"
cd $PROJECT_DIR
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo -e "${YELLOW}Step 9: Setting up nginx...${NC}"
cp nginx.conf /etc/nginx/sites-available/swiftoralogistics
ln -sf /etc/nginx/sites-available/swiftoralogistics /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo -e "${YELLOW}Step 10: Setting up SSL with Let's Encrypt...${NC}"
echo "⚠️  Make sure your domain DNS points to this VPS IP address before running certbot"
read -p "Press Enter to continue with SSL setup (or Ctrl+C to skip)..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo -e "${YELLOW}Step 11: Setting up firewall...${NC}"
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo -e "${YELLOW}Step 12: Setting up database backup...${NC}"
mkdir -p /backups
echo "0 2 * * * cp $PROJECT_DIR/backend/swiftora.db /backups/swiftora-$(date +\%Y\%m\%d).db" | crontab -

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Your website should be available at: https://$DOMAIN"
echo ""
echo "Next steps:"
echo "1. Edit $PROJECT_DIR/backend/.env and set a strong JWT_SECRET"
echo "2. Restart PM2: cd $PROJECT_DIR && pm2 restart all"
echo "3. Check logs: pm2 logs swiftora-backend"
echo "4. Monitor: pm2 monit"
echo ""
echo "Admin credentials:"
echo "  Username: Admin@$DOMAIN"
echo "  Password: admin"
echo ""
