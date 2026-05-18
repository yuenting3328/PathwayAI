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

  // Helper: resolve institution id (admin only)
  const getInstId = async (request: any, reply: any): Promise<string | null> => {
    const { sub, role } = request.user as { sub: string; role: string };
    if (!['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      reply.status(403).send({ error: 'Forbidden' }); return null;
    }
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) { reply.status(400).send({ error: 'No institution' }); return null; }
    return user.institutionId;
  };

  // GET /api/v1/employers/pipeline
  app.get('/pipeline', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstId(request, reply);
    if (!instId) return;
    return prisma.partnershipPipeline.findMany({
      where: { institutionId: instId },
      orderBy: { sortOrder: 'asc' },
    });
  });

  // GET /api/v1/employers/satisfaction-trends
  app.get('/satisfaction-trends', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstId(request, reply);
    if (!instId) return;
    return prisma.employerSatisfactionTrend.findMany({
      where: { institutionId: instId },
      orderBy: { quarterOrder: 'asc' },
    });
  });

  // GET /api/v1/employers/events
  app.get('/events', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstId(request, reply);
    if (!instId) return;
    return prisma.employerEvent.findMany({
      where: { institutionId: instId },
      orderBy: [{ year: 'asc' }, { monthOrder: 'asc' }],
    });
  });

  // GET /api/v1/employers/activity
  app.get('/activity', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstId(request, reply);
    if (!instId) return;
    return prisma.partnershipActivity.findMany({
      where: { institutionId: instId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  });

  // GET /api/v1/employers/sector-distribution — employer count per sector
  app.get('/sector-distribution', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstId(request, reply);
    if (!instId) return;
    const rels = await prisma.employerRelationship.findMany({
      where: { institutionId: instId },
      include: { employer: { select: { sector: true } } },
    });
    const counts: Record<string, number> = {};
    for (const r of rels) {
      const s = r.employer.sector ?? 'Other';
      counts[s] = (counts[s] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([sector, count]) => ({ sector, count }));
  });

  // GET /api/v1/employers/talent-hub — platform-level talent metrics
  app.get('/talent-hub', { preHandler: [app.authenticate] }, async (request, reply) => {
    const instId = await getInstId(request, reply);
    if (!instId) return;
    const [rels, applicationCount, placementCount] = await Promise.all([
      prisma.employerRelationship.findMany({ where: { institutionId: instId } }),
      prisma.application.count({ where: { user: { institutionId: instId } } }),
      prisma.employerRelationship.aggregate({
        where: { institutionId: instId },
        _sum: { placements: true, internships: true, jobPostings: true },
      }),
    ]);
    return [
      { metric: 'Job Postings',        value: placementCount._sum.jobPostings  ?? 0 },
      { metric: 'Internship Offers',   value: placementCount._sum.internships  ?? 0 },
      { metric: 'Student Applications',value: applicationCount },
      { metric: 'Placements Made',     value: placementCount._sum.placements   ?? 0 },
    ];
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
