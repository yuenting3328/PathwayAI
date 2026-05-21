import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';

export default async function marketRoutes(app: FastifyInstance) {
  // GET /api/v1/market/signals — market signals feed
  app.get('/signals', { preHandler: [app.authenticate] }, async (request) => {
    const query = z.object({
      sector: z.string().optional(),
      district: z.string().optional(),
      trend: z.enum(['UP', 'DOWN', 'STABLE', 'HOT']).optional(),
    }).parse(request.query);

    const where: any = {};
    if (query.sector) where.sector = query.sector;
    if (query.district) where.district = query.district;
    if (query.trend) where.trend = query.trend;

    const now = new Date();
    where.OR = [{ expiresAt: null }, { expiresAt: { gt: now } }];

    return prisma.marketSignal.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });
  });

  // GET /api/v1/market/signals/:id
  app.get('/signals/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const signal = await prisma.marketSignal.findUnique({ where: { id } });
    if (!signal) return reply.status(404).send({ error: 'Not found' });
    return signal;
  });

  // Helper: resolve institution from JWT (admin only)
  const getInstitutionId = async (request: any, reply: any): Promise<string | null> => {
    const { sub, role } = request.user as { sub: string; role: string };
    if (!['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      reply.status(403).send({ error: 'Forbidden' });
      return null;
    }
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) { reply.status(400).send({ error: 'No institution' }); return null; }
    return user.institutionId;
  };

  // GET /api/v1/market/sector-trends — sector demand index (pivoted by quarter)
  app.get('/sector-trends', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstitutionId(request, reply);
    if (!instId) return;
    const rows = await prisma.marketSectorTrend.findMany({
      where: { institutionId: instId },
      orderBy: [{ quarter: 'asc' }],
    });
    const map: Record<string, Record<string, number>> = {};
    for (const r of rows) {
      if (!map[r.quarter]) map[r.quarter] = {};
      const key = r.sector === 'Technology' ? 'tech'
        : r.sector === 'Professional Services' ? 'professional'
        : r.sector.toLowerCase();
      map[r.quarter][key] = r.demandIndex;
    }
    return Object.entries(map).map(([quarter, sectors]) => ({ quarter, ...sectors }));
  });

  // GET /api/v1/market/district-salaries
  app.get('/district-salaries', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstitutionId(request, reply);
    if (!instId) return;
    return prisma.districtSalaryBenchmark.findMany({
      where: { institutionId: instId },
      orderBy: { median: 'desc' },
    });
  });

  // GET /api/v1/market/skills-shortage
  app.get('/skills-shortage', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstitutionId(request, reply);
    if (!instId) return;
    return prisma.skillShortage.findMany({
      where: { institutionId: instId },
      orderBy: { shortage: 'desc' },
    });
  });

  // GET /api/v1/market/competency-feedback
  app.get('/competency-feedback', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub, role } = request.user as { sub: string; role: string };

    let institutionId: string | null = null;

    if (['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      institutionId = await getInstitutionId(request, reply);
      if (!institutionId) return;
    } else if (role === 'RECRUITER') {
      // Resolve institution via employer email domain relationship
      const user = await prisma.user.findUnique({ where: { id: sub } });
      const domain = user?.email.split('@')[1];
      const companySlug = domain?.split('.')[0] ?? '';
      const employer = await prisma.employer.findFirst({
        where: { name: { contains: companySlug, mode: 'insensitive' } },
        include: { relationships: { select: { institutionId: true }, take: 1 } },
      });
      const instId = employer?.relationships[0]?.institutionId;
      if (!instId) {
        const first = await prisma.institution.findFirst();
        if (!first) return reply.status(400).send({ error: 'No institution available' });
        institutionId = first.id;
      } else {
        institutionId = instId;
      }
    } else {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const rows = await prisma.competencyFeedback.findMany({
      where: { institutionId },
      orderBy: { competency: 'asc' },
    });
    return rows.map(r => ({ ...r, gap: r.desired - r.current }));
  });

  // GET /api/v1/market/demand-forecast
  app.get('/demand-forecast', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstitutionId(request, reply);
    if (!instId) return;
    return prisma.demandForecast.findMany({
      where: { institutionId: instId },
      orderBy: [{ year: 'asc' }, { monthOrder: 'asc' }],
    });
  });

  // POST /api/v1/market/competency-feedback — recruiter or admin submits competency ratings
  app.post('/competency-feedback', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub, role } = request.user as { sub: string; role: string };

    const schema = z.object({
      competency: z.string().min(1),
      current: z.number().min(0).max(10),
      desired: z.number().min(0).max(10),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    let institutionId: string;
    let employerId: string | null = null;

    if (['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      const user = await prisma.user.findUnique({ where: { id: sub } });
      if (!user?.institutionId) return reply.status(400).send({ error: 'No institution linked' });
      institutionId = user.institutionId;
    } else if (role === 'RECRUITER') {
      const user = await prisma.user.findUnique({ where: { id: sub } });
      // Resolve institution via employer relationship using email domain
      const domain = user?.email.split('@')[1];
      const companySlug = domain?.split('.')[0] ?? '';
      const employer = await prisma.employer.findFirst({
        where: { name: { contains: companySlug, mode: 'insensitive' } },
        include: { relationships: { select: { institutionId: true }, take: 1 } },
      });
      if (employer) employerId = employer.id;
      const instId = employer?.relationships[0]?.institutionId;
      if (!instId) {
        // Fall back to the first available institution
        const first = await prisma.institution.findFirst();
        if (!first) return reply.status(400).send({ error: 'No institution available' });
        institutionId = first.id;
      } else {
        institutionId = instId;
      }
    } else {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const year = new Date().getFullYear();
    const feedback = await prisma.competencyFeedback.upsert({
      where: { institutionId_competency_year: { institutionId, competency: body.data.competency, year } },
      create: { institutionId, employerId, year, ...body.data },
      update: { current: body.data.current, desired: body.data.desired, employerId },
    });
    return reply.status(201).send({ ...feedback, gap: feedback.desired - feedback.current });
  });

  // GET /api/v1/market/top-employers — top hiring employers by placements
  app.get('/top-employers', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstitutionId(request, reply);
    if (!instId) return;
    const relationships = await prisma.employerRelationship.findMany({
      where: { institutionId: instId },
      include: { employer: true },
      orderBy: { placements: 'desc' },
      take: 5,
    });
    return relationships.map((r, idx) => ({
      rank: idx + 1,
      employer: r.employer.name,
      sector: r.employer.sector ?? 'Other',
      hires: r.placements,
      avgSalary: 0,
      satisfaction: 8.5,
    }));
  });

  // GET /api/v1/market/salary — salary benchmark data
  app.get('/salary', { preHandler: [app.authenticate] }, async () => {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      select: { sector: true, district: true, salaryMin: true, salaryMax: true, title: true },
    });

    // Group by sector for salary ranges
    const bySector = jobs.reduce<Record<string, { min: number[]; max: number[] }>>((acc, j) => {
      if (!j.sector) return acc;
      if (!acc[j.sector]) acc[j.sector] = { min: [], max: [] };
      acc[j.sector].min.push(j.salaryMin);
      acc[j.sector].max.push(j.salaryMax);
      return acc;
    }, {});

    return Object.entries(bySector).map(([sector, data]) => ({
      sector,
      avgMin: Math.round(data.min.reduce((a, b) => a + b, 0) / data.min.length),
      avgMax: Math.round(data.max.reduce((a, b) => a + b, 0) / data.max.length),
    }));
  });
}
