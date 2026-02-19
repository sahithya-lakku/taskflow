import { Router } from 'express';
import {
  activityFeedHandler,
  addMemberHandler,
  analyticsHandler,
  createInviteHandler,
  createProjectHandler,
  getProjectsHandler,
  hardDeleteProjectHandler,
  joinByInviteHandler,
  reportHandler,
  softDeleteProjectHandler,
} from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addMemberSchema, createProjectSchema, joinInviteSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);
router.get('/', getProjectsHandler);
router.post('/', validate(createProjectSchema), createProjectHandler);
router.post('/:projectId/members', validate(addMemberSchema), addMemberHandler);
router.delete('/:projectId', softDeleteProjectHandler);
router.delete('/:projectId/hard', hardDeleteProjectHandler);
router.post('/:projectId/invites', createInviteHandler);
router.post('/join', validate(joinInviteSchema), joinByInviteHandler);
router.get('/:projectId/activity', activityFeedHandler);
router.get('/:projectId/analytics', analyticsHandler);
router.get('/:projectId/report', reportHandler);

export default router;
