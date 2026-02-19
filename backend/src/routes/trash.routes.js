import { Router } from 'express';
import { forceDeleteHandler, getTrashHandler, restoreHandler } from '../controllers/trash.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/', getTrashHandler);
router.post('/restore', restoreHandler);
router.delete('/force-delete', forceDeleteHandler);

export default router;
