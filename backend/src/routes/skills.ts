import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';

export default async function skillRoutes(app: FastifyInstance) {
  // GET /api/v1/skills — user's skill profile
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const skills = await prisma.userSkill.findMany({
      where: { userId: sub },
      include: { skill: true },
      orderBy: { skill: { name: 'asc' } },
    });
    return skills.map((us) => ({
      id: us.id,
      skillId: us.skillId,
      name: us.skill.name,
      category: us.skill.category,
      level: us.level,
      gap: us.gap,
      impact: us.impact,
    }));
  });

  // PUT /api/v1/skills/:skillId — upsert skill level
  app.put('/:skillId', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { skillId } = request.params as { skillId: string };
    const { sub } = request.user as { sub: string };
    const schema = z.object({
      level: z.number().min(0).max(100),
      gap: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
      impact: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) return reply.status(404).send({ error: 'Skill not found' });

    const userSkill = await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: sub, skillId } },
      create: { userId: sub, skillId, ...body.data },
      update: body.data,
    });
    return userSkill;
  });

  // GET /api/v1/skills/catalogue — all skills in system
  app.get('/catalogue', async () => {
    return prisma.skill.findMany({ orderBy: { name: 'asc' } });
  });

  // GET /api/v1/skills/gaps — skills user is missing for target role jobs
  app.get('/gaps', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const profile = await prisma.profile.findUnique({ where: { userId: sub } });
    if (!profile?.targetRole) return [];

    const jobs = await prisma.job.findMany({
      where: { title: { contains: profile.targetRole, mode: 'insensitive' }, isActive: true },
      take: 20,
    });

    const allJobSkills = new Set(jobs.flatMap((j) => j.skills.map((s) => s.toLowerCase())));
    const userSkills = await prisma.userSkill.findMany({
      where: { userId: sub },
      include: { skill: true },
    });
    const userSkillNames = new Set(userSkills.map((us) => us.skill.name.toLowerCase()));

    const gaps = [...allJobSkills].filter((s) => !userSkillNames.has(s));
    return gaps.map((skillName) => ({
      name: skillName,
      jobCount: jobs.filter((j) => j.skills.map((s) => s.toLowerCase()).includes(skillName)).length,
    }));
  });
}
