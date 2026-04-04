import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JourneyTemplate } from '@/data/types';

interface TemplateState {
  templates: JourneyTemplate[];
  addTemplate: (name: string, lineId: string, departureStationId: string, destinationStationId: string) => void;
  removeTemplate: (id: string) => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set) => ({
      templates: [],
      addTemplate: (name, lineId, departureStationId, destinationStationId) =>
        set((state) => ({
          templates: [
            ...state.templates,
            {
              id: Date.now().toString(),
              name,
              lineId,
              departureStationId,
              destinationStationId,
              createdAt: Date.now(),
            },
          ],
        })),
      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'commutepilot-templates',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
