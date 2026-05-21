import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Institution ───────────────────────────────────────────────────────────
  const cuhk = await prisma.institution.upsert({
    where: { name: 'CUHK' },
    create: { name: 'CUHK', domain: 'cuhk.edu.hk' },
    update: {},
  });

  // ── Users ────────────────────────────────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cuhk.edu.hk' },
    create: {
      email: 'admin@cuhk.edu.hk',
      passwordHash: await bcrypt.hash('admin123456', 12),
      role: 'INSTITUTION_ADMIN',
      institutionId: cuhk.id,
    },
    update: {},
  });

  const gradUser = await prisma.user.upsert({
    where: { email: 'student@cuhk.edu.hk' },
    create: {
      email: 'student@cuhk.edu.hk',
      passwordHash: await bcrypt.hash('student123', 12),
      role: 'GRADUATE',
      institutionId: cuhk.id,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: 'recruiter@hsbc.com' },
    create: {
      email: 'recruiter@hsbc.com',
      passwordHash: await bcrypt.hash('recruiter123', 12),
      role: 'RECRUITER',
    },
    update: {},
  });

  await prisma.profile.upsert({
    where: { userId: gradUser.id },
    create: {
      userId: gradUser.id,
      name: 'Alex Chan',
      university: 'CUHK',
      faculty: 'Engineering',
      degreeLevel: 'Bachelor',
      graduationYear: 2026,
      targetRole: 'Data Analyst',
      targetSector: 'Banking',
      gpa: 3.6,
      location: 'Hong Kong',
    },
    update: { name: 'Alex Chan', targetRole: 'Data Analyst', targetSector: 'Banking', gpa: 3.6, location: 'Hong Kong' },
  });

  // ── Employers ─────────────────────────────────────────────────────────────
  const employerData = [
    { name: 'HSBC', sector: 'Banking', district: 'Central' },
    { name: 'Standard Chartered', sector: 'Banking', district: 'Wan Chai' },
    { name: 'Bank of China', sector: 'Banking', district: 'Central & Western' },
    { name: 'PwC', sector: 'Professional Services', district: 'Central' },
    { name: 'Deloitte', sector: 'Professional Services', district: 'Admiralty' },
    { name: 'Alibaba Cloud', sector: 'Technology', district: 'Tsim Sha Tsui' },
    { name: 'JP Morgan', sector: 'Finance', district: 'Central' },
    { name: 'Goldman Sachs', sector: 'Finance', district: 'Central' },
    { name: 'EY', sector: 'Professional Services', district: 'Quarry Bay' },
    { name: 'KPMG', sector: 'Professional Services', district: 'Kowloon Bay' },
    { name: 'Hang Seng Bank', sector: 'Banking', district: 'Central' },
    { name: 'Cathay Pacific', sector: 'Aviation', district: 'Lantau' },
    { name: 'Hospital Authority', sector: 'Healthcare', district: 'Kowloon' },
    { name: 'MTR Corporation', sector: 'Transport', district: 'Kowloon Bay' },
    { name: 'Tencent', sector: 'Technology', district: 'Tsim Sha Tsui' },
  ];
  const employers: Record<string, string> = {};
  for (const e of employerData) {
    const emp = await prisma.employer.upsert({ where: { name: e.name }, create: e, update: {} });
    employers[e.name] = emp.id;
  }

  // ── Jobs ──────────────────────────────────────────────────────────────────
  const jobsData = [
    { id: 'job-01', title: 'Data Analyst', company: 'HSBC', district: 'Central', salaryMin: 35000, salaryMax: 50000, sector: 'Banking', responsibilities: 'Analyze customer data, create dashboards, support business decisions with data-driven insights', requirements: 'Bachelor degree, SQL, Python, 1-2 years experience preferred', skills: ['SQL', 'Python', 'Data Visualization', 'Excel', 'Tableau', 'Statistics'] },
    { id: 'job-02', title: 'Business Analyst', company: 'Standard Chartered', district: 'Wan Chai', salaryMin: 40000, salaryMax: 55000, sector: 'Banking', responsibilities: 'Gather requirements, document processes, liaise with stakeholders across departments', requirements: 'Bachelor degree, business analysis, strong communication skills', skills: ['Requirements Analysis', 'Documentation', 'Stakeholder Management', 'SQL', 'PowerPoint'] },
    { id: 'job-03', title: 'Cybersecurity Analyst', company: 'Bank of China', district: 'Central & Western', salaryMin: 45000, salaryMax: 65000, sector: 'Banking', responsibilities: 'Monitor security systems, respond to incidents, conduct vulnerability assessments', requirements: 'IT degree, security certifications preferred, 2+ years experience', skills: ['Network Security', 'SIEM', 'Incident Response', 'Firewalls', 'Linux'] },
    { id: 'job-04', title: 'Technology Consultant', company: 'PwC', district: 'Central', salaryMin: 38000, salaryMax: 52000, sector: 'Professional Services', responsibilities: 'Advise clients on technology strategy and digital transformation initiatives', requirements: 'Bachelor degree, IT knowledge, consulting mindset, client-facing experience', skills: ['Project Management', 'Communication', 'PowerPoint', 'Excel', 'SQL', 'Agile'] },
    { id: 'job-05', title: 'Audit Associate', company: 'Deloitte', district: 'Admiralty', salaryMin: 30000, salaryMax: 40000, sector: 'Professional Services', responsibilities: 'Conduct financial audits, prepare audit reports, work directly with clients', requirements: 'Accounting degree preferred, pursuing HKICPA or ACCA qualification', skills: ['Accounting', 'Excel', 'Financial Analysis', 'Communication', 'Attention to Detail', 'IFRS'] },
    { id: 'job-06', title: 'Cloud Solutions Architect', company: 'Alibaba Cloud', district: 'Tsim Sha Tsui', salaryMin: 55000, salaryMax: 80000, sector: 'Technology', responsibilities: 'Design cloud infrastructure, work with enterprise clients on digital transformation', requirements: 'Computer Science degree, cloud certifications (AWS/Azure/Alibaba), 2+ years', skills: ['Cloud Computing', 'Python', 'Linux', 'Docker', 'Kubernetes', 'Architecture Design'] },
    { id: 'job-07', title: 'Investment Analyst', company: 'JP Morgan', district: 'Central', salaryMin: 50000, salaryMax: 75000, sector: 'Finance', responsibilities: 'Research securities, build financial models, support portfolio managers', requirements: 'Finance or Economics degree, CFA pursuing, strong quantitative skills', skills: ['Financial Modeling', 'Excel', 'Python', 'Bloomberg', 'Financial Analysis', 'Presentation'] },
    { id: 'job-08', title: 'Risk Analyst', company: 'Goldman Sachs', district: 'Central', salaryMin: 52000, salaryMax: 72000, sector: 'Finance', responsibilities: 'Monitor market risk, credit risk, develop risk models and stress tests', requirements: 'Quantitative degree (Math/Statistics/Physics), strong programming skills', skills: ['Statistics', 'Python', 'R', 'Financial Modeling', 'Risk Management', 'SQL'] },
    { id: 'job-09', title: 'Tax Consultant', company: 'EY', district: 'Quarry Bay', salaryMin: 32000, salaryMax: 44000, sector: 'Professional Services', responsibilities: 'Advise corporate clients on tax planning, prepare tax filings, manage client relationships', requirements: 'Accounting or Law degree, pursuing CPA or tax qualification', skills: ['Accounting', 'Tax Law', 'Excel', 'Communication', 'Research', 'Attention to Detail'] },
    { id: 'job-10', title: 'Management Consultant', company: 'KPMG', district: 'Kowloon Bay', salaryMin: 40000, salaryMax: 58000, sector: 'Professional Services', responsibilities: 'Deliver strategy and operations consulting engagements, create client presentations', requirements: 'MBA or top undergraduate degree, 1-3 years experience preferred', skills: ['Strategy', 'PowerPoint', 'Excel', 'Communication', 'Project Management', 'Problem Solving'] },
    { id: 'job-11', title: 'Digital Marketing Analyst', company: 'Hang Seng Bank', district: 'Central', salaryMin: 28000, salaryMax: 38000, sector: 'Banking', responsibilities: 'Manage digital marketing campaigns, analyse customer engagement, optimize conversion', requirements: 'Marketing or Business degree, Google Analytics certified preferred', skills: ['Digital Marketing', 'Google Analytics', 'Excel', 'SEO', 'Content Marketing', 'Data Visualization'] },
    { id: 'job-12', title: 'Revenue Management Analyst', company: 'Cathay Pacific', district: 'Lantau', salaryMin: 32000, salaryMax: 46000, sector: 'Aviation', responsibilities: 'Optimize seat pricing using analytics, monitor competitive fares, forecast demand', requirements: 'Business or Engineering degree, strong analytical skills, Excel proficiency', skills: ['Excel', 'Statistics', 'Data Analysis', 'SQL', 'Forecasting', 'PowerPoint'] },
    { id: 'job-13', title: 'Healthcare IT Analyst', company: 'Hospital Authority', district: 'Kowloon', salaryMin: 33000, salaryMax: 48000, sector: 'Healthcare', responsibilities: 'Support clinical information systems, gather requirements from medical staff, improve workflows', requirements: 'IT or Healthcare Informatics degree, strong communication skills', skills: ['Requirements Analysis', 'SQL', 'Project Management', 'Communication', 'Documentation', 'Healthcare IT'] },
    { id: 'job-14', title: 'Operations Analyst', company: 'MTR Corporation', district: 'Kowloon Bay', salaryMin: 30000, salaryMax: 42000, sector: 'Transport', responsibilities: 'Analyse operational data, improve efficiency of rail operations, stakeholder coordination', requirements: 'Engineering or Business degree, analytical mindset, interest in infrastructure', skills: ['Data Analysis', 'Excel', 'SQL', 'Project Management', 'Stakeholder Management', 'PowerPoint'] },
    { id: 'job-15', title: 'Product Manager – FinTech', company: 'Tencent', district: 'Tsim Sha Tsui', salaryMin: 55000, salaryMax: 85000, sector: 'Technology', responsibilities: 'Define product roadmap for payment and financial products, work with engineering and design', requirements: '3+ years product management experience, fintech background preferred', skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis', 'Communication', 'SQL'] },
  ];

  const jobIds: Record<string, string> = {};
  for (const j of jobsData) {
    const job = await prisma.job.upsert({
      where: { id: j.id },
      create: { ...j, deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
      update: {},
    });
    jobIds[j.id] = job.id;
  }

  // ── Skills catalogue ──────────────────────────────────────────────────────
  const skillCatalogue = [
    { name: 'SQL', category: 'Technical' },
    { name: 'Python', category: 'Technical' },
    { name: 'Data Visualization', category: 'Technical' },
    { name: 'Excel', category: 'Technical' },
    { name: 'Tableau', category: 'Technical' },
    { name: 'Statistics', category: 'Technical' },
    { name: 'Network Security', category: 'Technical' },
    { name: 'SIEM', category: 'Technical' },
    { name: 'Incident Response', category: 'Technical' },
    { name: 'Firewalls', category: 'Technical' },
    { name: 'Linux', category: 'Technical' },
    { name: 'Cloud Computing', category: 'Technical' },
    { name: 'Docker', category: 'Technical' },
    { name: 'Kubernetes', category: 'Technical' },
    { name: 'R', category: 'Technical' },
    { name: 'Bloomberg', category: 'Technical' },
    { name: 'Financial Modeling', category: 'Business' },
    { name: 'Financial Analysis', category: 'Business' },
    { name: 'Risk Management', category: 'Business' },
    { name: 'Accounting', category: 'Business' },
    { name: 'IFRS', category: 'Business' },
    { name: 'Tax Law', category: 'Business' },
    { name: 'Requirements Analysis', category: 'Business' },
    { name: 'Documentation', category: 'Business' },
    { name: 'Stakeholder Management', category: 'Business' },
    { name: 'Project Management', category: 'Business' },
    { name: 'Agile', category: 'Business' },
    { name: 'Strategy', category: 'Business' },
    { name: 'Digital Marketing', category: 'Business' },
    { name: 'SEO', category: 'Business' },
    { name: 'Google Analytics', category: 'Technical' },
    { name: 'Content Marketing', category: 'Business' },
    { name: 'Product Management', category: 'Business' },
    { name: 'User Research', category: 'Business' },
    { name: 'Forecasting', category: 'Business' },
    { name: 'Healthcare IT', category: 'Technical' },
    { name: 'Architecture Design', category: 'Technical' },
    { name: 'Data Analysis', category: 'Technical' },
    { name: 'Communication', category: 'Soft' },
    { name: 'PowerPoint', category: 'Technical' },
    { name: 'Attention to Detail', category: 'Soft' },
    { name: 'Problem Solving', category: 'Soft' },
    { name: 'Presentation', category: 'Soft' },
    { name: 'Research', category: 'Soft' },
  ];

  const skillMap: Record<string, string> = {};
  for (const s of skillCatalogue) {
    const skill = await prisma.skill.upsert({ where: { name: s.name }, create: s, update: {} });
    skillMap[s.name] = skill.id;
  }

  // ── User skills for demo graduate ─────────────────────────────────────────
  const userSkillsData = [
    { name: 'SQL', level: 75, gap: 'MEDIUM' as const, impact: 'HIGH' as const },
    { name: 'Python', level: 65, gap: 'MEDIUM' as const, impact: 'HIGH' as const },
    { name: 'Data Analysis', level: 60, gap: 'HIGH' as const, impact: 'HIGH' as const },
    { name: 'Data Visualization', level: 55, gap: 'HIGH' as const, impact: 'HIGH' as const },
    { name: 'Excel', level: 80, gap: 'LOW' as const, impact: 'HIGH' as const },
    { name: 'Communication', level: 85, gap: 'LOW' as const, impact: 'MEDIUM' as const },
    { name: 'Statistics', level: 50, gap: 'HIGH' as const, impact: 'HIGH' as const },
    { name: 'PowerPoint', level: 78, gap: 'LOW' as const, impact: 'MEDIUM' as const },
    { name: 'Project Management', level: 45, gap: 'HIGH' as const, impact: 'MEDIUM' as const },
    { name: 'Tableau', level: 35, gap: 'HIGH' as const, impact: 'HIGH' as const },
  ];

  for (const us of userSkillsData) {
    if (!skillMap[us.name]) continue;
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: gradUser.id, skillId: skillMap[us.name] } },
      create: { userId: gradUser.id, skillId: skillMap[us.name], level: us.level, gap: us.gap, impact: us.impact },
      update: { level: us.level, gap: us.gap, impact: us.impact },
    });
  }

  // ── Applications ──────────────────────────────────────────────────────────
  const applicationsData = [
    { id: 'app-01', jobId: 'job-01', status: 'INTERVIEW' as const, stage: 'Second Round', appliedDate: '2026-04-15', interviewDate: '2026-05-20' },
    { id: 'app-02', jobId: 'job-02', status: 'PENDING' as const, stage: 'Under Review', appliedDate: '2026-04-20' },
    { id: 'app-03', jobId: 'job-03', status: 'INTERVIEW' as const, stage: 'First Round', appliedDate: '2026-04-10', interviewDate: '2026-05-18' },
    { id: 'app-04', jobId: 'job-04', status: 'REJECTED' as const, stage: 'Not Selected', appliedDate: '2026-03-28' },
    { id: 'app-05', jobId: 'job-05', status: 'PENDING' as const, stage: 'Application Submitted', appliedDate: '2026-05-05' },
    { id: 'app-06', jobId: 'job-07', status: 'INTERVIEW' as const, stage: 'Final Round', appliedDate: '2026-04-25', interviewDate: '2026-05-22' },
    { id: 'app-07', jobId: 'job-10', status: 'PENDING' as const, stage: 'Online Assessment', appliedDate: '2026-05-01' },
    { id: 'app-08', jobId: 'job-12', status: 'OFFERED' as const, stage: 'Offer Received', appliedDate: '2026-03-15', interviewDate: '2026-04-10' },
    { id: 'app-09', jobId: 'job-06', status: 'PENDING' as const, stage: 'CV Screening', appliedDate: '2026-05-08' },
    { id: 'app-10', jobId: 'job-11', status: 'REJECTED' as const, stage: 'Not Selected', appliedDate: '2026-03-20' },
    { id: 'app-11', jobId: 'job-08', status: 'PENDING' as const, stage: 'Application Submitted', appliedDate: '2026-05-12' },
    { id: 'app-12', jobId: 'job-09', status: 'WITHDRAWN' as const, stage: 'Withdrawn', appliedDate: '2026-04-01' },
    { id: 'app-13', jobId: 'job-13', status: 'INTERVIEW' as const, stage: 'First Round', appliedDate: '2026-04-18', interviewDate: '2026-05-25' },
    { id: 'app-14', jobId: 'job-14', status: 'PENDING' as const, stage: 'Under Review', appliedDate: '2026-05-03' },
  ];

  for (const a of applicationsData) {
    await prisma.application.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        userId: gradUser.id,
        jobId: a.jobId,
        status: a.status,
        stage: a.stage,
        appliedDate: new Date(a.appliedDate),
        interviewDate: a.interviewDate ? new Date(a.interviewDate) : undefined,
      },
      update: {},
    });
  }

  // ── Saved jobs ────────────────────────────────────────────────────────────
  for (const jobId of ['job-01', 'job-06', 'job-07', 'job-15']) {
    await prisma.savedJob.upsert({
      where: { userId_jobId: { userId: gradUser.id, jobId } },
      create: { userId: gradUser.id, jobId },
      update: {},
    });
  }

  // ── User credentials ──────────────────────────────────────────────────────
  const credentialsData = [
    { id: 'cred-01', category: 'Degree & Transcript', name: 'Bachelor of Computer Science', issuer: 'CUHK', status: 'VERIFIED' as const, issuedDate: '2025-06-01' },
    { id: 'cred-02', category: 'HEAR', name: 'Higher Education Achievement Report', issuer: 'CUHK', status: 'PENDING' as const },
    { id: 'cred-03', category: 'Certificates', name: 'Python for Data Science', issuer: 'Coursera', status: 'VERIFIED' as const, issuedDate: '2025-03-15' },
    { id: 'cred-04', category: 'Certificates', name: 'SQL for Data Analysis', issuer: 'Udemy', status: 'VERIFIED' as const, issuedDate: '2025-01-20' },
    { id: 'cred-05', category: 'Certificates', name: 'Google Data Analytics Professional', issuer: 'Google / Coursera', status: 'VERIFIED' as const, issuedDate: '2025-08-10' },
    { id: 'cred-06', category: 'Certificates', name: 'Tableau Desktop Specialist', issuer: 'Tableau', status: 'PENDING' as const },
    { id: 'cred-07', category: 'Certificates', name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', status: 'VERIFIED' as const, issuedDate: '2025-11-05' },
  ];

  for (const c of credentialsData) {
    await prisma.userCredential.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        userId: gradUser.id,
        category: c.category,
        name: c.name,
        issuer: c.issuer,
        status: c.status,
        issuedDate: c.issuedDate ? new Date(c.issuedDate) : undefined,
      },
      update: {},
    });
  }

  // ── Coaching sessions ─────────────────────────────────────────────────────
  const coachSessionsData = [
    { id: 'coach-01', type: 'interview_practice', topic: 'Behavioural Questions – STAR Method', score: 72, summary: 'Good structure but needs more specific examples. Work on quantifying achievements.', durationMs: 1800000 },
    { id: 'coach-02', type: 'interview_practice', topic: 'Technical SQL Round – HSBC', score: 65, summary: 'Solid basic queries but struggled with window functions. Practice CTEs and ranking.', durationMs: 2400000 },
    { id: 'coach-03', type: 'interview_practice', topic: 'Case Study – Data Analysis Role', score: 78, summary: 'Good structured approach, clear communication. Improve speed on data cleaning tasks.', durationMs: 3000000 },
    { id: 'coach-04', type: 'resume_review', topic: 'CV Review – Data Analyst Positions', score: 81, summary: 'Strong academic section. Add metrics to project descriptions. Move skills to top.', durationMs: 900000 },
    { id: 'coach-05', type: 'career_advice', topic: 'Career Path – Banking vs Consulting', summary: 'Explored both tracks. Recommend starting in banking data for domain knowledge then moving to consulting.', durationMs: 1200000 },
    { id: 'coach-06', type: 'interview_practice', topic: 'Final Round Prep – Cathay Pacific', score: 84, summary: 'Excellent improvement. Clear narrative, strong examples, confident delivery.', durationMs: 2700000 },
    { id: 'coach-07', type: 'interview_practice', topic: 'Python Coding Test Simulation', score: 70, summary: 'Good Pandas skills. Need to improve on time complexity awareness and optimisation.', durationMs: 3600000 },
    { id: 'coach-08', type: 'resume_review', topic: 'LinkedIn Profile Optimisation', score: 75, summary: 'Updated headline and summary. Added portfolio links. Keywords improved for recruiter search.', durationMs: 600000 },
  ];

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  for (let i = 0; i < coachSessionsData.length; i++) {
    const c = coachSessionsData[i];
    const createdAt = new Date(sevenDaysAgo.getTime() + i * 2 * 24 * 60 * 60 * 1000);
    await prisma.coachSession.upsert({
      where: { id: c.id },
      create: { id: c.id, userId: gradUser.id, ...c, feedback: c.summary ? { comment: c.summary } : undefined, createdAt },
      update: {},
    });
  }

  // ── Graduate programmes ───────────────────────────────────────────────────
  const programmesData = [
    { id: 'gprog-01', employerName: 'HSBC', name: 'HSBC Graduate Programme', logo: '🏦', deadline: '2026-06-30', salaryMin: 35000, salaryMax: 45000, successRate: 85, sector: 'Banking', description: 'Structured 2-year rotational programme across Retail, Commercial, and Investment Banking divisions.' },
    { id: 'gprog-02', employerName: 'PwC', name: 'PwC Audit & Assurance', logo: '📊', deadline: '2026-07-15', salaryMin: 30000, salaryMax: 40000, successRate: 78, sector: 'Professional Services', description: 'Fast-track path to HKICPA qualification with full study support and mentorship from senior managers.' },
    { id: 'gprog-03', employerName: 'Goldman Sachs', name: 'Goldman Sachs Analyst Programme', logo: '💼', deadline: '2026-05-31', salaryMin: 55000, salaryMax: 70000, successRate: 62, sector: 'Finance', description: 'Highly competitive analyst role across IBD, Securities and Asset Management divisions.' },
    { id: 'gprog-04', employerName: 'Alibaba Cloud', name: 'Alibaba Cloud Graduate Engineer', logo: '☁️', deadline: '2026-07-01', salaryMin: 45000, salaryMax: 60000, successRate: 71, sector: 'Technology', description: 'Build and deploy cloud solutions for enterprise clients across APAC. Full cloud certification support.' },
    { id: 'gprog-05', employerName: 'Deloitte', name: 'Deloitte Consulting Graduate', logo: '🔷', deadline: '2026-08-01', salaryMin: 38000, salaryMax: 50000, successRate: 74, sector: 'Professional Services', description: 'Strategy and technology consulting rotations with fast progression to senior consultant level.' },
    { id: 'gprog-06', employerName: 'JP Morgan', name: 'JP Morgan Summer Analyst → Full-time', logo: '🏛️', deadline: '2026-06-15', salaryMin: 50000, salaryMax: 68000, successRate: 68, sector: 'Finance', description: 'Convert from summer analyst to full-time analyst in Markets, IBD or Operations.' },
    { id: 'gprog-07', employerName: 'Standard Chartered', name: 'Standard Chartered International Graduate', logo: '🌏', deadline: '2026-07-31', salaryMin: 36000, salaryMax: 48000, successRate: 76, sector: 'Banking', description: 'International rotational programme with postings in HK, Singapore, and London.' },
    { id: 'gprog-08', employerName: 'EY', name: 'EY Graduate Tax & Law', logo: '⚖️', deadline: '2026-08-15', salaryMin: 32000, salaryMax: 42000, successRate: 80, sector: 'Professional Services', description: 'Structured tax advisory programme with full CPA study support and partner mentorship.' },
  ];

  for (const p of programmesData) {
    await prisma.graduateProgramme.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        employerId: employers[p.employerName],
        name: p.name,
        logo: p.logo,
        deadline: new Date(p.deadline),
        salaryMin: p.salaryMin,
        salaryMax: p.salaryMax,
        successRate: p.successRate,
        sector: p.sector,
        location: 'Hong Kong',
        description: p.description,
      },
      update: {},
    });
  }

  // ── Alumni paths ──────────────────────────────────────────────────────────
  const alumniPathsData = [
    { id: 'path-01', name: 'Audit to Strategy Consulting', typicalRoles: ['Audit Associate', 'Senior Auditor', 'Strategy Manager', 'Principal Consultant'], timeToTransition: '2-3 years', description: 'Most CUHK alumni leverage Big 4 audit experience to move into strategy consulting at MBB or Tier-2 firms.' },
    { id: 'path-02', name: 'Tech Analyst to Product Manager', typicalRoles: ['Business Analyst', 'Senior Analyst', 'Associate PM', 'Product Manager'], timeToTransition: '3-4 years', description: 'Common path for technical graduates who want to move from delivery into product strategy roles.' },
    { id: 'path-03', name: 'Banking to FinTech', typicalRoles: ['Graduate Analyst', 'Vice President', 'FinTech Startup Lead', 'Head of Digital'], timeToTransition: '4-6 years', description: 'Alumni use traditional banking experience as a foundation to move into high-growth FinTech startups.' },
    { id: 'path-04', name: 'Data Analyst to Data Scientist', typicalRoles: ['Data Analyst', 'Senior Data Analyst', 'Data Scientist', 'Lead Data Scientist'], timeToTransition: '2-4 years', description: 'Professionals add ML and statistical modelling skills on top of analytics experience to transition into data science.' },
    { id: 'path-05', name: 'Consulting to C-Suite', typicalRoles: ['Consultant', 'Manager', 'Director', 'CFO / COO'], timeToTransition: '8-12 years', description: 'CUHK alumni with consulting backgrounds frequently move into C-suite roles at HK corporates and multinationals.' },
  ];

  for (const p of alumniPathsData) {
    await prisma.alumniPath.upsert({
      where: { id: p.id },
      create: p,
      update: {},
    });
  }

  // ── Market signals ────────────────────────────────────────────────────────
  const signalsData = [
    { id: 'sig-01', title: 'FinTech hiring up 12% in Q2 2026', description: 'Growing demand in financial technology sector driven by HKMA digitisation push and virtual bank expansion.', trend: 'UP' as const, sector: 'FinTech', district: 'Central' },
    { id: 'sig-02', title: 'Hot now: Cybersecurity roles in Central & Western', description: 'High demand for security professionals as banks strengthen compliance post-regulation changes.', trend: 'HOT' as const, salaryMin: 45000, salaryMax: 65000, sector: 'Banking', district: 'Central & Western', role: 'Cybersecurity Analyst' },
    { id: 'sig-03', title: 'Data & Analytics roles: 18% salary increase', description: 'Employers are competing aggressively for data talent across banking, insurance and technology sectors.', trend: 'HOT' as const, salaryMin: 38000, salaryMax: 70000, sector: 'Technology', role: 'Data Analyst' },
    { id: 'sig-04', title: 'Cloud Engineers: shortest time-to-offer in 2026', description: 'Average offer turnaround for cloud engineers dropped to 18 days. Alibaba Cloud and AWS partners hiring aggressively.', trend: 'HOT' as const, salaryMin: 50000, salaryMax: 85000, sector: 'Technology', role: 'Cloud Engineer' },
    { id: 'sig-05', title: 'ESG roles emerging in banking sector', description: 'New HKMA sustainability reporting requirements driving demand for ESG analysts across major banks.', trend: 'UP' as const, salaryMin: 35000, salaryMax: 55000, sector: 'Banking', district: 'Central', role: 'ESG Analyst' },
    { id: 'sig-06', title: 'Professional Services headcount flat in Q1', description: 'Big 4 firms maintained flat headcount as audit fee pressure continues. Consulting arms growing separately.', trend: 'STABLE' as const, sector: 'Professional Services' },
    { id: 'sig-07', title: 'Healthcare IT: 15% growth driven by HA digitisation', description: "Hospital Authority's 5-year IT modernisation programme creating sustained demand for healthcare IT professionals.", trend: 'UP' as const, salaryMin: 32000, salaryMax: 52000, sector: 'Healthcare', district: 'Kowloon' },
    { id: 'sig-08', title: 'Aviation sector rebounds: Cathay hiring 200+ graduates', description: 'Post-COVID recovery drives recruitment across operations, revenue management and digital transformation roles.', trend: 'UP' as const, salaryMin: 30000, salaryMax: 48000, sector: 'Aviation', district: 'Lantau' },
    { id: 'sig-09', title: 'AI/ML Engineer salaries hit new high: HK$70K+', description: 'Machine learning engineers now command premium salaries as local AI labs and tech multinationals compete for talent.', trend: 'HOT' as const, salaryMin: 65000, salaryMax: 100000, sector: 'Technology', role: 'ML Engineer' },
    { id: 'sig-10', title: 'Kowloon East emerges as second CBD for tech firms', description: 'Growing concentration of tech firms and coworking spaces in Kowloon Bay and Kwun Tong creating new job clusters.', trend: 'UP' as const, sector: 'Technology', district: 'Kowloon East' },
  ];

  for (const s of signalsData) {
    await prisma.marketSignal.upsert({
      where: { id: s.id },
      create: { ...s, publishedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) },
      update: {},
    });
  }

  // ── Institution academic programmes ───────────────────────────────────────
  const instProgrammes = [
    { id: 'iprog-01', name: 'BEng in Computer Science', faculty: 'Engineering', degreeLevel: 'Bachelor', employmentRate: 92.8, avgSalary: 42000, timeToOffer: 2.3, satisfaction: 4.5 },
    { id: 'iprog-02', name: 'BBA in Finance', faculty: 'Business', degreeLevel: 'Bachelor', employmentRate: 94.2, avgSalary: 44000, timeToOffer: 2.1, satisfaction: 4.6 },
    { id: 'iprog-03', name: 'BSc in Data Science', faculty: 'Science', degreeLevel: 'Bachelor', employmentRate: 91.5, avgSalary: 41500, timeToOffer: 2.5, satisfaction: 4.4 },
    { id: 'iprog-04', name: 'BBA in Marketing', faculty: 'Business', degreeLevel: 'Bachelor', employmentRate: 89.7, avgSalary: 36000, timeToOffer: 3.1, satisfaction: 4.2 },
    { id: 'iprog-05', name: 'BA in Communication', faculty: 'Arts', degreeLevel: 'Bachelor', employmentRate: 85.3, avgSalary: 32000, timeToOffer: 3.8, satisfaction: 4.0 },
    { id: 'iprog-06', name: 'LLB in Law', faculty: 'Law', degreeLevel: 'Bachelor', employmentRate: 88.6, avgSalary: 38000, timeToOffer: 3.5, satisfaction: 4.1 },
    { id: 'iprog-07', name: 'BEng in Electronic Engineering', faculty: 'Engineering', degreeLevel: 'Bachelor', employmentRate: 90.1, avgSalary: 40000, timeToOffer: 2.7, satisfaction: 4.3 },
    { id: 'iprog-08', name: 'MSc in Financial Technology', faculty: 'Engineering', degreeLevel: 'Master', employmentRate: 95.4, avgSalary: 52000, timeToOffer: 1.8, satisfaction: 4.7 },
  ];

  for (const p of instProgrammes) {
    await prisma.programme.upsert({
      where: { id: p.id },
      create: { ...p, institutionId: cuhk.id },
      update: {},
    });
  }

  // ── Graduate outcomes (anonymised) ────────────────────────────────────────
  const cohortRefs = ['A001','A002','A003','A004','A005','A006','A007','A008','A009','A010','A011','A012','A013','A014','A015','A016','A017','A018','A019','A020','A021','A022','A023','A024','A025','A026','A027','A028','A029','A030'];
  const outcomesSeed = [
    { ref: 'A001', year: 2025, sector: 'Banking', role: 'Data Analyst', company: 'HSBC', salary: '35K-50K', geography: 'Hong Kong', prog: 'iprog-01' },
    { ref: 'A002', year: 2025, sector: 'Technology', role: 'Software Engineer', company: 'Alibaba Cloud', salary: '40K-55K', geography: 'Hong Kong', prog: 'iprog-01' },
    { ref: 'A003', year: 2025, sector: 'Professional Services', role: 'Audit Associate', company: 'Deloitte', salary: '30K-40K', geography: 'Hong Kong', prog: 'iprog-02' },
    { ref: 'A004', year: 2025, sector: 'Finance', role: 'Investment Analyst', company: 'Goldman Sachs', salary: '50K-70K', geography: 'Hong Kong', prog: 'iprog-02' },
    { ref: 'A005', year: 2025, sector: 'Banking', role: 'Business Analyst', company: 'Standard Chartered', salary: '38K-52K', geography: 'Hong Kong', prog: 'iprog-03' },
    { ref: 'A006', year: 2025, sector: 'Technology', role: 'Cybersecurity Analyst', company: 'Bank of China', salary: '42K-58K', geography: 'Hong Kong', prog: 'iprog-01' },
    { ref: 'A007', year: 2025, sector: 'Professional Services', role: 'Technology Consultant', company: 'PwC', salary: '36K-50K', geography: 'Hong Kong', prog: 'iprog-01' },
    { ref: 'A008', year: 2025, sector: 'Banking', role: 'Risk Analyst', company: 'HSBC', salary: '40K-55K', geography: 'United Kingdom', prog: 'iprog-02' },
    { ref: 'A009', year: 2025, sector: 'Finance', role: 'Analyst', company: 'JP Morgan', salary: '48K-65K', geography: 'Hong Kong', prog: 'iprog-02' },
    { ref: 'A010', year: 2025, sector: 'Technology', role: 'Cloud Engineer', company: 'Alibaba Cloud', salary: '45K-62K', geography: 'Hong Kong', prog: 'iprog-07' },
    { ref: 'A011', year: 2025, sector: 'Professional Services', role: 'Management Consultant', company: 'KPMG', salary: '38K-52K', geography: 'Hong Kong', prog: 'iprog-04' },
    { ref: 'A012', year: 2025, sector: 'Healthcare', role: 'Healthcare IT Analyst', company: 'Hospital Authority', salary: '33K-45K', geography: 'Hong Kong', prog: 'iprog-01' },
    { ref: 'A013', year: 2025, sector: 'Aviation', role: 'Revenue Analyst', company: 'Cathay Pacific', salary: '32K-46K', geography: 'Hong Kong', prog: 'iprog-04' },
    { ref: 'A014', year: 2025, sector: 'Banking', role: 'Digital Banking Analyst', company: 'Hang Seng Bank', salary: '30K-42K', geography: 'Hong Kong', prog: 'iprog-04' },
    { ref: 'A015', year: 2025, sector: 'Technology', role: 'Product Manager', company: 'Tencent', salary: '55K-80K', geography: 'Hong Kong', prog: 'iprog-08' },
    { ref: 'A016', year: 2024, sector: 'Finance', role: 'Quant Analyst', company: 'Goldman Sachs', salary: '55K-75K', geography: 'Hong Kong', prog: 'iprog-03' },
    { ref: 'A017', year: 2024, sector: 'Banking', role: 'Credit Analyst', company: 'HSBC', salary: '35K-48K', geography: 'Hong Kong', prog: 'iprog-02' },
    { ref: 'A018', year: 2024, sector: 'Professional Services', role: 'Tax Associate', company: 'EY', salary: '32K-44K', geography: 'Hong Kong', prog: 'iprog-02' },
    { ref: 'A019', year: 2024, sector: 'Technology', role: 'Data Engineer', company: 'Alibaba Cloud', salary: '42K-60K', geography: 'Singapore', prog: 'iprog-01' },
    { ref: 'A020', year: 2024, sector: 'Banking', role: 'Operations Analyst', company: 'Standard Chartered', salary: '33K-46K', geography: 'Hong Kong', prog: 'iprog-04' },
    { ref: 'A021', year: 2024, sector: 'Professional Services', role: 'Audit Manager', company: 'PwC', salary: '48K-65K', geography: 'Hong Kong', prog: 'iprog-02' },
    { ref: 'A022', year: 2024, sector: 'Transport', role: 'Operations Analyst', company: 'MTR Corporation', salary: '30K-42K', geography: 'Hong Kong', prog: 'iprog-07' },
    { ref: 'A023', year: 2024, sector: 'Finance', role: 'Equity Analyst', company: 'JP Morgan', salary: '50K-68K', geography: 'Hong Kong', prog: 'iprog-02' },
    { ref: 'A024', year: 2024, sector: 'Technology', role: 'ML Engineer', company: 'Tencent', salary: '65K-90K', geography: 'Hong Kong', prog: 'iprog-08' },
    { ref: 'A025', year: 2024, sector: 'Banking', role: 'Compliance Analyst', company: 'Bank of China', salary: '36K-50K', geography: 'Hong Kong', prog: 'iprog-06' },
    { ref: 'A026', year: 2023, sector: 'Finance', role: 'Portfolio Manager', company: 'Goldman Sachs', salary: '70K-95K', geography: 'Hong Kong', prog: 'iprog-02' },
    { ref: 'A027', year: 2023, sector: 'Technology', role: 'Senior Engineer', company: 'Alibaba Cloud', salary: '58K-80K', geography: 'China', prog: 'iprog-01' },
    { ref: 'A028', year: 2023, sector: 'Professional Services', role: 'Senior Consultant', company: 'Deloitte', salary: '55K-72K', geography: 'Hong Kong', prog: 'iprog-04' },
    { ref: 'A029', year: 2023, sector: 'Banking', role: 'Senior Analyst', company: 'HSBC', salary: '48K-65K', geography: 'United Kingdom', prog: 'iprog-02' },
    { ref: 'A030', year: 2023, sector: 'Healthcare', role: 'Senior IT Analyst', company: 'Hospital Authority', salary: '42K-58K', geography: 'Hong Kong', prog: 'iprog-01' },
  ];

  for (const o of outcomesSeed) {
    await prisma.graduateOutcome.upsert({
      where: { id: `outcome-${o.ref}` },
      create: {
        id: `outcome-${o.ref}`,
        institutionId: cuhk.id,
        programmeId: o.prog,
        cohortRef: o.ref,
        cohortYear: o.year,
        sector: o.sector,
        role: o.role,
        company: o.company,
        salaryBand: o.salary,
        geography: o.geography,
        timeToOfferDays: Math.floor(30 + Math.random() * 60),
      },
      update: {},
    });
  }

  // ── Issued credentials (institution view) ─────────────────────────────────
  const issuedTypes = [
    { type: 'HEAR', name: 'Higher Education Achievement Report' },
    { type: 'Degree', name: 'Bachelor Degree Certificate' },
    { type: 'Certificate', name: 'Industry Placement Certificate' },
    { type: 'Certificate', name: 'Research Excellence Certificate' },
    { type: 'HEAR', name: 'Higher Education Achievement Report' },
  ];
  const statuses: Array<'VERIFIED' | 'PENDING'> = ['VERIFIED', 'VERIFIED', 'VERIFIED', 'PENDING', 'PENDING'];

  for (let i = 0; i < 30; i++) {
    const t = issuedTypes[i % issuedTypes.length];
    const status = i < 20 ? 'VERIFIED' : 'PENDING';
    await prisma.issuedCredential.upsert({
      where: { id: `issued-${i + 1}` },
      create: {
        id: `issued-${i + 1}`,
        institutionId: cuhk.id,
        recipientRef: `A${String(i + 1).padStart(3, '0')}`,
        type: t.type,
        name: t.name,
        status,
        issuedAt: status === 'VERIFIED' ? new Date(Date.now() - (30 - i) * 5 * 24 * 60 * 60 * 1000) : undefined,
      },
      update: {},
    });
  }

  // ── Employer relationships ────────────────────────────────────────────────
  const relationshipData = [
    { empName: 'HSBC', tier: 'Platinum', jobPostings: 45, internships: 12, placements: 18 },
    { empName: 'Alibaba Cloud', tier: 'Platinum', jobPostings: 38, internships: 8, placements: 14 },
    { empName: 'Deloitte', tier: 'Gold', jobPostings: 28, internships: 6, placements: 11 },
    { empName: 'Goldman Sachs', tier: 'Gold', jobPostings: 22, internships: 5, placements: 9 },
    { empName: 'JP Morgan', tier: 'Gold', jobPostings: 19, internships: 4, placements: 8 },
    { empName: 'PwC', tier: 'Gold', jobPostings: 24, internships: 7, placements: 12 },
    { empName: 'Standard Chartered', tier: 'Silver', jobPostings: 15, internships: 3, placements: 6 },
    { empName: 'EY', tier: 'Silver', jobPostings: 16, internships: 4, placements: 7 },
    { empName: 'KPMG', tier: 'Silver', jobPostings: 14, internships: 3, placements: 5 },
    { empName: 'Bank of China', tier: 'Silver', jobPostings: 12, internships: 2, placements: 4 },
    { empName: 'Cathay Pacific', tier: 'Silver', jobPostings: 10, internships: 3, placements: 5 },
    { empName: 'Hospital Authority', tier: 'Silver', jobPostings: 18, internships: 6, placements: 10 },
  ];

  for (const r of relationshipData) {
    if (!employers[r.empName]) continue;
    await prisma.employerRelationship.upsert({
      where: { institutionId_employerId: { institutionId: cuhk.id, employerId: employers[r.empName] } },
      create: { institutionId: cuhk.id, employerId: employers[r.empName], tier: r.tier, jobPostings: r.jobPostings, internships: r.internships, placements: r.placements },
      update: { jobPostings: r.jobPostings, internships: r.internships, placements: r.placements },
    });
  }

  // ── Institution snapshots (5-year employment trends) ─────────────────────
  const snapshotsData = [
    { id: 'snap-2022', year: 2022, employmentRate: 82.1, medianSalary: 16500, timeToOfferDays: 52, employedCount: 1245, furtherStudyCount: 187, seekingCount: 134, otherCount: 45 },
    { id: 'snap-2023', year: 2023, employmentRate: 84.3, medianSalary: 17200, timeToOfferDays: 49, employedCount: 1387, furtherStudyCount: 203, seekingCount: 98, otherCount: 38 },
    { id: 'snap-2024', year: 2024, employmentRate: 85.8, medianSalary: 17800, timeToOfferDays: 47, employedCount: 1456, furtherStudyCount: 218, seekingCount: 76, otherCount: 32 },
    { id: 'snap-2025', year: 2025, employmentRate: 86.9, medianSalary: 18200, timeToOfferDays: 46, employedCount: 1500, furtherStudyCount: 225, seekingCount: 68, otherCount: 28 },
    { id: 'snap-2026', year: 2026, employmentRate: 87.5, medianSalary: 18500, timeToOfferDays: 45, employedCount: 1550, furtherStudyCount: 230, seekingCount: 60, otherCount: 25 },
  ];
  for (const s of snapshotsData) {
    await prisma.institutionSnapshot.upsert({
      where: { institutionId_year: { institutionId: cuhk.id, year: s.year } },
      create: { ...s, id: s.id, institutionId: cuhk.id },
      update: {},
    });
  }

  // ── Programme snapshots (3-year trend per programme) ──────────────────────
  const progSnapshotsData = [
    { id: 'psnap-cs-2024',   programmeId: 'iprog-01', year: 2024, employmentRate: 89.2, medianSalary: 38000 },
    { id: 'psnap-cs-2025',   programmeId: 'iprog-01', year: 2025, employmentRate: 91.5, medianSalary: 40000 },
    { id: 'psnap-cs-2026',   programmeId: 'iprog-01', year: 2026, employmentRate: 92.8, medianSalary: 42000 },
    { id: 'psnap-fin-2024',  programmeId: 'iprog-02', year: 2024, employmentRate: 91.5, medianSalary: 40000 },
    { id: 'psnap-fin-2025',  programmeId: 'iprog-02', year: 2025, employmentRate: 93.1, medianSalary: 42000 },
    { id: 'psnap-fin-2026',  programmeId: 'iprog-02', year: 2026, employmentRate: 94.2, medianSalary: 44000 },
    { id: 'psnap-ds-2024',   programmeId: 'iprog-03', year: 2024, employmentRate: 88.3, medianSalary: 37000 },
    { id: 'psnap-ds-2025',   programmeId: 'iprog-03', year: 2025, employmentRate: 90.1, medianSalary: 39500 },
    { id: 'psnap-ds-2026',   programmeId: 'iprog-03', year: 2026, employmentRate: 91.5, medianSalary: 41500 },
    { id: 'psnap-mkt-2024',  programmeId: 'iprog-04', year: 2024, employmentRate: 87.2, medianSalary: 33000 },
    { id: 'psnap-mkt-2025',  programmeId: 'iprog-04', year: 2025, employmentRate: 88.9, medianSalary: 34500 },
    { id: 'psnap-mkt-2026',  programmeId: 'iprog-04', year: 2026, employmentRate: 89.7, medianSalary: 36000 },
    { id: 'psnap-com-2024',  programmeId: 'iprog-05', year: 2024, employmentRate: 82.1, medianSalary: 28000 },
    { id: 'psnap-com-2025',  programmeId: 'iprog-05', year: 2025, employmentRate: 83.8, medianSalary: 30000 },
    { id: 'psnap-com-2026',  programmeId: 'iprog-05', year: 2026, employmentRate: 85.3, medianSalary: 32000 },
    { id: 'psnap-law-2024',  programmeId: 'iprog-06', year: 2024, employmentRate: 86.4, medianSalary: 35000 },
    { id: 'psnap-law-2025',  programmeId: 'iprog-06', year: 2025, employmentRate: 87.8, medianSalary: 36500 },
    { id: 'psnap-law-2026',  programmeId: 'iprog-06', year: 2026, employmentRate: 88.6, medianSalary: 38000 },
    { id: 'psnap-ee-2024',   programmeId: 'iprog-07', year: 2024, employmentRate: 87.5, medianSalary: 36000 },
    { id: 'psnap-ee-2025',   programmeId: 'iprog-07', year: 2025, employmentRate: 89.1, medianSalary: 38000 },
    { id: 'psnap-ee-2026',   programmeId: 'iprog-07', year: 2026, employmentRate: 90.1, medianSalary: 40000 },
    { id: 'psnap-ft-2024',   programmeId: 'iprog-08', year: 2024, employmentRate: 93.1, medianSalary: 47000 },
    { id: 'psnap-ft-2025',   programmeId: 'iprog-08', year: 2025, employmentRate: 94.6, medianSalary: 50000 },
    { id: 'psnap-ft-2026',   programmeId: 'iprog-08', year: 2026, employmentRate: 95.4, medianSalary: 52000 },
  ];
  for (const s of progSnapshotsData) {
    await prisma.programmeSnapshot.upsert({
      where: { programmeId_year: { programmeId: s.programmeId, year: s.year } },
      create: s,
      update: {},
    });
  }

  // ── Institution insights and alerts ───────────────────────────────────────
  const insightsData = [
    { id: 'insight-01', type: 'success', title: 'MSc FinTech graduates saw a 10% salary increase vs last cohort', description: 'Median salary rose from HKD $50,000 to HKD $52,000 — strongest growth across all programmes', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'insight-02', type: 'alert', title: 'Time-to-offer for Arts graduates rose by 6 days', description: 'BA Communication now at 114 days vs 108 days last year — recommend enhanced career support', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: 'insight-03', type: 'info', title: 'Finance sector hiring increased 15% this quarter', description: 'Strong demand for BBA Finance and MSc FinTech graduates from Goldman Sachs, JP Morgan, and HSBC', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: 'alert-01', type: 'warning', title: 'BA Communication employment rate below university average', description: '85.3% vs 87.5% university average — curriculum review recommended for communication programme', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: 'alert-02', type: 'warning', title: 'Small cohort risk: BEng Electronic Engineering (n=18)', description: 'Cohort size below threshold — data aggregated for privacy. Detailed analytics may be unreliable.', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  ];
  for (const ins of insightsData) {
    await prisma.institutionInsight.upsert({
      where: { id: ins.id },
      create: { ...ins, institutionId: cuhk.id },
      update: {},
    });
  }

  // ── Alumni career stages (progression by sector over years) ───────────────
  const careerStagesData = [
    { id: 'cs-01', yearsRange: '0-2 years', sector: 'Finance', count: 287 },
    { id: 'cs-02', yearsRange: '0-2 years', sector: 'Technology', count: 342 },
    { id: 'cs-03', yearsRange: '0-2 years', sector: 'Professional Services', count: 198 },
    { id: 'cs-04', yearsRange: '0-2 years', sector: 'Other', count: 156 },
    { id: 'cs-05', yearsRange: '3-5 years', sector: 'Finance', count: 312 },
    { id: 'cs-06', yearsRange: '3-5 years', sector: 'Technology', count: 398 },
    { id: 'cs-07', yearsRange: '3-5 years', sector: 'Professional Services', count: 234 },
    { id: 'cs-08', yearsRange: '3-5 years', sector: 'Other', count: 142 },
    { id: 'cs-09', yearsRange: '6-10 years', sector: 'Finance', count: 276 },
    { id: 'cs-10', yearsRange: '6-10 years', sector: 'Technology', count: 421 },
    { id: 'cs-11', yearsRange: '6-10 years', sector: 'Professional Services', count: 267 },
    { id: 'cs-12', yearsRange: '6-10 years', sector: 'Other', count: 128 },
    { id: 'cs-13', yearsRange: '10+ years', sector: 'Finance', count: 234 },
    { id: 'cs-14', yearsRange: '10+ years', sector: 'Technology', count: 389 },
    { id: 'cs-15', yearsRange: '10+ years', sector: 'Professional Services', count: 298 },
    { id: 'cs-16', yearsRange: '10+ years', sector: 'Other', count: 98 },
  ];
  for (const cs of careerStagesData) {
    await prisma.alumniCareerStage.upsert({
      where: { institutionId_yearsRange_sector: { institutionId: cuhk.id, yearsRange: cs.yearsRange, sector: cs.sector } },
      create: { ...cs, institutionId: cuhk.id },
      update: { count: cs.count },
    });
  }

  // ── Alumni salary stages ──────────────────────────────────────────────────
  const salaryStagesData = [
    { id: 'sal-01', yearsRange: '0-2', medianSalary: 18500, q1Salary: 15000, q3Salary: 24000 },
    { id: 'sal-02', yearsRange: '3-5', medianSalary: 28500, q1Salary: 22000, q3Salary: 38000 },
    { id: 'sal-03', yearsRange: '6-10', medianSalary: 42000, q1Salary: 32000, q3Salary: 58000 },
    { id: 'sal-04', yearsRange: '10+', medianSalary: 62000, q1Salary: 45000, q3Salary: 85000 },
  ];
  for (const sal of salaryStagesData) {
    await prisma.alumniSalaryStage.upsert({
      where: { institutionId_yearsRange: { institutionId: cuhk.id, yearsRange: sal.yearsRange } },
      create: { ...sal, institutionId: cuhk.id },
      update: {},
    });
  }

  // ── Alumni engagement (monthly) ───────────────────────────────────────────
  const engagementData = [
    { id: 'eng-01', month: 'Jan', mentorshipConnections: 187, eventsAttended: 12, jobPostings: 43 },
    { id: 'eng-02', month: 'Feb', mentorshipConnections: 203, eventsAttended: 15, jobPostings: 38 },
    { id: 'eng-03', month: 'Mar', mentorshipConnections: 234, eventsAttended: 18, jobPostings: 52 },
    { id: 'eng-04', month: 'Apr', mentorshipConnections: 267, eventsAttended: 14, jobPostings: 47 },
    { id: 'eng-05', month: 'May', mentorshipConnections: 289, eventsAttended: 21, jobPostings: 61 },
    { id: 'eng-06', month: 'Jun', mentorshipConnections: 312, eventsAttended: 19, jobPostings: 58 },
  ];
  for (const eng of engagementData) {
    await prisma.alumniEngagement.upsert({
      where: { institutionId_year_month: { institutionId: cuhk.id, year: 2026, month: eng.month } },
      create: { ...eng, institutionId: cuhk.id, year: 2026 },
      update: {},
    });
  }

  // ── Extra coaching sessions spread over 4 weeks (for coaching metrics) ────
  const extraSessions = [
    { id: 'coach-09',  score: 66, daysAgo: 25 }, { id: 'coach-10', score: 69, daysAgo: 23 },
    { id: 'coach-11',  score: 71, daysAgo: 22 }, { id: 'coach-12', score: 68, daysAgo: 21 },
    { id: 'coach-13',  score: 73, daysAgo: 20 }, { id: 'coach-14', score: 74, daysAgo: 19 },
    { id: 'coach-15',  score: 76, daysAgo: 17 }, { id: 'coach-16', score: 75, daysAgo: 16 },
    { id: 'coach-17',  score: 78, daysAgo: 15 }, { id: 'coach-18', score: 77, daysAgo: 14 },
    { id: 'coach-19',  score: 79, daysAgo: 13 }, { id: 'coach-20', score: 80, daysAgo: 12 },
    { id: 'coach-21',  score: 81, daysAgo: 11 }, { id: 'coach-22', score: 79, daysAgo: 10 },
    { id: 'coach-23',  score: 83, daysAgo:  9 }, { id: 'coach-24', score: 84, daysAgo: 8 },
    { id: 'coach-25',  score: 82, daysAgo:  7 }, { id: 'coach-26', score: 85, daysAgo: 6 },
    { id: 'coach-27',  score: 86, daysAgo:  4 }, { id: 'coach-28', score: 88, daysAgo: 2 },
    { id: 'coach-29',  score: 87, daysAgo:  1 },
  ];
  for (const s of extraSessions) {
    await prisma.coachSession.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        userId: gradUser.id,
        type: 'interview_practice',
        score: s.score,
        durationMs: 1800000,
        createdAt: new Date(Date.now() - s.daysAgo * 24 * 60 * 60 * 1000),
      },
      update: {},
    });
  }

  // ── Market sector demand trends (5 quarters × 5 sectors) ────────────────
  const sectorTrendsRaw = [
    { quarter: 'Q1 2025', qOrder: 1, Finance: 72, Technology: 85, Healthcare: 68, Education: 55, 'Professional Services': 70 },
    { quarter: 'Q2 2025', qOrder: 2, Finance: 76, Technology: 88, Healthcare: 70, Education: 58, 'Professional Services': 72 },
    { quarter: 'Q3 2025', qOrder: 3, Finance: 78, Technology: 90, Healthcare: 72, Education: 60, 'Professional Services': 74 },
    { quarter: 'Q4 2025', qOrder: 4, Finance: 82, Technology: 92, Healthcare: 75, Education: 62, 'Professional Services': 76 },
    { quarter: 'Q1 2026', qOrder: 5, Finance: 85, Technology: 94, Healthcare: 78, Education: 65, 'Professional Services': 78 },
  ];
  const sectorKeys = ['Finance', 'Technology', 'Healthcare', 'Education', 'Professional Services'] as const;
  for (const row of sectorTrendsRaw) {
    for (const sector of sectorKeys) {
      await prisma.marketSectorTrend.upsert({
        where: { institutionId_quarter_sector: { institutionId: cuhk.id, quarter: row.quarter, sector } },
        create: { institutionId: cuhk.id, quarter: row.quarter, sector, demandIndex: row[sector] as number },
        update: {},
      });
    }
  }

  // ── District salary benchmarks ────────────────────────────────────────────
  const districtSalariesData = [
    { district: 'Central & Western', median: 24500, q1Salary: 19000, q3Salary: 32000, jobCount: 487 },
    { district: 'Kowloon City',       median: 21000, q1Salary: 17500, q3Salary: 27000, jobCount: 342 },
    { district: 'Tsim Sha Tsui',      median: 22500, q1Salary: 18000, q3Salary: 29000, jobCount: 398 },
    { district: 'Kwun Tong',          median: 19500, q1Salary: 16000, q3Salary: 24000, jobCount: 276 },
    { district: 'Sha Tin',            median: 20000, q1Salary: 16500, q3Salary: 25000, jobCount: 213 },
  ];
  for (const d of districtSalariesData) {
    await prisma.districtSalaryBenchmark.upsert({
      where: { institutionId_district_year: { institutionId: cuhk.id, district: d.district, year: 2026 } },
      create: { ...d, institutionId: cuhk.id, year: 2026 },
      update: {},
    });
  }

  // ── Skill shortage matrix (also supplies Dashboard skillsData) ────────────
  const skillShortagesData = [
    { skill: 'Data Science',       shortage: 92, demandGrowth: 28, salaryPremium: 18, supply: 72 },
    { skill: 'Cloud Architecture', shortage: 88, demandGrowth: 32, salaryPremium: 22, supply: 58 },
    { skill: 'Cybersecurity',      shortage: 85, demandGrowth: 24, salaryPremium: 19, supply: 62 },
    { skill: 'AI/Machine Learning',shortage: 90, demandGrowth: 35, salaryPremium: 25, supply: 55 },
    { skill: 'Digital Marketing',  shortage: 65, demandGrowth: 15, salaryPremium:  8, supply: 85 },
    { skill: 'UX Design',          shortage: 72, demandGrowth: 18, salaryPremium: 12, supply: 68 },
  ];
  for (const s of skillShortagesData) {
    await prisma.skillShortage.upsert({
      where: { institutionId_skill: { institutionId: cuhk.id, skill: s.skill } },
      create: { ...s, institutionId: cuhk.id },
      update: {},
    });
  }

  // ── Employer competency feedback ──────────────────────────────────────────
  const competencyData = [
    { competency: 'Technical Skills', current: 78, desired: 90 },
    { competency: 'Communication',    current: 82, desired: 88 },
    { competency: 'Problem Solving',  current: 75, desired: 92 },
    { competency: 'Teamwork',         current: 85, desired: 90 },
    { competency: 'Adaptability',     current: 72, desired: 88 },
    { competency: 'Leadership',       current: 68, desired: 85 },
  ];
  for (const c of competencyData) {
    await prisma.competencyFeedback.upsert({
      where: { institutionId_competency_year: { institutionId: cuhk.id, competency: c.competency, year: 2026 } },
      create: { ...c, institutionId: cuhk.id, year: 2026 },
      update: {},
    });
  }

  // ── Job posting demand forecast (Jul–Dec 2026) ────────────────────────────
  const demandForecastData = [
    { month: 'Jul', monthOrder: 7,  actual: 2560, forecast: 2580, historical: 2420 },
    { month: 'Aug', monthOrder: 8,  actual: 2650, forecast: 2720, historical: 2510 },
    { month: 'Sep', monthOrder: 9,  actual: 2780, forecast: 2850, historical: 2640 },
    { month: 'Oct', monthOrder: 10, actual: null, forecast: 2980, historical: 2750 },
    { month: 'Nov', monthOrder: 11, actual: null, forecast: 3100, historical: 2820 },
    { month: 'Dec', monthOrder: 12, actual: null, forecast: 3050, historical: 2900 },
  ];
  for (const f of demandForecastData) {
    await prisma.demandForecast.upsert({
      where: { institutionId_year_month: { institutionId: cuhk.id, year: 2026, month: f.month } },
      create: { ...f, institutionId: cuhk.id, year: 2026 },
      update: {},
    });
  }

  // ── Partnership pipeline (funnel stages) ─────────────────────────────────
  const pipelineData = [
    { stage: 'Prospecting',        count: 48, conversionRate: 67, sortOrder: 1 },
    { stage: 'Initial Contact',    count: 32, conversionRate: 75, sortOrder: 2 },
    { stage: 'Engaged',            count: 24, conversionRate: 75, sortOrder: 3 },
    { stage: 'Partnership Active', count: 18, conversionRate: 100, sortOrder: 4 },
  ];
  for (const p of pipelineData) {
    await prisma.partnershipPipeline.upsert({
      where: { institutionId_stage: { institutionId: cuhk.id, stage: p.stage } },
      create: { ...p, institutionId: cuhk.id },
      update: { count: p.count },
    });
  }

  // ── Employer satisfaction trends (quarterly) ──────────────────────────────
  const satisfactionTrendsData = [
    { quarter: 'Q1 2025', quarterOrder: 1, overall: 8.1, graduates: 7.8, support: 8.3, processes: 7.9 },
    { quarter: 'Q2 2025', quarterOrder: 2, overall: 8.2, graduates: 8.0, support: 8.4, processes: 8.1 },
    { quarter: 'Q3 2025', quarterOrder: 3, overall: 8.3, graduates: 8.2, support: 8.5, processes: 8.2 },
    { quarter: 'Q4 2025', quarterOrder: 4, overall: 8.4, graduates: 8.3, support: 8.6, processes: 8.3 },
  ];
  for (const s of satisfactionTrendsData) {
    await prisma.employerSatisfactionTrend.upsert({
      where: { institutionId_quarter: { institutionId: cuhk.id, quarter: s.quarter } },
      create: { ...s, institutionId: cuhk.id },
      update: {},
    });
  }

  // ── Employer events (monthly, Jan–Jun 2026) ────────────────────────────────
  const employerEventsData = [
    { month: 'Jan', monthOrder: 1, careerFairs: 2, workshops: 4, networking: 3, attendance: 487 },
    { month: 'Feb', monthOrder: 2, careerFairs: 1, workshops: 5, networking: 4, attendance: 534 },
    { month: 'Mar', monthOrder: 3, careerFairs: 3, workshops: 6, networking: 5, attendance: 678 },
    { month: 'Apr', monthOrder: 4, careerFairs: 2, workshops: 4, networking: 3, attendance: 512 },
    { month: 'May', monthOrder: 5, careerFairs: 1, workshops: 7, networking: 6, attendance: 623 },
    { month: 'Jun', monthOrder: 6, careerFairs: 4, workshops: 5, networking: 4, attendance: 789 },
  ];
  for (const e of employerEventsData) {
    await prisma.employerEvent.upsert({
      where: { institutionId_year_month: { institutionId: cuhk.id, year: 2026, month: e.month } },
      create: { ...e, institutionId: cuhk.id, year: 2026 },
      update: {},
    });
  }

  // ── Partnership activity feed ─────────────────────────────────────────────
  const activityData = [
    { type: 'new',      employer: 'Deloitte HK',     action: 'MoU signed for 15 internship placements',        daysAgo: 0,  hoursAgo: 2 },
    { type: 'event',    employer: 'HSBC',             action: 'Career workshop scheduled for July 15',          daysAgo: 0,  hoursAgo: 5 },
    { type: 'feedback', employer: 'Alibaba Cloud',    action: 'Submitted employer satisfaction survey (9.0/10)', daysAgo: 1,  hoursAgo: 0 },
    { type: 'job',      employer: 'JP Morgan',        action: 'Posted 8 new graduate positions',                daysAgo: 2,  hoursAgo: 0 },
    { type: 'meeting',  employer: 'Hospital Authority',action: 'Partnership renewal meeting completed',         daysAgo: 3,  hoursAgo: 0 },
  ];
  for (const a of activityData) {
    const createdAt = new Date(Date.now() - (a.daysAgo * 24 + a.hoursAgo) * 60 * 60 * 1000);
    await prisma.partnershipActivity.create({
      data: { institutionId: cuhk.id, type: a.type, employer: a.employer, action: a.action, createdAt },
    }).catch(() => {}); // skip duplicates on re-seed
  }

  // ── Alumni events (for AlumniPathsScreen in consumer app) ─────────────────
  const alumniEventsData = [
    { id: 'ae-01', title: 'Data Career Transitions Panel',   date: '2026-05-28', time: '18:30-20:00', host: 'CS Alumni Network',       mode: 'Hybrid',    relevantPathIds: ['path-02', 'path-04'] },
    { id: 'ae-02', title: 'From IC to Manager Workshop',     date: '2026-06-05', time: '19:00-21:00', host: 'Career Services Office',   mode: 'In-person', relevantPathIds: ['path-02', 'path-05'] },
    { id: 'ae-03', title: 'Alumni Coffee Chat: Tech Sector', date: '2026-06-12', time: '10:00-12:00', host: 'Tech Alumni Chapter',      mode: 'Online',    relevantPathIds: ['path-03', 'path-04'] },
  ];
  for (const e of alumniEventsData) {
    await prisma.alumniEvent.upsert({
      where: { id: e.id },
      create: { id: e.id, institutionId: cuhk.id, title: e.title, date: new Date(e.date), time: e.time, host: e.host, mode: e.mode, relevantPathIds: e.relevantPathIds },
      update: {},
    });
  }

  console.log('\nSeeding complete!');
  console.log('─────────────────────────────────────────');
  console.log('Demo accounts:');
  console.log('  Graduate:  student@cuhk.edu.hk / student123');
  console.log('  Admin:     admin@cuhk.edu.hk  / admin123456');
  console.log('  Recruiter: recruiter@hsbc.com / recruiter123');
  console.log('─────────────────────────────────────────');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
