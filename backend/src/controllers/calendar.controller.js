import { getCalendarTasks, rescheduleTask } from '../services/calendar.service.js';

export const getCalendarTasksHandler = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getCalendarTasks(req.user.id, startDate, endDate);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

export const rescheduleTaskHandler = async (req, res, next) => {
  try {
    const data = await rescheduleTask(req.params.taskId, req.body.dueDate);
    res.json({ success: true, data });
  } catch (e) { next(e); }
};
