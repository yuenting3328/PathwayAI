import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';

const statusValues = ['PENDING', 'INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN'] as const;

export default async function applicationRoutes(app: FastifyInstance) {
  // GET /api/v1/applications — user's own applications
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const applications = await prisma.application.findMany({
      where: { userId: sub },
      include: { job: { select: { title: true, company: true, district: true, sector: true } } },
      orderBy: { appliedDate: 'desc' },
    });
    return applications;
  });

  // GET /api/v1/applications/stats — summary counts
  // NOTE: must be registered before /:id to avoid Fastify matching 'stats' as the :id param
  app.get('/stats', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const all = await prisma.application.findMany({ where: { userId: sub } });
    return {
      total: all.length,
      pending: all.filter((a) => a.status === 'PENDING' && a.stage !== 'Shortlisted').length,
      shortlisted: all.filter((a) => a.stage === 'Shortlisted').length,
      interviews: all.filter((a) => a.status === 'INTERVIEW').length,
      offers: all.filter((a) => a.status === 'OFFERED').length,
      rejected: all.filter((a) => a.status === 'REJECTED').length,
    };
  });

  // POST /api/v1/applications — apply to a job
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const schema = z.object({ jobId: z.string(), notes: z.string().optional() });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const job = await prisma.job.findUnique({ where: { id: body.data.jobId } });
    if (!job) return reply.status(404).send({ error: 'Job not found' });

    const existing = await prisma.application.findFirst({
      where: { userId: sub, jobId: body.data.jobId },
    });
    if (existing) return reply.status(409).send({ error: 'Already applied to this job' });

    const application = await prisma.application.create({
      data: { userId: sub, jobId: body.data.jobId, notes: body.data.notes },
      include: { job: true },
    });
    return reply.status(201).send(application);
  });

  // GET /api/v1/applications/:id
  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };
    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });
    if (!application || application.userId !== sub) return reply.status(404).send({ error: 'Not found' });
    return application;
  });

  // PATCH /api/v1/applications/:id — update status/stage/interview date
  app.patch('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application || application.userId !== sub) return reply.status(404).send({ error: 'Not found' });

    const schema = z.object({
      status: z.enum(statusValues).optional(),
      stage: z.string().optional(),
      interviewDate: z.string().datetime().optional(),
      notes: z.string().optional(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...body.data,
        interviewDate: body.data.interviewDate ? new Date(body.data.interviewDate) : undefined,
      },
    });
    return updated;
  });

  // DELETE /api/v1/applications/:id — withdraw
  app.delete('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application || application.userId !== sub) return reply.status(404).send({ error: 'Not found' });

    await prisma.application.update({ where: { id }, data: { status: 'WITHDRAWN' } });
    return { success: true };
  });
}
