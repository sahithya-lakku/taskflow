import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string().min(1) }),
});

export const createProjectSchema = z.object({
  body: z.object({ name: z.string().min(2), description: z.string().optional() }),
});

export const addMemberSchema = z.object({
  body: z.object({ userId: z.string().min(1), role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER') }),
  params: z.object({ projectId: z.string().min(1) }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional(),
    assignedToId: z.string().optional(),
  }),
  params: z.object({ projectId: z.string().min(1) }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().nullable().optional(),
    assignedToId: z.string().nullable().optional(),
  }),
  params: z.object({ taskId: z.string().min(1) }),
});

export const taskListQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    tagId: z.string().optional(),
  }),
  params: z.object({ projectId: z.string().min(1) }),
});

export const commentSchema = z.object({
  params: z.object({ taskId: z.string().min(1) }),
  body: z.object({ content: z.string().min(1).max(5000) }),
});

export const tagSchema = z.object({
  body: z.object({ name: z.string().min(1), color: z.string().min(3).max(20) }),
});

export const assignTagSchema = z.object({
  params: z.object({ taskId: z.string().min(1) }),
  body: z.object({ tagId: z.string().min(1) }),
});

export const inviteSchema = z.object({
  params: z.object({ projectId: z.string().min(1) }),
  body: z.object({ expiresInHours: z.coerce.number().int().min(1).max(168).default(24) }).optional(),
});

export const joinInviteSchema = z.object({
  body: z.object({ token: z.string().min(1) }),
});

export const timeLogSchema = z.object({
  params: z.object({ taskId: z.string().min(1) }),
  body: z.object({ minutesSpent: z.coerce.number().int().min(1).max(1440) }),
});
