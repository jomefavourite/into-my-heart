# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

"Into My Heart" is a Bible verse memorization app built with **Expo SDK 54 / React Native**. Backend is **Convex** (managed BaaS), auth is **Clerk** (managed). See `README.md` for basic getting-started steps.

### Required environment variables

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key |

These must be set before starting the app. The app will crash at startup without them.

### Running the app (web mode)

```
npx expo start --web --port 8081
```

The first bundle takes ~30 seconds. The app runs at `http://localhost:8081`.

### Lint / Test / Format

| Task | Command | Notes |
|---|---|---|
| Lint | `npx expo lint` | ESLint 9 + eslint-config-expo. Pre-existing warnings/errors in the codebase. |
| Test | `npx jest --passWithNoTests --watchAll=false` | Uses jest-expo preset. No tests exist yet. |
| Format check | `npm run format:check` | Prettier. Some pre-existing format drift. |
| Format fix | `npm run format` | Prettier --write |

### Gotchas

- The `npm run lint` script is `expo lint`, which auto-installs ESLint + config on first run if missing. Subsequent runs are fast.
- `npm run test` uses `--watchAll` by default (interactive). Use `npx jest --passWithNoTests --watchAll=false` for CI-style runs.
- The app's `_layout.tsx` throws if `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is falsy — ensure the env var is set before starting.
- Package manager is **npm** (`package-lock.json`).
