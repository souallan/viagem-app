# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node.js was installed via **Scoop** (`~\scoop\apps\nodejs-lts\current`). If `node`/`npm`/`npx` are not in PATH, prefix PowerShell commands with:

```powershell
$env:PATH = "$env:USERPROFILE\scoop\shims;$env:USERPROFILE\scoop\apps\nodejs-lts\current;$env:PATH"
```

The `DATABASE_URL` env var must be set when running Prisma CLI directly (it is read automatically from `.env.local` only by Next.js, not by the Prisma CLI):

```powershell
$env:DATABASE_URL = "file:./dev.db"
```

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Type-check | `npx tsc --noEmit` |
| Generate Prisma client | `npm run db:generate` |
| Sync schema to DB | `npm run db:push` (requires `$env:DATABASE_URL`) |
| Open Prisma Studio | `npm run db:studio` (requires `$env:DATABASE_URL`) |
| Build for production | `npm run build` |

## Architecture

### Route Groups

The app uses two Next.js route groups with separate layouts:

- **`(auth)/`** — unauthenticated pages (`/login`, `/register`). Centered card layout with logo.
- **`(app)/`** — protected pages. The layout (`src/app/(app)/layout.tsx`) calls `auth()` server-side and redirects to `/login` if unauthenticated. Renders a fixed sidebar + main content area.

Route protection is also enforced at the edge by `middleware.ts` (root), which uses next-auth's `auth` export. The matcher excludes `api/auth`, `api/register`, and static assets.

### Authentication

`auth.ts` at the **project root** is the canonical next-auth v5 config. It exports `{ handlers, signIn, signOut, auth }`.

`src/lib/auth.ts` is a re-export shim so that files inside `src/` can import via `@/lib/auth` (since `@/*` maps to `src/*` only).

- Strategy: **JWT** (not database sessions), combined with `PrismaAdapter` for user storage.
- The `session.user.id` is injected via the `jwt`/`session` callbacks since next-auth v5 does not include it by default.
- Passwords are hashed with `bcryptjs` (12 rounds).

### API Routes

All routes under `src/app/api/trips/` follow the same ownership-verification pattern:

```ts
const session = await auth();
if (!session?.user?.id) return 401;
const trip = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
if (!trip) return 404;
```

`params` is typed as `Promise<{ id: string }>` and must be awaited (Next.js 15 dynamic segments).

### Database

SQLite via Prisma (`prisma/dev.db`). **SQLite does not support Prisma enums** — all enum-like fields are stored as plain `String` with the valid values documented in comments above each model in `schema.prisma`. Always use the string literals directly (e.g. `"PLANNING"`, `"FLIGHT"`) rather than non-existent enum types.

Label/color mappings for these string values live in `src/lib/utils.ts` (`tripStatusLabel`, `tripStatusColor`, `activityTypeLabel`, `expenseCategoryLabel`).

### UI Components

Custom shadcn-compatible components in `src/components/ui/` (no shadcn CLI was used). They follow the same API as shadcn but are hand-written. The `Dialog` component is a custom implementation using a backdrop + `Escape` key handler — it does **not** use Radix UI.

`src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge), `formatDate()` (date-fns, pt-BR locale), and `formatCurrency()` (Intl.NumberFormat).

### Trip Sub-pages

Each trip has a tabbed layout at `src/app/(app)/trips/[id]/layout.tsx`. The tabs link to sibling routes:

```
/trips/[id]               → overview (page.tsx)
/trips/[id]/itinerary     → activities grouped by day
/trips/[id]/accommodation → hotels/Airbnbs
/trips/[id]/transport     → flights/buses/trains
/trips/[id]/budget        → expenses + budget progress bar
/trips/[id]/documents     → passports/vouchers/links
/trips/[id]/packing       → checklist with templates
```

Each sub-page fetches its data client-side from the corresponding `/api/trips/[id]/<resource>` route. CRUD uses `POST` to create and `DELETE` with a JSON body containing the item ID.

The `PackingList` is created lazily on first item addition (`ensurePackingList` in the API route). Toggle checked state uses `PATCH`.
