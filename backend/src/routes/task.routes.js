import multer from 'multer';
import { Router } from 'express';
import {
  addAttachmentHandler,
  addCommentHandler,
  assignTagHandler,
  createTagHandler,
  createTaskHandler,
  deleteTaskHandler,
  listCommentsHandler,
  listTasksHandler,
  logTimeHandler,
  taskTimeSummaryHandler,
  updateTaskHandler,
} from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  assignTagSchema,
  commentSchema,
  createTaskSchema,
  tagSchema,
  taskListQuerySchema,
  timeLogSchema,
  updateTaskSchema,
} from '../utils/validators.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticate);
router.get('/project/:projectId', validate(taskListQuerySchema), listTasksHandler);
router.post('/project/:projectId', validate(createTaskSchema), createTaskHandler);
router.patch('/:taskId', validate(updateTaskSchema), updateTaskHandler);
router.delete('/:taskId', deleteTaskHandler);

router.get('/:taskId/comments', listCommentsHandler);
router.post('/:taskId/comments', validate(commentSchema), addCommentHandler);
router.post('/:taskId/attachments', upload.single('file'), addAttachmentHandler);

router.post('/tags', validate(tagSchema), createTagHandler);
router.post('/:taskId/tags', validate(assignTagSchema), assignTagHandler);

router.post('/:taskId/time-logs', validate(timeLogSchema), logTimeHandler);
router.get('/:taskId/time-logs/summary', taskTimeSummaryHandler);

export default router;
