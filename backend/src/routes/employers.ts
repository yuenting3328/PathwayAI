import type { FastifyInstance } from 'fastify';
import { prisma } from '../index.js';

export default async function employerRoutes(app: FastifyInstance) {
  // GET /api/v1/employers — employer list (public for graduates)
  app.get('/', { preHandler: [app.authenticate] }, async () => {
    return prisma.employer.findMany({
      orderBy: { name: 'asc' },
      include: {
        programmes: {
          where: { isActive: true },
          select: { id: true, name: true, deadline: true, salaryMin: true, salaryMax: true, successRate: true },
        },
      },
    });
  });

  // GET /api/v1/employers/:id
  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const employer = await prisma.employer.findUnique({
      where: { id },
      include: { programmes: { where: { isActive: true } } },
    });
    if (!employer) return reply.status(404).send({ error: 'Not found' });
    return employer;
  });

  // GET /api/v1/employers/partnerships — institution view of partnerships
  app.get('/partnerships', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub, role } = request.user as { sub: string; role: string };
    if (!['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return reply.status(400).send({ error: 'No institution' });

    return prisma.employerRelationship.findMany({
      where: { institutionId: user.institutionId },
      include: { employer: true },
      orderBy: { jobPostings: 'desc' },
    });
  });
}
