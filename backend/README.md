# TaskFlow Backend

Production-ready Express API for TaskFlow.

## Stack
- Node.js + Express
- Prisma ORM + PostgreSQL (Neon)
- JWT + bcrypt
- Zod validation
- Socket.io real-time events

## Important: Neon + Prisma provider
Neon is a **PostgreSQL** database. In Prisma, the datasource provider must stay:

```prisma
provider = "postgresql"
```

Do **not** change provider to `neon`.

## Setup
```bash
npm install
cp .env.example .env
# fill DATABASE_URL and JWT_SECRET in .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Windows setup
```bat
npm install
copy .env.example .env
REM Edit .env and set DATABASE_URL + JWT_SECRET
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Existing Neon DB / migration drift fix
If you see:

- `Drift detected...`
- `migration(s) are applied to the database but missing from the local migrations directory: 20260219130757_init`

use this flow (from `backend/`):

```bat
npx prisma generate
npx prisma migrate status
npx prisma migrate resolve --applied 20260219130757_init
npx prisma migrate dev
```

Notes:
- This repository now includes `prisma/migrations/20260219130757_init` so Prisma can match the migration history.
- Use `migrate dev` for local development. Use `migrate deploy` in production.
- Do **not** run `cd backend` if your prompt already is `...\backend>`.

## Environment
Copy `.env.example` to `.env` and fill values.

Required keys:
- `DATABASE_URL` (your Neon PostgreSQL URL)
- `JWT_SECRET`
- `PORT` (default: `5000`)
- `FRONTEND_URL` (default: `http://localhost:5173`)

## API Modules
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/projects/:projectId/members`
- `GET /api/tasks/project/:projectId?page=1&limit=10&status=TODO`
- `POST /api/tasks/project/:projectId`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

## Real-time
- Client emits: `project:join` with projectId
- Server emits: `task:created`, `task:updated`, `task:deleted` to room `project:<id>`

## Deployment (Render)
1. Create Render Web Service from `backend/`.
2. Set build command: `npm install && npx prisma generate`.
3. Set start command: `npm start`.
4. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`.
5. Run migrations in Render shell: `npx prisma migrate deploy`.
