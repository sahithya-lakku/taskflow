import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

const buildAuthResponse = async (user) => {
  const payload = { id: user.id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const decoded = jwt.decode(refreshToken);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

export const registerUser = async ({ name, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, 'Email already in use');

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  return buildAuthResponse(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new ApiError(401, 'Invalid credentials');

  return buildAuthResponse(user);
};

export const refreshAccessToken = async (refreshToken) => {
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.blacklisted || stored.expiresAt < new Date()) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  return { accessToken: generateAccessToken({ id: payload.id, role: payload.role, email: payload.email }) };
};

export const logoutUser = async (refreshToken) => {
  await prisma.refreshToken.updateMany({ where: { token: refreshToken }, data: { blacklisted: true } });
};
