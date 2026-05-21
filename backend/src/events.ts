import { EventEmitter } from 'node:events';

export const eventBus = new EventEmitter();
eventBus.setMaxListeners(200); // support many concurrent SSE connections

export type AppEvent =
  | { type: 'OUTCOME_REPORTED'; institutionId: string; outcomeId: string }
  | { type: 'CREDENTIAL_ISSUED'; institutionId: string; graduateUserId: string | null; credentialId: string };

export function emit(event: AppEvent) {
  eventBus.emit(event.type, event);
  // Also emit a catch-all channel so institution-scoped listeners can filter
  eventBus.emit(`inst:${(event as any).institutionId}`, event);
}
