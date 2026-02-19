import fs from 'fs';
import path from 'path';
import { prisma } from '../config/prisma.js';

export const generateProjectReport = async (projectId, generatedById) => {
  const [tasks, members, timeLogs] = await Promise.all([
    prisma.task.findMany({ where: { projectId, deletedAt: null }, select: { id: true, title: true, status: true, priority: true } }),
    prisma.projectMember.findMany({ where: { projectId }, include: { user: { select: { name: true, email: true } } } }),
    prisma.timeLog.findMany({ where: { task: { projectId } }, select: { userId: true, minutesSpent: true } }),
  ]);

  const reportData = {
    generatedAt: new Date().toISOString(),
    totals: {
      tasks: tasks.length,
      completed: tasks.filter((t) => t.status === 'DONE').length,
    },
    tasks,
    memberContributions: members.map((m) => ({ role: m.role, user: m.user })),
    timeSpentMinutes: timeLogs.reduce((acc, log) => acc + log.minutesSpent, 0),
  };

  const reportsDir = path.resolve('reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const fileName = `project-${projectId}-${Date.now()}.json`;
  const filePath = path.join(reportsDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));

  const report = await prisma.report.create({
    data: {
      projectId,
      generatedById,
      fileUrl: `/reports/${fileName}`,
    },
  });

  const csvRows = ['taskId,title,status,priority', ...tasks.map((t) => `${t.id},"${t.title}",${t.status},${t.priority}`)];

  return { report, json: reportData, csv: csvRows.join('\n') };
};
