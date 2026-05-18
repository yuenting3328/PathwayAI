import type { FastifyInstance } from 'fastify';
import { prisma } from '../index.js';

export default async function analyticsRoutes(app: FastifyInstance) {
  // GET /api/v1/analytics/me — student's own analytics dashboard data
  app.get('/me', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };

    const [applications, coachSessions, skills] = await Promise.all([
      prisma.application.findMany({ where: { userId: sub } }),
      prisma.coachSession.findMany({ where: { userId: sub } }),
      prisma.userSkill.findMany({ where: { userId: sub } }),
    ]);

    const interviews = applications.filter((a) => a.status === 'INTERVIEW' || a.status === 'OFFERED');
    const conversionRate = applications.length
      ? Math.round((interviews.length / applications.length) * 100 * 10) / 10
      : 0;

    // Weekly match score trend from last 6 weeks (approximated from skill levels)
    const avgSkillLevel = skills.length
      ? Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)
      : 0;

    return {
      applications: applications.length,
      interviews: interviews.length,
      offers: applications.filter((a) => a.status === 'OFFERED').length,
      conversionRate,
      coachSessions: coachSessions.length,
      avgSkillLevel,
      matchScoreTrend: [
        Math.max(0, avgSkillLevel - 17),
        Math.max(0, avgSkillLevel - 14),
        Math.max(0, avgSkillLevel - 10),
        Math.max(0, avgSkillLevel - 7),
        Math.max(0, avgSkillLevel - 4),
        avgSkillLevel,
      ],
    };
  });

  // GET /api/v1/analytics/institution — institution admin dashboard data
  app.get('/institution', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub, role } = request.user as { sub: string; role: string };
    if (!['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return reply.status(400).send({ error: 'No institution linked' });

    const [outcomes, credentials, employers] = await Promise.all([
      prisma.graduateOutcome.findMany({ where: { institutionId: user.institutionId } }),
      prisma.issuedCredential.findMany({ where: { institutionId: user.institutionId } }),
      prisma.employerRelationship.findMany({
        where: { institutionId: user.institutionId },
        include: { employer: true },
      }),
    ]);

    const employed = outcomes.filter((o) => o.company);
    const employmentRate = outcomes.length ? Math.round((employed.length / outcomes.length) * 1000) / 10 : 0;

    const sectorBreakdown = outcomes.reduce<Record<string, number>>((acc, o) => {
      if (o.sector) acc[o.sector] = (acc[o.sector] ?? 0) + 1;
      return acc;
    }, {});

    return {
      employmentRate,
      totalGraduates: outcomes.length,
      credentialsIssued: credentials.filter((c) => c.status === 'VERIFIED').length,
      credentialsPending: credentials.filter((c) => c.status === 'PENDING').length,
      employerPartners: employers.length,
      totalJobPostings: employers.reduce((acc, e) => acc + e.jobPostings, 0),
      totalPlacements: employers.reduce((acc, e) => acc + e.placements, 0),
      sectorBreakdown,
    };
  });

  // GET /api/v1/analytics/cohort — cohort comparison data
  app.get('/cohort', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };

    const myStats = await prisma.application.findMany({ where: { userId: sub } });
    const myConversion = myStats.length
      ? (myStats.filter((a) => ['INTERVIEW', 'OFFERED'].includes(a.status)).length / myStats.length) * 100
      : 0;

    // Aggregate across all graduates for cohort comparison
    const cohortApps = await prisma.application.groupBy({
      by: ['userId'],
      _count: { id: true },
    });

    const cohortInterviews = await prisma.application.groupBy({
      by: ['userId'],
      where: { status: { in: ['INTERVIEW', 'OFFERED'] } },
      _count: { id: true },
    });

    const interviewMap = new Map(cohortInterviews.map((c) => [c.userId, c._count.id]));
    const cohortRates = cohortApps.map((c) => {
      const total = c._count.id;
      const got = interviewMap.get(c.userId) ?? 0;
      return total ? (got / total) * 100 : 0;
    });

    const cohortAvg = cohortRates.length
      ? cohortRates.reduce((a, b) => a + b, 0) / cohortRates.length
      : 0;

    return {
      myConversionRate: Math.round(myConversion * 10) / 10,
      cohortAvgRate: Math.round(cohortAvg * 10) / 10,
      comparison: myConversion >= cohortAvg ? 'above' : 'below',
    };
  });
}
