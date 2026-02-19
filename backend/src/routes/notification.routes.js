import { Router } from 'express';
import { listNotificationsHandler, markNotificationReadHandler } from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/', listNotificationsHandler);
router.patch('/:id/read', markNotificationReadHandler);

export default router;
