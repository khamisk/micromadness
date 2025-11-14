# Quick Start Guide

## First Time Setup

1. **Install dependencies and setup database:**
   ```powershell
   .\setup.ps1
   ```

   Or manually:
   ```bash
   npm install
   cp .env.example .env
   npx prisma generate
   npx prisma migrate dev --name init
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Playing the Game

1. **Choose a username** when prompted
2. **Create a lobby** or **join** with a code
3. **Wait for players** to join (minimum 2)
4. **Ready up** (non-host players)
5. **Start the game** (host clicks "Start Game")
6. **Complete minigames** - last player standing wins!

## Development Tips

### Hot Reload
The development server supports hot reload. Changes to React components will update instantly.

### Database Reset
```bash
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```

### Build for Production
```bash
npm run build
npm start
```

## Common Issues

### Port 3000 in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port
$env:PORT=3001; npm run dev
```

### Socket connection fails
- Check if server is running
- Clear browser cache
- Check console for errors

### Database locked
- Close Prisma Studio if open
- Delete `prisma/dev.db` and run migrations again

## Environment Variables

Edit `.env`:

```env
# Required
DATABASE_URL="file:./dev.db"

# Optional - for analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
├── server/          # Game logic & minigames
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
├── types/           # TypeScript definitions
└── utils/           # Helper functions
```

## Next Steps

- Read the full [README.md](README.md)
- Check out the [How to Play](http://localhost:3000/how-to-play) page
- Deploy to [Vercel](https://vercel.com)

Happy gaming! 🎮
