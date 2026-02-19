import { prisma } from '../config/prisma.js';

export const saveTemplateFromProject = async (projectId, userId, name) => {
  const project = await prisma.project.findUnique({ where: { id: projectId }, include: { tasks: true } });
  return prisma.projectTemplate.create({ data: { name, createdById: userId, templateData: { name: project.name, description: project.description, tasks: project.tasks.map((t) => ({ title: t.title, description: t.description, priority: t.priority })) }, projectId } });
};

export const createProjectFromTemplate = async (templateId, ownerId, nameOverride) => {
  const template = await prisma.projectTemplate.findUnique({ where: { id: templateId } });
  const data = template.templateData;
  const project = await prisma.project.create({ data: { name: nameOverride || data.name || 'Template Project', description: data.description || '', ownerId, members: { create: { userId: ownerId, role: 'OWNER' } } } });
  if (Array.isArray(data.tasks) && data.tasks.length) {
    await prisma.task.createMany({ data: data.tasks.map((t, i) => ({ title: t.title, description: t.description || '', priority: t.priority || 'MEDIUM', projectId: project.id, position: i })) });
  }
  return project;
};

export const listTemplates = async () => prisma.projectTemplate.findMany({ orderBy: { createdAt: 'desc' } });
