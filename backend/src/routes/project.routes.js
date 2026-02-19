import { Router } from 'express';
import {
  addMemberHandler,
  createProjectHandler,
  getProjectsHandler,
} from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addMemberSchema, createProjectSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);
router.get('/', getProjectsHandler);
router.post('/', validate(createProjectSchema), createProjectHandler);
router.post('/:projectId/members', validate(addMemberSchema), addMemberHandler);

export default router;
