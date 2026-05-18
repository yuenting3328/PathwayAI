import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PassThrough } from 'node:stream';
import { promises as fsPromises } from 'node:fs';
import nodePath from 'node:path';
import nodeOs from 'node:os';
import { randomUUID } from 'node:crypto';
import { prisma } from '../index.js';
import Anthropic from '@anthropic-ai/sdk';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

// ─── Client setup ─────────────────────────────────────────────────────────────
const PLACEHOLDER_KEY = 'your-anthropic-api-key-here';
const MODEL = 'claude-opus-4-5-20251101';
const hasValidKey = !!(
  process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== PLACEHOLDER_KEY
);
const anthropic = hasValidKey ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

// ─── Document file store (1-hour TTL) ─────────────────────────────────────────
interface FileEntry { path: string; filename: string; expiresAt: number }
const fileStore = new Map<string, FileEntry>();
let docTmpDir = nodePath.join(nodeOs.tmpdir(), 'pathwayai-docs');
fsPromises.mkdir(docTmpDir, { recursive: true }).catch(() => {});
setInterval(() => {
  const now = Date.now();
  for (const [id, e] of fileStore.entries()) {
    if (now > e.expiresAt) {
      fileStore.delete(id);
      fsPromises.unlink(e.path).catch(() => {});
    }
  }
}, 10 * 60 * 1000);

// ─── Rate limiting (20 messages / user / minute) ──────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId) ?? { count: 0, resetAt: now + 60_000 };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 60_000; }
  if (entry.count >= 20) return false;
  entry.count++;
  rateLimitMap.set(userId, entry);
  return true;
}

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `# Role

You are an AI Coach Agent integrated into the Pathway AI app's Coach Page. You function as an intelligent, professional coaching assistant embedded within the application to answer user questions, provide expert guidance, and execute meaningful actions on behalf of users to support their personal and professional development.

# Task

Your primary function is to:
1. **Answer questions** with clear, accurate, and contextually relevant information drawn from coaching best practices and domain expertise
2. **Provide professional advice** that is actionable, evidence-based, and tailored to each user's specific situation and goals
3. **Execute actions directly** when appropriate—creating plans, generating resources, organizing information, and documenting progress to move users forward without friction

# Context

You operate as a proactive coaching partner within the Pathway AI app ecosystem. Users rely on you to bridge the gap between coaching insight and real-world implementation, reducing friction between understanding a challenge and taking meaningful action. Your role integrates seamlessly into their development workflow, providing both guidance and execution support.

You are serving students primarily in the Hong Kong graduate job market. Where relevant, ground advice in HK-specific context: local employers (HSBC, Swire, Big 4, fintech firms), HK salary benchmarks (HKD 15,000–25,000/month for graduates), recruitment timelines, and cultural norms. If the user writes in Chinese, respond in Traditional Chinese (繁體中文).

# Instructions

## Core Behaviors

- **Answer directly first**: Start with a clear, concise response to the user's question or request before providing context or reasoning
- **Be conversational yet authoritative**: Approachable and empowering, grounded in expertise and professionalism
- **Ask clarifying questions judiciously**: When intent is unclear, ask—but avoid unnecessary back-and-forth that slows progress
- **Execute immediately when requested**: Create plans, log progress, organize information, or take other direct action unless the request requires user input first (in which case, ask for what you need)
- **Acknowledge context and constraints**: Show you understand the user's situation before offering advice
- **Maintain a coaching mindset**: Empower rather than solve for the user, unless they explicitly ask for direct action

## Tone and Style

- Professional yet approachable
- Honest about limitations—don't pretend to know what you don't
- Respectful of user autonomy and circumstances
- Concise unless the user asks for depth

## Output Format

- Start with a direct answer or acknowledgment
- Provide context or reasoning when it adds value
- Include specific next steps or actions when relevant
- Use formatting (bullets, sections) for scannability
- Keep responses concise; expand only when requested

## Boundaries

- **Do not provide medical, legal, or financial advice** unless explicitly framed as general educational information
- **Do not make assumptions** about the user's situation without asking
- **Do not overwhelm with options**; prioritize the most relevant guidance
- **Stay focused on coaching and professional development** within the Pathway AI context
- **For out-of-scope requests**: Clearly explain why it falls outside your scope and suggest what might help instead

## Edge Case Handling

**Off-Topic Requests**: Politely redirect to coaching and development topics while remaining helpful where possible.

**Uncertain Situations**: Explicitly state what you don't know and suggest how the user might find the answer.

**Conflicting Goals**: Help the user clarify priorities and trade-offs rather than choosing for them.

**User Asks for Action**: Execute immediately (create plans, send reminders, log progress) unless the request requires user input first—then ask for what you need.`;

// ─── Agent tools ──────────────────────────────────────────────────────────────
const COACH_TOOLS: Anthropic.Tool[] = [
  {
    name: 'create_action_plan',
    description: "Creates a structured weekly action plan and saves it to the user's coaching history.",
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Plan title, e.g. "4-Week SQL Study Plan"' },
        weeks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              week: { type: 'number' },
              focus: { type: 'string' },
              tasks: { type: 'array', items: { type: 'string' } },
            },
            required: ['week', 'focus', 'tasks'],
          },
        },
      },
      required: ['title', 'weeks'],
    },
  },
  {
    name: 'log_coaching_session',
    description: 'Records the current conversation as a coaching session with a summary.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type: { type: 'string', enum: ['career_advice', 'resume_review', 'interview_practice'] },
        topic: { type: 'string' },
        summary: { type: 'string', description: 'Brief summary of what was discussed and decided' },
      },
      required: ['type', 'topic', 'summary'],
    },
  },
  {
    name: 'update_target_role',
    description: "Updates the user's target role or sector in their profile based on what they've shared.",
    input_schema: {
      type: 'object' as const,
      properties: {
        targetRole: { type: 'string' },
        targetSector: { type: 'string' },
      },
    },
  },
  {
    name: 'generate_document',
    description: 'Generates a downloadable Word (.docx) file — cover letter or CV template — personalised with the user\'s profile data.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type: { type: 'string', enum: ['cover_letter', 'cv_template'], description: 'Document type to generate' },
      },
      required: ['type'],
    },
  },
];

// ─── User context builder (Phase 2) ──────────────────────────────────────────
async function buildUserContext(userId: string): Promise<string> {
  const [profile, skills, applications, sessions] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.userSkill.findMany({
      where: { userId },
      take: 10,
      include: { skill: { select: { name: true, category: true } } },
      orderBy: { gap: 'desc' },
    }),
    prisma.application.findMany({
      where: { userId },
      take: 5,
      include: { job: { select: { title: true, company: true } } },
      orderBy: { appliedDate: 'desc' },
    }),
    prisma.coachSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  return `## Current User Context
- Name: ${profile?.name ?? 'Not provided'}
- University: ${profile?.university ?? 'Not set'}${profile?.faculty ? `, ${profile.faculty}` : ''}
- Degree: ${profile?.degreeLevel ?? 'Not set'}, graduating ${profile?.graduationYear ?? 'Unknown'}
- Target role: ${profile?.targetRole ?? 'Not specified'}
- Target sector: ${profile?.targetSector ?? 'Not specified'}
- GPA: ${profile?.gpa ?? 'Not provided'}

## Skill Gaps (highest priority first)
${skills.length
    ? skills.map(s => `- ${s.skill.name}${s.skill.category ? ` (${s.skill.category})` : ''}: level ${s.level}/100, gap: ${s.gap}, impact: ${s.impact}`).join('\n')
    : '- No skills tracked yet'}

## Recent Applications (${applications.length})
${applications.length
    ? applications.map(a => `- ${a.job?.title ?? 'Unknown role'} at ${a.job?.company ?? 'Unknown company'}: ${a.status}`).join('\n')
    : '- No applications yet'}

## Previous Coaching Sessions
${sessions.length
    ? sessions.map(s => `- ${s.type}: ${s.topic ?? 'general'} (${new Date(s.createdAt).toLocaleDateString()})`).join('\n')
    : '- No previous sessions'}`;
}

// ─── Tool executor (Phase 3) ──────────────────────────────────────────────────
async function executeTool(name: string, input: Record<string, unknown>, userId: string): Promise<string> {
  switch (name) {
    case 'create_action_plan': {
      await prisma.coachSession.create({
        data: {
          userId,
          type: 'career_advice',
          topic: input.title as string,
          summary: `Action plan created: ${input.title}`,
          feedback: input as Record<string, unknown>,
        },
      });
      return `Action plan "${input.title as string}" saved to your profile.`;
    }
    case 'log_coaching_session': {
      await prisma.coachSession.create({
        data: {
          userId,
          type: input.type as string,
          topic: input.topic as string,
          summary: input.summary as string,
        },
      });
      return 'Coaching session logged successfully.';
    }
    case 'update_target_role': {
      await prisma.profile.upsert({
        where: { userId },
        update: {
          ...(input.targetRole && { targetRole: input.targetRole as string }),
          ...(input.targetSector && { targetSector: input.targetSector as string }),
        },
        create: {
          userId,
          ...(input.targetRole && { targetRole: input.targetRole as string }),
          ...(input.targetSector && { targetSector: input.targetSector as string }),
        },
      });
      return 'Profile updated with your target role and sector.';
    }
    case 'generate_document': {
      const docType = (input.type === 'cv_template' ? 'cv_template' : 'cover_letter') as DocType;
      const { filename, url } = await generateDocxFile(docType, userId);
      return `Document generated: ${filename}. Download link: ${url}`;
    }
    default:
      return 'Unknown tool — no action taken.';
  }
}

// ─── Persist a user + assistant message pair ──────────────────────────────────
async function persistMessages(userId: string, userMsg: string, assistantMsg: string) {
  if (!userMsg || !assistantMsg) return;
  await prisma.chatMessage.createMany({
    data: [
      { userId, role: 'user', content: userMsg },
      { userId, role: 'assistant', content: assistantMsg },
    ],
  });
}

// ─── Document generation ──────────────────────────────────────────────────────
type DocType = 'cover_letter' | 'cv_template';

function detectDocumentRequest(msg: string): DocType | null {
  const m = msg.toLowerCase();
  const wantsFile = ['generate', 'create', 'download', 'export', 'make me', 'write me', 'word', 'docx', '.doc', 'file', 'document'].some(t => m.includes(t));
  if (!wantsFile) return null;
  if (m.includes('cover letter') || m.includes('covering letter') || m.includes('求職信') || m.includes('自薦信')) return 'cover_letter';
  if (m.includes(' cv') || m.startsWith('cv') || m.includes('resume') || m.includes('curriculum vitae') || m.includes('履歷')) return 'cv_template';
  return null;
}

async function generateDocxFile(type: DocType, userId: string): Promise<{ filename: string; url: string; explanation: string }> {
  const profile = await prisma.profile.findUnique({ where: { userId } }).catch(() => null);
  const name = profile?.name ?? '[Your Name]';
  const university = profile?.university ?? '[University]';
  const targetRole = profile?.targetRole ?? '[Target Role]';
  const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost:4000';

  let doc: Document;
  let filename: string;
  let explanation: string;

  if (type === 'cover_letter') {
    filename = `cover-letter-${Date.now()}.docx`;
    explanation = `I've generated a cover letter template for you as a Word document.\n\nIt includes:\n- A professional header with your contact details\n- An opening that names the specific role and company\n- Two body paragraphs for your experience highlights\n- A confident, action-oriented closing\n\nDownload it below, then personalise the **blue placeholder text** with your specific company, role, and achievements. Would you like tips on strengthening any section?`;
    doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: name, heading: HeadingLevel.TITLE }),
          new Paragraph({ children: [new TextRun({ text: `${university}  |  Hong Kong  |  [your.email@example.com]  |  [+852 XXXX XXXX]`, color: '666666', size: 22 })] }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: new Date().toLocaleDateString('en-HK', { year: 'numeric', month: 'long', day: 'numeric' }) }),
          new Paragraph({ text: '' }),
          new Paragraph({ children: [new TextRun({ text: 'Hiring Manager', bold: true })] }),
          new Paragraph({ children: [new TextRun({ text: '[Company Name]', color: '1a56db' })] }),
          new Paragraph({ children: [new TextRun({ text: '[Company Address, Hong Kong]', color: '666666', size: 22 })] }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Dear Hiring Manager,' }),
          new Paragraph({ text: '' }),
          new Paragraph({ children: [
            new TextRun('I am writing to apply for the position of '),
            new TextRun({ text: `[${targetRole}]`, color: '1a56db' }),
            new TextRun(' at '),
            new TextRun({ text: '[Company Name]', color: '1a56db' }),
            new TextRun('. I was particularly drawn to '),
            new TextRun({ text: '[specific aspect, e.g. your expansion into fintech / your ESG commitment / your graduate programme structure]', color: '1a56db' }),
            new TextRun(', which aligns closely with my career goals.'),
          ]}),
          new Paragraph({ text: '' }),
          new Paragraph({ children: [
            new TextRun(`During my time at ${university}, I developed strong `),
            new TextRun({ text: '[Skill 1, e.g. data analysis]', color: '1a56db' }),
            new TextRun(' and '),
            new TextRun({ text: '[Skill 2, e.g. financial modelling]', color: '1a56db' }),
            new TextRun(' skills. In my '),
            new TextRun({ text: '[internship / project]', color: '1a56db' }),
            new TextRun(' at '),
            new TextRun({ text: '[Company / Project Name]', color: '1a56db' }),
            new TextRun(', I '),
            new TextRun({ text: '[achieved X with a number, e.g. reduced reporting time by 30% by automating dashboards in Python]', color: '1a56db' }),
            new TextRun('. This experience reinforced my ability to deliver results under pressure.'),
          ]}),
          new Paragraph({ text: '' }),
          new Paragraph({ children: [
            new TextRun('What sets me apart is '),
            new TextRun({ text: '[unique differentiator, e.g. my bilingual proficiency in English and Cantonese, combined with hands-on HK market experience]', color: '1a56db' }),
            new TextRun('. I am confident this makes me a strong fit for your team.'),
          ]}),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'I would welcome the opportunity to discuss how my background aligns with your needs. Thank you for your consideration.' }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Yours sincerely,' }),
          new Paragraph({ text: '' }),
          new Paragraph({ children: [new TextRun({ text: name, bold: true })] }),
        ],
      }],
    });
  } else {
    filename = `cv-template-${Date.now()}.docx`;
    explanation = `Here's your CV template as a Word document, structured for HK employers.\n\nIt follows a clean, ATS-friendly format with all key sections pre-built. The **blue text** marks every placeholder you need to fill in.\n\n**Tip:** Keep it to 1–2 pages and quantify every achievement with a number. Would you like help writing stronger bullet points for a specific section?`;
    doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: name, heading: HeadingLevel.TITLE }),
          new Paragraph({ children: [new TextRun({ text: `${university}  |  Hong Kong  |  [email]  |  [phone]  |  [LinkedIn]`, color: '666666', size: 22 })] }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'PROFESSIONAL SUMMARY', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [
            new TextRun(`${profile?.degreeLevel ?? 'Final-year'} student at ${university} targeting `),
            new TextRun({ text: targetRole, color: '1a56db' }),
            new TextRun(' roles. Strong in '),
            new TextRun({ text: '[Skill 1], [Skill 2], and [Skill 3]', color: '1a56db' }),
            new TextRun('. Proven ability to '),
            new TextRun({ text: '[key strength, e.g. deliver data-driven insights in fast-paced environments]', color: '1a56db' }),
            new TextRun('.'),
          ]}),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: university, bold: true }), new TextRun(`  —  ${profile?.degreeLevel ?? 'Bachelor of'} `), new TextRun({ text: '[Degree Title]', color: '1a56db' })] }),
          new Paragraph({ children: [new TextRun({ text: `${profile?.faculty ?? '[Faculty]'}  |  Expected ${profile?.graduationYear ?? new Date().getFullYear() + 1}  |  GPA: ${profile?.gpa ?? '[GPA]'}`, color: '666666', size: 22 })] }),
          new Paragraph({ children: [new TextRun('• '), new TextRun({ text: '[Relevant coursework, awards, or Dean\'s List]', color: '1a56db' })] }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'WORK EXPERIENCE', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: '[Company Name]', color: '1a56db', bold: true }), new TextRun('  —  '), new TextRun({ text: '[Job Title / Intern]', color: '1a56db' })] }),
          new Paragraph({ children: [new TextRun({ text: '[Month Year] – [Month Year]  |  Hong Kong', color: '666666', size: 22 })] }),
          new Paragraph({ children: [new TextRun('• '), new TextRun({ text: '[Achievement with number, e.g. Analysed 50K+ records in Python, reducing reporting time by 40%]', color: '1a56db' })] }),
          new Paragraph({ children: [new TextRun('• '), new TextRun({ text: '[Collaboration/impact statement]', color: '1a56db' })] }),
          new Paragraph({ children: [new TextRun('• '), new TextRun({ text: '[Another quantified achievement]', color: '1a56db' })] }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: 'Technical: ', bold: true }), new TextRun({ text: '[e.g. Python, SQL, Excel (Advanced), Tableau, PowerPoint]', color: '1a56db' })] }),
          new Paragraph({ children: [new TextRun({ text: 'Languages: ', bold: true }), new TextRun({ text: '[e.g. Cantonese (native), English (fluent), Mandarin (conversational)]', color: '1a56db' })] }),
          new Paragraph({ children: [new TextRun({ text: 'Certifications: ', bold: true }), new TextRun({ text: '[e.g. Google Data Analytics, Bloomberg Market Concepts]', color: '1a56db' })] }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'ACTIVITIES & LEADERSHIP', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: '[Role, e.g. Vice President, Finance Society]  |  [University]  |  2023–2024', color: '1a56db' })] }),
          new Paragraph({ children: [new TextRun('• '), new TextRun({ text: '[Achievement, e.g. Organised 3 industry panels with 200+ attendees; managed HKD 80,000 budget]', color: '1a56db' })] }),
        ],
      }],
    });
  }

  const fileId = randomUUID();
  const filePath = nodePath.join(docTmpDir, `${fileId}.docx`);
  const buffer = await Packer.toBuffer(doc);
  await fsPromises.writeFile(filePath, buffer);
  fileStore.set(fileId, { path: filePath, filename, expiresAt: Date.now() + 60 * 60 * 1000 });

  return { filename, url: `${SERVER_URL}/api/v1/coach/documents/${fileId}`, explanation };
}

// ─── Smart mock (no API key) ───────────────────────────────────────────────────
function getMockResponse(lastMessage: string, _allMessages: { role: string; content: string }[]): string {
  const msg = lastMessage.toLowerCase();
  const has = (...terms: string[]) => terms.some(t => msg.includes(t));

  if (has('hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening', '你好', '早晨', '下午好', 'can you help', 'what can you')) {
    return `Hello! I'm your PathwayAI Coach — here to help you navigate Hong Kong's graduate job market.

I can help you with:
- **CV & cover letter** review and optimisation
- **Interview prep** — competency, case, and technical rounds
- **Skill gaps** — what to learn and in what order
- **Job search strategy** — where to apply and how to stand out
- **Salary benchmarks** — what to expect and how to negotiate

What's on your mind today?`;
  }

  if (has('cover letter', 'covering letter', '求職信', '自薦信', 'motivation letter')) {
    return `A strong cover letter for HK employers is short, direct, and employer-focused. Here's the formula:

**Structure (3–4 paragraphs, under 400 words)**
1. **Opening** — Name the specific role and company. One sentence on why *this* company specifically.
2. **Why you're a fit** — 2–3 concrete examples from your experience that match the job requirements. Use numbers where possible.
3. **What you bring** — One thing that differentiates you (a project, a skill, a perspective) that isn't already obvious from your CV.
4. **Closing** — Short, confident. Express enthusiasm and ask for the opportunity to discuss further.

**HK-Specific Tips**
- Avoid generic openers like "I am writing to apply for..." — start with impact
- Mirror the company's language from their job posting
- For MNCs: emphasise cross-cultural adaptability and language skills (English + Cantonese/Mandarin)
- For local firms: show you understand the HK market context

**Common Mistakes**
- Repeating your CV line-by-line — the letter should *complement*, not duplicate
- Being too humble ("I hope I may be considered...") — be confident
- Sending the same letter to every company — personalisation is detectable and valued

Would you like me to help you draft or review a specific paragraph? Share the job description and I can tailor the advice.`;
  }

  if (has('cv', 'resume', 'curriculum vitae', '履歷', 'ats', 'bullet point', 'work experience', 'my experience', 'format my', 'write my', 'improve my', 'update my', 'review my', 'check my')) {
    return `For Hong Kong employers, here's what makes a strong CV:

**Format & Length**
- 1–2 pages max. HK recruiters spend ~6 seconds on first pass.
- Clean, ATS-friendly layout — avoid tables, columns, and graphics in the body.

**Must-Have Sections**
1. **Summary** (2–3 lines) — degree, target role, top skill
2. **Education** — GPA if ≥3.3, relevant coursework, awards
3. **Experience** — STAR bullets with numbers: *"Analysed 50K rows in Python, improving forecast accuracy by 18%"*
4. **Skills** — list tools explicitly: SQL, Python, Tableau, Excel

**HK-Specific Tips**
- Include HKID/right-to-work status if you're non-local
- Quantify everything — HK employers love metrics

Want me to help rewrite specific bullets, or review your skills section?`;
  }

  if (has('interview', 'prepare', 'preparation', '面試', '準備', 'behavioral', 'behavioural', 'competency', 'case study', 'case interview', 'star method', 'tell me about yourself', 'strengths', 'weaknesses', 'assessment centre', 'group exercise')) {
    return `Interview prep is where most candidates win or lose. Here's what works in HK:

**Know Your Interview Type**
- **Competency-based** (most common): Prepare 6–8 STAR stories — teamwork, leadership, problem-solving, handling failure
- **Case interviews** (banking/consulting): Practice HK-specific cases, e.g. market entry for a fintech in Cyberport
- **Technical** (tech roles): LeetCode Easy/Medium + basic system design

**Questions You'll Almost Always Get**
- *"Tell me about yourself"* → 90-second pitch: degree → key experience → why this role
- *"Why this company?"* → show you know their HK business specifically, not just global brand
- *"What's your expected salary?"* → HK grad roles: HKD 15K–22K/month depending on sector

**Day-Of**
- Arrive 10 mins early (MTR is reliable)
- Bring 3 printed CV copies — many HK firms still collect them
- Send a thank-you email within 24 hours

Which company or role are you preparing for? I can give you targeted questions.`;
  }

  if (has('skill', 'learn', 'course', 'study', 'training', 'certificate', 'certification', 'develop', 'upskill', '技能', '學習', '課程', 'python', 'sql', 'excel', 'tableau', 'power bi', 'coding', 'programming', 'data analysis', 'machine learning', 'ai ', 'artificial intelligence', 'cloud', 'aws', 'gcp', 'bloomberg', 'financial model')) {
    return `Here's your priority skill roadmap based on HK market demand right now:

**Tier 1 — High ROI, Fast to Learn**
- **SQL** — Required in 68% of analyst roles. Focus on JOINs, window functions, subqueries. Free: Mode SQL Tutorial
- **Excel (Advanced)** — Still king in HK finance & ops. Master PivotTables, XLOOKUP, Power Query

**Tier 2 — Differentiates You**
- **Python (pandas + matplotlib)** — Adds 15–20% to your match score for data roles. Start: Kaggle free course
- **Tableau or Power BI** — One strong dashboard in your portfolio beats 10 bullet points on a CV

**Tier 3 — Sector-Specific**
- Finance: Bloomberg Terminal basics, DCF/LBO modelling
- Tech: Git, basic cloud (AWS free tier), REST APIs
- Consulting: Structured communication, McKinsey-style slide decks

**Fastest Win**: Google Data Analytics Certificate (~3 months, ~HKD 300/month) covers SQL + Python + Tableau in one credential.

What sector are you targeting? I'll narrow this down.`;
  }

  if (has('salary', 'pay', 'wage', 'compensation', 'package', 'money', 'earn', 'income', 'hkd', 'negotiate', 'offer', 'benefits', 'mpf', '薪酬', '薪水', '工資', '人工', '錢')) {
    return `Here's an honest breakdown of HK graduate salaries in 2025:

**Starting Monthly Salary (HKD)**
| Sector | Range |
|--------|-------|
| Investment Banking | 25,000–35,000 |
| Big 4 Accounting | 18,000–22,000 |
| MNC Tech | 20,000–30,000 |
| MBB Consulting | 25,000–32,000 |
| Civil Service | 17,000–21,000 |
| Marketing / PR | 14,000–18,000 |

**How to Negotiate**
- Never give a number first — ask "what's the budgeted range for this role?"
- Counter with justification: your skill match, competing offers, market data
- Benefits (MPF top-up, medical, study leave) are often negotiable even when base isn't

Which role are you evaluating? I can give you a sharper benchmark.`;
  }

  if (has('stress', 'anxious', 'anxiety', 'worried', 'worry', 'nervous', 'scared', 'overwhelm', 'burn out', 'burnout', 'tired', 'exhausted', 'give up', 'hopeless', 'rejected', 'rejection', '擔心', '壓力', '焦慮')) {
    return `Job searching is genuinely stressful — especially in a competitive market like HK. What you're feeling is normal.

**Reframe the Numbers**
- Average HK grad sends 30–50 applications before landing their first offer
- A 10–15% response rate is considered good — most rejections are about fit, not you

**Protect Your Energy**
- Set a daily limit: 2–3 quality applications, not 10 rushed ones
- Take at least one full day off per week from job searching
- Track your wins — getting an interview is progress

**What Actually Moves the Needle**
- One coffee chat with an industry contact > 10 cold applications
- One improved CV section > applying to 20 new jobs with the same CV

What's the most frustrating part right now? Let's tackle it specifically.`;
  }

  if (has('finance', 'bank', 'fintech', 'investment', 'asset management', 'fund', 'equity', 'trading', 'investment banking', 'accounting', 'audit', '金融', '銀行', '投資', '會計')) {
    return `Finance is one of HK's strongest graduate pathways. Here's the landscape:

**Key Employers by Sub-Sector**
- **Investment Banking**: HSBC, JPMorgan, Goldman Sachs, UBS, Bank of America
- **Asset Management**: BlackRock, Fidelity, Schroders (HK is Asia's #2 fund hub)
- **Big 4 Accounting**: Deloitte, PwC, KPMG, EY — all have large HK practices
- **Fintech / Virtual Banks**: ZA Bank, Mox, WeLab, Airwallex, Neat

**Recruitment Timeline**
- IB summer analyst recruiting: September–November for the following year
- Big 4: October–January, with assessment centres
- Fintech: rolling, year-round

**Starting Salaries**
- IB analyst: HKD 25K–35K/month + bonus
- Big 4 associate: HKD 18K–22K/month
- Fintech: HKD 20K–28K/month

What specific finance area are you most interested in?`;
  }

  if (has('tech', 'technology', 'consulting', 'consultant', 'software', 'engineer', 'developer', 'product manager', 'startup', 'cyberport', 'science park', '科技', '顧問', '工程師')) {
    return `Tech and consulting are both strong choices for HK grads. Here's a quick breakdown:

**Tech in HK**
- **Where**: Cyberport, Science Park, MNCs (Google, Meta, Alibaba HK), local unicorns
- **Hot roles**: Data analyst, software engineer, product manager, UX researcher
- **Typical grad salary**: HKD 20K–28K/month at MNCs, HKD 18K–24K at local firms

**Consulting in HK**
- **MBB** (McKinsey, BCG, Bain): Very competitive — practice 30–40 cases
- **Big 4 advisory**: More accessible entry point, broad project exposure
- **Typical grad salary**: MBB HKD 25K–32K/month; Tier 2 HKD 18K–24K/month

**Breaking In**
- Tech: Build 2–3 GitHub projects. Even a well-documented data project signals initiative
- Consulting: Victor Cheng's Case Interview Secrets + CaseCoach for HK-specific practice

Which are you leaning towards?`;
  }

  if (has('network', 'connect', 'linkedin', 'referral', 'alumni', 'event', 'career fair', 'reach out', '人脈', '校友', '推薦')) {
    return `Networking in HK is genuinely different from other markets — here's how to do it well:

**Why It Matters More Here**
~60% of HK roles are filled before they're publicly posted. One warm intro beats 20 cold applications.

**Where to Network**
- **CUHK Alumni Association** — hugely underused. Many senior HK bankers/consultants actively mentor
- **LinkedIn** — send personalised connection notes (3 lines max)
- **Industry events** — HKFI, HKICPA, HKCS events are often free for students
- **Career fairs** — Convention Centre fairs in Oct–Nov attract 200+ employers

**The Right Message Formula**
*"Hi [Name], I'm a CUHK [Year] studying [Major]. I admire your work on [specific thing] and would love to hear about your path into [role]. Would you be open to a 15-min call?"*

Response rate with a personalised note: ~40% vs ~5% for generic requests.

Do you have a specific person or company you're trying to reach?`;
  }

  if (has('job', 'work', 'position', 'company', 'firm', 'employer', 'apply', 'application', 'search', 'find', 'internship', 'intern', 'full time', 'career', 'hsbc', 'jpmorgan', 'goldman', 'mckinsey', 'deloitte', 'pwc', 'kpmg', 'swire', 'mtr', '工作', '職位', '申請', '實習', '職業', '公司', '僱主')) {
    return `Let's build your HK job search strategy:

**Where to Apply**
- **JobsDB** — largest HK board, great for local firms and SMEs
- **LinkedIn Jobs** — best for MNCs and roles that value global profiles
- **Company career pages** — HSBC, Swire, CLP, MTR, HK Land post directly and early
- **GovHK** — civil service roles (very stable, competitive process)

**Application Strategy**
- Quality over quantity: 8–12 tailored applications beat 50 generic ones
- Apply within 48 hours of posting — HK recruiters often screen as they arrive

**HK's Hottest Hiring Areas Right Now**
- **Fintech** — ZA Bank, Mox, WeLab, Airwallex all hiring grads
- **Green finance / ESG** — HKEX mandatory ESG reporting created thousands of new roles
- **AI & data** — every sector, not just tech

What type of role or sector are you targeting? I'll help you prioritise.`;
  }

  if (msg.trim().split(' ').length <= 4) {
    return `I'd love to help — could you tell me a bit more? For example:

- Are you working on your **CV or cover letter**?
- Preparing for an upcoming **interview**?
- Looking for **jobs** or figuring out which sector to target?
- Wondering what **skills** to build next?
- Curious about **salary** ranges?

The more context you give me, the more specific I can be.`;
  }

  return `Got it — let me address that directly.

In the HK grad market, the most common underlying challenge tends to be one of these:

1. **Targeting** — applying broadly without a clear focus (fix: pick 2–3 sectors and go deep)
2. **Differentiation** — CVs and answers that sound like everyone else's (fix: lead with specific numbers and context)
3. **Timing** — missing recruitment windows (fix: IB/consulting recruit Sep–Nov; tech is year-round)
4. **Network gap** — relying only on public job boards (fix: one alumni intro per week)

Which of these resonates most? Or share more details and I'll give you something more targeted.`;
}

// ─── Routes ───────────────────────────────────────────────────────────────────
export default async function coachRoutes(app: FastifyInstance) {

  // Phase 1 — Health check
  app.get('/health', { preHandler: [app.authenticate] }, async () => ({
    model: MODEL,
    apiKeyConfigured: hasValidKey,
    mode: hasValidKey ? 'live' : 'mock',
  }));

  // Phase 6 — Load chat history
  app.get('/messages', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    return prisma.chatMessage.findMany({
      where: { userId: sub },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  });

  // Phase 6 — Clear chat history
  app.delete('/messages', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    await prisma.chatMessage.deleteMany({ where: { userId: sub } });
    return { success: true };
  });

  // Existing — coaching sessions list
  app.get('/sessions', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    return prisma.coachSession.findMany({
      where: { userId: sub },
      orderBy: { createdAt: 'desc' },
    });
  });

  // Existing — record session
  app.post('/sessions', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const schema = z.object({
      type: z.enum(['interview_practice', 'resume_review', 'career_advice']),
      topic: z.string().optional(),
      summary: z.string().optional(),
      score: z.number().min(0).max(100).optional(),
      feedback: z.record(z.unknown()).optional(),
      durationMs: z.number().optional(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const session = await prisma.coachSession.create({
      data: { userId: sub, ...body.data },
    });
    return reply.status(201).send(session);
  });

  // Phase 2+3+8 — Chat with agentic loop (non-streaming)
  app.post('/chat', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };

    // Phase 8 — Rate limiting
    if (!checkRateLimit(sub)) {
      return reply.status(429).send({ error: 'Rate limit: 20 messages per minute' });
    }

    const schema = z.object({
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })).min(1),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const lastUserMsg = [...body.data.messages].reverse().find(m => m.role === 'user')?.content ?? '';

    // Mock fallback
    if (!anthropic) {
      const docType = detectDocumentRequest(lastUserMsg);
      if (docType) {
        const { filename, url, explanation } = await generateDocxFile(docType, sub);
        await persistMessages(sub, lastUserMsg, explanation);
        return { content: explanation, attachment: { filename, url } };
      }
      const content = getMockResponse(lastUserMsg, body.data.messages);
      await persistMessages(sub, lastUserMsg, content);
      return { content };
    }

    // Phase 2 — Inject user context
    const userContext = await buildUserContext(sub);
    const systemWithContext = SYSTEM_PROMPT + '\n\n' + userContext;

    // Phase 3 — Agentic loop with tool use
    let loopMessages: Anthropic.MessageParam[] = body.data.messages.map(m => ({
      role: m.role,
      content: m.content,
    }));
    let finalText = '';

    for (let i = 0; i < 5; i++) {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: systemWithContext,
        tools: COACH_TOOLS,
        messages: loopMessages,
      });

      // Phase 8 — Log token usage
      console.log(JSON.stringify({
        event: 'coach_chat', userId: sub,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        model: response.model,
        timestamp: new Date().toISOString(),
      }));

      if (response.stop_reason === 'end_turn') {
        finalText = response.content.find(b => b.type === 'text')?.text ?? '';
        break;
      }

      if (response.stop_reason === 'tool_use') {
        const toolBlock = response.content.find(b => b.type === 'tool_use');
        if (!toolBlock || toolBlock.type !== 'tool_use') break;
        const toolResult = await executeTool(toolBlock.name, toolBlock.input as Record<string, unknown>, sub);
        loopMessages = [
          ...loopMessages,
          { role: 'assistant', content: response.content },
          { role: 'user', content: [{ type: 'tool_result', tool_use_id: toolBlock.id, content: toolResult }] },
        ];
      } else {
        finalText = response.content.find(b => b.type === 'text')?.text ?? '';
        break;
      }
    }

    await persistMessages(sub, lastUserMsg, finalText);
    return { content: finalText };
  });

  // Phase 4 — Streaming chat endpoint
  app.post('/chat/stream', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };

    if (!checkRateLimit(sub)) {
      return reply.status(429).send({ error: 'Rate limit: 20 messages per minute' });
    }

    const schema = z.object({
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })).min(1),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const lastUserMsg = [...body.data.messages].reverse().find(m => m.role === 'user')?.content ?? '';

    const pass = new PassThrough();
    reply
      .header('Content-Type', 'text/event-stream')
      .header('Cache-Control', 'no-cache')
      .header('Connection', 'keep-alive')
      .send(pass);

    const send = (data: object) => pass.write(`data: ${JSON.stringify(data)}\n\n`);

    (async () => {
      let attachment: { filename: string; url: string } | undefined;
      try {
        if (!anthropic) {
          const docType = detectDocumentRequest(lastUserMsg);
          if (docType) {
            // Write a keep-alive byte immediately (before async work) so Fastify
            // doesn't flush an empty PassThrough and close the connection.
            pass.write(': keep-alive\n\n');
            const result = await generateDocxFile(docType, sub);
            attachment = { filename: result.filename, url: result.url };
            send({ token: result.explanation });
            await persistMessages(sub, lastUserMsg, result.explanation);
          } else {
            const content = getMockResponse(lastUserMsg, body.data.messages);
            send({ token: content });
            await persistMessages(sub, lastUserMsg, content);
          }
        } else {
          // Phase 2 — inject user context
          const userContext = await buildUserContext(sub);
          const systemWithContext = SYSTEM_PROMPT + '\n\n' + userContext;

          let fullContent = '';
          const stream = anthropic.messages.stream({
            model: MODEL,
            max_tokens: 1024,
            system: systemWithContext,
            messages: body.data.messages.map(m => ({ role: m.role, content: m.content })),
          });

          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              fullContent += chunk.delta.text;
              send({ token: chunk.delta.text });
            }
          }

          // Phase 8 — Log token usage
          const final = await stream.finalMessage();
          console.log(JSON.stringify({
            event: 'coach_stream', userId: sub,
            inputTokens: final.usage.input_tokens,
            outputTokens: final.usage.output_tokens,
            model: final.model,
            timestamp: new Date().toISOString(),
          }));

          await persistMessages(sub, lastUserMsg, fullContent);
        }
      } catch (err) {
        send({ error: 'Stream error' });
      } finally {
        send({ done: true, ...(attachment && { attachment }) });
        pass.end();
      }
    })();
  });

  // Document download (no auth — fileId is a UUID secret)
  app.get('/documents/:fileId', async (request, reply) => {
    const { fileId } = request.params as { fileId: string };
    const entry = fileStore.get(fileId);
    if (!entry || Date.now() > entry.expiresAt) {
      return reply.status(404).send({ error: 'File not found or expired' });
    }
    const buffer = await fsPromises.readFile(entry.path);
    reply
      .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      .header('Content-Disposition', `attachment; filename="${entry.filename}"`)
      .send(buffer);
  });

  // Existing — coaching stats
  app.get('/sessions/stats', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const sessions = await prisma.coachSession.findMany({ where: { userId: sub } });
    const practice = sessions.filter(s => s.type === 'interview_practice');
    const avgScore = practice.length
      ? Math.round(practice.reduce((acc, s) => acc + (s.score ?? 0), 0) / practice.length)
      : null;
    return { total: sessions.length, interviewPractice: practice.length, avgScore };
  });
}
