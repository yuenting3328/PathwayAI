import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';

export default async function institutionRoutes(app: FastifyInstance) {
  const requireAdmin = async (request: any, reply: any) => {
    await request.jwtVerify();
    const { role } = request.user as { role: string };
    if (!['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };

  // GET /api/v1/institution/programmes — institution's academic programmes
  app.get('/programmes', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.programme.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { name: 'asc' },
    });
  });

  // GET /api/v1/institution/outcomes — graduate outcomes (anonymised)
  app.get('/outcomes', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return reply.status(400).send({ error: 'No institution' });

    const query = z.object({
      cohortYear: z.coerce.number().optional(),
      faculty: z.string().optional(),
      sector: z.string().optional(),
      geography: z.string().optional(),
    }).parse(request.query);

    const where: any = { institutionId: user.institutionId };
    if (query.cohortYear) where.cohortYear = query.cohortYear;
    if (query.sector) where.sector = query.sector;
    if (query.geography) where.geography = query.geography;

    return prisma.graduateOutcome.findMany({
      where,
      include: { programme: { select: { name: true, faculty: true } } },
      orderBy: { cohortYear: 'desc' },
    });
  });

  // GET /api/v1/institution/credentials — issued credentials status
  app.get('/credentials', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.issuedCredential.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { createdAt: 'desc' },
    });
  });

  // POST /api/v1/institution/credentials — issue a credential
  app.post('/credentials', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return reply.status(400).send({ error: 'No institution' });

    const schema = z.object({
      recipientRef: z.string(),
      type: z.string(),
      name: z.string(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const credential = await prisma.issuedCredential.create({
      data: { institutionId: user.institutionId!, status: 'PENDING', ...body.data },
    });
    return reply.status(201).send(credential);
  });

  // GET /api/v1/institution/snapshots — 5-year employment trend
  app.get('/snapshots', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.institutionSnapshot.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { year: 'asc' },
    });
  });

  // GET /api/v1/institution/programme-snapshots — 3-year trend per programme
  app.get('/programme-snapshots', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.programmeSnapshot.findMany({
      where: { programme: { institutionId: user.institutionId } },
      orderBy: [{ programmeId: 'asc' }, { year: 'asc' }],
    });
  });

  // GET /api/v1/institution/insights — insights and alerts
  app.get('/insights', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.institutionInsight.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { createdAt: 'desc' },
    });
  });

  // GET /api/v1/institution/career-stages — alumni career progression by sector
  app.get('/career-stages', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.alumniCareerStage.findMany({
      where: { institutionId: user.institutionId },
      orderBy: [{ yearsRange: 'asc' }, { sector: 'asc' }],
    });
  });

  // GET /api/v1/institution/salary-stages — alumni salary progression
  app.get('/salary-stages', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.alumniSalaryStage.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { yearsRange: 'asc' },
    });
  });

  // GET /api/v1/institution/engagement — monthly alumni engagement
  app.get('/engagement', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.alumniEngagement.findMany({
      where: { institutionId: user.institutionId },
      orderBy: [{ year: 'asc' }],
    });
  });

  // GET /api/v1/institution/coaching-metrics — weekly coaching stats (last 4 weeks)
  app.get('/coaching-metrics', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];

    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const sessions = await prisma.coachSession.findMany({
      where: { user: { institutionId: user.institutionId }, createdAt: { gte: fourWeeksAgo } },
      select: { createdAt: true, score: true },
    });

    return Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(now - (4 - i) * weekMs);
      const weekEnd = new Date(now - (3 - i) * weekMs);
      const weekSessions = sessions.filter(s => s.createdAt >= weekStart && s.createdAt < weekEnd);
      const scored = weekSessions.filter(s => s.score !== null);
      const avgSatisfaction = scored.length
        ? scored.reduce((acc, s) => acc + (s.score ?? 0), 0) / scored.length / 10
        : 0;
      return {
        week: `Week ${i + 1}`,
        sessions: weekSessions.length,
        satisfaction: +avgSatisfaction.toFixed(1),
      };
    });
  });
}
