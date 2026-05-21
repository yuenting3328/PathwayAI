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

const port = Number(process.env.PORT ?? 4000);
await app.listen({ port, host: '0.0.0.0' });
console.log(`PathwayAI backend running on http://localhost:${port}`);
