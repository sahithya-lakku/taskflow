import { Router } from 'express';
import { auditLogsHandler, forceDeleteProjectHandler, platformAnalyticsHandler, projectsHandler, suspendUserHandler, tasksHandler, usersHandler } from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate, authorizeRoles('SUPER_ADMIN'));
router.get('/users', usersHandler);
router.get('/projects', projectsHandler);
router.get('/tasks', tasksHandler);
router.patch('/users/:userId/suspend', suspendUserHandler);
router.delete('/projects/:projectId/force', forceDeleteProjectHandler);
router.get('/analytics', platformAnalyticsHandler);
router.get('/audit-logs', auditLogsHandler);

export default router;
