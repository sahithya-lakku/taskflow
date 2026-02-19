import {
  auditLogs,
  deleteUser,
  getAllProjects,
  getAllTasks,
  getAllUsers,
  platformAnalytics,
  resetUserPassword,
  suspendUser,
  updateUserRole,
  writeAudit,
} from '../services/admin.service.js';
import { hardDeleteProject } from '../services/project.service.js';

export const usersHandler = async (req, res, next) => {
  try {
    const data = await getAllUsers({
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 20),
      email: req.query.email,
      role: req.query.role,
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
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
export const deleteUserHandler = async (req, res, next) => {
  try {
    await deleteUser(req.params.userId);
    await writeAudit('delete_user', req.user.id, { userId: req.params.userId });
    res.json({ success: true });
  } catch (e) { next(e); }
};
export const resetPasswordHandler = async (req, res, next) => {
  try {
    await resetUserPassword(req.params.userId, req.body.newPassword || 'Temp@12345');
    await writeAudit('reset_password', req.user.id, { userId: req.params.userId });
    res.json({ success: true });
  } catch (e) { next(e); }
};
export const updateRoleHandler = async (req, res, next) => {
  try {
    const data = await updateUserRole(req.params.userId, req.body.role);
    await writeAudit('update_role', req.user.id, { userId: req.params.userId, role: req.body.role });
    res.json({ success: true, data });
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
