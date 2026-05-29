import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';

export default async function jobRoutes(app: FastifyInstance) {
  // GET /api/v1/jobs — list with optional filters + match score
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const query = z.object({
      district: z.string().optional(),
      sector: z.string().optional(),
      salaryMin: z.coerce.number().optional(),
      search: z.string().optional(),
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(20),
    }).parse(request.query);

    const where: any = { isActive: true };
    if (query.district) where.district = query.district;
    if (query.sector) where.sector = query.sector;
    if (query.salaryMin) where.salaryMin = { gte: query.salaryMin };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { company: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { sub } = request.user as { sub: string };

    // Exclude jobs the user has already applied to
    const appliedJobIds = (await prisma.application.findMany({
      where: { userId: sub },
      select: { jobId: true },
    })).map((a) => a.jobId);
    if (appliedJobIds.length) where.id = { notIn: appliedJobIds };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.count({ where }),
    ]);

    // Attach saved status and compute match score against user skills
    const userSkills = await prisma.userSkill.findMany({
      where: { userId: sub },
      include: { skill: true },
    });
    const savedJobs = await prisma.savedJob.findMany({ where: { userId: sub } });
    const savedSet = new Set(savedJobs.map((s) => s.jobId));
    const userSkillNames = new Set(userSkills.map((us) => us.skill.name.toLowerCase()));

    const enriched = jobs.map((job) => {
      const total = job.skills.length;
      const have = job.skills.filter((s) => userSkillNames.has(s.toLowerCase())).length;
      const matchScore = total ? Math.round((have / total) * 100) : 0;
      return { ...job, saved: savedSet.has(job.id), skillsMatch: { have, total }, matchScore };
    });

    return { data: enriched, total, page: query.page, limit: query.limit };
  });

  // GET /api/v1/jobs/:id
  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return reply.status(404).send({ error: 'Job not found' });

    const saved = await prisma.savedJob.findUnique({ where: { userId_jobId: { userId: sub, jobId: id } } });
    const userSkills = await prisma.userSkill.findMany({ where: { userId: sub }, include: { skill: true } });
    const userSkillNames = new Set(userSkills.map((us) => us.skill.name.toLowerCase()));
    const have = job.skills.filter((s) => userSkillNames.has(s.toLowerCase())).length;
    const matchScore = job.skills.length ? Math.round((have / job.skills.length) * 100) : 0;

    return { ...job, saved: !!saved, skillsMatch: { have, total: job.skills.length }, matchScore };
  });

  // POST /api/v1/jobs/:id/save — toggle saved
  app.post('/:id/save', { preHandler: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };
    const key = { userId: sub, jobId: id };

    const existing = await prisma.savedJob.findUnique({ where: { userId_jobId: key } });
    if (existing) {
      await prisma.savedJob.delete({ where: { userId_jobId: key } });
      return { saved: false };
    }
    await prisma.savedJob.create({ data: key });
    return { saved: true };
  });
}
