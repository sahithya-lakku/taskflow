import { prisma } from '../config/prisma.js';

export const getCalendarTasks = async (userId, startDate, endDate) => prisma.task.findMany({
  where: {
    deletedAt: null,
    dueDate: { gte: new Date(startDate), lte: new Date(endDate) },
    project: { members: { some: { userId } } },
  },
  select: { id: true, title: true, status: true, dueDate: true, projectId: true, priority: true },
  orderBy: { dueDate: 'asc' },
});

export const rescheduleTask = async (taskId, dueDate) => prisma.task.update({ where: { id: taskId }, data: { dueDate: new Date(dueDate) } });
