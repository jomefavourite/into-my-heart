# Into My Heart

Into My Heart is an Expo + React Native Bible verse memorization app backed by Convex and Clerk. The launch scope is a lean, offline-first core focused on saving verses, building collections, taking notes, writing affirmations, and practicing with flashcards, fill-in-the-blanks, and recitation.

## Launch Scope

- `KJV only` for verse text and practice
- Offline-first local persistence with sync to Convex
- Core memorization flows:
  - verses
  - collections
  - notes
  - affirmations
  - featured verse
  - flashcards
  - fill in the blanks
  - recitation
- Basic progress tracking:
  - completed practice sessions
  - per-verse practice totals
- Native daily reminder notifications

Out of scope for this launch:

- verse of the day
- goals
- streaks
- badges
- Bible version switching

## Tech Stack

- Expo SDK 54
- React Native
- Expo Router
- Convex
- Clerk
- Zustand

## Required Environment Variables

### App

- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Convex / Clerk backend integration

- `CLERK_JWT_ISSUER_DOMAIN`
- `CLERK_WEBHOOK_SECRET`
- `CLERK_SECRET_KEY`

`CLERK_SECRET_KEY` is required for the server-side account deletion flow.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Set the required environment variables.

3. Start the app:

```bash
npx expo start
```

### Web

```bash
npx expo start --web --port 8081
```

The web app runs at [http://localhost:8081](http://localhost:8081).

## Common Commands

### Run

```bash
npm run start
npm run web
npm run ios
npm run android
```

Native reminder notifications require an iOS or Android build. They are not available on web.

### Lint

```bash
npx expo lint
```

### Tests

```bash
npx jest --passWithNoTests --watchAll=false
npm run test:e2e
```

### Format

```bash
npm run format:check
npm run format
```

## Convex Notes

- Convex schema lives in `convex/schema.ts`.
- The app uses offline-first state in `store/offlineDataStore.ts`.
- Sync orchestration lives in `components/OfflineSyncProvider.tsx` and `convex/sync.ts`.
- Practice progress uses:
  - `practiceSessions`
  - `verseProgress`

When editing Convex code, read `convex/_generated/ai/guidelines.md` first.

## Clerk Notes

- Clerk handles auth and onboarding.
- Convex auth is configured in `convex/auth.config.ts`.
- Clerk user webhooks are handled in `convex/http.ts`.
- Account deletion is a server-side Convex action that removes Convex data first and deletes the Clerk user last.

## Admin Setup

Admin tooling is internal-only for launch.

To create the first admin, use one of the Convex mutations in `convex/users.ts`:

- `setupFirstAdmin`
- `setupAdminByClerkId`

The admin page is available at `/admin` for authenticated admin users.

## Account Deletion

The launch build supports full account deletion.

Deletion flow:

1. Delete the user’s saved verses, collections, notes, affirmations, practice sessions, and verse progress from Convex.
2. Delete the user document.
3. Delete the Clerk account with `CLERK_SECRET_KEY`.
4. Clear local offline state and return the user to onboarding.

## Project Structure

- `app/`: Expo Router screens
- `components/`: shared UI and feature components
- `convex/`: backend schema and functions
- `hooks/`: shared hooks
- `store/`: Zustand stores
- `lib/`: utilities, Bible data access, practice helpers

## Current Product Notes

- Imported verses resolve to the app’s local KJV text.
- Profile stats are launch-safe metrics:
  - saved verses
  - saved collections
  - completed practice sessions
- Collection and verse detail pages can start guided practice directly.
