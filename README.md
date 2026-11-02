# Cadence

Personal full-stack music catalog - browse top songs and artists, rate tracks, and add new songs/artists. Built to showcase clean API design, SQL modeling, and a polished React UI.

> Current app: Node.js + Express + MySQL + React. A full rebuild is planned in [`plan.md`](plan.md).  
> In-app features are also summarized on the **Home** page after login.

---

## Login Credentials

| Field    | Value   |
| -------- | ------- |
| Username | `admin` |
| Password | `admin` |

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 18, React Router, Material UI |
| Backend  | Node.js, Express                    |
| Database | MySQL (`spotify-db`)                |
| HTTP     | Axios                               |

---

## Features

- **Login** - gated access with demo credentials
- **Songs** - Top 10 by rating, artwork, release date, artists; rate 1–5 stars; See More / See Less
- **Artists** - Top 10 by average song rating; DOB and song list
- **Add New Song** - name, release date, artwork filename, multi-select artists
- **Add New Artist** - modal on the Add Song page (name, DOB, bio)
- **About Me** - developer details
- **Logout** - return to login

---

## Project Structure

```text
Spotify-Details-Beginner/
├── public/                 # CRA public assets
├── src/
│   ├── components/         # Login, Navbar, HomeProperties
│   ├── pages/              # Home, Songs, Artists, AddSong, AboutUs
│   ├── datas/              # Early mock JSON (songs / artists)
│   ├── styles/             # CSS
│   └── artwork/            # Song cover images (by filename)
├── songs-db/               # Express + MySQL backend
│   └── index.js
├── question.md             # Original DeltaX problem statement
├── features-status.md      # Present vs pending features
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (npm included)
- [MySQL](https://www.mysql.com/) running locally
- A MySQL schema named `spotify-db` (or change the name in config - see below)

---

## Database Setup

1. Create a MySQL schema (database), e.g. `spotify-db`.
2. Create tables for **artists** and **songs** (with fields matching the app: artist name / DOB / bio; song name / artists / date / image / ratings).
3. Open `songs-db/index.js` and update the connection pool:

```js
const db = mysql.createPool({
  host: "localhost",
  user: "root",        // ← change to your MySQL username
  password: "password", // ← change to your MySQL password
  database: "spotify-db", // ← change if you use another schema name
});
```

| Setting    | Default in code | What to do                          |
| ---------- | --------------- | ----------------------------------- |
| `user`     | `root`          | Change to your own MySQL username   |
| `password` | `password`      | Change to your personal password    |
| `database` | `spotify-db`    | Use this schema, or set your own name |

---

## Installation & Run

You need **two terminals** - frontend and backend.

### 1. Backend (`songs-db`)

```bash
cd songs-db
npm install
npm run devStart
```

Uses **nodemon** and listens on **http://localhost:3001**.

Or without nodemon:

```bash
npm start
```

### 2. Frontend (project root)

```bash
# from project root
npm install
npm start
```

Runs in development mode. Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## API Endpoints

Backend base URL: `http://localhost:3001`

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| `GET`  | `/get/songs`     | List all songs     |
| `GET`  | `/get/artists`   | List all artists   |
| `POST` | `/add/song`      | Add a new song     |
| `POST` | `/add/artist`    | Add a new artist   |
| `POST` | `/add/ratings`   | Update song rating |

---

## App Routes

| Path       | Page                                      |
| ---------- | ----------------------------------------- |
| `/`        | Login                                     |
| `/home`    | Home (feature overview)                   |
| `/songs`   | Songs list + ratings                      |
| `/artists` | Artists list                              |
| `/add`     | Add new song (and new artist via modal)   |
| `/about`   | About the developer                       |

---

## Artwork Tips

On **Add New Song**, the Artwork field expects a **filename with extension** (e.g. `cover.jpg`). Place the image file in `src/artwork/` so the Songs page can load it.

---

## Related Docs

- [`question.md`](question.md) - original DeltaX assignment brief  
- [`features-status.md`](features-status.md) - what’s implemented vs still pending  

---

## Author

**Mohammed Shahan**  
P. A. College of Engineering · USN: `4PA18CS064`
