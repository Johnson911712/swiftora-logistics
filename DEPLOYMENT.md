# Swiftora Logistics - Deployment Guide

## Deployment Options for swiftoralogistics.online

### Option 1: Vercel + Render (Recommended - Free Tier)

**Frontend (Vercel):**
1. Install Vercel CLI: `npm i -g vercel`
2. In `frontend/` folder: `vercel`
3. Connect to your Vercel account
4. Set project name: `swiftora-logistics-frontend`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com`
6. Deploy!

**Backend (Render):**
1. Push code to GitHub
2. Go to render.com and create account
3. Create New Web Service
4. Connect your GitHub repository
5. Set Build Command: `cd backend && npm install`
6. Set Start Command: `cd backend && npm start`
7. Add environment variables:
   - `PORT=5000`
   - `JWT_SECRET=your-secret-key-here`
8. Deploy!

### Option 2: Railway (All-in-One)

1. Go to railway.app and create account
2. Create New Project
3. Deploy from GitHub repo
4. Railway will auto-detect Node.js
5. Add environment variables in Railway dashboard
6. Railway provides a domain - configure swiftoralogistics.online to point there

### Option 3: VPS/DigitalOcean/AWS (Full Control)

**Prerequisites:**
- VPS with Ubuntu 22.04+
- Domain swiftoralogistics.online
- SSL certificate

**Steps:**
```bash
# 1. SSH into your VPS
ssh user@your-vps-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2 (process manager)
sudo npm install -g pm2

# 4. Clone your repository
git clone https://github.com/your-username/swiftora-logistics.git
cd swiftora-logistics

# 5. Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# 6. Set up environment
cd backend
nano .env
# Add:
# PORT=5000
# JWT_SECRET=your-secure-random-secret
# NODE_ENV=production

# 7. Start backend with PM2
pm2 start server.js --name swiftora-backend

# 8. Set up nginx for reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/swiftoralogistics
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name swiftoralogistics.online www.swiftoralogistics.online;

    # Frontend
    location / {
        root /path/to/swiftora-logistics/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 9. Enable site
sudo ln -s /etc/nginx/sites-available/swiftoralogistics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 10. Install SSL with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d swiftoralogistics.online -d www.swiftoralogistics.online
```

### Option 4: Netlify + Heroku

**Frontend (Netlify):**
1. Connect Netlify to GitHub
2. Select frontend folder as root
3. Build command: `npm run build`
4. Publish directory: `build`
5. Add environment variable: `REACT_APP_API_URL=https://your-heroku-app.herokuapp.com`

**Backend (Heroku):**
1. Create Procfile in backend:
```
web: node server.js
```
2. Deploy to Heroku
3. Add config vars in Heroku dashboard

---

## Environment Variables Required

**Backend (.env):**
```
PORT=5000
JWT_SECRET=generate-a-secure-random-string
NODE_ENV=production
```

**Frontend (.env.production):**
```
REACT_APP_API_URL=https://swiftoralogistics.online
```

## Domain DNS Configuration

For swiftoralogistics.online, configure your DNS:

**A Records:**
- `@` → Your VPS IP address (or hosting provider IP)
- `www` → Your VPS IP address

**If using Vercel/Netlify:**
- Add CNAME record for `www` pointing to your hosting provider

---

## Post-Deployment Checklist

- [ ] Update frontend REACT_APP_API_URL to production backend URL
- [ ] Set strong JWT_SECRET in production
- [ ] Enable HTTPS/SSL
- [ ] Configure database backups (SQLite file backup)
- [ ] Set up monitoring/logging
- [ ] Test admin login
- [ ] Test tracking code generation
- [ ] Test contact form submission
- [ ] Verify email (Info@swiftoralogistics.online) routing

---

## Current Local Status

- Backend: Running on http://localhost:5000
- Frontend: Running on http://localhost:3000
- Database: SQLite (swiftora.db in backend folder)
- Admin: Admin@swiftoralogistics.online / admin
