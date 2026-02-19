import { prisma } from '../config/prisma.js';
import { createNotification } from './notification.service.js';

export const createRule = async (payload) => prisma.automationRule.create({ data: payload });

export const listRules = async (projectId) => prisma.automationRule.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } });

export const evaluateTaskRules = async (task, io) => {
  const rules = await prisma.automationRule.findMany({ where: { projectId: task.projectId, triggerType: 'STATUS_CHANGED' } });
  for (const rule of rules) {
    if (rule.conditionField === 'status' && rule.conditionValue === task.status) {
      if (rule.actionType === 'NOTIFY' && task.assignedToId) {
        await createNotification({ userId: task.assignedToId, message: `Automation: ${task.title} changed to ${task.status}` }, io);
      }
      if (rule.actionType === 'CHANGE_STATUS' && rule.conditionField !== 'status') {
        await prisma.task.update({ where: { id: task.id }, data: { status: rule.conditionValue } });
      }
    }
  }
};

export const runDueDateAutomation = async () => {
  const rules = await prisma.automationRule.findMany({ where: { triggerType: 'DATE_REACHED' } });
  for (const rule of rules) {
    const tasks = await prisma.task.findMany({ where: { projectId: rule.projectId, status: { not: 'DONE' }, dueDate: { lte: new Date() }, deletedAt: null } });
    for (const task of tasks) {
      if (rule.actionType === 'CHANGE_STATUS') {
        await prisma.task.update({ where: { id: task.id }, data: { status: 'BLOCKED' } });
      }
    }
  }
};
