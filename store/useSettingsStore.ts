import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AccessibilityProfile } from '@/data/types';

export type AlarmIntensity = 'soft' | 'normal' | 'loud';
export type AdvanceWarningStations = 1 | 2 | 3;

interface SettingsState {
  alarmIntensity: AlarmIntensity;
  advanceWarningStations: AdvanceWarningStations;
  /** Accessibility profile for route checking */
  accessibilityProfile: AccessibilityProfile;
  /** Show accessibility warnings before starting journey */
  showAccessibilityWarnings: boolean;
  /** Prefer accessible routes (avoid stations without elevators etc.) */
  preferAccessibleRoutes: boolean;
  /** Show toilet info on station list for elderly/medical needs */
  showToiletInfo: boolean;
  /** Enable high-contrast mode for vision-impaired users */
  highContrastMode: boolean;
  /** Enable larger touch targets for motor-impaired users */
  largeTouchTargets: boolean;

  setAlarmIntensity: (intensity: AlarmIntensity) => void;
  setAdvanceWarningStations: (stations: AdvanceWarningStations) => void;
  setAccessibilityProfile: (profile: AccessibilityProfile) => void;
  setShowAccessibilityWarnings: (show: boolean) => void;
  setPreferAccessibleRoutes: (prefer: boolean) => void;
  setShowToiletInfo: (show: boolean) => void;
  setHighContrastMode: (enabled: boolean) => void;
  setLargeTouchTargets: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      alarmIntensity: 'normal',
      advanceWarningStations: 2,
      accessibilityProfile: 'standard',
      showAccessibilityWarnings: true,
      preferAccessibleRoutes: false,
      showToiletInfo: false,
      highContrastMode: false,
      largeTouchTargets: false,

      setAlarmIntensity: (alarmIntensity) => set({ alarmIntensity }),
      setAdvanceWarningStations: (advanceWarningStations) => set({ advanceWarningStations }),
      setAccessibilityProfile: (profile) => {
        const auto: Partial<SettingsState> = { accessibilityProfile: profile };
        // Auto-enable relevant settings per profile
        if (profile === 'wheelchair') {
          auto.preferAccessibleRoutes = true;
          auto.showAccessibilityWarnings = true;
          auto.largeTouchTargets = true;
        } else if (profile === 'vision') {
          auto.highContrastMode = true;
          auto.showAccessibilityWarnings = true;
        } else if (profile === 'elderly') {
          auto.showToiletInfo = true;
          auto.showAccessibilityWarnings = true;
          auto.largeTouchTargets = true;
          auto.preferAccessibleRoutes = true;
        } else {
          // Standard — reset all
          auto.preferAccessibleRoutes = false;
          auto.showToiletInfo = false;
          auto.highContrastMode = false;
          auto.largeTouchTargets = false;
        }
        set(auto);
      },
      setShowAccessibilityWarnings: (showAccessibilityWarnings) => set({ showAccessibilityWarnings }),
      setPreferAccessibleRoutes: (preferAccessibleRoutes) => set({ preferAccessibleRoutes }),
      setShowToiletInfo: (showToiletInfo) => set({ showToiletInfo }),
      setHighContrastMode: (highContrastMode) => set({ highContrastMode }),
      setLargeTouchTargets: (largeTouchTargets) => set({ largeTouchTargets }),
    }),
    {
      name: 'commutepilot-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
