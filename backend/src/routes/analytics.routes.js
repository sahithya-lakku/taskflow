import { Router } from 'express';
import { completionRateHandler, projectProgressHandler, timeSpentHandler, workloadHandler } from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/workload', workloadHandler);
router.get('/completion-rate', completionRateHandler);
router.get('/time-spent', timeSpentHandler);
router.get('/project-progress', projectProgressHandler);

export default router;
