import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export const configureSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication token required'));

    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch (_error) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('project:join', async (projectId) => {
      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: socket.user.id,
            projectId,
          },
        },
      });

      if (membership) {
        socket.join(`project:${projectId}`);
      }
    });

    socket.on('disconnect', () => {});
  });
};
