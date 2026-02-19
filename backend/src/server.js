import http from 'http';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketServer } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import profileRoutes from './routes/profile.routes.js';
import adminRoutes from './routes/admin.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import automationRoutes from './routes/automation.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import templateRoutes from './routes/template.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import trashRoutes from './routes/trash.routes.js';
import { runDueDateAutomation } from './services/automation.service.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { sanitizeInput } from './middlewares/security.middleware.js';
import { configureSocket } from './sockets/index.js';
import { appEnv } from './config/env.js';

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: appEnv.FRONTEND_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

configureSocket(io);

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(
  cors({
    origin: appEnv.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(sanitizeInput);
app.use('/uploads', express.static('uploads'));
app.use('/reports', express.static('reports'));
app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'TaskFlow API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/bookmark', bookmarkRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/trash', trashRoutes);

app.use(errorHandler);

const PORT = appEnv.PORT;
setInterval(() => { runDueDateAutomation().catch(() => {}); }, 60 * 60 * 1000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
