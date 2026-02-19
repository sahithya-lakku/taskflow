import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { createNotification } from './notification.service.js';
import { ensureProjectMember } from './project.service.js';
import { evaluateTaskRules } from './automation.service.js';
import { recomputeUserGamification } from './gamification.service.js';

const createActivity = async (taskId, performedById, action) => {
  await prisma.taskActivityLog.create({ data: { taskId, performedById, action } });
};

export const listTasks = async ({ projectId, userId, page, limit, status, tagId }) => {
  await ensureProjectMember(projectId, userId);
  const where = {
    projectId,
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(tagId ? { tags: { some: { tagId } } } : {}),
  };
  const [data, total] = await Promise.all([
    prisma.task.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        assignedToId: true,
        createdAt: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        tags: { select: { tag: true } },
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
};

export const createTask = async ({ projectId, userId, payload, io }) => {
  await ensureProjectMember(projectId, userId, ['OWNER', 'ADMIN', 'EDITOR', 'MEMBER']);

  const task = await prisma.task.create({
    data: {
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      projectId,
    },
  });
  await createActivity(task.id, userId, 'Task created');
  await prisma.projectActivity.create({ data: { projectId, action: `Task created: ${task.title}`, performedBy: userId } });

  if (payload.assignedToId) {
    await createNotification({ userId: payload.assignedToId, message: `You were assigned task: ${task.title}` }, io);
  }
  await evaluateTaskRules(task, io);
  if (task.assignedToId) await recomputeUserGamification(task.assignedToId);
  return task;
};

export const updateTask = async ({ taskId, userId, payload, io }) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing || existing.deletedAt) throw new ApiError(404, 'Task not found');

  await ensureProjectMember(existing.projectId, userId, ['OWNER', 'ADMIN', 'EDITOR', 'MEMBER']);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...payload,
      dueDate: payload.dueDate === null ? null : payload.dueDate ? new Date(payload.dueDate) : undefined,
    },
  });

  await createActivity(task.id, userId, 'Task updated');
  await prisma.projectActivity.create({ data: { projectId: task.projectId, action: `Task updated: ${task.title}`, performedBy: userId } });

  if (task.assignedToId) {
    await createNotification({ userId: task.assignedToId, message: `Task updated: ${task.title}` }, io);
    await recomputeUserGamification(task.assignedToId);
  }
  await evaluateTaskRules(task, io);

  return task;
};

export const deleteTask = async ({ taskId, userId }) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing || existing.deletedAt) throw new ApiError(404, 'Task not found');

  await ensureProjectMember(existing.projectId, userId, ['OWNER', 'ADMIN', 'EDITOR', 'MEMBER']);
  await createActivity(taskId, userId, 'Task deleted');
  await prisma.task.update({ where: { id: taskId }, data: { deletedAt: new Date() } });
  await prisma.projectActivity.create({ data: { projectId: existing.projectId, action: `Task deleted`, performedBy: userId } });

  return { id: taskId, projectId: existing.projectId };
};

export const addComment = async ({ taskId, userId, content }, io) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.deletedAt) throw new ApiError(404, 'Task not found');
  await ensureProjectMember(task.projectId, userId, ['OWNER', 'ADMIN', 'EDITOR', 'MEMBER']);

  const comment = await prisma.comment.create({
    data: { taskId, userId, content },
    include: { user: { select: { id: true, name: true } } },
  });

  if (task.assignedToId && task.assignedToId !== userId) {
    await createNotification({ userId: task.assignedToId, message: `New comment on task: ${task.title}` }, io);
  }

  return { comment, projectId: task.projectId };
};

export const listComments = async (taskId, userId) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.deletedAt) throw new ApiError(404, 'Task not found');
  await ensureProjectMember(task.projectId, userId);

  return prisma.comment.findMany({
    where: { taskId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  });
};

export const addAttachment = async ({ taskId, file, userId }) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.deletedAt) throw new ApiError(404, 'Task not found');
  await ensureProjectMember(task.projectId, userId, ['OWNER', 'ADMIN', 'EDITOR', 'MEMBER']);

  return prisma.attachment.create({
    data: {
      taskId,
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.originalname,
      uploadedBy: userId,
    },
  });
};

export const createTag = async (payload) => prisma.tag.create({ data: payload });

export const assignTagToTask = async ({ taskId, tagId, userId }) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.deletedAt) throw new ApiError(404, 'Task not found');
  await ensureProjectMember(task.projectId, userId, ['OWNER', 'ADMIN', 'EDITOR', 'MEMBER']);

  return prisma.taskTag.upsert({
    where: { taskId_tagId: { taskId, tagId } },
    create: { taskId, tagId },
    update: {},
  });
};

export const logTime = async ({ taskId, userId, minutesSpent }) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.deletedAt) throw new ApiError(404, 'Task not found');
  await ensureProjectMember(task.projectId, userId, ['OWNER', 'ADMIN', 'EDITOR', 'MEMBER']);

  return prisma.timeLog.create({ data: { taskId, userId, minutesSpent } });
};

export const taskTimeSummary = async (taskId, userId) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.deletedAt) throw new ApiError(404, 'Task not found');
  await ensureProjectMember(task.projectId, userId);

  const grouped = await prisma.timeLog.groupBy({ by: ['userId'], where: { taskId }, _sum: { minutesSpent: true } });
  return grouped;
};
