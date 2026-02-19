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

Do **not** change provider to `neon` (that is not a valid Prisma provider value).

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

## Common fix for `Environment variable not found: DATABASE_URL`
If Prisma shows:

`Environment variable not found: DATABASE_URL`

1. Ensure `backend/.env` exists.
2. Ensure it contains a valid `DATABASE_URL=...` line.
3. Run commands from the `backend/` directory.
4. Restart terminal / dev server after editing `.env`.

## Deployment (Render)
1. Create Render Web Service from `backend/`.
2. Set build command: `npm install && npx prisma generate`.
3. Set start command: `npm start`.
4. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`.
5. Run migrations in Render shell: `npx prisma migrate deploy`.
