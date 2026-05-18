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
