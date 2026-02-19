import { completionRateAnalytics, projectProgressAnalytics, timeSpentAnalytics, workloadAnalytics } from '../services/analytics.service.js';

export const workloadHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await workloadAnalytics(req.query.projectId) }); } catch (e) { next(e); }
};
export const completionRateHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await completionRateAnalytics(req.query.projectId) }); } catch (e) { next(e); }
};
export const timeSpentHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await timeSpentAnalytics(req.query.projectId) }); } catch (e) { next(e); }
};
export const projectProgressHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await projectProgressAnalytics(req.query.projectId) }); } catch (e) { next(e); }
};
