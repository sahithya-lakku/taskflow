import { prisma } from '../config/prisma.js';

export const getProjectAnalytics = async (projectId) => {
  const [tasksByStatus, tasksByPriority, overdueCount, activeMembers] = await Promise.all([
    prisma.task.groupBy({ by: ['status'], where: { projectId, deletedAt: null }, _count: { _all: true } }),
    prisma.task.groupBy({ by: ['priority'], where: { projectId, deletedAt: null }, _count: { _all: true } }),
    prisma.task.count({ where: { projectId, deletedAt: null, dueDate: { lt: new Date() }, status: { not: 'DONE' } } }),
    prisma.projectMember.count({ where: { projectId } }),
  ]);

  const totalTasks = await prisma.task.count({ where: { projectId, deletedAt: null } });
  const doneTasks = await prisma.task.count({ where: { projectId, deletedAt: null, status: 'DONE' } });

  const timeSpentPerUser = await prisma.timeLog.groupBy({ by: ['userId'], where: { task: { projectId } }, _sum: { minutesSpent: true } });

  return {
    tasksByStatus,
    tasksByPriority,
    overdueCount,
    activeMembers,
    projectProgressPercent: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
    timeSpentPerUser,
  };
};

export const workloadAnalytics = async (projectId) => prisma.task.groupBy({
  by: ['assignedToId'],
  where: { projectId, deletedAt: null },
  _count: { _all: true },
});

export const completionRateAnalytics = async (projectId) => {
  const total = await prisma.task.count({ where: { projectId, deletedAt: null } });
  const done = await prisma.task.count({ where: { projectId, deletedAt: null, status: 'DONE' } });
  return { total, done, completionRate: total ? Number(((done / total) * 100).toFixed(2)) : 0 };
};

export const timeSpentAnalytics = async (projectId) => prisma.timeLog.groupBy({
  by: ['userId'],
  where: { task: { projectId } },
  _sum: { minutesSpent: true },
});

export const projectProgressAnalytics = async (projectId) => {
  const byStatus = await prisma.task.groupBy({ by: ['status'], where: { projectId, deletedAt: null }, _count: { _all: true } });
  return byStatus;
};
