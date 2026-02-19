# TaskFlow Backend

Production-ready Express API for TaskFlow.

## Stack
- Node.js + Express
- Prisma ORM + PostgreSQL (Neon)
- JWT + bcrypt
- Zod validation
- Socket.io real-time events

## Setup
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Environment
Copy `.env.example` to `.env` and fill values.

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
