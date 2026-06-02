# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Next.js 15.1.0** (App Router, TypeScript)
- **next-auth 5.0.0-beta.25** — JWT strategy + Credentials provider
- **Prisma 5.22.0** — SQLite (`prisma/dev.db`)
- **Tailwind CSS** + custom shadcn-compatible UI components (no CLI)

## Commands

> Node.js is installed via **Scoop** on Windows. If `node`/`npm` are not in PATH:
> ```powershell
> $env:PATH = "$env:USERPROFILE\scoop\shims;$env:USERPROFILE\scoop\apps\nodejs-lts\current;$env:PATH"
> ```
> Prisma CLI needs `$env:DATABASE_URL = "file:./dev.db"` when run directly.

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Sync schema → DB (needs `$env:DATABASE_URL`) |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio (needs `$env:DATABASE_URL`) |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check without emitting |

## Auto-sync to GitHub

`scripts/watch-and-push.ps1` — file watcher that auto-commits and pushes on every save.
`scripts/setup-hooks.ps1` — installs a `post-commit` hook that auto-pushes after every manual commit.

## Architecture

### Route Groups

| Group | Path prefix | Purpose |
|-------|-------------|---------|
| `(auth)` | `/login`, `/register` | Unauthenticated; centered card layout |
| `(app)` | `/dashboard`, `/trips/*` | Protected; fixed sidebar + main content |

`src/app/(app)/layout.tsx` calls `auth()` server-side and redirects to `/login` if no session.
`middleware.ts` (root) enforces the same at the edge — matcher excludes `api/auth`, `api/register`, and static assets.

### Authentication

`auth.ts` (project root) is the canonical next-auth config exporting `{ handlers, signIn, signOut, auth }`.
`src/lib/auth.ts` re-exports it so `@/lib/auth` works inside `src/` (since `@/*` → `src/*`).

- Passwords hashed with **bcryptjs** (12 rounds).
- `session.user.id` injected via `jwt`/`session` callbacks (not included by default in v5).

### Database — Prisma Models

| Model | Notes |
|-------|-------|
| `User` | |
| `Account` | |
| `Session` | |
| `VerificationToken` | |
| `Trip` | |
| `TripMember` | |
| `Activity` | |
| `Accommodation` | |
| `Transport` | |
| `Expense` | |
| `Document` | |
| `PackingList` | |
| `PackingItem` | |
| `TripPrepItem` | |
| `JournalEntry` | |
| `CommunityRoute` | |
| `RouteComment` | |
| `CommunityActivity` | |
| `AuditLog` | |
| `NewsletterSubscriber` | |
| `Post` | |
| `SiteAnnouncement` | |
| `Experience` | |

**SQLite does not support Prisma enums.** All enum-like fields are stored as `String`.
Valid values are documented in comments above each model in `prisma/schema.prisma`.
Label/color helpers live in `src/lib/utils.ts`: `tripStatusLabel`, `tripStatusColor`, `activityTypeLabel`, `expenseCategoryLabel`.

### API Routes

Every route verifies ownership before acting:
```ts
const session = await auth();
if (!session?.user?.id) return 401;
const trip = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
if (!trip) return 404;
```

`params` must be **awaited** (Next.js 15 dynamic segments are `Promise<{id: string}>`).

Registered routes:
- `/admin/analytics` — GET
- `/admin/announcements` — DELETE, GET, PATCH, POST
- `/admin/audit` — GET
- `/admin/backup` — GET
- `/admin/comments` — DELETE, GET
- `/admin/content` — DELETE, GET
- `/admin/newsletter` — DELETE, GET
- `/admin/posts` — DELETE, GET, PATCH, POST
- `/admin/referrals` — GET
- `/admin/stats` — GET
- `/admin/users` — DELETE, GET, PATCH
- `/announcement` — GET
- `/auth/[...nextauth]` — 
- `/auth/check-credentials` — POST
- `/auth/forgot-password` — POST
- `/auth/reset-password` — POST
- `/auth/send-verification` — POST
- `/auth/verify-email` — GET
- `/community-routes/[id]/comments` — GET, POST
- `/community-routes/[id]` — DELETE, GET
- `/community-routes` — GET, POST
- `/exchange-rate` — GET
- `/experiences/[id]` — DELETE, GET, PATCH, PUT
- `/experiences` — GET, POST
- `/health` — GET
- `/newsletter` — POST
- `/notifications` — GET
- `/posts/[slug]` — GET
- `/posts` — GET
- `/public-stats` — GET
- `/referral` — GET
- `/register` — POST
- `/share/[token]` — GET
- `/tips/community` — GET
- `/tips/external` — GET
- `/trips/[id]/accommodations` — DELETE, GET, POST, PUT
- `/trips/[id]/activities` — DELETE, GET, POST, PUT
- `/trips/[id]/activities/suggest` — POST
- `/trips/[id]/documents` — DELETE, GET, POST
- `/trips/[id]/expenses` — DELETE, GET, POST, PUT
- `/trips/[id]/journal` — DELETE, GET, POST, PUT
- `/trips/[id]/members` — DELETE, GET, POST
- `/trips/[id]/packing` — DELETE, GET, PATCH, POST, PUT
- `/trips/[id]/prep` — DELETE, GET, PATCH, POST
- `/trips/[id]` — DELETE, GET, PUT
- `/trips/[id]/share` — DELETE, POST
- `/trips/[id]/share-route` — POST
- `/trips/[id]/transports` — DELETE, GET, POST, PUT
- `/trips` — GET, POST
- `/user/export` — GET
- `/user` — DELETE, GET, PUT

### Pages

- `/`
- `/backoffice`
- `/backoffice/announcements`
- `/backoffice/audit`
- `/backoffice/comments`
- `/backoffice/content`
- `/backoffice/newsletter`
- `/backoffice/posts`
- `/backoffice/referrals`
- `/backoffice/settings`
- `/backoffice/stats`
- `/backoffice/users`
- `/blog`
- `/blog/[slug]`
- `/dashboard`
- `/experiences`
- `/experiences/[id]`
- `/experiences/[id]/edit`
- `/experiences/new`
- `/forgot-password`
- `/login`
- `/offline`
- `/posts`
- `/posts/[slug]`
- `/pricing`
- `/privacy`
- `/profile`
- `/register`
- `/reset-password`
- `/roteiro`
- `/roteiro/[cidade]`
- `/routes`
- `/routes/contribute`
- `/share/[token]`
- `/terms`
- `/tips`
- `/trips/[id]`
- `/trips/[id]/accommodation`
- `/trips/[id]/budget`
- `/trips/[id]/compare`
- `/trips/[id]/currency`
- `/trips/[id]/documents`
- `/trips/[id]/edit`
- `/trips/[id]/itinerary`
- `/trips/[id]/journal`
- `/trips/[id]/map`
- `/trips/[id]/packing`
- `/trips/[id]/prep`
- `/trips/[id]/summary`
- `/trips/[id]/transport`
- `/trips/new`
- `/verify-email`

Each trip sub-page fetches data client-side from its API route.
`DELETE` requests send the item ID in the **JSON body** (not URL params).
`PackingList` is created lazily on first item addition (`ensurePackingList` in the API route).
Packing item toggle uses `PATCH { itemId, isPacked }`.

### UI Components

Custom components in `src/components/ui/` — hand-written, shadcn-compatible API, **no Radix UI**.
Available: `badge`, `button`, `card`, `currency-input`, `dialog`, `input`, `label`, `location-input`, `select`, `textarea`.

`Dialog` uses a backdrop + `Escape` key handler (no Radix).
`cn()` in `src/lib/utils.ts` combines clsx + tailwind-merge.
