import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ensureProjectMember } from './project.service.js';

const createActivity = async (taskId, performedById, action) => {
  await prisma.taskActivityLog.create({
    data: { taskId, performedById, action },
  });
};

export const listTasks = async ({ projectId, userId, page, limit, status }) => {
  await ensureProjectMember(projectId, userId);
  const where = { projectId, ...(status ? { status } : {}) };
  const [data, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

export const createTask = async ({ projectId, userId, payload }) => {
  await ensureProjectMember(projectId, userId);

  const task = await prisma.task.create({
    data: {
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      projectId,
    },
  });
  await createActivity(task.id, userId, 'Task created');
  return task;
};

export const updateTask = async ({ taskId, userId, payload }) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new ApiError(404, 'Task not found');

  await ensureProjectMember(existing.projectId, userId);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...payload,
      dueDate: payload.dueDate === null ? null : payload.dueDate ? new Date(payload.dueDate) : undefined,
    },
  });

  await createActivity(task.id, userId, 'Task updated');
  return task;
};

export const deleteTask = async ({ taskId, userId }) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new ApiError(404, 'Task not found');

  await ensureProjectMember(existing.projectId, userId);
  await createActivity(taskId, userId, 'Task deleted');
  await prisma.task.delete({ where: { id: taskId } });

  return { id: taskId, projectId: existing.projectId };
};
