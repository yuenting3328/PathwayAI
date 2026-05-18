import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';

export default async function programmeRoutes(app: FastifyInstance) {
  // GET /api/v1/programmes — graduate programmes from employers
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const query = z.object({
      sector: z.string().optional(),
      salaryMin: z.coerce.number().optional(),
    }).parse(request.query);

    const where: any = { isActive: true };
    if (query.sector) where.sector = query.sector;
    if (query.salaryMin) where.salaryMin = { gte: query.salaryMin };

    return prisma.graduateProgramme.findMany({
      where,
      include: { employer: { select: { name: true, sector: true } } },
      orderBy: { deadline: 'asc' },
    });
  });

  // GET /api/v1/programmes/:id
  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const programme = await prisma.graduateProgramme.findUnique({
      where: { id },
      include: { employer: true },
    });
    if (!programme) return reply.status(404).send({ error: 'Not found' });
    return programme;
  });

  // GET /api/v1/programmes/alumni-paths — career transition paths
  app.get('/alumni-paths', { preHandler: [app.authenticate] }, async () => {
    return prisma.alumniPath.findMany({ orderBy: { name: 'asc' } });
  });
}
