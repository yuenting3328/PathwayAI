import { useEffect, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

function getToken() {
  return localStorage.getItem('pathwayai_token');
}

export type SSEEvent<T = unknown> = { type: string; data: T };

/**
 * Subscribe to a Server-Sent Events stream.
 * Auto-reconnects with exponential backoff on error.
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
        try { onEventRef.current(JSON.parse(raw.data) as SSEEvent<T>); } catch { /* ignore */ }
      };
      es.onerror = () => {
        es?.close();
        if (!destroyed) { setTimeout(connect, retryDelay); retryDelay = Math.min(retryDelay * 2, 30_000); }
      };
      es.onopen = () => { retryDelay = 2000; };
    };
    connect();
    return () => { destroyed = true; es?.close(); };
  }, [path, enabled]);
}
