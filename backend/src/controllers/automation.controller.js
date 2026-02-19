import { createRule, listRules } from '../services/automation.service.js';

export const createRuleHandler = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await createRule(req.body) }); } catch (e) { next(e); }
};

export const listRulesHandler = async (req, res, next) => {
  try { res.json({ success: true, data: await listRules(req.params.projectId) }); } catch (e) { next(e); }
};
