import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useActiveJourneyStore } from '@/store/useActiveJourneyStore';
import { useDecelerationDetector } from '@/hooks/useDecelerationDetector';
import { StationTracker } from '@/services/StationTracker';
import { DetectionMethod } from '@/data/types';

const ACCEL_INTERVAL_MS = 100;
const TICK_INTERVAL_MS = 1000;
const DECEL_COOLDOWN_MS = 30000;

export function useStationTracker() {
  const journey = useActiveJourneyStore((s) => s.journey);
  const isActive = useActiveJourneyStore((s) => s.isActive);
  const advanceStation = useActiveJourneyStore((s) => s.advanceStation);

  const trackerRef = useRef<StationTracker | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accelSubRef = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const { events: decelEvents, feed: feedDecel, clearEvents: clearDecel } = useDecelerationDetector({
    cooldownMs: DECEL_COOLDOWN_MS,
  });

  // Track last deceleration event count to detect new events
  const lastDecelCountRef = useRef(0);

  const onStationAdvance = useCallback(
    (method: DetectionMethod) => {
      advanceStation(method);
    },
    [advanceStation]
  );

  // Start/stop tracker when journey starts/stops
  useEffect(() => {
    if (!isActive || !journey) {
      // Cleanup
      trackerRef.current?.destroy();
      trackerRef.current = null;

      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }

      accelSubRef.current?.remove();
      accelSubRef.current = null;

      deactivateKeepAwake();
      clearDecel();
      setElapsedSeconds(0);
      lastDecelCountRef.current = 0;
      return;
    }

    // Create tracker
    const tracker = new StationTracker({
      segmentDurations: journey.segmentDurations,
      totalStations: journey.totalStations,
      onStationAdvance,
    });
    trackerRef.current = tracker;

    // Start tick interval
    tickIntervalRef.current = setInterval(() => {
      tracker.tick();
      setElapsedSeconds((prev) => prev + 1);
    }, TICK_INTERVAL_MS);

    // Start accelerometer
    Accelerometer.setUpdateInterval(ACCEL_INTERVAL_MS);
    accelSubRef.current = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      feedDecel(magnitude);
    });

    // Keep screen awake
    activateKeepAwakeAsync();

    return () => {
      tracker.destroy();
      trackerRef.current = null;

      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }

      accelSubRef.current?.remove();
      accelSubRef.current = null;

      deactivateKeepAwake();
    };
  }, [isActive, journey?.startedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Feed deceleration events to tracker
  useEffect(() => {
    if (decelEvents.length > lastDecelCountRef.current) {
      trackerRef.current?.feedDeceleration();
      lastDecelCountRef.current = decelEvents.length;
    }
  }, [decelEvents.length]);

  // Handle app returning from background
  useEffect(() => {
    const handleAppState = (state: AppStateStatus) => {
      if (state === 'active' && journey && isActive) {
        const elapsed = Date.now() - journey.startedAt;
        trackerRef.current?.recoverFromBackground(elapsed);
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [journey?.startedAt, isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const manualAdvance = useCallback(() => {
    trackerRef.current?.manualAdvance();
  }, []);

  const currentStation = journey ? journey.stations[journey.currentStationIndex] : null;
  const remainingStations = journey ? journey.totalStations - 1 - journey.currentStationIndex : 0;

  // Estimate remaining time
  let estimatedTimeRemaining = 0;
  if (journey) {
    for (let i = journey.currentStationIndex; i < journey.segmentDurations.length; i++) {
      estimatedTimeRemaining += journey.segmentDurations[i];
    }
    // Subtract elapsed time in current segment
    const segmentElapsed = trackerRef.current?.getSegmentElapsed() ?? 0;
    estimatedTimeRemaining = Math.max(0, estimatedTimeRemaining - segmentElapsed);
  }

  return {
    currentStation,
    remainingStations,
    elapsedSeconds,
    estimatedTimeRemaining,
    manualAdvance,
  };
}
