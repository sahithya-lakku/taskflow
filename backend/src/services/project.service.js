import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';

export const createProject = async ({ name, description, ownerId }) => {
  return prisma.project.create({
    data: {
      name,
      description,
      ownerId,
      members: { create: { userId: ownerId, role: 'OWNER' } },
      activities: { create: { action: 'Project created', performedBy: ownerId } },
    },
  });
};

export const addProjectMember = async ({ projectId, userId, role }, requesterId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.deletedAt) throw new ApiError(404, 'Project not found');

  const requesterMembership = await ensureProjectMember(projectId, requesterId, ['OWNER', 'ADMIN']);
  if (!requesterMembership) throw new ApiError(403, 'Only owner/admin can add members');

  const member = await prisma.projectMember.upsert({
    where: { userId_projectId: { userId, projectId } },
    create: { userId, projectId, role },
    update: { role },
  });

  await prisma.projectActivity.create({ data: { projectId, action: `Member added (${role})`, performedBy: requesterId } });
  return member;
};

export const getUserProjects = async (userId) => {
  return prisma.project.findMany({
    where: {
      deletedAt: null,
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      owner: { select: { id: true, name: true, email: true } },
      members: { select: { id: true, role: true, user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const ensureProjectMember = async (projectId, userId, allowedRoles) => {
  const member = await prisma.projectMember.findUnique({ where: { userId_projectId: { userId, projectId } } });
  if (!member) throw new ApiError(403, 'Not a project member');
  if (allowedRoles && !allowedRoles.includes(member.role)) {
    throw new ApiError(403, 'Insufficient role permissions');
  }
  return member;
};

export const softDeleteProject = async (projectId, userId) => {
  await ensureProjectMember(projectId, userId, ['OWNER', 'ADMIN']);
  await prisma.project.update({ where: { id: projectId }, data: { deletedAt: new Date() } });
  await prisma.task.updateMany({ where: { projectId }, data: { deletedAt: new Date() } });
  await prisma.projectActivity.create({ data: { projectId, action: 'Project soft-deleted', performedBy: userId } });
};

export const hardDeleteProject = async (projectId, userId, isAdmin) => {
  if (!isAdmin) throw new ApiError(403, 'Only SUPER_ADMIN can hard delete project');
  await prisma.project.delete({ where: { id: projectId } });
};

export const generateInvite = async (projectId, userId, expiresInHours = 24) => {
  await ensureProjectMember(projectId, userId, ['OWNER', 'ADMIN']);
  const token = crypto.randomBytes(24).toString('hex');
  const invite = await prisma.inviteToken.create({
    data: {
      projectId,
      token,
      createdById: userId,
      expiresAt: new Date(Date.now() + expiresInHours * 3600000),
    },
  });
  return invite;
};

export const joinProjectByInvite = async (token, userId) => {
  const invite = await prisma.inviteToken.findUnique({ where: { token } });
  if (!invite || invite.expiresAt < new Date()) throw new ApiError(400, 'Invalid or expired invite token');

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId, projectId: invite.projectId } },
    create: { userId, projectId: invite.projectId, role: 'MEMBER' },
    update: {},
  });

  await prisma.projectActivity.create({ data: { projectId: invite.projectId, action: 'Member joined via invite', performedBy: userId } });
  return invite.projectId;
};

export const getProjectActivity = async (projectId, userId, page = 1, limit = 20) => {
  await ensureProjectMember(projectId, userId);
  return prisma.projectActivity.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });
};
