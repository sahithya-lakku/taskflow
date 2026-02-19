import { Router } from 'express';
import { getCalendarTasksHandler, rescheduleTaskHandler } from '../controllers/calendar.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/tasks/calendar', getCalendarTasksHandler);
router.patch('/tasks/:taskId/reschedule', rescheduleTaskHandler);

export default router;
