import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JourneyLeg, MultiLegTemplate } from '@/data/types';

interface MultiLegState {
  templates: MultiLegTemplate[];
  /** Currently edited legs (before saving as template) */
  draftLegs: JourneyLeg[];
  /** Active multi-leg journey */
  activeLegIndex: number;
  isActive: boolean;

  // Draft actions
  addLeg: (leg: JourneyLeg) => void;
  removeLeg: (index: number) => void;
  moveLeg: (from: number, to: number) => void;
  updateLeg: (index: number, leg: JourneyLeg) => void;
  clearDraft: () => void;

  // Template actions
  saveTemplate: (name: string) => void;
  deleteTemplate: (id: string) => void;
  renameTemplate: (id: string, name: string) => void;
  loadTemplate: (id: string) => void;

  // Active journey
  startMultiLeg: () => void;
  advanceLeg: () => void;
  stopMultiLeg: () => void;
}

export const useMultiLegStore = create<MultiLegState>()(
  persist(
    (set, get) => ({
      templates: [],
      draftLegs: [],
      activeLegIndex: 0,
      isActive: false,

      addLeg: (leg) =>
        set((s) => ({ draftLegs: [...s.draftLegs, leg] })),

      removeLeg: (index) =>
        set((s) => ({
          draftLegs: s.draftLegs.filter((_, i) => i !== index),
        })),

      moveLeg: (from, to) =>
        set((s) => {
          const legs = [...s.draftLegs];
          const [moved] = legs.splice(from, 1);
          legs.splice(to, 0, moved);
          return { draftLegs: legs };
        }),

      updateLeg: (index, leg) =>
        set((s) => {
          const legs = [...s.draftLegs];
          legs[index] = leg;
          return { draftLegs: legs };
        }),

      clearDraft: () => set({ draftLegs: [] }),

      saveTemplate: (name) =>
        set((s) => ({
          templates: [
            ...s.templates,
            {
              id: `ml-${Date.now()}`,
              name,
              legs: [...s.draftLegs],
              createdAt: Date.now(),
            },
          ],
        })),

      deleteTemplate: (id) =>
        set((s) => ({
          templates: s.templates.filter((t) => t.id !== id),
        })),

      renameTemplate: (id, name) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id ? { ...t, name } : t
          ),
        })),

      loadTemplate: (id) => {
        const template = get().templates.find((t) => t.id === id);
        if (template) {
          set({ draftLegs: [...template.legs] });
        }
      },

      startMultiLeg: () =>
        set({ isActive: true, activeLegIndex: 0 }),

      advanceLeg: () =>
        set((s) => {
          const next = s.activeLegIndex + 1;
          if (next >= s.draftLegs.length) {
            return { isActive: false, activeLegIndex: 0 };
          }
          return { activeLegIndex: next };
        }),

      stopMultiLeg: () =>
        set({ isActive: false, activeLegIndex: 0 }),
    }),
    {
      name: 'commutepilot-multileg',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ templates: state.templates }),
    }
  )
);
