# TaskFlow Backend (Enterprise Extension)

This backend now extends TaskFlow into an enterprise collaboration platform while keeping the existing architecture.

## Major additions
- Advanced role system:
  - User roles: `USER`, `ADMIN`, `SUPER_ADMIN`
  - Project roles: `OWNER`, `ADMIN`, `EDITOR`, `MEMBER`, `VIEWER`
- Strict RBAC middleware for global and project scopes
- Profile service (with avatar upload via Cloudinary when configured)
- Extended statuses: `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`, `BLOCKED`
- Automation rules engine + scheduled due-date automation checks
- Calendar APIs
- Bookmark APIs
- Trash APIs (restore / force delete)
- Enterprise analytics endpoints
- Admin dashboard APIs + audit logs
- Project templates
- Gamification service (points/level/streak scaffolding)

## Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name enterprise_upgrade
npm run dev
```

## Migration notes (Neon)
If drift exists due to prior migration history:
```bash
npx prisma migrate status
npx prisma migrate resolve --applied 20260219130757_init
npx prisma migrate dev --name enterprise_upgrade
```

## Key new APIs
- `GET /api/profile`, `PUT /api/profile`, `PUT /api/profile/avatar`, `PUT /api/profile/password`, `DELETE /api/profile/account`
- `GET /api/admin/users`, `GET /api/admin/projects`, `GET /api/admin/tasks`
- `PATCH /api/admin/users/:userId/suspend`, `DELETE /api/admin/projects/:projectId/force`
- `GET /api/admin/analytics`, `GET /api/admin/audit-logs`
- `GET /api/calendar/tasks/calendar`, `PATCH /api/calendar/tasks/:taskId/reschedule`
- `GET/POST /api/automation/:projectId`
- `GET/POST/DELETE /api/bookmark`
- `GET /api/trash`, `POST /api/trash/restore`, `DELETE /api/trash/force-delete`
- `GET /api/analytics/workload`, `/completion-rate`, `/time-spent`, `/project-progress`
- `GET /api/templates`, `POST /api/templates/project/:projectId`, `POST /api/templates/:templateId/create`

## Cloudinary (optional)
Set these env vars to upload avatars to Cloudinary:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

If not set, avatar uploads fall back to local `uploads/`.
