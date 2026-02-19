import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, points: true, profile: true, streak: true } });
  const [doneTasks, hoursLogged] = await Promise.all([
    prisma.task.count({ where: { assignedToId: userId, status: 'DONE', deletedAt: null } }),
    prisma.timeLog.aggregate({ where: { userId }, _sum: { minutesSpent: true } }),
  ]);
  const totalMinutes = hoursLogged._sum.minutesSpent || 0;
  return {
    ...user,
    stats: {
      tasksCompleted: doneTasks,
      hoursLogged: Math.round((totalMinutes / 60) * 10) / 10,
      streak: user?.streak?.currentStreak || 0,
      level: Math.max(1, Math.floor((user?.points || 0) / 100) + 1),
    },
  };
};

export const upsertProfile = async (userId, payload) => {
  return prisma.profile.upsert({
    where: { userId },
    create: { userId, ...payload },
    update: payload,
  });
};

export const updateAvatar = async (userId, avatarUrl) => upsertProfile(userId, { avatarUrl });

export const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const matched = await bcrypt.compare(currentPassword, user.password);
  if (!matched) throw new Error('Current password is incorrect');
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
};

export const deleteAccount = async (userId) => {
  await prisma.user.update({ where: { id: userId }, data: { suspended: true } });
};

export const updateNotificationPreference = async (userId, receiveRealtimeNotifications) => prisma.user.update({ where: { id: userId }, data: { receiveRealtimeNotifications } });
