import { Router } from 'express';
import {
  auditLogsHandler,
  deleteUserHandler,
  forceDeleteProjectHandler,
  platformAnalyticsHandler,
  projectsHandler,
  resetPasswordHandler,
  suspendUserHandler,
  tasksHandler,
  updateRoleHandler,
  usersHandler,
} from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate, authorizeRoles('SUPER_ADMIN'));
router.get('/users', usersHandler);
router.get('/projects', projectsHandler);
router.get('/tasks', tasksHandler);
router.patch('/users/:userId/suspend', suspendUserHandler);
router.delete('/users/:userId', deleteUserHandler);
router.patch('/users/:userId/reset-password', resetPasswordHandler);
router.patch('/users/:userId/role', updateRoleHandler);
router.delete('/projects/:projectId/force', forceDeleteProjectHandler);
router.get('/analytics', platformAnalyticsHandler);
router.get('/audit-logs', auditLogsHandler);

export default router;
