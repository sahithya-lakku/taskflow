import { createTask, deleteTask, listTasks, updateTask } from '../services/task.service.js';

export const listTasksHandler = async (req, res, next) => {
  try {
    const { page, limit, status } = req.validated.query;
    const result = await listTasks({
      projectId: req.params.projectId,
      userId: req.user.id,
      page,
      limit,
      status,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const createTaskHandler = async (req, res, next) => {
  try {
    const task = await createTask({
      projectId: req.params.projectId,
      userId: req.user.id,
      payload: req.validated.body,
    });

    req.io.to(`project:${req.params.projectId}`).emit('task:created', task);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTaskHandler = async (req, res, next) => {
  try {
    const task = await updateTask({
      taskId: req.params.taskId,
      userId: req.user.id,
      payload: req.validated.body,
    });

    req.io.to(`project:${task.projectId}`).emit('task:updated', task);
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskHandler = async (req, res, next) => {
  try {
    const result = await deleteTask({ taskId: req.params.taskId, userId: req.user.id });
    req.io.to(`project:${result.projectId}`).emit('task:deleted', { id: result.id });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
