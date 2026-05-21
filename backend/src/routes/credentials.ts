import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';

export default async function credentialRoutes(app: FastifyInstance) {
  // GET /api/v1/credentials — user's own credentials
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    return prisma.userCredential.findMany({
      where: { userId: sub },
      orderBy: { createdAt: 'desc' },
    });
  });

  // POST /api/v1/credentials — submit a credential for verification
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const schema = z.object({
      category: z.string(),
      name: z.string(),
      issuer: z.string(),
      fileUrl: z.string().url().optional(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const credential = await prisma.userCredential.create({
      data: { userId: sub, status: 'PENDING', ...body.data },
    });
    return reply.status(201).send(credential);
  });

  // POST /api/v1/credentials/:id/share — generate a shareable link for a verified credential
  app.post('/:id/share', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = request.user as { sub: string };

    const credential = await prisma.userCredential.findUnique({ where: { id } });
    if (!credential || credential.userId !== sub) {
      return reply.status(404).send({ error: 'Credential not found' });
    }

    const schema = z.object({ expiryDays: z.number().min(1).max(365).nullable() });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const expiresIn = body.data.expiryDays ? `${body.data.expiryDays}d` : '30d';
    const shareToken = app.jwt.sign({ credentialId: id, sub, type: 'credential_share' }, { expiresIn });
    const serverUrl = process.env.SERVER_URL ?? 'http://localhost:4000';
    return { url: `${serverUrl}/api/v1/credentials/shared/${shareToken}` };
  });

  // GET /api/v1/credentials/shared/:token — public view of a shared credential (no auth)
  app.get('/shared/:token', async (request, reply) => {
    const { token } = request.params as { token: string };
    try {
      const payload = app.jwt.verify(token) as { credentialId: string; type: string };
      if (payload.type !== 'credential_share') throw new Error('Invalid token type');
      const credential = await prisma.userCredential.findUnique({ where: { id: payload.credentialId } });
      if (!credential) return reply.status(404).send({ error: 'Credential not found or link expired' });
      const { userId: _, ...safe } = credential;
      return safe;
    } catch {
      return reply.status(401).send({ error: 'Link invalid or expired' });
    }
  });

  // PATCH /api/v1/credentials/:id/verify — institution admin verifies
  app.patch('/:id/verify', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { role } = request.user as { role: string };
    if (!['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
    const { id } = request.params as { id: string };
    const credential = await prisma.userCredential.update({
      where: { id },
      data: { status: 'VERIFIED', issuedDate: new Date() },
    });
    return credential;
  });
}
