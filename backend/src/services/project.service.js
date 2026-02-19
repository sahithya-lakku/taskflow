import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';

export const createProject = async ({ name, description, ownerId }) => {
  return prisma.project.create({
    data: {
      name,
      description,
      ownerId,
      members: {
        create: {
          userId: ownerId,
          role: 'OWNER',
        },
      },
    },
  });
};

export const addProjectMember = async ({ projectId, userId, role }, requesterId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new ApiError(404, 'Project not found');

  if (project.ownerId !== requesterId) {
    throw new ApiError(403, 'Only the project owner can add members');
  }

  return prisma.projectMember.upsert({
    where: { userId_projectId: { userId, projectId } },
    create: { userId, projectId, role },
    update: { role },
  });
};

export const getUserProjects = async (userId) => {
  return prisma.project.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const ensureProjectMember = async (projectId, userId) => {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  if (!member) throw new ApiError(403, 'Not a project member');
  return member;
};
