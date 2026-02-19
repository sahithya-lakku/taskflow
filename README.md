# TaskFlow

Full-stack production-ready task management app.

## Monorepo Structure
```
taskflow/
├── frontend/
└── backend/
```

## Backend quickstart
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Frontend quickstart
```bash
cd frontend
npm install
npm run dev
npm run build
```
