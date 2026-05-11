# Vercel + Render Deployment Guide for swiftoralogistics.online

This guide deploys the frontend on Vercel (free, fast, global CDN) and the backend on Render (free tier with persistent storage).

## Architecture

- **Frontend:** Vercel - React static site with global CDN
- **Backend:** Render - Express.js with SQLite database
- **Domain:** swiftoralogistics.online (configured on Vercel)

## Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- Domain: swiftoralogistics.online

## Step 1: Prepare Code for Deployment

### 1.1 Update Frontend Environment Variable

Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://swiftora-logistics-backend.onrender.com
```

### 1.2 Add Root Package.json

Create `package.json` in the project root:
```json
{
  "name": "swiftora-logistics",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "postinstall": "cd frontend && npm install"
  }
}
```

### 1.3 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/swiftora-logistics.git
git push -u origin main
```

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### 2.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `swiftora-logistics-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (or Starter at $7/month for better performance)

### 2.3 Add Environment Variables

In the Render dashboard, add these environment variables:
```
PORT=5000
JWT_SECRET=your-secure-random-secret-here
NODE_ENV=production
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Deploy

Click **"Create Web Service"**. Render will deploy your backend.

**Note your backend URL:** `https://swiftora-logistics-backend.onrender.com`

### 2.5 Configure Persistent Disk (SQLite)

For SQLite persistence on Render:
1. Go to your web service in Render
2. Click **"Advanced"** → **"Add Disk"**
3. Configure:
   - **Name:** `data`
   - **Mount Path:** `/opt/render/project/backend`
   - **Size:** 1GB (free tier)
4. Update backend/server.js to use the mounted path:
```javascript
const dbPath = path.join(process.env.RENDER_EXTERNAL_MOUNT_PATH || __dirname, 'swiftora.db');
```

## Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 3.2 Deploy to Vercel

```bash
cd swiftora-logistics
vercel
```

Follow the prompts:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → `N`
- **Project name:** → `swiftora-logistics`
- **Directory:** → `./`
- **Override settings?** → `N`

Vercel will deploy and provide a URL like: `https://swiftora-logistics.vercel.app`

### 3.3 Configure Environment Variable

In Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://swiftora-logistics-backend.onrender.com`)
3. Redeploy from the dashboard

## Step 4: Configure Domain

### 4.1 Add Domain in Vercel

1. Go to Vercel project → **Settings** → **Domains**
2. Add domain: `swiftoralogistics.online`
3. Vercel will show DNS records to add

### 4.2 Configure DNS at Your Registrar

Add these DNS records at your domain registrar:

**For swiftoralogistics.online (root domain):**
- **Type:** `A`
- **Name:** `@`
- **Value:** `76.76.21.21` (Vercel's IP)

**For www.swiftoralogistics.online:**
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** `cname.vercel-dns.com`

### 4.3 Wait for DNS Propagation

DNS can take 5-30 minutes to propagate. Vercel will show the status.

### 4.4 Enable HTTPS

Vercel automatically provisions SSL certificates. Wait for the green checkmark.

## Step 5: Update Frontend with Production URL

Once the backend is deployed and you have the URL:

1. Update `frontend/.env.production`:
```env
REACT_APP_API_URL=https://swiftora-logistics-backend.onrender.com
```

2. Push to GitHub
3. Vercel will auto-redeploy

## Step 6: Test Deployment

1. Visit `https://swiftoralogistics.online`
2. Test tracking feature
3. Test admin login at `/admin`
4. Test contact form
5. Test testimonial submission

## Costs

**Free Tier:**
- Vercel: Free (100GB bandwidth/month)
- Render: Free (750 hours/month, 512MB RAM)
- Domain: ~$10-15/year

**Total:** ~$10-15/year (domain only)

**Paid Tier (Recommended for production):**
- Vercel Pro: $20/month
- Render Starter: $7/month
- Total: ~$37/month

## Management

### Update Application

```bash
git add .
git commit -m "Update"
git push
```

Both Vercel and Render will auto-deploy on push.

### View Logs

**Vercel:**
- Dashboard → Project → Deployments → Select deployment → View logs

**Render:**
- Dashboard → Web Service → Logs

### Environment Variables

**Vercel:** Dashboard → Settings → Environment Variables

**Render:** Dashboard → Web Service → Environment

## Troubleshooting

### Frontend can't reach backend

1. Check backend is running on Render
2. Verify REACT_APP_API_URL is correct
3. Check Render logs for errors
4. Ensure CORS is configured in backend

### SSL Certificate issues

Vercel handles SSL automatically. If issues:
1. Check DNS configuration
2. Wait for propagation
3. Contact Vercel support

### Database not persisting (Render)

Ensure you configured the persistent disk:
1. Go to Render web service
2. Advanced → Add Disk
3. Mount to `/opt/render/project/backend`

### Build failures

Check build logs:
- Vercel: Dashboard → Deployments
- Render: Dashboard → Web Service → Events

## Alternative: Full Vercel Deployment (Serverless)

If you want everything on Vercel, you need to:
1. Convert Express to Vercel Serverless Functions
2. Use Vercel Postgres or external database (SQLite not supported)
3. Rewrite backend to use serverless architecture

See: [Vercel Serverless Functions](https://vercel.com/docs/functions)

## Summary

- **Frontend:** Vercel (global CDN, auto-SSL)
- **Backend:** Render (Express + SQLite)
- **Domain:** swiftoralogistics.online (configured on Vercel)
- **Cost:** Free tier available
- **Auto-deploy:** On git push
