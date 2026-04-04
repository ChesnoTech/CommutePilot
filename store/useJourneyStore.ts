import { create } from 'zustand';

interface JourneyState {
  selectedLineId: string | null;
  departureStationId: string | null;
  destinationStationId: string | null;
  setLine: (lineId: string) => void;
  setDepartureStation: (stationId: string) => void;
  setDestinationStation: (stationId: string) => void;
  clearJourney: () => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  selectedLineId: null,
  departureStationId: null,
  destinationStationId: null,
  setLine: (lineId) =>
    set({ selectedLineId: lineId, departureStationId: null, destinationStationId: null }),
  setDepartureStation: (stationId) => set({ departureStationId: stationId }),
  setDestinationStation: (stationId) => set({ destinationStationId: stationId }),
  clearJourney: () =>
    set({ selectedLineId: null, departureStationId: null, destinationStationId: null }),
}));
