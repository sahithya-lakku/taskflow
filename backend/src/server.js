import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express from 'express';
import { Server as SocketServer } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
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

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
