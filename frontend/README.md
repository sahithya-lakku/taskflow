# TaskFlow Frontend

Enhanced SaaS-style frontend with analytics, reports, notifications, activity feed, and settings.

## Setup
```bash
npm install
npm run dev
npm run build
```

## New frontend pages
- `/dashboard` (analytics cards + charts)
- `/projects/:projectId` (kanban + live comments)
- `/activity` (project timeline)
- `/reports` (generate + download PDF/CSV)
- `/settings` (soft delete + invite regenerate)

## Added UI capabilities
- Recharts visual analytics
- jsPDF report download
- Notification bell + unread badge
- Dark mode toggle
- Better loading/error and polished styling

## Environment
Copy `.env.example` to `.env`.
