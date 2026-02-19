import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';

export const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing or invalid authorization token'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, role: true, email: true, suspended: true } });
    if (!user || user.suspended) return next(new ApiError(403, 'Account suspended or not found'));
    req.user = user;
    return next();
  } catch (_err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden: insufficient permissions'));
  }
  return next();
};

export const authorizeProjectRoles = (...roles) => async (req, _res, next) => {
  const projectId = req.params.projectId || req.body.projectId || req.query.projectId;
  if (!projectId) return next(new ApiError(400, 'projectId required for project role check'));
  const membership = await prisma.projectMember.findUnique({ where: { userId_projectId: { userId: req.user.id, projectId } } });
  if (!membership || !roles.includes(membership.role)) {
    return next(new ApiError(403, 'Forbidden: insufficient project role'));
  }
  req.projectRole = membership.role;
  return next();
};
