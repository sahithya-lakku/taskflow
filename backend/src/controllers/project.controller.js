import {
  addProjectMember,
  createProject,
  getUserProjects,
} from '../services/project.service.js';

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
    const member = await addProjectMember(
      { projectId: req.params.projectId, ...req.validated.body },
      req.user.id,
    );
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
