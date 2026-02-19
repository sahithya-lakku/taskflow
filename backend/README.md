# TaskFlow Backend

Production-grade backend for TaskFlow SaaS collaboration.

## New capabilities added
- Soft delete for projects/tasks (`deletedAt`)
- Hard delete project endpoint (admin-level)
- Comments + real-time comment events
- Attachments upload via Multer
- Notifications table + socket notifications
- Time logs + task time aggregation
- Tags and task-tag mapping
- Project activity feed
- Invite token generation/join
- Analytics and report generation APIs
- Helmet + rate limiting + request sanitization
- Access token + refresh token flow with token blacklist model

## Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name saas_upgrade
npm run dev
```

## Migration instructions (important)
If your Neon DB already has prior migrations:
```bash
npx prisma migrate status
npx prisma migrate resolve --applied 20260219130757_init
npx prisma migrate dev --name saas_upgrade
```

## New API list
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/projects/:projectId/members`
- `DELETE /api/projects/:projectId` (soft)
- `DELETE /api/projects/:projectId/hard` (hard)
- `POST /api/projects/:projectId/invites`
- `POST /api/projects/join`
- `GET /api/projects/:projectId/activity`
- `GET /api/projects/:projectId/analytics`
- `GET /api/projects/:projectId/report`

### Tasks
- `GET /api/tasks/project/:projectId?page=1&limit=10&status=TODO&tagId=`
- `POST /api/tasks/project/:projectId`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId` (soft)
- `GET /api/tasks/:taskId/comments`
- `POST /api/tasks/:taskId/comments`
- `POST /api/tasks/:taskId/attachments` (multipart/form-data, key: `file`)
- `POST /api/tasks/tags`
- `POST /api/tasks/:taskId/tags`
- `POST /api/tasks/:taskId/time-logs`
- `GET /api/tasks/:taskId/time-logs/summary`

### Notifications
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

## Real-time events
- `task:created`, `task:updated`, `task:deleted`
- `comment:created`
- `notification:new`
