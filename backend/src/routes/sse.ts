import type { FastifyInstance } from 'fastify';
import { PassThrough } from 'node:stream';
import { eventBus, type AppEvent } from '../events.js';

export default async function sseRoutes(app: FastifyInstance) {
  // GET /api/v1/events/stream — persistent SSE connection for real-time updates
  // Token passed as ?token= query param because EventSource API cannot set headers
  app.get('/stream', async (request, reply) => {
    // Accept token via query param (EventSource cannot set Authorization header)
    const { token } = request.query as { token?: string };
    if (!token) return reply.status(401).send({ error: 'token query param required' });

    let userId: string;
    let institutionId: string | null = null;

    try {
      const payload = app.jwt.verify(token) as { sub: string; role: string };
      userId = payload.sub;

      // Pre-fetch institution for scoped event filtering
      const { prisma } = await import('../index.js');
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { institutionId: true } });
      institutionId = user?.institutionId ?? null;
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }

    const pass = new PassThrough();

    reply
      .header('Content-Type', 'text/event-stream')
      .header('Cache-Control', 'no-cache')
      .header('Connection', 'keep-alive')
      .header('X-Accel-Buffering', 'no') // disable nginx buffering
      .send(pass);

    // Use unnamed `data:` frames so EventSource.onmessage fires in all browsers.
    // The event type is included in the JSON payload; consumers filter by event.type.
    const sendEvent = (event: AppEvent) => {
      pass.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    // Institution-scoped listener — only fires events for this user's institution
    const instChannel = institutionId ? `inst:${institutionId}` : null;
    const onInstEvent = (event: AppEvent) => sendEvent(event);

    // Graduate-level listener — CREDENTIAL_ISSUED addressed specifically to this user
    const onCredential = (event: AppEvent) => {
      if (event.type === 'CREDENTIAL_ISSUED' && event.graduateUserId === userId) {
        sendEvent(event);
      }
    };

    if (instChannel) eventBus.on(instChannel, onInstEvent);
    eventBus.on('CREDENTIAL_ISSUED', onCredential);

    // Keep-alive ping every 25 seconds to prevent proxy timeouts
    const ping = setInterval(() => {
      if (!pass.destroyed) pass.write(': ping\n\n');
    }, 25_000);

    request.raw.on('close', () => {
      clearInterval(ping);
      if (instChannel) eventBus.off(instChannel, onInstEvent);
      eventBus.off('CREDENTIAL_ISSUED', onCredential);
      if (!pass.destroyed) pass.end();
    });
  });
}
