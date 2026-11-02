# Cadence — Project Plan

**Cadence** is a personal full-stack music catalog app built to showcase production-quality skills: normalized SQL design, Express APIs, modern React UI, auth, ratings, image uploads, CI, and cloud deploy.

This plan rebuilds the current codebase into a complete, professional product using [`question.md`](question.md) as the **product requirements** source and [`features-status.md`](features-status.md) as the gap list — framed as a portfolio app, not coursework.

**Status:** Planning. Name locked: **Cadence**. Ready for Phase 0 after DB hosting choice in §2.1 is confirmed.

---

## 1. Brand

| Item | Value |
| ---- | ----- |
| **Name** | Cadence |
| **Tagline (draft)** | Rate the rhythm. Rank the artists. |
| **Repos / packages** | `cadence`, `cadence-web`, `cadence-api` |
| **Hosts** | Vercel project `cadence`, Render service `cadence-api` |

Rename package titles, HTML `<title>`, logos, and README to **Cadence** during Phase 0.

---

## 2. Tech stack

### Decision: Vite + React + Express + SQL — **TypeScript everywhere**

**Hard requirement:** Cadence is a **TypeScript** project end-to-end. No new app code in plain `.js` / `.jsx`.

| Layer | Choice | Why |
| ----- | ------ | --- |
| Language | **TypeScript (strict)** | Frontend + backend + shared types; `tsc --noEmit` in CI |
| Frontend | **React + TypeScript + Vite** | `.tsx` components; typed hooks, props, API clients |
| Why not Next | — | Keeps Express as the real backend on Render |
| UI | **Tailwind CSS + shadcn/ui** | Polished dark / light themes |
| Theme | Class-based light/dark toggle | Every page |
| Data fetching | **TanStack Query** | Caching, errors, retries; typed query keys / responses |
| Forms | **React Hook Form + Zod** | Infer form types from Zod (`z.infer<>`) |
| Toasts | **Sonner** | Success / error feedback |
| Routing | **React Router** | Auth + home + add song |
| Backend | **Express + TypeScript** | Typed req/res via middleware; no Nest/Fastify/etc. |
| Shared types | **`packages/shared` (optional)** or Zod schemas imported by API + web | One source of truth for DTOs |
| ORM | **Prisma** | Generated TS client + migrations; MySQL or Postgres |
| Database | **SQL (see §2.1)** | Normalized schema, join tables, FKs — not Mongo |
| Auth | **JWT + bcrypt** | User name + email |
| Images | **ImageKit** | Covers / CDN (no DIY S3) |
| Frontend host | **Vercel** | |
| Backend host | **Render** (Web Service) | |
| Lint | **ESLint** (flat config) + **import order / grouping** | Enforce import groups project-wide |
| Format | **Prettier** | Single style for the entire monorepo |
| Git hooks | **Husky** + **lint-staged** | Pre-commit: lint + auto-fix staged files |
| CI | **GitHub Actions** | Lint + typecheck + tests |
| Notify | **Telegram** via GitHub Action | On Vercel production deploy |

### 2.1 Database: MySQL vs Postgres vs Mongo — and how to host MySQL

| Option | Fit for Cadence? | “Atlas-like” free host? | Verdict |
| ------ | ---------------- | ----------------------- | ------- |
| **MySQL** | Excellent for relational design | Weaker than Atlas/Neon — see below | Good if you want MySQL on the resume |
| **PostgreSQL** | Excellent (same model) | **Neon** — closest to Atlas DX | Best *deploy* experience |
| **MongoDB** | Weak for M2M + FKs + averages | Atlas | **Skip** for Cadence |

**Mongo Atlas** = managed DB, no server for you.  
**Neon** = same idea for **Postgres**.  
**MySQL** has **no single dominant free serverless twin** as polished as Atlas/Neon. You still need a managed MySQL provider (or a MySQL-*compatible* serverless).

#### MySQL hosting options (no Railway)

| Provider | Notes |
| -------- | ----- |
| **TiDB Cloud Serverless** | MySQL-compatible protocol; has a free/serverless tier; strong “connect string and go” story |
| **Aiven for MySQL** | Managed MySQL; free trial / credits then paid — solid for demos |
| **Oracle Cloud Always Free** | Can run MySQL; more setup than Neon |
| **DigitalOcean / AWS RDS / Azure MySQL** | Paid managed MySQL — fine if you budget for it |
| **db4free / hobby free MySQL sites** | OK for toys; unreliable for a portfolio URL — avoid |
| **Local MySQL only** | Great for dev; production API on Render still needs a reachable cloud DB |

You said you **don’t use Railway** — plan does **not** depend on it.

#### Practical recommendation for Cadence

Pick one:

1. **Stay on MySQL for learning continuity**  
   - Dev: local MySQL  
   - Prod: **TiDB Serverless** (or Aiven if you take a trial)  
   - Express + Prisma `provider = "mysql"`  

2. **Use Neon Postgres for deploy ease (recommended if hosting friction matters)**  
   - Same Express code, same Prisma models (swap `provider` + connection string)  
   - Neon ≈ Atlas for SQL  
   - You are **not** learning a new backend — still Express; SQL skills transfer  

**Not recommended:** MongoDB — wrong data model for users ↔ ratings ↔ songs ↔ artists with averages and FKs.

**Action:** Confirm **(1) MySQL + TiDB/Aiven** or **(2) Neon Postgres** before Phase 1 migrations.

### Monorepo layout (target)

```text
cadence/
├── apps/
│   ├── web/                 # Vite + React → Vercel
│   └── api/                 # Express + Prisma → Render
├── packages/
│   └── shared/              # Shared Zod / types (optional)
├── .github/workflows/
│   ├── ci.yml
│   └── telegram-notify.yml
├── .husky/
│   └── pre-commit            # lint-staged
├── eslint.config.js          # root flat config (or per-package)
├── .prettierrc / .prettierignore
├── AGENTS.md
├── .cursor/rules/
├── question.md              # Product requirements
├── features-status.md
├── plan.md
└── README.md
```

*(Alternative: `/client` + `/server` — same stack.)*

### 2.2 Linting, formatting & pre-commit (project-wide)

**Hard requirement:** The entire Cadence monorepo follows one ESLint + Prettier standard. New code must pass lint/format locally (via hooks) and in CI.

#### ESLint — import ordering & grouping

Use ESLint (flat config) with an import plugin (e.g. `eslint-plugin-import` and/or `@typescript-eslint` + a dedicated order rule such as `simple-import-sort` or `import/order`).

**Required import groups** (blank line between groups), applied to **all** `apps/` and `packages/`:

1. Node / built-ins (`node:`, `fs`, `path`, …)  
2. External packages (`react`, `express`, `@tanstack/…`, …)  
3. Internal / shared aliases (`@cadence/shared`, `@/…`)  
4. Relative parent imports (`../…`)  
5. Relative sibling / same-folder imports (`./…`)  
6. Side-effect / style imports (`*.css`, etc.) last  

Also enforce: no unused imports, consistent type-only imports (`import type { … }`), and TypeScript-aware linting for `.ts` / `.tsx`.

#### Prettier — entire project

- One root **Prettier** config (`.prettierrc`) + `.prettierignore` (e.g. `dist`, `coverage`, Prisma generate output, lockfiles).  
- Same print width, quotes, semicolons, trailing commas for **web + api + shared**.  
- Wire `eslint-config-prettier` so ESLint never fights Prettier.  
- Scripts: `format` / `format:check` at the repo root; CI runs `format:check`.

#### Husky + lint-staged (pre-commit)

Whenever something is committed:

1. **Husky** `pre-commit` hook runs **lint-staged**.  
2. **lint-staged** runs only on **staged** files:  
   - ESLint with `--fix` (auto-fix lint issues where safe)  
   - Prettier `--write` (reformat)  
3. Fixed files are re-staged so the commit includes the cleaned result.  
4. If remaining errors are not auto-fixable, the commit **fails** until the developer fixes them.

Root `package.json` sketch:

```json
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css,yml,yaml}": ["prettier --write"]
  }
}
```

Install/setup in Phase 0: `husky`, `lint-staged`, `eslint`, Prettier, import-order plugin, `eslint-config-prettier`. Document the hook in `AGENTS.md` (don’t bypass with `--no-verify` in normal workflow).

---

## 3. Deployment & secrets

| Service | Role | Env |
| ------- | ---- | --- |
| **SQL host** (TiDB / Aiven / Neon) | Database | `DATABASE_URL` |
| **Render** | Express API | `DATABASE_URL`, `JWT_SECRET`, `IMAGEKIT_*`, `CORS_ORIGIN`, `NODE_ENV`, `PORT` |
| **Vercel** | Frontend | `VITE_API_URL` |
| **ImageKit** | Covers | Public key + URL endpoint (FE); **private key only on API** |
| **GitHub Secrets** | CI + Telegram | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, CI `DATABASE_URL` if needed |

### ImageKit

1. User picks cover on Add Song.  
2. Signed upload via ImageKit (auth from Express).  
3. Store `cover_url` / file id on `songs`.  
4. Listings use ImageKit thumbnails.

### Telegram notify

Workflow `.github/workflows/telegram-notify.yml`:

- On Vercel production `deployment_status` = success  
- Message: `✅ Cadence deployed — <url>` (+ commit SHA)  
- Secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (bot already ready)  
- Test once with `workflow_dispatch`

---

## 4. MCP / Cursor setup (before coding)

| Tool | Purpose |
| ---- | ------- |
| GitHub / `gh` | PRs, Actions |
| DB dashboard (TiDB / Aiven / Neon) | Schema & SQL |
| Vercel MCP / CLI | Frontend deploy |
| Render dashboard | API service + env |
| ImageKit dashboard | Keys, folders |
| Browser MCP | Visual QA (themes) |

**AI guidance files — yes:**

| File | Purpose |
| ---- | ------- |
| `AGENTS.md` | Repo map, scripts, env names, never commit secrets |
| `.cursor/rules/*.mdc` | Express, React/UI, Prisma, testing conventions |
| Optional skill | Only if you want a reusable “Cadence feature” skill |

**4.1 Pre-start checklist**

- [ ] **4.1.1** `AGENTS.md` + Cursor rules  
- [ ] **4.1.2** Auth MCPs / CLIs as needed  
- [ ] **4.1.3** Create **Cadence** projects: ImageKit, Render, Vercel, SQL host  
- [ ] **4.1.4** Decide monorepo vs client/server  
- [ ] **4.1.5** Lock DB choice: MySQL host **or** Neon  

---

## 5. Branding assets

| Asset | Notes |
| ----- | ----- |
| Logo (SVG + PNG) | Light + dark friendly; `apps/web/public/` |
| Favicons | `favicon.ico`, 32px, apple-touch-icon |
| OG image | 1200×630 for previews / README |
| Cover placeholder | Empty-state artwork |
| Color system | CSS variables; music-catalog look (e.g. ink + lime, or charcoal + amber) — avoid generic purple AI UI |

---

## 6. Domain model (normalized)

```text
users          (id, name, email unique, password_hash, created_at)
artists        (id, name, dob, bio, created_at)
songs          (id, name, release_date, cover_url, created_by_user_id, created_at)
song_artists   (song_id, artist_id)  UNIQUE + FKs CASCADE
ratings        (id, user_id, song_id, value 1..5, UNIQUE(user_id, song_id), FKs)
```

- Song avg = `AVG(ratings.value)`  
- Artist avg = documented rule (avg of song avgs **or** avg of all ratings on their songs)  
- Ship Prisma schema + migrations + seed in the repo  

---

## 7. Features — build / revamp / quality

### A. Must build (gaps)

| # | Feature |
| - | ------- |
| A1 | Register / login (name, email) — replace hardcoded admin |
| A2 | Normalized DB + FKs + `song_artists` |
| A3 | Per-user ratings 1–5 + true averages |
| A4 | **Home**: Top 10 Songs + Top 10 Artists + rate + New Song |
| A5 | ImageKit covers |
| A6 | Migrations + seed in repo |
| A7 | Screenshots in repo root |
| A8 | Validations documented in README |

### B. Revamp existing ideas

| # | Feature | Goal |
| - | ------- | ---- |
| B1 | Songs / rate | Professional cards/table, optimistic UI, toasts |
| B2 | Artists | Name, DOB, avg; optional bio |
| B3 | Add Song + Add Artist modal | ImageKit, multi-select, Zod, Ajax refresh |
| B4 | Shell / nav | Cadence logo, theme toggle, auth-aware CTA |
| B5 | Auth pages | Real login + register, clear errors |
| B6 | About / profile | Optional polished page |
| B7 | README | Cadence stack, env, deploy, validations |
| B8 | Express API | TS, routers, middleware, consistent JSON errors |

### C. UX quality

- Dark + light on every page  
- Toasts + descriptive errors  
- Loading / empty / error states  
- Responsive + basic a11y  

### D. Stretch

- Docker Compose (local API + DB)  
- Search on Home  
- GraphQL — skip unless spare time  

---

## 8. API surface

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| `POST` | `/auth/register` | No | Name, email, password |
| `POST` | `/auth/login` | No | → JWT |
| `GET`  | `/auth/me` | Yes | Current user |
| `GET`  | `/songs/top` | Yes* | Top 10 by avg |
| `GET`  | `/songs` | Yes* | All songs |
| `POST` | `/songs` | Yes | Create + artists + cover |
| `GET`  | `/artists/top` | Yes* | Top 10 by avg |
| `GET`  | `/artists` | Yes* | Dropdown |
| `POST` | `/artists` | Yes | Create from Add Song |
| `POST` | `/songs/:id/ratings` | Yes | Upsert 1–5 |
| `POST` | `/uploads/imagekit-auth` | Yes | Signed upload |

\*Prefer auth-required catalog unless you want public browse.

---

## 9. Frontend routes

| Route | Page |
| ----- | ---- |
| `/login`, `/register` | Auth |
| `/` | Home — Top 10 songs + artists, rate, New Song |
| `/songs/new` | Add Song (+ Add Artist dialog) |
| `/artists` | Optional full list |
| `/about` | Optional |
| Header | Cadence brand + theme toggle + logout |

---

## 10. Testing

| Area | Tools |
| ---- | ----- |
| Unit | Vitest |
| API | Supertest + Vitest (+ CI database URL) |
| UI | Vitest + Testing Library |
| E2E (later) | Playwright |
| Lint / format | ESLint (incl. **import order/grouping**) + **Prettier** project-wide |
| Git hooks | **Husky** pre-commit → **lint-staged** (`eslint --fix` + Prettier on staged files) |
| Types | `tsc --noEmit` |

**Coverage targets:** auth, artists, songs, ratings averages/upserts, ImageKit auth gate, Home smoke, theme toggle, toast on success paths.

---

## 11. GitHub Actions

### `ci.yml`

On PR + push to `main`: install → **lint** → **format:check (Prettier)** → typecheck → test → (optional) build. Fail on any step. Pre-commit hooks do not replace CI — CI still enforces ESLint import rules + Prettier on the full tree.

### `telegram-notify.yml`

Vercel production deploy success → Telegram. Secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

---

## 12. Phases

### Phase 0 — Prep

1. Brand everything **Cadence**  
2. Confirm DB host (TiDB/Aiven MySQL **or** Neon)  
3. Create Render + Vercel + ImageKit + DB projects  
4. `AGENTS.md` + Cursor rules  
5. Scaffold Vite/React **TypeScript** + Express **TypeScript** + Prisma (`strict: true` in both `tsconfig`s)  
6. **Lint/format toolchain (project-wide):** ESLint flat config with **import order + grouping**, Prettier root config + `eslint-config-prettier`, root scripts `lint` / `format` / `format:check`  
7. **Husky + lint-staged:** `prepare` script, `.husky/pre-commit` → lint-staged; staged `*.{ts,tsx,js,jsx}` get `eslint --fix` + `prettier --write`; other staged text files get Prettier  
8. CI stubs: lint + Prettier check + **`tsc --noEmit`** + tests + `.env.example`  
9. Document lint/format/hooks in `AGENTS.md`  

### Phase 1 — API

Schema → auth → artists/songs/ratings → ImageKit → API tests  

### Phase 2 — Web

Theme → auth → Home → Add Song/Artist → toasts/errors → logo/favicons  

### Phase 3 — Ship

1. Deploy API → Render; Web → Vercel  
2. CORS + production env  
3. Telegram notify workflow  
4. Screenshots in repo root  
5. **Final documentation pack** (see §13) — ERD, schema doc, architecture doc  
6. **Rewrite README** for Cadence (setup, env, deploy, validations, links to docs)  
7. Refresh `features-status.md` to all Done  

### Phase 4 — Stretch

Docker / Playwright / search  

---

## 13. Final documentation (when the project is finished)

Create these **after** features, tests, and deploy are stable — so diagrams match the real system. Link all of them from the final README.

| File | Purpose | Suggested format |
| ---- | ------- | ---------------- |
| **`docs/erd.md`** (or `docs/erd.mmd`) | Entity-Relationship Diagram — users, artists, songs, song_artists, ratings + cardinalities | Mermaid `erDiagram` in Markdown (renders on GitHub); optional PNG export in `docs/assets/` |
| **`docs/database-schema.md`** | Human-readable schema: tables, columns, types, PK/FK, indexes, unique constraints, rating rules | Markdown tables + notes; keep in sync with Prisma / SQL migrations |
| **`docs/architecture.md`** | System architecture: Vite web → Express API → SQL DB; ImageKit; Vercel / Render; auth flow; CI / Telegram | Mermaid flowchart + short prose |
| **`README.md`** | Full rewrite for Cadence | Install, env vars, scripts, demo login, validations, deploy map, **links to the three docs above** |

### 13.1 README update checklist (end of Phase 3)

- [ ] **13.1.1** Project name **Cadence** + short description (personal portfolio app)  
- [ ] **13.1.2** Tech stack table (TS, Vite, React, Express, Prisma, SQL host, ImageKit, Vercel, Render)  
- [ ] **13.1.3** Local setup (web + api + DB)  
- [ ] **13.1.4** Environment variables (no secrets committed)  
- [ ] **13.1.5** Demo credentials (if any)  
- [ ] **13.1.6** Documented validation rules  
- [ ] **13.1.7** Links: `docs/erd.md`, `docs/database-schema.md`, `docs/architecture.md`  
- [ ] **13.1.8** Links: `question.md` (product requirements), `features-status.md`  
- [ ] **13.1.9** Screenshots  
- [ ] **13.1.10** CI / deploy / Telegram notes (high level)  

### When to generate ERD / schema / architecture

- **Draft** optional after Phase 1 (schema locked).  
- **Finalize** in Phase 3 once API + deploy match production.  
- Re-export if schema changes after that.

---

## 14. Master checklist

Use IDs when talking to the AI (e.g. “do **14.2.3**” or “why is **14.1.2** not done?”).

### 14.1 Pre-start

- [x] **14.1.1** Project name: **Cadence**  
- [ ] **14.1.2** Confirm SQL host: MySQL (TiDB/Aiven) **or** Neon Postgres  
- [ ] **14.1.3** Stack confirmed: **TypeScript (strict)** on web + API, Vite+React, Express, Prisma, ImageKit, Vercel, Render  
- [ ] **14.1.4** ESLint import order/grouping + Prettier project-wide  
- [ ] **14.1.5** Husky pre-commit → lint-staged (auto-fix staged files)  
- [ ] **14.1.6** `AGENTS.md` + rules  
- [ ] **14.1.7** Cloud projects + GitHub secrets placeholders  

### 14.2 Product

- [ ] **14.2.1** Normalized schema + seed  
- [ ] **14.2.2** Users + auth  
- [ ] **14.2.3** M2M song↔artist  
- [ ] **14.2.4** Per-user ratings + averages  
- [ ] **14.2.5** Home Top 10s + rate + New Song  
- [ ] **14.2.6** Add Song + Ajax Add Artist  
- [ ] **14.2.7** ImageKit  
- [ ] **14.2.8** Validations documented  
- [ ] **14.2.9** Screenshots  

### 14.3 Quality & deploy

- [ ] **14.3.1** Dark / light, toasts, structure, tests, CI, Telegram  
- [ ] **14.3.2** ESLint + Prettier clean in CI; Husky/lint-staged on commit  
- [ ] **14.3.3** Logo / favicons  
- [ ] **14.3.4** SQL host ↔ Render ↔ Vercel live  

### 14.4 Docs (finish line)

- [ ] **14.4.1** `docs/erd.md` — ERD diagram  
- [ ] **14.4.2** `docs/database-schema.md` — full schema reference  
- [ ] **14.4.3** `docs/architecture.md` — project architecture  
- [ ] **14.4.4** Final **README** rewrite with links to those docs  
- [ ] **14.4.5** `features-status.md` marked complete 

---

## 15. Out of scope (for now)

- Spotify Web API / real audio player  
- Native mobile  
- GraphQL (unless Phase 4)  
- Keeping CRA + denormalized schema as-is  

---

## 16. Immediate next step

1. **You:** Choose DB path — **MySQL via TiDB/Aiven** or **Neon Postgres** (Express either way).  
2. **Then:** Phase 0 scaffold for **Cadence**.  
3. **At the end:** ERD + database schema + architecture docs + full README update (§13).

---

*Refs: [`question.md`](question.md) · [`features-status.md`](features-status.md) · [`README.md`](README.md)*
