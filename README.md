# TaskFlow

Full-stack SaaS collaboration platform (extended from baseline TaskFlow).

## Structure
- `backend/` Express + Prisma + Socket.io API
- `frontend/` React + Vite + Tailwind web app

## Quick start
### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name saas_upgrade
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## What's newly added
- Notifications, comments, attachments, time logs, tags, invite links
- Activity feed and analytics endpoints
- Report generation (JSON + CSV backend, PDF/CSV frontend downloads)
- Improved frontend pages and visuals
