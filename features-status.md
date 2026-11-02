# Features Status - Present vs Pending

Comparison of the official DeltaX requirements in [`question.md`](question.md) against what this repository currently implements.

**Legend**

| Status | Meaning |
| ------ | ------- |
| Done | Present and working as required (or close enough) |
| Partial | Exists, but incomplete / not as specified |
| Pending | Missing / not done |

---

## 1. Entities

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| **Artist** - Name | Done | Stored as `artistsName` |
| **Artist** - DOB | Done | Stored as `dob` |
| **Artist** - Bio | Done | Stored as `bio`; collected in Add Artist modal |
| **Song** - Name | Done | Stored as `songsName` |
| **Song** - Date of Release | Done | Stored as `date` |
| **Song** - Cover (image) | Partial | Filename string saved; image loaded from `src/artwork/`. No real file upload |
| **User** - Name | Pending | No real User table/entity |
| **User** - Email | Pending | No email field or registration |

---

## 2. Relationships

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| Artist can sing multiple songs | Partial | Implied by CSV artist names on songs + frontend grouping; no proper DB link |
| Song can be sung by multiple artists | Partial | Multi-select UI exists; artists saved as comma-separated string, not a join table |
| Users can rate a song (1–5) | Partial | Star rating 1–5 exists, but rating is stored on the song row itself - not per user |

---

## 3. Home Screen (minimum requirements)

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| Top 10 Songs (by Avg Rating) on Home | Partial | Top 10 Songs exists on **`/songs`**, not on a combined Home listing screen |
| Show Cover, Name, Date of Release, Avg. Rating, all Artists | Done | Shown on Songs page |
| ‘New Song’ button | Done | Navbar → “Add New Song” |
| Allow users to rate the Song from this screen | Done | MUI `Rating` on Songs page; `POST /add/ratings` |
| Top 10 Artists (by Avg Rating of their Songs) on Home | Partial | Exists on **`/artists`**, not combined on Home |
| Artists show Name, DOB, Avg. Rating | Done | Artists page also shows their songs (extra) |

**Current Home (`/home`)** only shows a “Properties of This App” explainer - not the Top 10 lists the brief asks for.

---

## 4. Add New Song

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| Screen to add a new Song with necessary fields | Done | `/add` - name, date, artwork, artists |
| Select from existing Artists | Done | Multi-select dropdown from `GET /get/artists` |
| Add new Artist from same screen (Ajax) | Done | Modal + `POST /add/artist` via axios (Ajax equivalent) |
| Artist fields on modal: Name, DOB, Bio | Done | |

---

## 5. Database design (strongly emphasized)

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| Normalized schema / Normal Forms | Pending | Denormalized: artists as CSV on `songs`; rating column on `songs` |
| Join tables (e.g. `song_artists`) | Pending | Missing |
| Foreign keys | Pending | Missing |
| Separate `ratings` table (user + song + value) | Pending | Missing |
| `users` table | Pending | Missing |
| Complete DB scripts in repo | Pending | `schema-db.sql` only has a `SELECT`, not CREATE TABLE / seed scripts |

---

## 6. Auth & users

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| Real user registration / login (Name, Email) | Pending | Hardcoded `admin` / `admin` only |
| Rating tied to logged-in user | Pending | Anyone can change the single song rating |
| Avg rating across multiple users | Pending | Single stored rating, not an average of user ratings |

---

## 7. Validation & quality (hints / evaluation)

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| Form / API validations + note them in README | Pending | HTML `required` only; no documented validation rules |
| Well-structured UI | Done | React + Material UI, navbar, tables, form, modal |
| Functionally complete (vs brief) | Partial | Core flows exist; DB design + User + Home layout gaps remain |
| Coding standards | Partial | Works as a beginner project; APIs don’t always send proper responses |
| Regular commits reflecting progress | Unknown | Depends on git history on your remote |

---

## 8. Stack & “wow” tips

| Item | Status | Notes |
| ---- | ------ | ----- |
| Modern JS framework (React / Vue / Angular…) | Done | React 18 |
| Clean UI framework (Bootstrap suggested) | Done | Material UI used instead of Bootstrap |
| Docker | Pending | Optional “wow us” |
| GraphQL | Pending | Optional “wow us” |

---

## 9. Submission checklist

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| Code on GitHub / Bitbucket | Unknown | Confirm your remote |
| DB scripts committed | Pending | Incomplete |
| Screenshots in repository root | Pending | Not present |
| README with setup instructions | Partial | Basic README exists (login + MySQL config + `npm start`); thin |

---

## Summary

### Already there (present)

- Artist & Song fields (name, DOB/bio, release date, cover filename)
- Songs list with Top 10, ratings (1–5), artwork, artists, See More
- Artists list with Top 10 by average song rating, DOB, songs
- Add Song page + Add Artist modal (same screen, async API)
- React frontend + Express backend + MySQL
- Login gate (simplified), navbar, About Me page
- Basic README

### Yet to be done (pending / incomplete)

1. **User entity** - Name + Email, real register/login  
2. **Normalized DB** - `users`, `songs`, `artists`, `song_artists` join table, `ratings` table + foreign keys  
3. **True average rating** - multiple users rating a song; display avg  
4. **Combined Home screen** - Top 10 Songs + Top 10 Artists on one listing page (as in the mocks)  
5. **Proper cover image handling** - upload (or reliable image path), not only a filename string  
6. **Complete DB scripts** in the repo  
7. **Screenshots** in repo root  
8. **Documented validations** in README  
9. *(Optional)* Docker / GraphQL  

---

*Generated by comparing [`question.md`](question.md) with the current codebase (`src/`, `songs-db/`, `schema-db.sql`, `README.md`).*
