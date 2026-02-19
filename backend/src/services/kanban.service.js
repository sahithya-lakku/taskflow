import { updateTask } from './task.service.js';

export const moveTaskInKanban = async ({ taskId, userId, status, position, io }) => {
  return updateTask({ taskId, userId, payload: { status, position }, io });
};
