import { Router } from 'express';
import { createFromTemplateHandler, listTemplatesHandler, saveTemplateHandler } from '../controllers/template.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/', listTemplatesHandler);
router.post('/project/:projectId', saveTemplateHandler);
router.post('/:templateId/create', createFromTemplateHandler);

export default router;
