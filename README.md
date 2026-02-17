# RUOK Backend

Node.js/Express API backend for the RUOK app. Handles authentication, emotions, check-ins, tags (place, activity, people), profiles, self notes, and feedback. Uses MongoDB and runs on port 8000.

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, cookies, Google Auth
- **Other:** bcrypt, joi, node-cron, dotenv, cors, cookie-parser

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd RUOK-backend
npm install
```

### 2. Environment variables

Create a `.env` file in the project root with your config (e.g. database URL, JWT secret, Google OAuth):

```env
MONGODB_URI=mongodb://localhost:27017/ruok
JWT_SECRET=your-secret
```

### 3. Run locally

**Development (with nodemon):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server runs at **http://localhost:8000**.

## API Overview

| Path | Description |
|------|-------------|
| `/api/auth` | Authentication (login, register, Google, etc.) |
| `/api/emotion` | Emotion-related endpoints |
| `/api/checkin` | Check-in endpoints |
| `/api/placeTag` | Place tags |
| `/api/activityTag` | Activity tags |
| `/api/peopleTag` | People tags |
| `/api/profile` | User profile |
| `/api/selfNote` | Self notes |
| `/api/feedback` | Feedback |

CORS is configured for: `http://localhost:5173`, `https://ru-ok.vercel.app`, `https://ru-ok.in`.

## Docker

### Run with Docker Compose (app + MongoDB)

```bash
docker compose up --build
```

- **App:** http://localhost:8000
- **MongoDB:** localhost:27017

Services: `ruok_backend` (app), `ruok_db` (MongoDB). Environment variables are loaded from `.env` via `env_file` in `docker-compose.yml`.

### Build and push to Docker Hub

```bash
docker build -t tanishqsethi/ruok-backend:latest -f Dockerfile .
docker push tanishqsethi/ruok-backend:latest
```

If you built with Compose, tag the image first then push:

```bash
docker tag ruok-backend-app tanishqsethi/ruok-backend:latest
docker push tanishqsethi/ruok-backend:latest
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run production server (`node index.js`) |
| `npm run dev` | Run with nodemon |
| `npm test` | Placeholder (no tests specified) |

## Project structure

- `index.js` – App entry, routes, DB connection, cron jobs
- `routes/` – Auth, Emotion, CheckIn, PlaceTag, ActivityTag, PeopleTag, Profile, SelfNote, Feedback
- `models/` – Mongoose models
- `middleware/` – Auth and other middleware
- `utils/` – Database connection, cron jobs
