import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../index.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['GRADUATE', 'ADVISOR', 'INSTITUTION_ADMIN']).optional(),
  institutionId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const body = registerSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const { email, password, role = 'GRADUATE', institutionId } = body.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.status(409).send({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, role, institutionId },
    });

    await prisma.profile.create({ data: { userId: user.id } });

    const token = app.jwt.sign({ sub: user.id, role: user.role, email: user.email });
    const refreshToken = app.jwt.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '30d' }
    );

    return { token, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  });

  app.post('/login', async (request, reply) => {
    const body = loginSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const { email, password } = body.data;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = app.jwt.sign({ sub: user.id, role: user.role, email: user.email });
    const refreshToken = app.jwt.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '30d' }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    };
  });

  app.post('/refresh', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string };
    if (!refreshToken) return reply.status(400).send({ error: 'refreshToken required' });

    try {
      const payload = app.jwt.verify(refreshToken) as { sub: string; type: string };
      if (payload.type !== 'refresh') throw new Error('Not a refresh token');

      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return reply.status(401).send({ error: 'User not found' });

      const token = app.jwt.sign({ sub: user.id, role: user.role, email: user.email });
      return { token };
    } catch {
      return reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });

  app.get('/me', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({
      where: { id: sub },
      include: { profile: true },
    });
    if (!user) throw new Error('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  });

  // POST /api/v1/auth/alumni-transition — graduate self-promotes to ALUMNI
  app.post('/alumni-transition', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub, role } = request.user as { sub: string; role: string };
    if (role !== 'GRADUATE') {
      return reply.status(400).send({ error: 'Only GRADUATE accounts can transition to ALUMNI' });
    }
    const user = await prisma.user.update({
      where: { id: sub },
      data: { role: 'ALUMNI' },
    });
    const token = app.jwt.sign({ sub: user.id, role: user.role, email: user.email });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  });

  app.patch('/me/profile', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const schema = z.object({
      name: z.string().optional(),
      university: z.string().optional(),
      faculty: z.string().optional(),
      degreeLevel: z.string().optional(),
      studyMode: z.string().optional(),
      graduationYear: z.number().optional(),
      targetRole: z.string().optional(),
      targetSector: z.string().optional(),
      gpa: z.number().optional(),
      location: z.string().optional(),
      bio: z.string().optional(),
    });

    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const profile = await prisma.profile.upsert({
      where: { userId: sub },
      create: { userId: sub, ...body.data },
      update: body.data,
    });
    return profile;
  });
}
