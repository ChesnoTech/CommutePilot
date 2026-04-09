import { useState, useRef, useCallback } from 'react';

export interface DecelerationEvent {
  id: string;
  timestamp: number;
  magnitudeDelta: number;
  duration: number;
}

interface DetectorOptions {
  windowSize?: number;
  threshold?: number;
  minConsecutive?: number;
  cooldownMs?: number;
}

const DEFAULT_WINDOW_SIZE = 20;
const DEFAULT_THRESHOLD = 0.15;
const DEFAULT_MIN_CONSECUTIVE = 3;
const DEFAULT_COOLDOWN_MS = 0;

export function useDecelerationDetector(options?: DetectorOptions) {
  const windowSize = options?.windowSize ?? DEFAULT_WINDOW_SIZE;
  const threshold = options?.threshold ?? DEFAULT_THRESHOLD;
  const minConsecutive = options?.minConsecutive ?? DEFAULT_MIN_CONSECUTIVE;
  const cooldownMs = options?.cooldownMs ?? DEFAULT_COOLDOWN_MS;

  const [events, setEvents] = useState<DecelerationEvent[]>([]);
  const windowRef = useRef<number[]>([]);
  const consecutiveRef = useRef(0);
  const startTimeRef = useRef(0);
  const lastEventTimeRef = useRef(0);

  const feed = useCallback((magnitude: number) => {
    const win = windowRef.current;
    win.push(magnitude);
    if (win.length > windowSize) win.shift();

    if (win.length < 2) return;

    const avg = win.reduce((a, b) => a + b, 0) / win.length;
    const delta = avg - magnitude;

    if (delta > threshold) {
      if (consecutiveRef.current === 0) {
        startTimeRef.current = Date.now();
      }
      consecutiveRef.current++;
    } else {
      if (consecutiveRef.current >= minConsecutive) {
        const now = Date.now();
        // Enforce cooldown
        if (cooldownMs === 0 || now - lastEventTimeRef.current >= cooldownMs) {
          const duration = now - startTimeRef.current;
          lastEventTimeRef.current = now;
          setEvents((prev) => [
            ...prev,
            {
              id: now.toString(),
              timestamp: now,
              magnitudeDelta: delta,
              duration,
            },
          ]);
        }
      }
      consecutiveRef.current = 0;
    }
  }, [windowSize, threshold, minConsecutive, cooldownMs]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    windowRef.current = [];
    consecutiveRef.current = 0;
    lastEventTimeRef.current = 0;
  }, []);

  return { events, feed, clearEvents };
}
