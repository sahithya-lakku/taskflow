import { prisma } from '../config/prisma.js';
import { hardDeleteProject } from '../services/project.service.js';

export const getTrashHandler = async (req, res, next) => {
  try {
    const [projects, tasks] = await Promise.all([
      prisma.project.findMany({ where: { deletedAt: { not: null } }, select: { id: true, name: true, deletedAt: true } }),
      prisma.task.findMany({ where: { deletedAt: { not: null } }, select: { id: true, title: true, projectId: true, deletedAt: true } }),
    ]);
    res.json({ success: true, data: { projects, tasks } });
  } catch (e) { next(e); }
};

export const restoreHandler = async (req, res, next) => {
  try {
    const { type, id } = req.body;
    if (type === 'project') {
      await prisma.project.update({ where: { id }, data: { deletedAt: null } });
      await prisma.task.updateMany({ where: { projectId: id }, data: { deletedAt: null } });
    }
    if (type === 'task') await prisma.task.update({ where: { id }, data: { deletedAt: null } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

export const forceDeleteHandler = async (req, res, next) => {
  try {
    const { type, id } = req.body;
    if (type === 'project') await hardDeleteProject(id, req.user.id, req.user.role === 'SUPER_ADMIN');
    if (type === 'task') await prisma.task.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) { next(e); }
};
