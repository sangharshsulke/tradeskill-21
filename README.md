# TradeSkill — Exchange Skills Instead of Money

React (Vite) frontend + Express API + **MySQL** database.

```
src/       React app (views, components)
src/lib/api.ts   fetch wrapper used by the app for every CRUD call
server/    Express API (TypeScript, run with tsx)
  schema.sql     all tables
  seed.ts        creates the DB, tables and demo data
  routes/        auth, skills, people, sessions, requests, dashboard, support
```

## Setup

1. Have MySQL 8 running (Homebrew: `brew install mysql && brew services start mysql`).
2. Copy the env file and fill in your MySQL login:
   ```bash
   cp .env.example .env
   # edit DB_USER / DB_PASSWORD (and JWT_SECRET)
   ```
3. Install packages and create the database with demo data:
   ```bash
   npm install
   npm run db:setup
   ```
   `db:setup` drops and recreates the tables, so run it again any time you want a fresh demo DB.
4. Start API + frontend together:
   ```bash
   npm run dev
   ```
   Frontend: http://localhost:3000 · API: http://localhost:4000 (Vite proxies `/api` to it).

Demo login: **elena@tradeskill.dev / password123** (every seeded member uses `password123`, e.g. `kenji.takahashi@tradeskill.dev`, so you can log in as the other side of a request).

## Pages and CRUD

Home, About and Contact are public. Skills, People, Sessions and Dashboard ask you to log in first.

| Feature | Operation | Endpoint |
|---|---|---|
| Register / log in | Create / Read | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Browse & search skills | Read | `GET /api/skills?q=&category=`, `GET /api/skills/:id` |
| Add a skill listing (Quick List) | Create | `POST /api/skills` (`DELETE /api/skills/:id` for your own) |
| People list / profile / expertise | Read | `GET /api/people?q=`, `GET /api/people/:id` |
| Send exchange request ("Request Trade") | Create | `POST /api/requests` |
| Accept / reject exchange requests | Update | `PATCH /api/requests/:id/accept` · `/decline` |
| Schedule a session (Propose Swap) | Create | `POST /api/sessions` |
| My sessions / history / details | Read | `GET /api/sessions`, `GET /api/sessions/:id` |
| Accept / reject / reschedule / notes / cancel / complete | Update | `PATCH /api/sessions/:id/{accept,decline,reschedule,notes,cancel,complete}` |
| Rate learning partner | Create | `POST /api/sessions/:id/review` |
| Dashboard statistics + reviews | Read | `GET /api/dashboard` |
| My Teach/Learn skills | Create / Read / Update / Delete | `POST/GET /api/dashboard/skills`, `PUT /api/dashboard/skills/:id`, `PATCH …/:id/toggle`, `DELETE …/:id` |
| Availability toggle | Update | `PATCH /api/auth/me/availability` |
| Contact form | Create | `POST /api/support` |

All request/response bodies are JSON. Logged-in calls send `Authorization: Bearer <token>` (stored in `localStorage`).
