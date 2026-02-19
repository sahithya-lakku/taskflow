import {
  addAttachment,
  addComment,
  assignTagToTask,
  createTag,
  createTask,
  deleteTask,
  listComments,
  listTasks,
  logTime,
  taskTimeSummary,
  updateTask,
} from '../services/task.service.js';
import { moveTaskInKanban } from '../services/kanban.service.js';

export const listTasksHandler = async (req, res, next) => {
  try {
    const { page, limit, status, tagId } = req.validated.query;
    const result = await listTasks({
      projectId: req.params.projectId,
      userId: req.user.id,
      page,
      limit,
      status,
      tagId,
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
      io: req.io,
    });

    req.io.to(`project:${req.params.projectId}`).emit('task:created', task);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTaskHandler = async (req, res, next) => {
  try {
    const payload = req.validated.body;
    const task = (payload.status || payload.position !== undefined)
      ? await moveTaskInKanban({ taskId: req.params.taskId, userId: req.user.id, status: payload.status, position: payload.position, io: req.io })
      : await updateTask({ taskId: req.params.taskId, userId: req.user.id, payload, io: req.io });

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

export const addCommentHandler = async (req, res, next) => {
  try {
    const { comment, projectId } = await addComment({ taskId: req.params.taskId, userId: req.user.id, content: req.validated.body.content }, req.io);
    req.io.to(`project:${projectId}`).emit('comment:created', comment);
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const listCommentsHandler = async (req, res, next) => {
  try {
    const comments = await listComments(req.params.taskId, req.user.id);
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

export const addAttachmentHandler = async (req, res, next) => {
  try {
    const attachment = await addAttachment({ taskId: req.params.taskId, file: req.file, userId: req.user.id });
    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    next(error);
  }
};

export const createTagHandler = async (req, res, next) => {
  try {
    const tag = await createTag(req.validated.body);
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

export const assignTagHandler = async (req, res, next) => {
  try {
    const record = await assignTagToTask({ taskId: req.params.taskId, tagId: req.validated.body.tagId, userId: req.user.id });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const logTimeHandler = async (req, res, next) => {
  try {
    const data = await logTime({ taskId: req.params.taskId, userId: req.user.id, minutesSpent: req.validated.body.minutesSpent });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const taskTimeSummaryHandler = async (req, res, next) => {
  try {
    const data = await taskTimeSummary(req.params.taskId, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
