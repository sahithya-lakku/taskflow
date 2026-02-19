import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';

export const getAllUsers = async ({ page = 1, limit = 20, email, role }) => {
  const where = {
    ...(email ? { email: { contains: email, mode: 'insensitive' } } : {}),
    ...(role ? { role } : {}),
  };

  const rows = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true, suspended: true, createdAt: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const taskCounts = await prisma.task.groupBy({
    by: ['assignedToId'],
    where: { assignedToId: { in: rows.map((r) => r.id) }, deletedAt: null },
    _count: { _all: true },
  });

  const countMap = Object.fromEntries(taskCounts.map((r) => [r.assignedToId, r._count._all]));
  return rows.map((u) => ({ ...u, taskCount: countMap[u.id] || 0, lastLogin: null }));
};

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
export const deleteUser = async (userId) => prisma.user.delete({ where: { id: userId } });
export const resetUserPassword = async (userId, newPassword) => prisma.user.update({ where: { id: userId }, data: { password: await bcrypt.hash(newPassword, 12) } });
export const updateUserRole = async (userId, role) => prisma.user.update({ where: { id: userId }, data: { role } });

export const platformAnalytics = async () => {
  const [users, activeUsers, projects, tasks, completed] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { suspended: false } }),
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.task.count({ where: { deletedAt: null } }),
    prisma.task.count({ where: { deletedAt: null, status: 'DONE' } }),
  ]);
  return { users, activeUsers, projects, tasks, completedTasks: completed };
};

export const auditLogs = async (filters = {}) => prisma.auditLog.findMany({
  where: {
    ...(filters.userId ? { userId: filters.userId } : {}),
    ...(filters.startDate || filters.endDate
      ? {
          createdAt: {
            gte: filters.startDate ? new Date(filters.startDate) : undefined,
            lte: filters.endDate ? new Date(filters.endDate) : undefined,
          },
        }
      : {}),
  },
  orderBy: { createdAt: 'desc' },
  take: 500,
});

export const writeAudit = async (action, userId, meta) => prisma.auditLog.create({ data: { action, userId, meta } });
