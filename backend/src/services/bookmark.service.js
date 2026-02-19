import { prisma } from '../config/prisma.js';

export const addBookmark = async (userId, payload) => prisma.bookmark.create({ data: { userId, ...payload } });
export const removeBookmark = async (userId, id) => prisma.bookmark.deleteMany({ where: { id, userId } });
export const listBookmarks = async (userId) => prisma.bookmark.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { task: true, project: true } });
