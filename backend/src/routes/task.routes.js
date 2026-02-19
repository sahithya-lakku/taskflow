import { Router } from 'express';
import {
  createTaskHandler,
  deleteTaskHandler,
  listTasksHandler,
  updateTaskHandler,
} from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createTaskSchema,
  taskListQuerySchema,
  updateTaskSchema,
} from '../utils/validators.js';

const router = Router();

router.use(authenticate);
router.get('/project/:projectId', validate(taskListQuerySchema), listTasksHandler);
router.post('/project/:projectId', validate(createTaskSchema), createTaskHandler);
router.patch('/:taskId', validate(updateTaskSchema), updateTaskHandler);
router.delete('/:taskId', deleteTaskHandler);

export default router;
