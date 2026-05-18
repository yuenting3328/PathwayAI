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

  console.log('\nSeeding complete!');
  console.log('─────────────────────────────────────────');
  console.log('Demo accounts:');
  console.log('  Graduate:  student@cuhk.edu.hk / student123');
  console.log('  Admin:     admin@cuhk.edu.hk  / admin123456');
  console.log('─────────────────────────────────────────');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
