import { useState, useEffect, useRef, useCallback } from 'react';
import { Accelerometer } from 'expo-sensors';

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

export function useAccelerometer() {
  const [data, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0, magnitude: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const subscriptionRef = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);

  useEffect(() => {
    Accelerometer.isAvailableAsync().then(setIsAvailable);
  }, []);

  const start = useCallback((intervalMs = 100) => {
    Accelerometer.setUpdateInterval(intervalMs);
    subscriptionRef.current = Accelerometer.addListener(({ x, y, z }) => {
      setData({ x, y, z, magnitude: Math.sqrt(x * x + y * y + z * z) });
    });
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    setIsActive(false);
  }, []);

  useEffect(() => {
    return () => {
      subscriptionRef.current?.remove();
    };
  }, []);

  return { data, isActive, isAvailable, start, stop };
}
