import { create } from 'zustand';
import { ActiveJourney, AlarmPhase, DetectionMethod, StationArrival } from '@/data/types';
import { getLineById } from '@/data/metro';
import { useSettingsStore } from '@/store/useSettingsStore';

interface ActiveJourneyState {
  journey: ActiveJourney | null;
  isActive: boolean;
  startJourney: (lineId: string, departureId: string, destinationId: string) => void;
  advanceStation: (method: DetectionMethod) => void;
  dismissAlarm: () => void;
  stopJourney: () => void;
}

function computeAlarmPhase(remainingStations: number, advanceWarning: number): AlarmPhase {
  if (remainingStations <= 0) return 'full';
  if (remainingStations <= advanceWarning - 1) return 'warning';
  if (remainingStations <= advanceWarning) return 'gentle';
  return 'none';
}

export const useActiveJourneyStore = create<ActiveJourneyState>((set) => ({
  journey: null,
  isActive: false,

  startJourney: (lineId, departureId, destinationId) => {
    const line = getLineById(lineId);
    if (!line) return;

    const depStation = line.stations.find((s) => s.id === departureId);
    const destStation = line.stations.find((s) => s.id === destinationId);
    if (!depStation || !destStation) return;

    const isReversed = depStation.order > destStation.order;
    const fromOrder = Math.min(depStation.order, destStation.order);
    const toOrder = Math.max(depStation.order, destStation.order);

    let stations = line.stations.filter(
      (s) => s.order >= fromOrder && s.order <= toOrder
    );

    if (isReversed) {
      stations = [...stations].reverse();
    }

    // Build segment durations in travel order
    const segmentDurations: number[] = [];
    for (let i = 0; i < stations.length - 1; i++) {
      // timeToNext is always defined for the station with lower order
      if (isReversed) {
        // Traveling backwards: duration between station[i] and station[i+1]
        // is the timeToNext of the station with lower order (which is stations[i+1] when reversed)
        segmentDurations.push(stations[i + 1].timeToNext);
      } else {
        segmentDurations.push(stations[i].timeToNext);
      }
    }

    const journey: ActiveJourney = {
      lineId,
      stations,
      segmentDurations,
      currentStationIndex: 0,
      totalStations: stations.length,
      startedAt: Date.now(),
      arrivals: [
        { stationId: departureId, timestamp: Date.now(), method: 'manual' },
      ],
      alarmPhase: computeAlarmPhase(stations.length - 1, useSettingsStore.getState().advanceWarningStations),
      alarmDismissed: false,
    };

    set({ journey, isActive: true });
  },

  advanceStation: (method) =>
    set((state) => {
      if (!state.journey) return state;
      const nextIndex = state.journey.currentStationIndex + 1;
      if (nextIndex >= state.journey.totalStations) return state;

      const remaining = state.journey.totalStations - 1 - nextIndex;
      const advanceWarning = useSettingsStore.getState().advanceWarningStations;
      const arrival: StationArrival = {
        stationId: state.journey.stations[nextIndex].id,
        timestamp: Date.now(),
        method,
      };

      return {
        journey: {
          ...state.journey,
          currentStationIndex: nextIndex,
          arrivals: [...state.journey.arrivals, arrival],
          alarmPhase: computeAlarmPhase(remaining, advanceWarning),
          alarmDismissed: false,
        },
      };
    }),

  dismissAlarm: () =>
    set((state) => {
      if (!state.journey) return state;
      return {
        journey: { ...state.journey, alarmDismissed: true },
      };
    }),

  stopJourney: () => set({ journey: null, isActive: false }),
}));
