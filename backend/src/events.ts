import { EventEmitter } from 'node:events';

export const eventBus = new EventEmitter();
eventBus.setMaxListeners(200); // support many concurrent SSE connections

export type AppEvent =
  | { type: 'OUTCOME_REPORTED'; institutionId: string; outcomeId: string }
  | { type: 'CREDENTIAL_ISSUED'; institutionId: string; graduateUserId: string | null; credentialId: string }
  | { type: 'STAGE_CHANGE'; userId: string; applicationId: string; title: string; message: string };

export function emit(event: AppEvent) {
  eventBus.emit(event.type, event);
  if (event.type === 'STAGE_CHANGE') {
    eventBus.emit(`user:${event.userId}`, event);
  } else {
    eventBus.emit(`inst:${(event as any).institutionId}`, event);
  }
}
