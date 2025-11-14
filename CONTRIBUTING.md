# Contributing to MicroMadness

Thank you for your interest in contributing! 🎮

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Open a new issue with the `enhancement` label
2. Describe the feature and why it would be useful
3. Include mockups or examples if possible

### Code Contributions

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/microgames.git
   cd microgames
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Set up the project**
   ```bash
   npm install
   cp .env.example .env
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

6. **Test your changes**
   ```bash
   npm run dev
   # Test thoroughly in the browser
   npm run build  # Ensure it builds
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc)
   - `refactor:` - Code refactoring
   - `perf:` - Performance improvements
   - `test:` - Adding tests
   - `chore:` - Build process or tooling changes

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Link any related issues

## Adding a New Minigame

To add a new minigame:

1. **Create the server-side logic** in `src/server/minigames/YourMinigame.ts`:
   ```typescript
   import { BaseMinigame } from './BaseMinigame'
   import { MinigameResult, MinigameType } from '@/types'

   export class YourMinigame extends BaseMinigame {
     readonly id = 'your-minigame'
     readonly name = 'Your Minigame'
     readonly description = 'What players need to do'
     readonly type: MinigameType = 'performance' // or 'passFail' or 'hybrid'

     handleInput(playerId: string, data: any) {
       // Process player input
     }

     protected calculatePlayersLostLife(results: MinigameResult[]): string[] {
       // Determine who loses lives
     }
   }
   ```

2. **Export it** in `src/server/minigames/index.ts`

3. **Add to orchestrator** in `src/server/MinigameOrchestrator.ts`

4. **Create the UI component** in `src/components/minigames/YourMinigame.tsx`

5. **Add to renderer** in `src/components/MinigameRenderer.tsx`

6. **Update documentation** in `src/app/how-to-play/page.tsx`

## Code Style

- Use TypeScript for all new code
- Follow existing formatting (Prettier config)
- Use meaningful variable names
- Add JSDoc comments for exported functions
- Keep components small and focused

## Testing Checklist

Before submitting a PR, test:

- [ ] Game creation and joining works
- [ ] Lobby ready system works
- [ ] Game starts correctly
- [ ] All minigames function properly
- [ ] Lives decrease correctly
- [ ] Elimination works
- [ ] Winner is determined correctly
- [ ] Stats update properly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark mode works

## Questions?

Feel free to ask questions in:
- GitHub Discussions
- Issue comments
- Pull request comments

Thank you for contributing! 🚀
