import { getProjectAnalytics } from '../services/analytics.service.js';
import {
  addProjectMember,
  createProject,
  generateInvite,
  getProjectActivity,
  getUserProjects,
  hardDeleteProject,
  joinProjectByInvite,
  softDeleteProject,
} from '../services/project.service.js';
import { generateProjectReport } from '../services/report.service.js';

export const createProjectHandler = async (req, res, next) => {
  try {
    const project = await createProject({ ...req.validated.body, ownerId: req.user.id });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const addMemberHandler = async (req, res, next) => {
  try {
    const member = await addProjectMember({ projectId: req.params.projectId, ...req.validated.body }, req.user.id);
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

export const getProjectsHandler = async (req, res, next) => {
  try {
    const projects = await getUserProjects(req.user.id);
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const softDeleteProjectHandler = async (req, res, next) => {
  try {
    await softDeleteProject(req.params.projectId, req.user.id);
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

export const hardDeleteProjectHandler = async (req, res, next) => {
  try {
    await hardDeleteProject(req.params.projectId, req.user.id, req.user.role === 'ADMIN' || req.user.role === 'OWNER');
    res.status(200).json({ success: true, message: 'Project permanently deleted' });
  } catch (error) {
    next(error);
  }
};

export const createInviteHandler = async (req, res, next) => {
  try {
    const invite = await generateInvite(req.params.projectId, req.user.id, req.body?.expiresInHours || 24);
    res.status(201).json({ success: true, data: invite });
  } catch (error) {
    next(error);
  }
};

export const joinByInviteHandler = async (req, res, next) => {
  try {
    const projectId = await joinProjectByInvite(req.validated.body.token, req.user.id);
    res.status(200).json({ success: true, data: { projectId } });
  } catch (error) {
    next(error);
  }
};

export const activityFeedHandler = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const data = await getProjectActivity(req.params.projectId, req.user.id, page, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const analyticsHandler = async (req, res, next) => {
  try {
    const data = await getProjectAnalytics(req.params.projectId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const reportHandler = async (req, res, next) => {
  try {
    const data = await generateProjectReport(req.params.projectId, req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
