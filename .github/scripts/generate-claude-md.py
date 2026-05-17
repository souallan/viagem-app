#!/usr/bin/env python3
"""
Generates CLAUDE.md from the actual project structure.
Runs in CI (GitHub Actions) on every push to main.
"""

import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent


# ── Helpers ────────────────────────────────────────────────────────────────

def read(path: str) -> str:
    try:
        return (ROOT / path).read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""


def scripts_table(pkg: dict) -> str:
    scripts = pkg.get("scripts", {})
    rows = []
    labels = {
        "dev": "Start dev server",
        "build": "Build for production",
        "db:generate": "Generate Prisma client",
        "db:push": "Sync schema → DB (needs `$env:DATABASE_URL`)",
        "db:migrate": "Run migrations",
        "db:studio": "Open Prisma Studio (needs `$env:DATABASE_URL`)",
        "lint": "Run ESLint",
    }
    for key, label in labels.items():
        if key in scripts:
            rows.append(f"| `npm run {key}` | {label} |")
    return "\n".join(rows)


def prisma_models(schema: str) -> list[str]:
    return re.findall(r"^model\s+(\w+)", schema, re.MULTILINE)


def api_routes(src: Path) -> list[str]:
    api_dir = src / "app" / "api"
    routes = []
    for f in sorted(api_dir.rglob("route.ts")):
        rel = f.relative_to(src / "app" / "api")
        methods = re.findall(r"^export async function (GET|POST|PUT|PATCH|DELETE)",
                             f.read_text(encoding="utf-8"), re.MULTILINE)
        route_path = "/" + str(rel.parent).replace("\\", "/")
        routes.append(f"`{route_path}` — {', '.join(sorted(set(methods)))}")
    return routes


def app_pages(src: Path) -> list[str]:
    app_dir = src / "app"
    pages = []
    for f in sorted(app_dir.rglob("page.tsx")):
        rel = f.relative_to(app_dir)
        # Normalize Windows backslashes first, then strip route groups like (app)/
        path_str = str(rel.parent).replace("\\", "/")
        clean = re.sub(r"\([^)]+\)/", "", path_str).strip("/")
        pages.append("/" if not clean or clean == "." else "/" + clean)
    return sorted(set(pages))


def ui_components(src: Path) -> list[str]:
    ui_dir = src / "components" / "ui"
    return sorted(f.stem for f in ui_dir.glob("*.tsx")) if ui_dir.exists() else []


def dep_version(pkg: dict, name: str) -> str:
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    v = deps.get(name, "")
    return v.lstrip("^~") if v else "?"


# ── Build CLAUDE.md ────────────────────────────────────────────────────────

def generate() -> str:
    pkg = json.loads(read("package.json") or "{}")
    schema = read("prisma/schema.prisma")
    src = ROOT / "src"

    models = prisma_models(schema)
    routes = api_routes(src)
    pages = app_pages(src)
    components = ui_components(src)

    next_ver = dep_version(pkg, "next")
    auth_ver = dep_version(pkg, "next-auth")
    prisma_ver = dep_version(pkg, "@prisma/client")

    # detect string-enum fields in schema
    string_enums = re.findall(r"//\s*(.*?values:.*)", schema)

    return f"""\
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Next.js {next_ver}** (App Router, TypeScript)
- **next-auth {auth_ver}** — JWT strategy + Credentials provider
- **Prisma {prisma_ver}** — SQLite (`prisma/dev.db`)
- **Tailwind CSS** + custom shadcn-compatible UI components (no CLI)

## Commands

> Node.js is installed via **Scoop** on Windows. If `node`/`npm` are not in PATH:
> ```powershell
> $env:PATH = "$env:USERPROFILE\\scoop\\shims;$env:USERPROFILE\\scoop\\apps\\nodejs-lts\\current;$env:PATH"
> ```
> Prisma CLI needs `$env:DATABASE_URL = "file:./dev.db"` when run directly.

| Command | Description |
|---------|-------------|
{scripts_table(pkg)}
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

`auth.ts` (project root) is the canonical next-auth config exporting `{{ handlers, signIn, signOut, auth }}`.
`src/lib/auth.ts` re-exports it so `@/lib/auth` works inside `src/` (since `@/*` → `src/*`).

- Passwords hashed with **bcryptjs** (12 rounds).
- `session.user.id` injected via `jwt`/`session` callbacks (not included by default in v5).

### Database — Prisma Models

{'| Model | Notes |' if models else ''}
{'|-------|-------|' if models else ''}
{chr(10).join(f'| `{m}` | |' for m in models)}

**SQLite does not support Prisma enums.** All enum-like fields are stored as `String`.
Valid values are documented in comments above each model in `prisma/schema.prisma`.
Label/color helpers live in `src/lib/utils.ts`: `tripStatusLabel`, `tripStatusColor`, `activityTypeLabel`, `expenseCategoryLabel`.

### API Routes

Every route verifies ownership before acting:
```ts
const session = await auth();
if (!session?.user?.id) return 401;
const trip = await prisma.trip.findFirst({{ where: {{ id, userId: session.user.id }} }});
if (!trip) return 404;
```

`params` must be **awaited** (Next.js 15 dynamic segments are `Promise<{{id: string}}>`).

Registered routes:
{chr(10).join(f'- {r}' for r in routes)}

### Pages

{chr(10).join(f'- `{p}`' for p in pages)}

Each trip sub-page fetches data client-side from its API route.
`DELETE` requests send the item ID in the **JSON body** (not URL params).
`PackingList` is created lazily on first item addition (`ensurePackingList` in the API route).
Packing item toggle uses `PATCH {{ itemId, isPacked }}`.

### UI Components

Custom components in `src/components/ui/` — hand-written, shadcn-compatible API, **no Radix UI**.
Available: {', '.join(f'`{c}`' for c in components)}.

`Dialog` uses a backdrop + `Escape` key handler (no Radix).
`cn()` in `src/lib/utils.ts` combines clsx + tailwind-merge.
"""


if __name__ == "__main__":
    content = generate()
    out = ROOT / "CLAUDE.md"
    out.write_text(content, encoding="utf-8")
    print(f"Written {len(content)} chars to {out}")
