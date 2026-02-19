# TaskFlow Enterprise

TaskFlow has been extended into a production-oriented enterprise collaboration platform while preserving the modular architecture.

## Backend additions
- Advanced global/project RBAC and strict guards
- Profile service and account controls
- Automation rules, calendar service, bookmarks, trash restore
- Admin APIs (users/projects/tasks/audit/analytics)
- Platform analytics endpoints
- Project templates and gamification scaffolding

## Frontend additions
- Admin dashboard
- Profile page
- Automation page
- Calendar page
- Bookmarks page
- Trash page
- Colorful multi-status drag-and-drop kanban
- Multi-theme support (light/dark/auto)

## Run
### Backend
```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name enterprise_upgrade
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
