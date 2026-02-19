import { Router } from 'express';
import { createRuleHandler, listRulesHandler } from '../controllers/automation.controller.js';
import { authenticate, authorizeProjectRoles } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/:projectId', listRulesHandler);
router.post('/:projectId', authorizeProjectRoles('OWNER', 'ADMIN'), createRuleHandler);

export default router;
