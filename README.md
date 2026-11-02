# Cadence

Personal full-stack music catalog - rate songs, rank artists, add covers.

**Stack:** TypeScript monorepo · Vite + React (`apps/web`) · Express + Prisma MySQL / TiDB (`apps/api`) · Vercel + Render (deploy later)

## Repo layout

```text
apps/web   # Frontend (Vite + React + TS)
apps/api   # Backend (Express + Prisma + TS)
```

See [`TODO.md`](TODO.md) for the step-by-step checklist, [`AGENTS.md`](AGENTS.md) for conventions, and [`plan.md`](plan.md) for stack/API reference.

## Prerequisites

- Node.js 20+
- TiDB Cloud Starter connection string in `apps/api/.env` (`DATABASE_URL`)

## Setup

```bash
npm install
cp apps/api/.env.example apps/api/.env   # if needed; paste DATABASE_URL
cp apps/web/.env.example apps/web/.env   # optional; defaults to localhost:4000
```

Generate Prisma client (after `DATABASE_URL` is set):

```bash
npm run prisma:generate -w cadence-api
```

## Develop

```bash
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:5173
```

## Quality

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
```

Pre-commit (Husky → lint-staged): em-dash fix, ESLint `--fix`, Prettier on staged files.

## Catalog rules (current)

Uniqueness for artists/songs is enforced in the **API** (not locked as DB `UNIQUE` on business fields), so rules can change later without fighting the schema.

- **Artists:** current rule - name must not already exist (`409 ARTIST_NAME_TAKEN`). DOB is optional. Artists may exist with **zero** songs.
- **Songs:** current rule - at least one artist on create. Same title OK when the artist set differs. Same title + same artists (ids sorted then compared) → `409 SONG_DUPLICATE`.

Structural uniques that stay in the DB: `users.email`, `ratings (user_id, song_id)`, and M2M PK on `song_artists`.

## Coming soon / flexible identity

- **Lyrics:** song detail will show lyrics; the page already has a placeholder section.
- **Artist identity:** may move to name + DOB, and later fields such as nationality (or other attributes), without relying on today's name-only rule being baked into the database.
- **Song / artist coupling:** rules around whether creating an artist requires a song (or vice versa) can change in the API; the schema already allows artists without songs and songs with one or more artists.

## Docs

- [`question.md`](question.md) - product requirements
- [`features-status.md`](features-status.md) - feature gap list
- [`plan.md`](plan.md) - phases and checklist IDs
