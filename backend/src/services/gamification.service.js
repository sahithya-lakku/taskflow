import { prisma } from '../config/prisma.js';

export const recomputeUserGamification = async (userId) => {
  const [doneTasks, time] = await Promise.all([
    prisma.task.count({ where: { assignedToId: userId, status: 'DONE', deletedAt: null } }),
    prisma.timeLog.aggregate({ where: { userId }, _sum: { minutesSpent: true } }),
  ]);
  const hours = (time._sum.minutesSpent || 0) / 60;
  const points = doneTasks * 10 + Math.floor(hours * 5);
  await prisma.user.update({ where: { id: userId }, data: { points } });

  const streak = await prisma.userStreak.upsert({ where: { userId }, create: { userId, currentStreak: 1, longestStreak: 1 }, update: { currentStreak: { increment: 1 }, longestStreak: { increment: 0 } } });
  const level = Math.max(1, Math.floor(points / 100) + 1);
  const badges = [];
  if (points >= 100) badges.push('Bronze');
  if (points >= 300) badges.push('Silver');
  if (points >= 700) badges.push('Gold');
  return { points, level, streak, badges };
};
