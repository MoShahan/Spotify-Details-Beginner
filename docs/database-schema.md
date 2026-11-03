# Cadence - Database schema

Source of truth: `apps/api/prisma/schema.prisma` + migrations under `apps/api/prisma/migrations/`.

**Host:** MySQL-compatible **TiDB Cloud** (`provider = "mysql"`).  
**Live API:** [https://cadence-api-z3vh.onrender.com](https://cadence-api-z3vh.onrender.com)

## Tables

### `users`

| Column          | Type              | Notes        |
| --------------- | ----------------- | ------------ |
| `id`            | `VARCHAR(191)` PK | `cuid()`     |
| `name`          | `VARCHAR(100)`    | Display name |
| `email`         | `VARCHAR(255)`    | **UNIQUE**   |
| `password_hash` | `VARCHAR(255)`    | bcrypt       |
| `created_at`    | `DATETIME`        | default now  |

### `artists`

| Column       | Type              | Notes                               |
| ------------ | ----------------- | ----------------------------------- |
| `id`         | `VARCHAR(191)` PK | `cuid()`                            |
| `name`       | `VARCHAR(150)`    | Indexed; uniqueness enforced in API |
| `dob`        | `DATE`            | optional                            |
| `bio`        | `TEXT`            | optional                            |
| `image_url`  | `VARCHAR(2048)`   | optional (ImageKit or URL)          |
| `created_at` | `DATETIME`        | default now                         |

### `songs`

| Column               | Type                           | Notes                         |
| -------------------- | ------------------------------ | ----------------------------- |
| `id`                 | `VARCHAR(191)` PK              | `cuid()`                      |
| `name`               | `VARCHAR(200)`                 | indexed                       |
| `release_date`       | `DATE`                         | required; year derived in API |
| `album`              | `VARCHAR(200)`                 | optional; indexed             |
| `cover_url`          | `VARCHAR(2048)`                | optional                      |
| `created_by_user_id` | `VARCHAR(191)` FK → `users.id` | `ON DELETE RESTRICT`          |
| `created_at`         | `DATETIME`                     | default now                   |
| `updated_at`         | `DATETIME`                     | Prisma `@updatedAt`           |

Indexes: `created_by_user_id`, `name`, `release_date`, `album`.

### `song_artists`

| Column      | Type           | Notes                               |
| ----------- | -------------- | ----------------------------------- |
| `song_id`   | `VARCHAR(191)` | PK part; FK → `songs.id` Restrict   |
| `artist_id` | `VARCHAR(191)` | PK part; FK → `artists.id` Restrict |

Composite primary key `(song_id, artist_id)`. Index on `artist_id`.

### `ratings`

| Column       | Type                           | Notes             |
| ------------ | ------------------------------ | ----------------- |
| `id`         | `VARCHAR(191)` PK              | `cuid()`          |
| `user_id`    | `VARCHAR(191)` FK → `users.id` | Restrict          |
| `song_id`    | `VARCHAR(191)` FK → `songs.id` | Restrict          |
| `value`      | `DECIMAL(2,1)`                 | 1.0–5.0 (API Zod) |
| `created_at` | `DATETIME`                     | default now       |

**UNIQUE** `(user_id, song_id)`. Indexes on `song_id`, `user_id`.

## Foreign keys

All relation FKs use **`onDelete: Restrict`** (no cascade deletes of catalog data).

## Migrations & seed

```bash
npm exec -w cadence-api -- prisma migrate deploy
npm run prisma:seed -w cadence-api
```

Seed creates demo users (see README) plus catalog artists/songs/ratings and optional ImageKit-hosted images.

## Related docs

- [`erd.md`](erd.md) - diagram
- [`architecture.md`](architecture.md) - runtime topology
