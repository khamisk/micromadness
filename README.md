# MicroMadness 🎮

A fast-paced minigame battle royale built with Next.js 14, TypeScript, and Socket.IO.

## Features

- **16 Unique Minigames** - From Perfect Stopwatch to Bullet Hell
- **Real-time Multiplayer** - WebSocket-powered gameplay
- **Persistent Stats** - Track your wins and playtime
- **Customizable Lobbies** - Adjust lives, minigame duration, and more
- **Responsive Design** - Play on desktop or mobile
- **No Authentication Required** - Jump in and play instantly

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Socket.IO
- **Database**: Prisma + SQLite (easily switchable to PostgreSQL)
- **Analytics**: Google Analytics 4
- **Hosting**: Optimized for Vercel

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd microgames
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="file:./dev.db"

# Google Analytics 4 (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 4. Initialize Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
microgames/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js 14 App Router pages
│   │   ├── api/              # API routes
│   │   ├── create-lobby/     # Create lobby page
│   │   ├── join-lobby/       # Join lobby page
│   │   ├── lobby/[code]/     # Lobby page
│   │   ├── game/[code]/      # Game page
│   │   ├── stats/            # Stats page
│   │   └── how-to-play/      # Instructions page
│   ├── components/           # React components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utility libraries
│   ├── server/               # Server-side logic
│   │   ├── minigames/       # All 16 minigame implementations
│   │   ├── GameManager.ts   # Game orchestration
│   │   └── MinigameOrchestrator.ts
│   ├── types/                # TypeScript types
│   └── utils/                # Helper functions
├── public/                   # Static assets
└── package.json
```

## Minigames

All 16 minigames are implemented:

1. **Perfect Stopwatch** - Click at exactly the target time
2. **Adaptive Mash Challenge** - Press changing keys rapidly
3. **Speed Typist** - Type sentences quickly
4. **Team Tug-of-War** - Spacebar team battle
5. **Precision Maze** - Navigate without touching walls
6. **Stickman Dodgefall** - Dodge falling objects
7. **Stickman Parkour** - Complete obstacle course
8. **Stay in the Circle** - Keep cursor inside moving circle
9. **Memory Grid** - Remember and click tiles
10. **Territory Grab** - Claim the most tiles
11. **Average Bait** - Guess closest to average
12. **Vote to Kill** - Vote someone out
13. **Bullet Hell** - Dodge bullets with cursor
14. **Reverse APM** - Click buttons 20→0
15. **Deadly Corners** - Choose safe corner
16. **Group Coinflip** - Guess heads or tails

## Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Connect to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure environment variables:
  - `DATABASE_URL` - Use PostgreSQL for production (e.g., Neon, Supabase)
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Your GA4 measurement ID

3. **Deploy**

- Click "Deploy"
- Vercel will automatically build and deploy your app

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID

# Deploy to production
vercel --prod
```

### Important: Database for Production

SQLite is file-based and won't persist on Vercel's serverless platform. For production, use PostgreSQL:

1. **Create a PostgreSQL Database** (free options):
   - [Neon](https://neon.tech)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)

2. **Update DATABASE_URL** in Vercel environment variables:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
```

3. **Update Prisma Schema** (if needed):

In `prisma/schema.prisma`, change:
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

4. **Run Migrations**:
```bash
npx prisma migrate deploy
```

### WebSocket Configuration for Vercel

WebSockets work on Vercel but have limitations. For production-grade WebSocket support:

1. **Use Vercel's Edge Runtime** (current implementation)
2. **Or use external WebSocket server**:
   - Deploy Socket.IO server separately (e.g., Railway, Fly.io)
   - Update Socket.IO client to connect to external server
   - Add server URL to environment variables

## Configuration

### Lobby Settings

- **Lives**: 3-15 (default: 5)
- **Minigame Duration**:
  - Short: 8-10 seconds
  - Normal: 10-12 seconds
  - Long: 12-15 seconds

### Game Rules

- Minimum 2 players to start
- After each minigame, one or more players lose a life
- When a player reaches 0 lives, they're eliminated
- Last player standing wins

## Analytics

Google Analytics 4 tracks:
- Page views
- Lobby created/joined
- Game started/finished
- Minigame events

To enable, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in your environment variables.

## Development

### Add a New Minigame

1. Create minigame class in `src/server/minigames/YourMinigame.ts`:

```typescript
import { BaseMinigame } from './BaseMinigame'
import { MinigameResult, MinigameType } from '@/types'

export class YourMinigame extends BaseMinigame {
  readonly id = 'your-minigame'
  readonly name = 'Your Minigame'
  readonly description = 'Description'
  readonly type: MinigameType = 'performance'

  handleInput(playerId: string, data: any) {
    // Handle player input
  }

  protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
    // Determine who loses lives
  }
}
```

2. Export in `src/server/minigames/index.ts`
3. Add to `MinigameOrchestrator.ts`
4. Create client component in `src/components/minigames/YourMinigame.tsx`

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development)
npx prisma migrate reset
```

### Build for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### WebSocket Connection Issues

- Ensure Socket.IO path is correctly configured: `/api/socket`
- Check CORS settings in `pages/api/socket.ts`
- For Vercel, WebSockets may have cold start delays

### Database Errors

- Run `npx prisma generate` after schema changes
- Check DATABASE_URL is correctly formatted
- For PostgreSQL, ensure SSL mode is configured

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## Performance Optimization

- Static pages are pre-rendered
- API routes are optimized for serverless
- Database queries use Prisma's efficient query engine
- WebSocket connections are pooled

## Security Notes

- No sensitive data is stored client-side except player ID (UUID)
- Player IDs are generated client-side and stored in localStorage
- No authentication system - suitable for casual play
- Rate limiting should be added for production (consider Vercel Rate Limiting)

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Version

1.0.0

---

Built with ❤️ using Next.js 14, TypeScript, and Socket.IO
