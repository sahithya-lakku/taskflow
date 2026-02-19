# TaskFlow Frontend

React + Vite + Tailwind front-end for TaskFlow.

## Setup
```bash
npm install
npm run dev
npm run build
```

## Environment
Copy `.env.example` to `.env`.

- `VITE_API_BASE_URL` e.g. `http://localhost:5000/api`
- `VITE_SOCKET_URL` e.g. `http://localhost:5000`

## Features
- Auth pages (register/login)
- Protected routes
- Dashboard + project list
- Project task board with TODO / IN_PROGRESS / DONE columns
- Real-time task updates with Socket.io

## Deployment (Vercel)
1. Import `frontend/` project into Vercel.
2. Set `VITE_API_BASE_URL` and `VITE_SOCKET_URL`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
