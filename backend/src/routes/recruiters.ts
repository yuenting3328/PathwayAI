import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';
import { emit } from '../events.js';

// Guard: only RECRUITER or SUPER_ADMIN
async function requireRecruiter(request: any, reply: any) {
  await request.jwtVerify();
  const { role } = request.user as { role: string };
  if (!['RECRUITER', 'SUPER_ADMIN'].includes(role)) {
    return reply.status(403).send({ error: 'Forbidden' });
  }
}

export default async function recruiterRoutes(app: FastifyInstance) {

  // ── Jobs ────────────────────────────────────────────────────────────────────

  // GET /api/v1/recruiters/jobs — list jobs posted by this recruiter
  app.get('/jobs', { preHandler: [requireRecruiter] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const jobs = await prisma.job.findMany({
      where: { createdByUserId: sub },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map((j) => ({
      id: j.id,
      title: j.title,
      sector: j.sector ?? 'Other',
      district: j.district,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      deadline: j.deadline?.toISOString() ?? null,
      status: j.jobStatus as 'OPEN' | 'DRAFT' | 'CLOSED',
      applicantCount: j._count.applications,
      description: j.responsibilities,
      skills: j.skills,
    }));
  });

  // POST /api/v1/recruiters/jobs — create a job (writes to shared Job table)
  app.post('/jobs', { preHandler: [requireRecruiter] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const schema = z.object({
      title: z.string().min(1),
      sector: z.string().optional(),
      district: z.string(),
      salaryMin: z.number().min(0),
      salaryMax: z.number().min(0),
      deadline: z.string().optional(),
      skills: z.array(z.string()).default([]),
      description: z.string().optional(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    // Resolve company name from recruiter email domain
    const recruiter = await prisma.user.findUnique({ where: { id: sub } });
    const companySlug = recruiter?.email.split('@')[1]?.split('.')[0] ?? 'Company';

    // Prefer an exact Employer record match; otherwise title-case or uppercase short slugs
    const employer = await prisma.employer.findFirst({
      where: { name: { contains: companySlug, mode: 'insensitive' } },
    });
    const company = employer?.name ?? (companySlug.length <= 5
      ? companySlug.toUpperCase()
      : companySlug.charAt(0).toUpperCase() + companySlug.slice(1));

    const job = await prisma.job.create({
      data: {
        title: body.data.title,
        company,
        district: body.data.district,
        salaryMin: body.data.salaryMin,
        salaryMax: body.data.salaryMax,
        responsibilities: body.data.description ?? '',
        requirements: '',
        skills: body.data.skills,
        sector: body.data.sector ?? null,
        deadline: body.data.deadline ? new Date(body.data.deadline) : null,
        isActive: true,
        jobStatus: 'OPEN',
        createdByUserId: sub,
        employerId: employer?.id ?? null,
      },
    });
    return reply.status(201).send({
      id: job.id,
      title: job.title,
      sector: job.sector ?? 'Other',
      district: job.district,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      deadline: job.deadline?.toISOString() ?? null,
      status: 'OPEN',
      applicantCount: 0,
      description: job.responsibilities,
      skills: job.skills,
    });
  });

  // PATCH /api/v1/recruiters/jobs/:id — update a job
  app.patch('/jobs/:id', { preHandler: [requireRecruiter] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.createdByUserId !== sub) return reply.status(404).send({ error: 'Not found' });

    const schema = z.object({
      title: z.string().optional(),
      sector: z.string().optional(),
      district: z.string().optional(),
      salaryMin: z.number().optional(),
      salaryMax: z.number().optional(),
      deadline: z.string().optional(),
      skills: z.array(z.string()).optional(),
      description: z.string().optional(),
      status: z.enum(['OPEN', 'DRAFT', 'CLOSED']).optional(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const updated = await prisma.job.update({
      where: { id },
      data: {
        ...(body.data.title && { title: body.data.title }),
        ...(body.data.sector !== undefined && { sector: body.data.sector }),
        ...(body.data.district && { district: body.data.district }),
        ...(body.data.salaryMin !== undefined && { salaryMin: body.data.salaryMin }),
        ...(body.data.salaryMax !== undefined && { salaryMax: body.data.salaryMax }),
        ...(body.data.deadline && { deadline: new Date(body.data.deadline) }),
        ...(body.data.skills && { skills: body.data.skills }),
        ...(body.data.description !== undefined && { responsibilities: body.data.description }),
        ...(body.data.status && {
          jobStatus: body.data.status,
          isActive: body.data.status === 'OPEN',
        }),
      },
    });
    return {
      id: updated.id, title: updated.title, sector: updated.sector ?? 'Other',
      district: updated.district, salaryMin: updated.salaryMin, salaryMax: updated.salaryMax,
      deadline: updated.deadline?.toISOString() ?? null,
      status: updated.jobStatus as 'OPEN' | 'DRAFT' | 'CLOSED',
      applicantCount: 0, description: updated.responsibilities, skills: updated.skills,
    };
  });

  // DELETE /api/v1/recruiters/jobs/:id — hard-delete a job and its applications
  app.delete('/jobs/:id', { preHandler: [requireRecruiter] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.createdByUserId !== sub) return reply.status(404).send({ error: 'Not found' });

    await prisma.application.deleteMany({ where: { jobId: id } });
    await prisma.savedJob.deleteMany({ where: { jobId: id } });
    await prisma.job.delete({ where: { id } });
    return { success: true };
  });

  // ── Candidates ──────────────────────────────────────────────────────────────

  // GET /api/v1/recruiters/candidates — applications for this recruiter's jobs
  app.get('/candidates', { preHandler: [requireRecruiter] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const query = z.object({ jobId: z.string().optional() }).parse(request.query);

    const recruiterJobIds = (
      await prisma.job.findMany({ where: { createdByUserId: sub }, select: { id: true } })
    ).map((j) => j.id);

    const where: any = { jobId: { in: recruiterJobIds } };
    if (query.jobId) where.jobId = query.jobId;

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: { select: { title: true, skills: true } },
        user: {
          select: {
            id: true,
            profile: {
              select: { name: true, university: true, faculty: true, graduationYear: true },
            },
            skills: { include: { skill: { select: { name: true } } }, orderBy: { level: 'desc' } },
          },
        },
      },
      orderBy: { appliedDate: 'desc' },
    });

    return applications.map((a) => {
      const profile = a.user.profile;
      const jobSkills = new Set((a.job?.skills ?? []).map((s) => s.toLowerCase()));
      const userSkillNames = a.user.skills.map((us) => us.skill.name.toLowerCase());
      const matchScore = jobSkills.size
        ? Math.round((userSkillNames.filter((s) => jobSkills.has(s)).length / jobSkills.size) * 100)
        : 0;
      return {
        id: a.id,
        jobId: a.jobId,
        jobTitle: a.job?.title ?? '',
        // Map backend stage to recruiter pipeline stage
        status: stageToRecruiterStatus(a.stage),
        appliedDate: a.appliedDate.toISOString(),
        graduate: {
          userId: a.user.id,
          name: profile?.name ?? a.user.id.slice(-6),
          university: profile?.university ?? 'Unknown',
          faculty: profile?.faculty ?? undefined,
          graduationYear: profile?.graduationYear ?? undefined,
          matchScore,
        },
      };
    });
  });

  // GET /api/v1/recruiters/candidates/:id — full candidate detail
  app.get('/candidates/:id', { preHandler: [requireRecruiter] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: { select: { id: true, title: true, skills: true } },
        user: {
          include: {
            profile: true,
            skills: { include: { skill: true }, orderBy: { level: 'desc' } },
            credentials: { where: { status: 'VERIFIED' } },
          },
        },
      },
    });
    if (!application) return reply.status(404).send({ error: 'Not found' });

    // Verify this application is for one of the recruiter's jobs
    const recruiterJob = await prisma.job.findFirst({
      where: { id: application.jobId, createdByUserId: sub },
    });
    if (!recruiterJob) return reply.status(403).send({ error: 'Forbidden' });

    const profile = application.user.profile;
    const jobSkills = new Set((application.job?.skills ?? []).map((s) => s.toLowerCase()));
    const userSkillNames = application.user.skills.map((us) => us.skill.name.toLowerCase());
    const matchScore = jobSkills.size
      ? Math.round((userSkillNames.filter((s) => jobSkills.has(s)).length / jobSkills.size) * 100)
      : 0;

    return {
      id: application.id,
      jobId: application.jobId,
      jobTitle: application.job?.title ?? '',
      status: stageToRecruiterStatus(application.stage),
      appliedDate: application.appliedDate.toISOString(),
      graduate: {
        userId: application.user.id,
        name: profile?.name ?? application.user.id.slice(-6),
        university: profile?.university ?? 'Unknown',
        faculty: profile?.faculty ?? undefined,
        graduationYear: profile?.graduationYear ?? undefined,
        matchScore,
        gpa: profile?.gpa ?? undefined,
        bio: profile?.bio ?? undefined,
        skills: application.user.skills.map((us) => ({ name: us.skill.name, level: us.level })),
        credentials: application.user.credentials.map((c) => ({
          name: c.name,
          type: c.category,
          status: c.status,
          issuer: c.issuer,
        })),
      },
    };
  });

  // PATCH /api/v1/recruiters/candidates/:id — advance or reject a candidate
  app.patch('/candidates/:id', { preHandler: [requireRecruiter] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };

    const schema = z.object({
      status: z.enum(['APPLIED', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'REJECTED']),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) return reply.status(404).send({ error: 'Not found' });

    const recruiterJob = await prisma.job.findFirst({
      where: { id: application.jobId, createdByUserId: sub },
    });
    if (!recruiterJob) return reply.status(403).send({ error: 'Forbidden' });

    const { stage, status } = recruiterStatusToStageAndEnum(body.data.status);
    await prisma.application.update({
      where: { id },
      data: { stage, ...(status && { status }) },
    });

    // Notify the graduate for all status changes except APPLIED
    if (['SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'REJECTED'].includes(body.data.status)) {
      const job = await prisma.job.findUnique({
        where: { id: application.jobId },
        select: { title: true, company: true },
      });
      const notif =
        body.data.status === 'SHORTLISTED'
          ? {
              title: 'You\'ve been Shortlisted!',
              message: `Great news! You've been shortlisted for ${job?.title ?? 'a role'} at ${job?.company ?? 'the employer'}.`,
            }
          : body.data.status === 'INTERVIEWING'
          ? {
              title: 'Interview Scheduled',
              message: `You've been selected for an interview for ${job?.title ?? 'a role'} at ${job?.company ?? 'the employer'}.`,
            }
          : body.data.status === 'OFFERED'
          ? {
              title: 'Offer Received',
              message: `Congratulations! You have received an offer for ${job?.title ?? 'a role'} at ${job?.company ?? 'the employer'}.`,
            }
          : {
              title: 'Application Update',
              message: `Your application for ${job?.title ?? 'a role'} at ${job?.company ?? 'the employer'} was not selected.`,
            };
      await prisma.notification.create({
        data: { userId: application.userId, type: 'STAGE_CHANGE', applicationId: id, ...notif },
      });
      emit({ type: 'STAGE_CHANGE', userId: application.userId, applicationId: id, ...notif });
    }

    return { id, status: body.data.status };
  });

  // ── Campus Events ────────────────────────────────────────────────────────────

  // GET /api/v1/recruiters/events
  app.get('/events', { preHandler: [requireRecruiter] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const events = await prisma.campusEvent.findMany({
      where: { recruiterId: sub },
      orderBy: { date: 'asc' },
    });
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      date: e.date.toISOString(),
      time: e.time,
      location: e.location,
      universityPartner: e.universityPartner,
      expectedAttendance: e.expectedAttendance,
      description: e.description ?? undefined,
    }));
  });

  // POST /api/v1/recruiters/events
  app.post('/events', { preHandler: [requireRecruiter] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const schema = z.object({
      title: z.string().min(1),
      type: z.enum(['CAREER_FAIR', 'WORKSHOP', 'NETWORKING', 'INFO_SESSION']),
      date: z.string().datetime(),
      time: z.string(),
      location: z.string(),
      universityPartner: z.string(),
      expectedAttendance: z.number().min(0).default(0),
      description: z.string().optional(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const event = await prisma.campusEvent.create({
      data: { recruiterId: sub, ...body.data, date: new Date(body.data.date) },
    });
    return reply.status(201).send({
      ...event,
      date: event.date.toISOString(),
      description: event.description ?? undefined,
    });
  });

  // ── Analytics ────────────────────────────────────────────────────────────────

  // GET /api/v1/recruiters/analytics
  app.get('/analytics', { preHandler: [requireRecruiter] }, async (request) => {
    const { sub } = request.user as { sub: string };

    const jobs = await prisma.job.findMany({
      where: { createdByUserId: sub },
      include: { _count: { select: { applications: true } }, applications: true },
    });

    const activeJobs = jobs.filter((j) => j.isActive).length;
    const allApps = jobs.flatMap((j) => j.applications);
    const totalApplications = allApps.length;
    const shortlisted = allApps.filter((a) =>
      ['Shortlisted', 'Interviewing'].includes(a.stage),
    ).length;
    const offersMade = allApps.filter((a) => a.status === 'OFFERED').length;

    // Avg time to hire (days from applied to OFFERED)
    const offeredApps = allApps.filter((a) => a.status === 'OFFERED');
    const avgTimeToHire = offeredApps.length
      ? Math.round(
          offeredApps.reduce((acc, a) => {
            const days = (a.updatedAt.getTime() - a.appliedDate.getTime()) / 86_400_000;
            return acc + days;
          }, 0) / offeredApps.length,
        )
      : 0;

    // Top university from applicant profiles
    const applicantIds = allApps.map((a) => a.userId);
    const profiles = applicantIds.length
      ? await prisma.profile.findMany({
          where: { userId: { in: applicantIds } },
          select: { university: true },
        })
      : [];
    const uniCounts: Record<string, number> = {};
    for (const p of profiles) {
      if (p.university) uniCounts[p.university] = (uniCounts[p.university] ?? 0) + 1;
    }
    const topUniversity =
      Object.entries(uniCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

    // 6-month pipeline trend
    const sixMonthsAgo = new Date(Date.now() - 180 * 86_400_000);
    const recentApps = allApps.filter((a) => a.appliedDate >= sixMonthsAgo);
    const monthLabels = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleString('default', { month: 'short' });
    });
    const pipelineTrend = monthLabels.map((month, i) => {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - (5 - i), 1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      const monthApps = recentApps.filter((a) => a.appliedDate >= monthStart && a.appliedDate < monthEnd);
      return {
        month,
        applications: monthApps.length,
        shortlisted: monthApps.filter((a) => ['Shortlisted', 'Interviewing'].includes(a.stage)).length,
        offers: monthApps.filter((a) => a.status === 'OFFERED').length,
      };
    });

    // Sector breakdown from this recruiter's jobs
    const sectorBreakdown = jobs.reduce<Record<string, number>>((acc, j) => {
      const s = j.sector ?? 'Other';
      acc[s] = (acc[s] ?? 0) + j._count.applications;
      return acc;
    }, {});

    return {
      activeJobs,
      totalApplications,
      shortlisted,
      offersMade,
      avgTimeToHire,
      topUniversity,
      pipelineTrend,
      sectorBreakdown: Object.entries(sectorBreakdown).map(([sector, count]) => ({ sector, count })),
    };
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function stageToRecruiterStatus(
  stage: string,
): 'APPLIED' | 'SHORTLISTED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED' {
  if (stage === 'Shortlisted') return 'SHORTLISTED';
  if (stage === 'Interview Scheduled' || stage === 'Interviewing') return 'INTERVIEWING';
  if (stage === 'Offer Made' || stage === 'Offer Accepted') return 'OFFERED';
  if (stage === 'Rejected') return 'REJECTED';
  return 'APPLIED';
}

function recruiterStatusToStageAndEnum(
  recruiterStatus: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED',
): { stage: string; status?: 'PENDING' | 'INTERVIEW' | 'OFFERED' | 'REJECTED' } {
  switch (recruiterStatus) {
    case 'APPLIED':      return { stage: 'Application Submitted', status: 'PENDING' };
    case 'SHORTLISTED':  return { stage: 'Shortlisted' };
    case 'INTERVIEWING': return { stage: 'Interview Scheduled', status: 'INTERVIEW' };
    case 'OFFERED':      return { stage: 'Offer Made', status: 'OFFERED' };
    case 'REJECTED':     return { stage: 'Rejected', status: 'REJECTED' };
  }
}
