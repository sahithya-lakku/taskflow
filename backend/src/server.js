import 'dotenv/config';
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
import { errorHandler } from './middlewares/error.middleware.js';
import { sanitizeInput } from './middlewares/security.middleware.js';
import { configureSocket } from './sockets/index.js';

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

configureSocket(io);

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
