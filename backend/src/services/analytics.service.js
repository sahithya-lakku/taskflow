import { prisma } from '../config/prisma.js';

export const getProjectAnalytics = async (projectId) => {
  const [tasksByStatus, tasksByPriority, overdueCount, activityCountPerDay, completedPerDay, activeMembers] = await Promise.all([
    prisma.task.groupBy({ by: ['status'], where: { projectId, deletedAt: null }, _count: { _all: true } }),
    prisma.task.groupBy({ by: ['priority'], where: { projectId, deletedAt: null }, _count: { _all: true } }),
    prisma.task.count({ where: { projectId, deletedAt: null, dueDate: { lt: new Date() }, status: { not: 'DONE' } } }),
    prisma.projectActivity.groupBy({ by: ['createdAt'], where: { projectId }, _count: { _all: true } }),
    prisma.task.groupBy({ by: ['createdAt'], where: { projectId, deletedAt: null, status: 'DONE' }, _count: { _all: true } }),
    prisma.projectMember.count({ where: { projectId } }),
  ]);

  const totalTasks = await prisma.task.count({ where: { projectId, deletedAt: null } });
  const doneTasks = await prisma.task.count({ where: { projectId, deletedAt: null, status: 'DONE' } });

  const timeSpentPerUser = await prisma.timeLog.groupBy({
    by: ['userId'],
    where: { task: { projectId } },
    _sum: { minutesSpent: true },
  });

  return {
    tasksByStatus,
    tasksByPriority,
    overdueCount,
    activityCountPerDay,
    tasksCompletedPerDay: completedPerDay,
    activeMembers,
    projectProgressPercent: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
    timeSpentPerUser,
  };
};
