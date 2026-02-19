import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async ({ name, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, 'Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  const token = generateToken({ id: user.id, role: user.role, email: user.email });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new ApiError(401, 'Invalid credentials');

  const token = generateToken({ id: user.id, role: user.role, email: user.email });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};
