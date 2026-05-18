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
