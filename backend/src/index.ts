import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import sensible from '@fastify/sensible';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import skillRoutes from './routes/skills.js';
import credentialRoutes from './routes/credentials.js';
import coachRoutes from './routes/coaching.js';
import programmeRoutes from './routes/programmes.js';
import analyticsRoutes from './routes/analytics.js';
import marketRoutes from './routes/market.js';
import institutionRoutes from './routes/institution.js';
import employerRoutes from './routes/employers.js';
import outcomeRoutes from './routes/outcomes.js';
import recruiterRoutes from './routes/recruiters.js';
import sseRoutes from './routes/sse.js';
import notificationRoutes from './routes/notifications.js';

const app = Fastify({ logger: true });
export const prisma = new PrismaClient();

await app.register(cors, {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:5179',
    'http://localhost:5180',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET ?? 'pathwayai-dev-secret-change-in-production',
  sign: { expiresIn: '15m' },
});

await app.register(sensible);
await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

// Auth middleware decorator
app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch {
    reply.unauthorized('Invalid or expired token');
  }
});

// Route prefix /api/v1
await app.register(authRoutes, { prefix: '/api/v1/auth' });
await app.register(jobRoutes, { prefix: '/api/v1/jobs' });
await app.register(applicationRoutes, { prefix: '/api/v1/applications' });
await app.register(skillRoutes, { prefix: '/api/v1/skills' });
await app.register(credentialRoutes, { prefix: '/api/v1/credentials' });
await app.register(coachRoutes, { prefix: '/api/v1/coach' });
await app.register(programmeRoutes, { prefix: '/api/v1/programmes' });
await app.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
await app.register(marketRoutes, { prefix: '/api/v1/market' });
await app.register(institutionRoutes, { prefix: '/api/v1/institution' });
await app.register(employerRoutes, { prefix: '/api/v1/employers' });
await app.register(outcomeRoutes, { prefix: '/api/v1/outcomes' });
await app.register(recruiterRoutes, { prefix: '/api/v1/recruiters' });
await app.register(sseRoutes, { prefix: '/api/v1/events' });
await app.register(notificationRoutes, { prefix: '/api/v1/notifications' });

app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// TEMP — remove after demo setup
app.post('/api/v1/_seed', async (_req, reply) => {
  // Wake Neon with retry (cold-start can take up to 10s)
  for (let i = 1; i <= 8; i++) {
    try { await prisma.$queryRaw`SELECT 1`; break; }
    catch { if (i === 8) return reply.status(503).send({ ok: false, error: 'DB unreachable' }); await new Promise(r => setTimeout(r, 4000)); }
  }

  // Apply missing migrations (idempotent)
  const migrations = [
    `ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "jobStatus" TEXT NOT NULL DEFAULT 'OPEN'`,
    `ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "createdByUserId" TEXT`,
    `ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "employerId" TEXT`,
    `ALTER TABLE "IssuedCredential" ADD COLUMN IF NOT EXISTS "graduateUserId" TEXT`,
    `ALTER TABLE "CompetencyFeedback" ADD COLUMN IF NOT EXISTS "employerId" TEXT`,
    `CREATE TABLE IF NOT EXISTS "CampusEvent" ("id" TEXT NOT NULL, "recruiterId" TEXT NOT NULL, "title" TEXT NOT NULL, "type" TEXT NOT NULL, "date" TIMESTAMP(3) NOT NULL, "time" TEXT NOT NULL, "location" TEXT NOT NULL, "universityPartner" TEXT NOT NULL, "expectedAttendance" INTEGER NOT NULL DEFAULT 0, "description" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CampusEvent_pkey" PRIMARY KEY ("id"))`,
    `CREATE TABLE IF NOT EXISTS "Notification" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" TEXT NOT NULL, "title" TEXT NOT NULL, "message" TEXT NOT NULL, "read" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"))`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='Job_createdByUserId_fkey') THEN ALTER TABLE "Job" ADD CONSTRAINT "Job_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='Job_employerId_fkey') THEN ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='IssuedCredential_graduateUserId_fkey') THEN ALTER TABLE "IssuedCredential" ADD CONSTRAINT "IssuedCredential_graduateUserId_fkey" FOREIGN KEY ("graduateUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; END IF; END $$`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='Notification_userId_fkey') THEN ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='CampusEvent_recruiterId_fkey') THEN ALTER TABLE "CampusEvent" ADD CONSTRAINT "CampusEvent_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$`,
    `CREATE INDEX IF NOT EXISTS "Application_stage_idx" ON "Application"("stage")`,
  ];
  for (const sql of migrations) {
    try { await prisma.$executeRawUnsafe(sql); } catch { /* skip if already applied */ }
  }

  // Seed employers
  const employerRows = [
    { name:'HSBC', sector:'Banking', district:'Central' },
    { name:'Standard Chartered', sector:'Banking', district:'Wan Chai' },
    { name:'Bank of China', sector:'Banking', district:'Central & Western' },
    { name:'PwC', sector:'Professional Services', district:'Central' },
    { name:'Deloitte', sector:'Professional Services', district:'Admiralty' },
    { name:'Alibaba Cloud', sector:'Technology', district:'Tsim Sha Tsui' },
    { name:'JP Morgan', sector:'Finance', district:'Central' },
    { name:'Goldman Sachs', sector:'Finance', district:'Central' },
    { name:'EY', sector:'Professional Services', district:'Quarry Bay' },
    { name:'KPMG', sector:'Professional Services', district:'Kowloon Bay' },
    { name:'Hang Seng Bank', sector:'Banking', district:'Central' },
    { name:'Cathay Pacific', sector:'Aviation', district:'Lantau' },
    { name:'Hospital Authority', sector:'Healthcare', district:'Kowloon' },
    { name:'MTR Corporation', sector:'Transport', district:'Kowloon Bay' },
    { name:'Tencent', sector:'Technology', district:'Tsim Sha Tsui' },
  ];
  await prisma.employer.createMany({ data: employerRows, skipDuplicates: true });

  const deadline = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const jobs = [
    { id:'job-01', title:'Data Analyst', company:'HSBC', district:'Central', salaryMin:35000, salaryMax:50000, sector:'Banking', responsibilities:'Analyze customer data, create dashboards, support business decisions with data-driven insights', requirements:'Bachelor degree, SQL, Python, 1-2 years experience preferred', skills:['SQL','Python','Data Visualization','Excel','Tableau','Statistics'], deadline },
    { id:'job-02', title:'Business Analyst', company:'Standard Chartered', district:'Wan Chai', salaryMin:40000, salaryMax:55000, sector:'Banking', responsibilities:'Gather requirements, document processes, liaise with stakeholders across departments', requirements:'Bachelor degree, business analysis, strong communication skills', skills:['Requirements Analysis','Documentation','Stakeholder Management','SQL','PowerPoint'], deadline },
    { id:'job-03', title:'Cybersecurity Analyst', company:'Bank of China', district:'Central & Western', salaryMin:45000, salaryMax:65000, sector:'Banking', responsibilities:'Monitor security systems, respond to incidents, conduct vulnerability assessments', requirements:'IT degree, security certifications preferred, 2+ years experience', skills:['Network Security','SIEM','Incident Response','Firewalls','Linux'], deadline },
    { id:'job-04', title:'Technology Consultant', company:'PwC', district:'Central', salaryMin:38000, salaryMax:52000, sector:'Professional Services', responsibilities:'Advise clients on technology strategy and digital transformation initiatives', requirements:'Bachelor degree, IT knowledge, consulting mindset, client-facing experience', skills:['Project Management','Communication','PowerPoint','Excel','SQL','Agile'], deadline },
    { id:'job-05', title:'Audit Associate', company:'Deloitte', district:'Admiralty', salaryMin:30000, salaryMax:40000, sector:'Professional Services', responsibilities:'Conduct financial audits, prepare audit reports, work directly with clients', requirements:'Accounting degree preferred, pursuing HKICPA or ACCA qualification', skills:['Accounting','Excel','Financial Analysis','Communication','Attention to Detail','IFRS'], deadline },
    { id:'job-06', title:'Cloud Solutions Architect', company:'Alibaba Cloud', district:'Tsim Sha Tsui', salaryMin:55000, salaryMax:80000, sector:'Technology', responsibilities:'Design cloud infrastructure, work with enterprise clients on digital transformation', requirements:'Computer Science degree, cloud certifications (AWS/Azure/Alibaba), 2+ years', skills:['Cloud Computing','Python','Linux','Docker','Kubernetes','Architecture Design'], deadline },
    { id:'job-07', title:'Investment Analyst', company:'JP Morgan', district:'Central', salaryMin:50000, salaryMax:75000, sector:'Finance', responsibilities:'Research securities, build financial models, support portfolio managers', requirements:'Finance or Economics degree, CFA pursuing, strong quantitative skills', skills:['Financial Modeling','Excel','Python','Bloomberg','Financial Analysis','Presentation'], deadline },
    { id:'job-08', title:'Risk Analyst', company:'Goldman Sachs', district:'Central', salaryMin:52000, salaryMax:72000, sector:'Finance', responsibilities:'Monitor market risk, credit risk, develop risk models and stress tests', requirements:'Quantitative degree (Math/Statistics/Physics), strong programming skills', skills:['Statistics','Python','R','Financial Modeling','Risk Management','SQL'], deadline },
    { id:'job-09', title:'Tax Consultant', company:'EY', district:'Quarry Bay', salaryMin:32000, salaryMax:44000, sector:'Professional Services', responsibilities:'Advise corporate clients on tax planning, prepare tax filings, manage client relationships', requirements:'Accounting or Law degree, pursuing CPA or tax qualification', skills:['Accounting','Tax Law','Excel','Communication','Research','Attention to Detail'], deadline },
    { id:'job-10', title:'Management Consultant', company:'KPMG', district:'Kowloon Bay', salaryMin:40000, salaryMax:58000, sector:'Professional Services', responsibilities:'Deliver strategy and operations consulting engagements, create client presentations', requirements:'MBA or top undergraduate degree, 1-3 years experience preferred', skills:['Strategy','PowerPoint','Excel','Communication','Project Management','Problem Solving'], deadline },
    { id:'job-11', title:'Digital Marketing Analyst', company:'Hang Seng Bank', district:'Central', salaryMin:28000, salaryMax:38000, sector:'Banking', responsibilities:'Manage digital marketing campaigns, analyse customer engagement, optimize conversion', requirements:'Marketing or Business degree, Google Analytics certified preferred', skills:['Digital Marketing','Google Analytics','Excel','SEO','Content Marketing','Data Visualization'], deadline },
    { id:'job-12', title:'Revenue Management Analyst', company:'Cathay Pacific', district:'Lantau', salaryMin:32000, salaryMax:46000, sector:'Aviation', responsibilities:'Optimize seat pricing using analytics, monitor competitive fares, forecast demand', requirements:'Business or Engineering degree, strong analytical skills, Excel proficiency', skills:['Excel','Statistics','Data Analysis','SQL','Forecasting','PowerPoint'], deadline },
    { id:'job-13', title:'Healthcare IT Analyst', company:'Hospital Authority', district:'Kowloon', salaryMin:33000, salaryMax:48000, sector:'Healthcare', responsibilities:'Support clinical information systems, gather requirements from medical staff, improve workflows', requirements:'IT or Healthcare Informatics degree, strong communication skills', skills:['Requirements Analysis','SQL','Project Management','Communication','Documentation','Healthcare IT'], deadline },
    { id:'job-14', title:'Operations Analyst', company:'MTR Corporation', district:'Kowloon Bay', salaryMin:30000, salaryMax:42000, sector:'Transport', responsibilities:'Analyse operational data, improve efficiency of rail operations, stakeholder coordination', requirements:'Engineering or Business degree, analytical mindset, interest in infrastructure', skills:['Data Analysis','Excel','SQL','Project Management','Stakeholder Management','PowerPoint'], deadline },
    { id:'job-15', title:'Product Manager – FinTech', company:'Tencent', district:'Tsim Sha Tsui', salaryMin:55000, salaryMax:85000, sector:'Technology', responsibilities:'Define product roadmap for payment and financial products, work with engineering and design', requirements:'3+ years product management experience, fintech background preferred', skills:['Product Management','Agile','User Research','Data Analysis','Communication','SQL'], deadline },
  ];
  await prisma.job.createMany({ data: jobs, skipDuplicates: true });

  // Seed applications for the demo student
  const student = await prisma.user.findUnique({ where: { email: 'student@cuhk.edu.hk' } });
  if (student) {
    const apps = [
      { id:'app-01', userId:student.id, jobId:'job-01', status:'INTERVIEW' as const, stage:'Second Round', appliedDate:new Date('2026-04-15'), interviewDate:new Date('2026-05-20') },
      { id:'app-02', userId:student.id, jobId:'job-02', status:'PENDING' as const, stage:'Under Review', appliedDate:new Date('2026-04-20') },
      { id:'app-03', userId:student.id, jobId:'job-03', status:'INTERVIEW' as const, stage:'First Round', appliedDate:new Date('2026-04-10'), interviewDate:new Date('2026-05-18') },
      { id:'app-04', userId:student.id, jobId:'job-04', status:'REJECTED' as const, stage:'Not Selected', appliedDate:new Date('2026-03-28') },
      { id:'app-05', userId:student.id, jobId:'job-05', status:'PENDING' as const, stage:'Application Submitted', appliedDate:new Date('2026-05-05') },
      { id:'app-06', userId:student.id, jobId:'job-07', status:'INTERVIEW' as const, stage:'Final Round', appliedDate:new Date('2026-04-25'), interviewDate:new Date('2026-05-22') },
      { id:'app-07', userId:student.id, jobId:'job-10', status:'PENDING' as const, stage:'Online Assessment', appliedDate:new Date('2026-05-01') },
      { id:'app-08', userId:student.id, jobId:'job-12', status:'OFFERED' as const, stage:'Offer Received', appliedDate:new Date('2026-03-15'), interviewDate:new Date('2026-04-10') },
      { id:'app-09', userId:student.id, jobId:'job-06', status:'PENDING' as const, stage:'CV Screening', appliedDate:new Date('2026-05-08') },
    ];
    await prisma.application.createMany({ data: apps, skipDuplicates: true });
  }

  // Seed user credentials for demo
  if (student) {
    const creds = [
      { id:'cred-01', userId:student.id, category:'Degree & Transcript', name:'Bachelor of Computer Science', issuer:'CUHK', status:'VERIFIED' as const, issuedDate:new Date('2025-06-01') },
      { id:'cred-02', userId:student.id, category:'HEAR', name:'Higher Education Achievement Report', issuer:'CUHK', status:'PENDING' as const },
      { id:'cred-03', userId:student.id, category:'Certificates', name:'Python for Data Science', issuer:'Coursera', status:'VERIFIED' as const, issuedDate:new Date('2025-03-15') },
    ];
    await prisma.userCredential.createMany({ data: creds, skipDuplicates: true });
  }

  const jobCount = await prisma.job.count();
  return reply.send({ ok: true, jobs: jobCount });
});

// TEMP — reset demo applications to a clean state
app.post('/api/v1/_reset-demo', async (_req, reply) => {
  const student = await prisma.user.findUnique({ where: { email: 'student@cuhk.edu.hk' } });
  if (!student) return reply.status(404).send({ ok: false, error: 'Student not found' });

  // Delete all existing applications for the demo student
  await prisma.application.deleteMany({ where: { userId: student.id } });

  // Re-create 3 focused demo apps: interview, pending, offered
  await prisma.application.createMany({
    data: [
      { id:'demo-app-01', userId:student.id, jobId:'job-01', status:'INTERVIEW', stage:'Second Round', appliedDate:new Date('2026-04-15'), interviewDate:new Date('2026-05-28') },
      { id:'demo-app-02', userId:student.id, jobId:'job-07', status:'PENDING',   stage:'Under Review',  appliedDate:new Date('2026-05-01') },
      { id:'demo-app-03', userId:student.id, jobId:'job-12', status:'OFFERED',   stage:'Offer Received', appliedDate:new Date('2026-03-20'), interviewDate:new Date('2026-04-10') },
    ],
    skipDuplicates: true,
  });

  const available = await prisma.job.count({ where: { isActive:true, id:{ notIn:['job-01','job-07','job-12'] } } });
  return reply.send({ ok: true, demoApps: 3, availableJobs: available });
});


const port = Number(process.env.PORT ?? 4000);
await app.listen({ port, host: '0.0.0.0' });
console.log(`PathwayAI backend running on http://localhost:${port}`);

// Keep Neon awake: ping immediately on start, then every 3 min
const keepAlive = async () => {
  for (let i = 0; i < 5; i++) {
    try { await prisma.$queryRaw`SELECT 1`; return; }
    catch { await new Promise(r => setTimeout(r, 4000)); }
  }
};
keepAlive();
setInterval(keepAlive, 3 * 60 * 1000);
