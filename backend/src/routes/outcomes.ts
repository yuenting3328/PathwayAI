import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';
import { emit } from '../events.js';

export default async function outcomeRoutes(app: FastifyInstance) {
  // POST /api/v1/outcomes — graduate self-reports an accepted offer
  // Creates an anonymised GraduateOutcome visible on the Institution dashboard
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };

    const schema = z.object({
      applicationId: z.string(),
      company: z.string(),
      role: z.string(),
      sector: z.string().optional(),
      salaryBand: z.string().optional(),
      geography: z.string().optional(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const [user, profile, application] = await Promise.all([
      prisma.user.findUnique({ where: { id: sub } }),
      prisma.profile.findUnique({ where: { userId: sub } }),
      prisma.application.findUnique({ where: { id: body.data.applicationId } }),
    ]);

    if (!application || application.userId !== sub) {
      return reply.status(404).send({ error: 'Application not found' });
    }
    if (!user?.institutionId) {
      return reply.status(400).send({ error: 'No institution linked to your account' });
    }

    // Resolve programmeId from the graduate's faculty if possible
    const programme = profile?.faculty
      ? await prisma.programme.findFirst({
          where: { institutionId: user.institutionId, faculty: { contains: profile.faculty, mode: 'insensitive' } },
        })
      : null;

    // Use an anonymised cohort ref so the graduate is not identifiable
    const cohortRef = `G${sub.slice(-6).toUpperCase()}`;

    const outcome = await prisma.graduateOutcome.create({
      data: {
        institutionId: user.institutionId,
        programmeId: programme?.id ?? null,
        cohortRef,
        studentName: profile?.name ?? null,
        cohortYear: profile?.graduationYear ?? new Date().getFullYear(),
        company: body.data.company,
        role: body.data.role,
        sector: body.data.sector ?? null,
        salaryBand: body.data.salaryBand ?? null,
        geography: body.data.geography ?? null,
      },
    });

    // Update the application stage to reflect acceptance
    await prisma.application.update({
      where: { id: body.data.applicationId },
      data: { stage: 'Offer Accepted' },
    });

    // Emit event so Institution dashboard refreshes via SSE
    emit({ type: 'OUTCOME_REPORTED', institutionId: user.institutionId, outcomeId: outcome.id });

    return reply.status(201).send({ id: outcome.id });
  });
}
