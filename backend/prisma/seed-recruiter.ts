import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const RECRUITER_ID = 'cmpeurs4i0005qwhpsj048vqj';
const HSBC_ID      = 'cmp8g63dx0007qw7yquyy6lq4';
const CUHK_INST_ID_QUERY = true; // resolved below

async function main() {
  console.log('Seeding recruiter demo data…');

  // ── 5 HSBC jobs owned by the recruiter ──────────────────────────────────
  const jobsData = [
    {
      id: 'rec-job-01',
      title: 'Graduate Analyst – Markets',
      company: 'HSBC',
      district: 'Central',
      salaryMin: 35000,
      salaryMax: 50000,
      sector: 'Banking',
      responsibilities:
        'Support trading desks with data analysis, produce daily P&L reports, assist with market research and client reporting.',
      requirements:
        'Bachelor degree in Finance, Economics or related field. Strong Excel and Python skills. 0-2 years experience.',
      skills: ['Excel', 'Python', 'Financial Analysis', 'Bloomberg', 'SQL', 'PowerPoint'],
      deadline: new Date('2026-07-31'),
    },
    {
      id: 'rec-job-02',
      title: 'Associate Software Engineer',
      company: 'HSBC',
      district: 'Tsim Sha Tsui',
      salaryMin: 40000,
      salaryMax: 58000,
      sector: 'Technology',
      responsibilities:
        'Build and maintain internal banking applications, participate in agile sprints, write unit tests and API integrations.',
      requirements:
        'Computer Science degree. Proficient in Java or Python. Familiar with REST APIs and cloud platforms.',
      skills: ['Python', 'Java', 'SQL', 'Docker', 'Agile', 'REST APIs'],
      deadline: new Date('2026-08-15'),
    },
    {
      id: 'rec-job-03',
      title: 'Data Analyst – Retail Banking',
      company: 'HSBC',
      district: 'Central',
      salaryMin: 33000,
      salaryMax: 46000,
      sector: 'Banking',
      responsibilities:
        'Analyse customer behaviour data, build dashboards for management reporting, identify growth opportunities.',
      requirements:
        'Bachelor degree in Data Science, Statistics or Business. SQL and Tableau proficiency required.',
      skills: ['SQL', 'Tableau', 'Data Visualization', 'Python', 'Excel', 'Statistics'],
      deadline: new Date('2026-07-15'),
    },
    {
      id: 'rec-job-04',
      title: 'Risk & Compliance Graduate',
      company: 'HSBC',
      district: 'Central',
      salaryMin: 30000,
      salaryMax: 44000,
      sector: 'Banking',
      responsibilities:
        'Assist with regulatory reporting, conduct compliance reviews, support risk assessment frameworks.',
      requirements:
        'Law, Finance or Business degree. Attention to detail. Interest in regulatory environment.',
      skills: ['Risk Management', 'Excel', 'Documentation', 'Research', 'Attention to Detail', 'Communication'],
      deadline: new Date('2026-07-30'),
    },
    {
      id: 'rec-job-05',
      title: 'Digital Transformation Analyst',
      company: 'HSBC',
      district: 'Wan Chai',
      salaryMin: 36000,
      salaryMax: 52000,
      sector: 'Technology',
      responsibilities:
        'Drive digital initiatives across retail banking, gather requirements from business units, document processes and define KPIs.',
      requirements:
        'Business or IT degree. Agile/Scrum knowledge preferred. Strong communication and stakeholder management.',
      skills: ['Agile', 'Requirements Analysis', 'Project Management', 'PowerPoint', 'Stakeholder Management', 'SQL'],
      deadline: new Date('2026-08-01'),
    },
  ];

  for (const j of jobsData) {
    await prisma.job.upsert({
      where: { id: j.id },
      create: { ...j, isActive: true, createdByUserId: RECRUITER_ID, employerId: HSBC_ID },
      update: { createdByUserId: RECRUITER_ID, employerId: HSBC_ID },
    });
  }
  console.log('✓ Jobs created');

  // ── 6 graduate users with profiles ──────────────────────────────────────
  const graduatesData = [
    {
      id: 'grad-emily',
      email: 'emily.chan@connect.hku.hk',
      name: 'Emily Chan',
      university: 'HKU',
      faculty: 'Business',
      graduationYear: 2026,
      gpa: 3.8,
      skills: ['Financial Analysis', 'Excel', 'Bloomberg', 'PowerPoint', 'SQL'],
    },
    {
      id: 'grad-james',
      email: 'james.wong@ust.hk',
      name: 'James Wong',
      university: 'HKUST',
      faculty: 'Economics',
      graduationYear: 2026,
      gpa: 3.7,
      skills: ['Python', 'Statistics', 'Excel', 'Financial Analysis', 'SQL'],
    },
    {
      id: 'grad-sarah',
      email: 'sarah.lam@connect.polyu.edu.hk',
      name: 'Sarah Lam',
      university: 'HKUST',
      faculty: 'Computer Science',
      graduationYear: 2026,
      gpa: 3.9,
      skills: ['Python', 'Java', 'SQL', 'Docker', 'Agile', 'REST APIs'],
    },
    {
      id: 'grad-kevin',
      email: 'kevin.liu@polyu.edu.hk',
      name: 'Kevin Liu',
      university: 'PolyU',
      faculty: 'Computing',
      graduationYear: 2025,
      gpa: 3.5,
      skills: ['Python', 'SQL', 'Data Visualization', 'Tableau', 'Excel'],
    },
    {
      id: 'grad-alice',
      email: 'alice.ng@link.cuhk.edu.hk',
      name: 'Alice Ng',
      university: 'CUHK',
      faculty: 'Finance',
      graduationYear: 2026,
      gpa: 3.4,
      skills: ['Excel', 'Financial Analysis', 'Research', 'Communication', 'PowerPoint'],
    },
    {
      id: 'grad-ryan',
      email: 'ryan.ho@connect.hku.hk',
      name: 'Ryan Ho',
      university: 'HKU',
      faculty: 'Information Systems',
      graduationYear: 2026,
      gpa: 3.6,
      skills: ['SQL', 'Python', 'Agile', 'Requirements Analysis', 'Stakeholder Management'],
    },
  ];

  const hash = await bcrypt.hash('demo123456', 12);
  for (const g of graduatesData) {
    await prisma.user.upsert({
      where: { email: g.email },
      create: { id: g.id, email: g.email, passwordHash: hash, role: 'GRADUATE' },
      update: {},
    });
    const user = await prisma.user.findUnique({ where: { email: g.email }, select: { id: true } });
    if (!user) continue;

    await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name: g.name,
        university: g.university,
        faculty: g.faculty,
        degreeLevel: 'Bachelor',
        graduationYear: g.graduationYear,
        gpa: g.gpa,
        location: 'Hong Kong',
        targetRole: 'Graduate Analyst',
        targetSector: 'Banking',
      },
      update: { name: g.name, university: g.university, faculty: g.faculty, gpa: g.gpa },
    });

    // Add skills for match score calculation
    for (const skillName of g.skills) {
      const skill = await prisma.skill.findFirst({ where: { name: skillName } });
      if (!skill) continue;
      await prisma.userSkill.upsert({
        where: { userId_skillId: { userId: user.id, skillId: skill.id } },
        create: { userId: user.id, skillId: skill.id, level: 65 + Math.floor(Math.random() * 30), gap: 'MEDIUM', impact: 'HIGH' },
        update: {},
      });
    }
  }
  console.log('✓ Graduate users created');

  // ── Resolve user IDs after upsert ────────────────────────────────────────
  const getUid = async (email: string) => {
    const u = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    return u!.id;
  };

  const uidEmily  = await getUid('emily.chan@connect.hku.hk');
  const uidJames  = await getUid('james.wong@ust.hk');
  const uidSarah  = await getUid('sarah.lam@connect.polyu.edu.hk');
  const uidKevin  = await getUid('kevin.liu@polyu.edu.hk');
  const uidAlice  = await getUid('alice.ng@link.cuhk.edu.hk');
  const uidRyan   = await getUid('ryan.ho@connect.hku.hk');
  const uidAlex   = 'cmp8g63ds0004qw7yp7j3cu1o'; // existing student@cuhk.edu.hk

  // ── Applications spread across all 5 Kanban stages ──────────────────────
  // Stage strings must match stageToRecruiterStatus() in recruiters.ts:
  //   'Application Submitted' → APPLIED
  //   'Shortlisted'           → SHORTLISTED
  //   'Interview Scheduled'   → INTERVIEWING
  //   'Offer Made'            → OFFERED
  //   'Rejected'              → REJECTED
  const appsData: {
    id: string;
    userId: string;
    jobId: string;
    stage: string;
    status: 'PENDING' | 'INTERVIEW' | 'OFFERED' | 'REJECTED';
    appliedDate: string;
  }[] = [
    // ── rec-job-01: Graduate Analyst – Markets ────────────────────────────
    { id: 'ra-01', userId: uidEmily,  jobId: 'rec-job-01', stage: 'Application Submitted', status: 'PENDING',   appliedDate: '2026-05-10' },
    { id: 'ra-02', userId: uidJames,  jobId: 'rec-job-01', stage: 'Shortlisted',            status: 'PENDING',   appliedDate: '2026-05-08' },
    { id: 'ra-03', userId: uidAlice,  jobId: 'rec-job-01', stage: 'Rejected',               status: 'REJECTED',  appliedDate: '2026-05-12' },
    { id: 'ra-04', userId: uidAlex,   jobId: 'rec-job-01', stage: 'Application Submitted',  status: 'PENDING',   appliedDate: '2026-05-14' },

    // ── rec-job-02: Associate Software Engineer ───────────────────────────
    { id: 'ra-05', userId: uidSarah,  jobId: 'rec-job-02', stage: 'Interview Scheduled',    status: 'INTERVIEW', appliedDate: '2026-05-05' },
    { id: 'ra-06', userId: uidKevin,  jobId: 'rec-job-02', stage: 'Offer Made',              status: 'OFFERED',   appliedDate: '2026-04-28' },
    { id: 'ra-07', userId: uidRyan,   jobId: 'rec-job-02', stage: 'Shortlisted',             status: 'PENDING',   appliedDate: '2026-05-06' },

    // ── rec-job-03: Data Analyst – Retail Banking ─────────────────────────
    { id: 'ra-08', userId: uidJames,  jobId: 'rec-job-03', stage: 'Interview Scheduled',    status: 'INTERVIEW', appliedDate: '2026-05-02' },
    { id: 'ra-09', userId: uidKevin,  jobId: 'rec-job-03', stage: 'Shortlisted',             status: 'PENDING',   appliedDate: '2026-05-09' },
    { id: 'ra-10', userId: uidAlice,  jobId: 'rec-job-03', stage: 'Application Submitted',  status: 'PENDING',   appliedDate: '2026-05-15' },

    // ── rec-job-04: Risk & Compliance ────────────────────────────────────
    { id: 'ra-11', userId: uidEmily,  jobId: 'rec-job-04', stage: 'Shortlisted',             status: 'PENDING',   appliedDate: '2026-05-07' },
    { id: 'ra-12', userId: uidRyan,   jobId: 'rec-job-04', stage: 'Application Submitted',  status: 'PENDING',   appliedDate: '2026-05-13' },

    // ── rec-job-05: Digital Transformation ───────────────────────────────
    { id: 'ra-13', userId: uidSarah,  jobId: 'rec-job-05', stage: 'Offer Made',              status: 'OFFERED',   appliedDate: '2026-04-25' },
    { id: 'ra-14', userId: uidRyan,   jobId: 'rec-job-05', stage: 'Interview Scheduled',    status: 'INTERVIEW', appliedDate: '2026-05-03' },
    { id: 'ra-15', userId: uidAlex,   jobId: 'rec-job-05', stage: 'Shortlisted',             status: 'PENDING',   appliedDate: '2026-05-11' },
  ];

  for (const a of appsData) {
    await prisma.application.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        userId: a.userId,
        jobId: a.jobId,
        stage: a.stage,
        status: a.status,
        appliedDate: new Date(a.appliedDate),
      },
      update: { stage: a.stage, status: a.status },
    });
  }
  console.log('✓ Applications created (15 across 5 stages)');

  // ── Campus events ────────────────────────────────────────────────────────
  const eventsData = [
    {
      id: 'rev-01',
      title: 'CUHK Campus Career Fair 2026',
      type: 'CAREER_FAIR' as const,
      date: new Date('2026-06-10T10:00:00'),
      time: '10:00–17:00',
      location: 'CUHK Shaw College Amphitheatre',
      universityPartner: 'CUHK',
      expectedAttendance: 850,
      description: 'Annual career fair targeting Computer Science, Finance and Business graduates.',
    },
    {
      id: 'rev-02',
      title: 'HKU FinTech Insight Workshop',
      type: 'WORKSHOP' as const,
      date: new Date('2026-06-18T14:00:00'),
      time: '14:00–17:00',
      location: 'HKU Main Building Room 201',
      universityPartner: 'HKU',
      expectedAttendance: 120,
      description: 'Hands-on workshop on digital payments, open banking APIs and regulatory sandbox.',
    },
    {
      id: 'rev-03',
      title: 'Banking Talent Networking Night',
      type: 'NETWORKING' as const,
      date: new Date('2026-06-25T18:30:00'),
      time: '18:30–21:00',
      location: 'HSBC Main Building, Central',
      universityPartner: 'HKUST',
      expectedAttendance: 200,
      description: 'Informal networking event connecting HSBC hiring managers with HKUST graduates.',
    },
    {
      id: 'rev-04',
      title: 'HSBC Technology Graduate Info Session',
      type: 'INFO_SESSION' as const,
      date: new Date('2026-07-03T16:00:00'),
      time: '16:00–18:00',
      location: 'Online (Zoom)',
      universityPartner: 'PolyU',
      expectedAttendance: 300,
      description: 'Learn about HSBC Technology graduate roles, internship-to-hire pathways and the application process.',
    },
  ];

  for (const e of eventsData) {
    await prisma.campusEvent.upsert({
      where: { id: e.id },
      create: { ...e, recruiterId: RECRUITER_ID },
      update: { title: e.title, expectedAttendance: e.expectedAttendance },
    });
  }
  console.log('✓ Campus events created');

  // ── Summary ──────────────────────────────────────────────────────────────
  const [jobCount, appCount, eventCount] = await Promise.all([
    prisma.job.count({ where: { createdByUserId: RECRUITER_ID } }),
    prisma.application.count({ where: { job: { createdByUserId: RECRUITER_ID } } }),
    prisma.campusEvent.count({ where: { recruiterId: RECRUITER_ID } }),
  ]);

  console.log('\nRecruiter seed complete!');
  console.log('─────────────────────────────────────────');
  console.log(`  Jobs owned by recruiter : ${jobCount}`);
  console.log(`  Applications in pipeline: ${appCount}`);
  console.log(`  Campus events           : ${eventCount}`);
  console.log('\nKanban distribution:');
  const stages = ['Application Submitted', 'Shortlisted', 'Interview Scheduled', 'Offer Made', 'Rejected'];
  for (const stage of stages) {
    const n = await prisma.application.count({ where: { stage, job: { createdByUserId: RECRUITER_ID } } });
    console.log(`  ${stage.padEnd(28)}: ${n}`);
  }
  console.log('─────────────────────────────────────────');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
