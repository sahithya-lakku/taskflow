import { prisma } from '../config/prisma.js';

export const getAllUsers = async (page = 1, limit = 20) => prisma.user.findMany({
  select: { id: true, name: true, email: true, role: true, suspended: true, createdAt: true },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
});

export const getAllProjects = async (page = 1, limit = 20) => prisma.project.findMany({
  where: { deletedAt: null },
  select: { id: true, name: true, ownerId: true, createdAt: true },
  skip: (page - 1) * limit,
  take: limit,
});

export const getAllTasks = async (page = 1, limit = 20) => prisma.task.findMany({
  where: { deletedAt: null },
  select: { id: true, title: true, status: true, priority: true, projectId: true },
  skip: (page - 1) * limit,
  take: limit,
});

export const suspendUser = async (userId) => prisma.user.update({ where: { id: userId }, data: { suspended: true } });

export const platformAnalytics = async () => {
  const [users, projects, tasks, completed] = await Promise.all([
    prisma.user.count(),
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.task.count({ where: { deletedAt: null } }),
    prisma.task.count({ where: { deletedAt: null, status: 'DONE' } }),
  ]);
  return { users, projects, tasks, completedTasks: completed };
};

export const auditLogs = async (filters = {}) => prisma.auditLog.findMany({
  where: {
    ...(filters.userId ? { userId: filters.userId } : {}),
    ...(filters.startDate || filters.endDate ? { createdAt: { gte: filters.startDate ? new Date(filters.startDate) : undefined, lte: filters.endDate ? new Date(filters.endDate) : undefined } } : {}),
  },
  orderBy: { createdAt: 'desc' },
  take: 200,
});

export const writeAudit = async (action, userId, meta) => prisma.auditLog.create({ data: { action, userId, meta } });
