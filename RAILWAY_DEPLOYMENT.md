# Railway Deployment Guide for MicroMadness

This guide will walk you through deploying MicroMadness to Railway for production multiplayer hosting.

## Why Railway?

Railway is perfect for MicroMadness because it:
- **Supports WebSockets** - Essential for real-time multiplayer
- **Provides PostgreSQL** - Free database for production
- **Easy Deployment** - Direct GitHub integration
- **Great for Multiplayer** - Low latency and reliable connections

## Prerequisites

1. GitHub account with your code pushed to: https://github.com/khamisk/micromadness
2. Railway account (sign up at https://railway.app)
3. Google Analytics 4 Measurement ID (optional)

## Step-by-Step Deployment

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Login" and sign in with your GitHub account
3. Authorize Railway to access your GitHub repositories

### Step 2: Create New Project

1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your repository: `khamisk/micromadness`
4. Railway will automatically detect it's a Next.js application

### Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will provision a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically set

### Step 4: Configure Environment Variables

In your Railway project settings, go to "Variables" and add:

```
NODE_ENV=production
DATABASE_URL=(automatically set by Railway PostgreSQL)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important Notes:**
- `DATABASE_URL` is automatically configured when you add PostgreSQL
- Add your Google Analytics ID if you want analytics
- Railway automatically handles the production build

### Step 5: Update Package.json Scripts

Your `package.json` already has the correct scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### Step 6: Deploy

1. Railway will automatically deploy when you push to GitHub
2. First deployment will:
   - Install dependencies
   - Generate Prisma client
   - Build Next.js application
   - Run database migrations
   - Start the production server

### Step 7: Run Database Migrations

After first deployment:

1. Go to your Railway project
2. Click on your service
3. Go to "Settings" → "Deploy"
4. Add a deploy command (one-time): `npx prisma migrate deploy`
5. Or use Railway CLI: `railway run npx prisma migrate deploy`

### Step 8: Get Your Production URL

1. In Railway dashboard, click on your service
2. Go to "Settings" → "Networking"
3. Click "Generate Domain"
4. You'll get a URL like: `micromadness-production.up.railway.app`
5. Share this URL with players!

## Custom Domain (Optional)

To use your own domain:

1. Go to "Settings" → "Networking" in Railway
2. Click "Custom Domain"
3. Add your domain (e.g., `micromadness.com`)
4. Update your DNS records as instructed by Railway

## Monitoring & Logs

### View Logs
1. Click on your service in Railway dashboard
2. Go to "Deployments" tab
3. Click on any deployment to see logs

### Check Metrics
- Railway provides CPU, Memory, and Network usage
- Monitor active WebSocket connections
- Check database query performance

## Database Management

### Access PostgreSQL Database

Using Railway CLI:
```bash
railway login
railway link
railway run psql $DATABASE_URL
```

### Backup Database
Railway automatically backs up your PostgreSQL database

### View Database
1. Go to PostgreSQL service in Railway
2. Click "Data" tab to browse tables
3. Use "Query" tab to run SQL

## Environment-Specific Configuration

### Development
```bash
npm run dev
# Uses SQLite database (dev.db)
```

### Production (Railway)
```bash
npm run build && npm run start
# Uses PostgreSQL from DATABASE_URL
```

## WebSocket Configuration

MicroMadness WebSockets work automatically on Railway because:
- Railway supports WebSocket upgrades
- Socket.IO is configured correctly in `src/pages/api/socket.ts`
- No additional configuration needed

## Troubleshooting

### Issue: "Cannot connect to server"
**Solution:** Check Railway logs for startup errors
```bash
railway logs
```

### Issue: Database connection errors
**Solution:** Ensure PostgreSQL service is running and DATABASE_URL is set
```bash
railway variables
```

### Issue: Build fails during Prisma generation
**Solution:** Make sure `postinstall` script runs Prisma generate
```json
"postinstall": "prisma generate"
```

### Issue: WebSocket connection fails
**Solution:** 
- Check that Socket.IO server starts (see logs)
- Verify client connects to correct URL
- Railway supports WebSockets by default, no extra config needed

### Issue: Migration errors
**Solution:** Run migrations manually
```bash
railway run npx prisma migrate deploy
```

## Cost Estimates

Railway Free Tier:
- ✅ $5 free credit per month
- ✅ Perfect for development and testing
- ✅ Supports WebSockets
- ✅ PostgreSQL included

For Production:
- ~$5-10/month for small player base (50-100 concurrent)
- ~$20-30/month for medium player base (200-500 concurrent)
- Scales automatically with usage

## Performance Tips

1. **Database Indexing** - Already configured in Prisma schema
2. **Connection Pooling** - Railway handles this automatically
3. **Region Selection** - Choose region closest to your players
4. **Monitor Active Games** - Check dashboard for active lobbies
5. **Auto-scaling** - Railway scales based on demand

## Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin master
```

Railway will:
1. Detect the push
2. Pull latest code
3. Run build
4. Deploy automatically
5. Zero-downtime deployment

## Security

Railway automatically provides:
- ✅ HTTPS/TLS encryption
- ✅ Environment variable encryption
- ✅ DDoS protection
- ✅ Secure WebSocket connections (WSS)

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Railway project
3. ✅ Add PostgreSQL database
4. ✅ Configure environment variables
5. ✅ Deploy and test
6. ✅ Share with players!

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- MicroMadness Issues: https://github.com/khamisk/micromadness/issues

## Production Checklist

- [ ] GitHub repository is public or Railway has access
- [ ] PostgreSQL database added to Railway project
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Database migrations completed
- [ ] WebSocket connections working
- [ ] Test create/join lobby
- [ ] Test multiplayer gameplay
- [ ] Custom domain configured (optional)
- [ ] Analytics working (optional)

---

**Ready to deploy!** 🚀

Your multiplayer game will be live at: `https://your-project.up.railway.app`
