# Cadence - Agent Guide

Instructions for AI coding agents and humans working in this repo.

**Cadence** is a personal full-stack music catalog: rate songs, rank artists, add covers. Portfolio-quality rebuild - not coursework.

**Sources of truth**

| Doc                                        | Use for                                                              |
| ------------------------------------------ | -------------------------------------------------------------------- |
| [`TODO.md`](TODO.md)                       | **Linear checklist** - IDs like **1.1.1** (primary day-to-day to-do) |
| [`plan.md`](plan.md)                       | Stack decisions, API tables, domain notes (reference, not the to-do) |
| [`question.md`](question.md)               | Product requirements                                                 |
| [`features-status.md`](features-status.md) | What’s Done / Partial / Pending                                      |
| [`AGENTS.md`](AGENTS.md)                   | How to work in the repo (this file)                                  |

When the user cites a checklist ID, open **`TODO.md`** first.

---

## Locked decisions (do not reopen unless asked)

| Topic         | Choice                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Name          | **Cadence**                                                                                             |
| Layout        | **Monorepo** - `apps/web` + `apps/api`                                                                  |
| Language      | **TypeScript strict**, **no `any`** - fully type-safe; no new plain `.js` / `.jsx` app code             |
| Frontend      | Vite + React + Tailwind + shadcn/ui + **Axios** + RHF + Zod + Sonner + React Router (no TanStack Query) |
| Backend       | Express + TypeScript (not Nest / Fastify)                                                               |
| ORM / DB      | **Prisma 7** + **MySQL** / TiDB (`provider = "mysql"`; URL in `prisma.config.ts` + `.env`)              |
| Auth          | JWT + bcrypt (name + email)                                                                             |
| Images        | ImageKit (signed upload from API; private key never on web)                                             |
| Hosting       | Web → **Vercel**; API → **Render**                                                                      |
| Lint / format | ESLint (incl. import order) + Prettier project-wide                                                     |
| Git hooks     | Husky pre-commit → lint-staged (fix staged files)                                                       |
| Not in scope  | TanStack Query, MongoDB, Next.js, Railway, GraphQL (unless Phase 4), Spotify player                     |

ImageKit / Render / Vercel cloud projects are **deferred until deploy-ready**. TiDB + local `DATABASE_URL` come first.

---

## Repo map (target)

```text
cadence/
├── apps/
│   ├── web/                 # Vite + React + TS → Vercel
│   └── api/                 # Express + Prisma + TS → Render
├── packages/
│   └── shared/              # Optional shared Zod / types
├── .github/workflows/       # ci.yml, telegram-notify.yml
├── .husky/                  # pre-commit → lint-staged
├── .cursor/rules/           # Cursor conventions
├── eslint-plugin-cadence/   # Local rules (e.g. no-em-dash)
├── scripts/                 # Repo tooling (e.g. fix-em-dash)
├── apps/api/.env            # Secrets - NEVER commit
├── apps/api/.env.example    # Safe template - commit OK
├── plan.md
├── question.md
├── features-status.md
├── AGENTS.md
└── README.md
```

**Current state:** Monorepo scaffold in place (`apps/web`, `apps/api`). Legacy CRA / `songs-db` removed. Implement features in `apps/` only.

---

## Environment variables

### API (`apps/api/.env`) - Render in production

| Variable                | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `DATABASE_URL`          | TiDB Cloud MySQL URL (`?sslaccept=strict`) |
| `JWT_SECRET`            | Sign/verify JWTs                           |
| `IMAGEKIT_PUBLIC_KEY`   | ImageKit                                   |
| `IMAGEKIT_PRIVATE_KEY`  | ImageKit - **API only**                    |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit CDN base                          |
| `CORS_ORIGIN`           | Allowed web origin (Vercel URL)            |
| `NODE_ENV`              | `development` / `production`               |
| `PORT`                  | API port (Render sets this)                |

### Web (`apps/web/.env`) - Vercel in production

| Variable       | Purpose             |
| -------------- | ------------------- |
| `VITE_API_URL` | Public API base URL |

### GitHub Actions (secrets - later)

| Secret               | Purpose       |
| -------------------- | ------------- |
| `TELEGRAM_BOT_TOKEN` | Deploy notify |
| `TELEGRAM_CHAT_ID`   | Deploy notify |

**Rules**

- Never commit `.env`, keys, tokens, or real `DATABASE_URL` passwords.
- Commit `.env.example` with empty/placeholder values only.
- ImageKit **private** key stays on the API / Render - never `VITE_*`.

---

## Scripts (root - after Phase 0)

Typical root scripts (adjust names if scaffold differs):

| Script                            | Meaning                    |
| --------------------------------- | -------------------------- |
| `npm run dev` / workspace filters | Run web and/or api         |
| `npm run lint`                    | ESLint                     |
| `npm run lint:fix`                | ESLint with `--fix`        |
| `npm run format` / `format:check` | Prettier                   |
| `npm run typecheck`               | `tsc --noEmit` (web + api) |
| `npm test`                        | Vitest (and API tests)     |
| `prepare`                         | Husky install              |

API-local (from `apps/api`): Prisma `migrate`, `generate`, `db seed` as documented in README after scaffold.

---

## Coding conventions

1. **TypeScript strict, no `any`** - typed handlers, props, Zod-inferred forms, Prisma types. Use `unknown` + narrow instead of `any`. No `as any`.
2. **Imports** - ordered/grouped (builtins → external → internal aliases → parent → sibling → styles); type-only imports where needed.
3. **No em dashes (`-`)** - use hyphen (`-`). Enforced by `cadence/no-em-dash` + `scripts/fix-em-dash.mjs` on commit.
4. **API** - routers + middleware; consistent JSON error shape; validate inputs with Zod.
5. **Web** - light/dark on every page; **mobile responsive** (phone → desktop); **skeleton loaders** while fetching (never circular spinners); empty / error states; toasts via Sonner.
6. **DB** - normalized schema (`users`, `artists`, `songs`, `song_artists`, `ratings`); no denormalized CSV artists or rating-on-song-row.
7. **Don’t** bypass pre-commit with `--no-verify` in normal workflow.
8. **Don’t** expand scope into plan §15 (out of scope) unless the user asks.

---

## Domain snapshot

```text
users          id, name, email unique, password_hash, created_at
artists        id, name, dob, bio, created_at
songs          id, name, release_date, cover_url, created_by_user_id, created_at
song_artists   song_id, artist_id (M2M)
ratings        user_id, song_id, value 1..5 decimals OK (unique per user+song)
```

Song average = `AVG(ratings.value)`. Artist average = documented rule in README / schema docs (song avgs or all ratings on their songs).

---

## Deploy map (when ready)

```text
Browser → Vercel (apps/web)
              ↓ VITE_API_URL
         Render (apps/api) → TiDB Cloud (MySQL)
                         ↘ ImageKit (signed uploads)
```

---

## How agents should work

1. Prefer checklist IDs from `plan.md` (§12 phases, §14 master list).
2. Match existing patterns once `apps/web` and `apps/api` exist; don’t invent a second stack.
3. Keep diffs focused - no drive-by refactors or unsolicited markdown docs.
4. After substantive edits, run lint/typecheck for touched packages when available.
5. Secrets: read `.env.example`, never paste real secrets into commits, README, or chat logs if avoidable.
6. Em-dash rule applies to docs and code strings alike.

---

## Phase pointer

See [`TODO.md`](TODO.md). Phase 0 is done. Next unchecked item starts Phase 1 at **1.1.1**.

## Cursor rules

| File                             | When                       |
| -------------------------------- | -------------------------- |
| `.cursor/rules/cadence-core.mdc` | Always                     |
| `.cursor/rules/express-api.mdc`  | `apps/api/**`              |
| `.cursor/rules/react-web.mdc`    | `apps/web/**`              |
| `.cursor/rules/prisma-db.mdc`    | Prisma schema / migrations |
| `.cursor/rules/testing.mdc`      | Tests                      |
