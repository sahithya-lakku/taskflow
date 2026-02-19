import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';

export const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing or invalid authorization token'));
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
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
