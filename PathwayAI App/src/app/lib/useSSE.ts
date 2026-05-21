import { useEffect, useRef } from 'react';
import { BASE_URL, getToken } from './api';

export type SSEEvent<T = unknown> = { type: string; data: T };

/**
 * Subscribe to a Server-Sent Events stream from the PathwayAI backend.
 * The connection is re-established automatically on errors (exponential backoff).
 * Call `close()` from the returned object to disconnect manually.
 *
 * Usage:
 *   useSSE('/events/credentials', e => {
 *     if (e.type === 'CREDENTIAL_ISSUED') refresh();
 *   });
 */
export function useSSE<T = unknown>(
  path: string,
  onEvent: (event: SSEEvent<T>) => void,
  enabled = true,
) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return;

    let es: EventSource | null = null;
    let retryDelay = 2000;
    let destroyed = false;

    const connect = () => {
      if (destroyed) return;
      const token = getToken();
      const url = `${BASE_URL}${path}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      es = new EventSource(url);

      es.onmessage = (raw) => {
        try {
          const parsed = JSON.parse(raw.data) as SSEEvent<T>;
          onEventRef.current(parsed);
        } catch {
          // ignore malformed frames
        }
      };

      es.onerror = () => {
        es?.close();
        if (!destroyed) {
          setTimeout(connect, retryDelay);
          retryDelay = Math.min(retryDelay * 2, 30_000);
        }
      };

      es.onopen = () => { retryDelay = 2000; };
    };

    connect();

    return () => {
      destroyed = true;
      es?.close();
    };
  }, [path, enabled]);
}
