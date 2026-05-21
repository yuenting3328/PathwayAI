import type { FastifyInstance } from 'fastify';
import { prisma } from '../index.js';

export default async function analyticsRoutes(app: FastifyInstance) {
  // GET /api/v1/analytics/me — student's own analytics dashboard data
  app.get('/me', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };

    const sixWeeksAgo = new Date(Date.now() - 42 * 24 * 60 * 60 * 1000);
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    const [allApplications, recentApplications, coachSessions, skills] = await Promise.all([
      prisma.application.findMany({ where: { userId: sub } }),
      prisma.application.findMany({
        where: { userId: sub, appliedDate: { gte: sixWeeksAgo } },
        select: { appliedDate: true, status: true },
      }),
      prisma.coachSession.findMany({ where: { userId: sub } }),
      prisma.userSkill.findMany({ where: { userId: sub } }),
    ]);

    const interviews = allApplications.filter((a) => a.status === 'INTERVIEW' || a.status === 'OFFERED');
    const conversionRate = allApplications.length
      ? Math.round((interviews.length / allApplications.length) * 100 * 10) / 10
      : 0;

    const avgSkillLevel = skills.length
      ? Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)
      : 0;

    // Weekly interview conversion rate over last 6 weeks; falls back to avgSkillLevel when no data
    const now = Date.now();
    const matchScoreTrend = Array.from({ length: 6 }, (_, i) => {
      const weekStart = new Date(now - (6 - i) * weekMs);
      const weekEnd = new Date(now - (5 - i) * weekMs);
      const weekApps = recentApplications.filter(
        (a) => a.appliedDate >= weekStart && a.appliedDate < weekEnd,
      );
      if (weekApps.length === 0) return avgSkillLevel;
      const weekInterviews = weekApps.filter((a) =>
        ['INTERVIEW', 'OFFERED'].includes(a.status),
      );
      return Math.round((weekInterviews.length / weekApps.length) * 100);
    });

    return {
      applications: allApplications.length,
      interviews: interviews.length,
      offers: allApplications.filter((a) => a.status === 'OFFERED').length,
      conversionRate,
      coachSessions: coachSessions.length,
      avgSkillLevel,
      matchScoreTrend,
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

    const [outcomes, credentials, employers, alumniCount, coachingSessionCount, totalApplications] = await Promise.all([
      prisma.graduateOutcome.findMany({ where: { institutionId: user.institutionId } }),
      prisma.issuedCredential.findMany({ where: { institutionId: user.institutionId } }),
      prisma.employerRelationship.findMany({
        where: { institutionId: user.institutionId },
        include: { employer: true },
      }),
      prisma.user.count({ where: { institutionId: user.institutionId, role: 'GRADUATE' } }),
      prisma.coachSession.count({ where: { user: { institutionId: user.institutionId } } }),
      prisma.application.count({
        where: { user: { institutionId: user.institutionId } },
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
      totalApplications,
      sectorBreakdown,
      alumniCount,
      coachingSessionCount,
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
