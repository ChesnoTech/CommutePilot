import { useEffect, useRef } from 'react';
import { useActiveJourneyStore } from '@/store/useActiveJourneyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import * as AlarmManager from '@/services/AlarmManager';
import { AlarmPhase } from '@/data/types';

export function useAlarm() {
  const journey = useActiveJourneyStore((s) => s.journey);
  const isActive = useActiveJourneyStore((s) => s.isActive);
  const alarmIntensity = useSettingsStore((s) => s.alarmIntensity);
  const prevPhaseRef = useRef<AlarmPhase>('none');

  useEffect(() => {
    if (!isActive || !journey) {
      if (prevPhaseRef.current !== 'none') {
        AlarmManager.dismiss();
        prevPhaseRef.current = 'none';
      }
      return;
    }

    const phase = journey.alarmDismissed ? 'none' : journey.alarmPhase;

    if (phase !== prevPhaseRef.current) {
      prevPhaseRef.current = phase;
      AlarmManager.triggerPhase(phase);
    }
  }, [journey?.alarmPhase, journey?.alarmDismissed, isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync intensity setting to AlarmManager
  useEffect(() => {
    AlarmManager.setIntensity(alarmIntensity);
  }, [alarmIntensity]);

  // Preload sound on mount
  useEffect(() => {
    AlarmManager.preload();
  }, []);
}
