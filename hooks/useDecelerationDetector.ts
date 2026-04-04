import { useState, useRef, useCallback } from 'react';

export interface DecelerationEvent {
  id: string;
  timestamp: number;
  magnitudeDelta: number;
  duration: number;
}

const WINDOW_SIZE = 20;
const DECELERATION_THRESHOLD = 0.15;
const MIN_CONSECUTIVE = 3;

export function useDecelerationDetector() {
  const [events, setEvents] = useState<DecelerationEvent[]>([]);
  const windowRef = useRef<number[]>([]);
  const consecutiveRef = useRef(0);
  const startTimeRef = useRef(0);

  const feed = useCallback((magnitude: number) => {
    const window = windowRef.current;
    window.push(magnitude);
    if (window.length > WINDOW_SIZE) window.shift();

    if (window.length < 2) return;

    const avg = window.reduce((a, b) => a + b, 0) / window.length;
    const delta = avg - magnitude;

    if (delta > DECELERATION_THRESHOLD) {
      if (consecutiveRef.current === 0) {
        startTimeRef.current = Date.now();
      }
      consecutiveRef.current++;
    } else {
      if (consecutiveRef.current >= MIN_CONSECUTIVE) {
        const duration = Date.now() - startTimeRef.current;
        setEvents((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            timestamp: Date.now(),
            magnitudeDelta: delta,
            duration,
          },
        ]);
      }
      consecutiveRef.current = 0;
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    windowRef.current = [];
    consecutiveRef.current = 0;
  }, []);

  return { events, feed, clearEvents };
}
