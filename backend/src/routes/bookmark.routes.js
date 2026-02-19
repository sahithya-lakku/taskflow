import { Router } from 'express';
import { addBookmarkHandler, listBookmarksHandler, removeBookmarkHandler } from '../controllers/bookmark.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.get('/', listBookmarksHandler);
router.post('/', addBookmarkHandler);
router.delete('/:id', removeBookmarkHandler);

export default router;
