import { prisma } from '../config/prisma.js';

export const createNotification = async ({ userId, message }, io) => {
  const notification = await prisma.notification.create({ data: { userId, message } });
  if (io) io.to(`user:${userId}`).emit('notification:new', notification);
  return notification;
};

export const listNotifications = async (userId, { page = 1, limit = 20 }) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });
};

export const markNotificationRead = async (id, userId) =>
  prisma.notification.updateMany({ where: { id, userId }, data: { read: true } });
