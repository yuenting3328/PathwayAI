import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index.js';

export default async function institutionRoutes(app: FastifyInstance) {
  const requireAdmin = async (request: any, reply: any) => {
    await request.jwtVerify();
    const { role } = request.user as { role: string };
    if (!['INSTITUTION_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };

  // GET /api/v1/institution/programmes — institution's academic programmes
  app.get('/programmes', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.programme.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { name: 'asc' },
    });
  });

  // GET /api/v1/institution/outcomes — graduate outcomes (anonymised)
  app.get('/outcomes', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return reply.status(400).send({ error: 'No institution' });

    const query = z.object({
      cohortYear: z.coerce.number().optional(),
      faculty: z.string().optional(),
      sector: z.string().optional(),
      geography: z.string().optional(),
    }).parse(request.query);

    const where: any = { institutionId: user.institutionId };
    if (query.cohortYear) where.cohortYear = query.cohortYear;
    if (query.sector) where.sector = query.sector;
    if (query.geography) where.geography = query.geography;

    return prisma.graduateOutcome.findMany({
      where,
      include: { programme: { select: { name: true, faculty: true } } },
      orderBy: { cohortYear: 'desc' },
    });
  });

  // GET /api/v1/institution/credentials — issued credentials status
  app.get('/credentials', { preHandler: [requireAdmin] }, async (request) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return [];
    return prisma.issuedCredential.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { createdAt: 'desc' },
    });
  });

  // POST /api/v1/institution/credentials — issue a credential
  app.post('/credentials', { preHandler: [requireAdmin] }, async (request, reply) => {
    const { sub } = request.user as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user?.institutionId) return reply.status(400).send({ error: 'No institution' });

    const schema = z.object({
      recipientRef: z.string(),
      type: z.string(),
      name: z.string(),
    });
    const body = schema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

    const credential = await prisma.issuedCredential.create({
      data: { institutionId: user.institutionId!, status: 'PENDING', ...body.data },
    });
    return reply.status(201).send(credential);
  });
}
