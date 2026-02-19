import { auditLogs, getAllProjects, getAllTasks, getAllUsers, platformAnalytics, suspendUser, writeAudit } from '../services/admin.service.js';
import { hardDeleteProject } from '../services/project.service.js';

export const usersHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await getAllUsers(Number(req.query.page || 1), Number(req.query.limit || 20)) }); } catch (e) { next(e); }
};
export const projectsHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await getAllProjects(Number(req.query.page || 1), Number(req.query.limit || 20)) }); } catch (e) { next(e); }
};
export const tasksHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await getAllTasks(Number(req.query.page || 1), Number(req.query.limit || 20)) }); } catch (e) { next(e); }
};
export const suspendUserHandler = async (req, res, next) => {
  try {
    await suspendUser(req.params.userId);
    await writeAudit('suspend_user', req.user.id, { userId: req.params.userId });
    res.json({ success: true });
  } catch (e) { next(e); }
};
export const forceDeleteProjectHandler = async (req, res, next) => {
  try {
    await hardDeleteProject(req.params.projectId, req.user.id, true);
    await writeAudit('force_delete_project', req.user.id, { projectId: req.params.projectId });
    res.json({ success: true });
  } catch (e) { next(e); }
};
export const platformAnalyticsHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await platformAnalytics() }); } catch (e) { next(e); }
};
export const auditLogsHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await auditLogs(req.query) }); } catch (e) { next(e); }
};
