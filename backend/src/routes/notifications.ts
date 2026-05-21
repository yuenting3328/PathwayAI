import type { FastifyInstance } from 'fastify';
import { prisma } from '../index.js';

export default async function notificationRoutes(app: FastifyInstance) {
  // GET /api/v1/notifications — list notifications for the authenticated user
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    return prisma.notification.findMany({
      where: { userId: sub },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  });

  // PATCH /api/v1/notifications/mark-read — mark all notifications as read
  app.patch('/mark-read', { preHandler: [app.authenticate] }, async (request) => {
    const { sub } = request.user as { sub: string };
    await prisma.notification.updateMany({
      where: { userId: sub, read: false },
      data: { read: true },
    });
    return { success: true };
  });
}
