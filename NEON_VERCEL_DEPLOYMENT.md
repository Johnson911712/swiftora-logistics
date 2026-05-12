# Neon Postgres + Vercel Deployment Guide

This guide deploys Swiftora Logistics entirely on Vercel with Neon Postgres as the database.

## Architecture

- **Frontend:** Vercel (React static site)
- **Backend:** Vercel Functions (serverless)
- **Database:** Neon Postgres
- **Domain:** swiftoralogistics.online

## Prerequisites

- GitHub account
- Vercel account (free)
- Neon account (free tier available)

## Step 1: Create Neon Postgres Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up or log in
3. Click "Create a project"
4. Configure:
   - **Project name:** `swiftora-logistics`
   - **Region:** Choose nearest to your users
   - **PostgreSQL version:** 16 (default)
5. Click "Create project"
6. **Copy the DATABASE_URL** from the project dashboard (you'll need this for Vercel)

## Step 2: Initialize Database Schema

1. In Neon dashboard, go to your project
2. Click "SQL Editor" (or "Console")
3. Copy the contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" to create tables and seed data

Alternatively, use Neon CLI:
```bash
npm install -g neonctl
neonctl auth
neonctl sql execute --file database/schema.sql
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts:
- Set up and deploy? `Y`
- Link to existing project? `N`
- Project name? `swiftora-logistics`
- Directory? `./`
- Override settings? `N`

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import from GitHub: `Johnson911712/swiftora-logistics`
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/build`

## Step 4: Add Environment Variables

In Vercel dashboard (Settings → Environment Variables), add:

```
DATABASE_URL=your-neon-database-url
JWT_SECRET=your-secure-random-secret
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Important:** Add these to all environments (Production, Preview, Development)

## Step 5: Deploy

Vercel will automatically deploy. Wait for the build to complete (2-3 minutes).

## Step 6: Configure Domain

1. In Vercel dashboard → Settings → Domains
2. Add domain: `swiftoralogistics.online`
3. Vercel will show DNS records to add

### DNS Configuration

At your domain registrar, add:

**For swiftoralogistics.online:**
- **Type:** `A`
- **Name:** `@`
- **Value:** `76.76.21.21`

**For www.swiftoralogistics.online:**
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** `cname.vercel-dns.com`

Wait for DNS propagation (5-30 minutes).

## Step 7: Test Deployment

1. Visit `https://swiftoralogistics.online`
2. Test tracking feature
3. Test admin login at `/admin`
   - Username: `Admin@swiftoralogistics.online`
   - Password: `admin`
4. Test contact form
5. Test testimonial submission

## Project Structure

```
swiftora-logistics/
├── api/                    # Vercel Functions (backend)
│   ├── auth/
│   │   └── login.js        # Admin authentication
│   ├── tracking/
│   │   └── [code].js       # Package tracking
│   ├── shipments/
│   │   ├── index.js        # List/create shipments
│   │   └── [id].js         # Update/delete shipments
│   └── contact/
│       ├── index.js        # Contact messages
│       └── testimonials.js # Testimonials
├── frontend/               # React frontend
│   ├── src/
│   └── build/              # Production build
├── database/
│   └── schema.sql          # Postgres schema
└── vercel.json             # Vercel configuration
```

## API Endpoints

After deployment, these will be available at `https://swiftoralogistics.online`:

- `POST /api/auth/login` - Admin login
- `GET /api/tracking/:code` - Track package
- `GET /api/shipments` - List shipments (admin)
- `POST /api/shipments` - Create shipment (admin)
- `PUT /api/shipments/:id` - Update shipment (admin)
- `DELETE /api/shipments/:id` - Delete shipment (admin)
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - List messages (admin)
- `GET /api/contact/testimonials` - Get testimonials
- `POST /api/contact/testimonials` - Submit testimonial

## Costs

**Free Tier:**
- Vercel: Free (100GB bandwidth/month)
- Neon: Free tier (0.5GB storage, 100 hours compute/month)
- Domain: ~$10-15/year

**Total:** ~$10-15/year (domain only)

**Paid Tier (Recommended for production):**
- Vercel Pro: $20/month
- Neon Pro: $19/month
- Total: ~$39/month

## Management

### Update Application

```bash
git add .
git commit -m "Update"
git push
```

Vercel will auto-deploy on push.

### View Logs

**Vercel:**
- Dashboard → Project → Deployments → Select deployment → View logs

**Neon:**
- Dashboard → Project → Logs

### Environment Variables

**Vercel:** Dashboard → Settings → Environment Variables

**Neon:** Dashboard → Project → Connection Details

## Troubleshooting

### Deployment fails

1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify DATABASE_URL is correct

### API returns 500 errors

1. Check Vercel function logs
2. Verify DATABASE_URL is correct
3. Ensure database schema is initialized

### Database connection errors

1. Verify DATABASE_URL in Vercel environment variables
2. Check Neon dashboard for database status
3. Ensure database is not paused (Neon free tier pauses after inactivity)

### Admin login fails

1. Verify admin user exists in database:
   ```sql
   SELECT * FROM admin WHERE username = 'Admin@swiftoralogistics.online';
   ```
2. If missing, run the INSERT statement from `database/schema.sql`

## Security Best Practices

1. **Use strong JWT_SECRET** - Generate a random 32-byte secret
2. **Rotate secrets regularly** - Update JWT_SECRET periodically
3. **Enable HTTPS** - Vercel provides SSL automatically
4. **Monitor logs** - Check Vercel and Neon logs regularly
5. **Limit database access** - Use Neon's security features

## Performance Optimization

For higher traffic, consider:
- Enable Vercel Edge Functions for faster API responses
- Use Neon's connection pooling
- Add caching with Vercel KV or Redis
- Optimize database queries

## Summary

- **Frontend:** Vercel (global CDN, auto-SSL)
- **Backend:** Vercel Functions (serverless)
- **Database:** Neon Postgres (serverless)
- **Domain:** swiftoralogistics.online
- **Cost:** Free tier available
- **Auto-deploy:** On git push
