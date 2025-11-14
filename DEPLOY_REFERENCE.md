# MicroMadness - Quick Deployment Reference

## ✅ What's Done

- ✅ Code pushed to GitHub: https://github.com/khamisk/micromadness
- ✅ Railway configuration files created (`railway.json`, `nixpacks.toml`)
- ✅ PostgreSQL database schema ready
- ✅ Public lobby browser implemented
- ✅ Spectator mode support added
- ✅ Fixed lobby loading issue
- ✅ All 19 minigames implemented
- ✅ WebSocket multiplayer ready

## 🚀 Deploy to Railway (Next Steps)

### 1. Create Railway Account
- Go to: https://railway.app
- Sign in with GitHub

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose: `khamisk/micromadness`

### 3. Add PostgreSQL Database
- Click "New" → "Database" → "PostgreSQL"
- Railway auto-configures `DATABASE_URL`

### 4. Add Environment Variables
In Railway dashboard under "Variables":
```
NODE_ENV=production
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
(DATABASE_URL is automatically set)

### 5. Deploy
- Railway deploys automatically
- Go to "Settings" → "Generate Domain"
- Your game URL: `https://your-project.up.railway.app`

### 6. Run Migrations (First Time Only)
In Railway dashboard:
- Open service → "Settings" → "Deploy"
- Or use CLI: `railway run npx prisma migrate deploy`

## 🎮 Features Implemented

### Main Screen
- **Public Lobby Browser** - See all active public lobbies
- **Real-time Updates** - Lobbies refresh every 3 seconds
- **Create Lobby** - Modal with settings (lives, public/private)
- **Join Lobby** - Click any lobby to join or spectate

### Lobby System
- **Public/Private** - Toggle visibility
- **Mid-Game Joining** - Join as spectator if game in progress
- **Fixed Durations** - Removed confusing duration settings
- **Player Count** - Shows current/max players

### 19 Minigames
1. Speed Typist
2. Perfect Stopwatch
3. Memory Grid
4. Stickman Parkour
5. Stickman Dodgefall
6. Bullet Hell
7. Stay in Circle
8. Precision Maze
9. Average Bait
10. Reverse APM
11. Deadly Corners
12. Adaptive Mash Challenge
13. Team Tug of War
14. Territory Grab
15. Vote to Kill
16. Group Coinflip
17. Cursor Chain Reaction ⭐ NEW
18. Stickman Cannon Jump ⭐ NEW
19. Math Flash Rush ⭐ NEW

## 📊 Tech Stack

- **Frontend**: React + Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS with custom theme
- **Real-time**: Socket.IO (WebSocket)
- **Database**: PostgreSQL (via Railway)
- **ORM**: Prisma
- **Deployment**: Railway
- **Analytics**: Google Analytics 4

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev --name init

# Run development server
npm run dev
```

Open http://localhost:3000

## 📝 Environment Variables

### Local (.env)
```env
DATABASE_URL="postgresql://..."  # Railway will provide this
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Railway (Production)
```env
NODE_ENV=production
DATABASE_URL=(auto-configured by Railway PostgreSQL)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🎯 Testing Checklist

After deployment, test:
- [ ] Main menu loads
- [ ] Create public lobby
- [ ] Join lobby from list
- [ ] Multiple players ready up
- [ ] Start game
- [ ] Minigames load and play
- [ ] Lives decrease correctly
- [ ] Game ends with winner
- [ ] Stats save properly
- [ ] Spectator mode works

## 📚 Documentation

- **README.md** - Overview and features
- **RAILWAY_DEPLOYMENT.md** - Detailed Railway deployment guide
- **QUICKSTART.md** - Quick start guide
- **INSTALLATION.md** - Installation instructions
- **CONTRIBUTING.md** - Contribution guidelines

## 🐛 Troubleshooting

### Can't connect to game
- Check Railway logs for errors
- Verify WebSocket connection in browser console
- Ensure DATABASE_URL is set

### Database errors
- Run migrations: `railway run npx prisma migrate deploy`
- Check PostgreSQL service is running in Railway

### Build fails
- Check build logs in Railway
- Verify all dependencies in package.json
- Ensure postinstall script runs

## 💡 Quick Tips

1. **Railway auto-deploys** on every git push
2. **Free tier** includes $5/month credit
3. **PostgreSQL** is included and managed
4. **Logs** available in Railway dashboard
5. **Custom domain** can be added in settings

## 🔗 Important Links

- **GitHub Repo**: https://github.com/khamisk/micromadness
- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.app
- **Your Game URL**: (Generate in Railway after deployment)

## 🎉 Ready to Play!

Once deployed, share your game URL with friends and start playing!

```
https://your-project.up.railway.app
```

---

**Need help?** Check `RAILWAY_DEPLOYMENT.md` for detailed instructions.
