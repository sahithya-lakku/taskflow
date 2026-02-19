import { createProjectFromTemplate, listTemplates, saveTemplateFromProject } from '../services/template.service.js';

export const saveTemplateHandler = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await saveTemplateFromProject(req.params.projectId, req.user.id, req.body.name) }); } catch (e) { next(e); }
};

export const createFromTemplateHandler = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await createProjectFromTemplate(req.params.templateId, req.user.id, req.body.name) }); } catch (e) { next(e); }
};

export const listTemplatesHandler = async (_req, res, next) => {
  try { res.json({ success: true, data: await listTemplates() }); } catch (e) { next(e); }
};
