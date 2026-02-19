import { listNotifications, markNotificationRead } from '../services/notification.service.js';

export const listNotificationsHandler = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const data = await listNotifications(req.user.id, { page, limit });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const markNotificationReadHandler = async (req, res, next) => {
  try {
    await markNotificationRead(req.params.id, req.user.id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
