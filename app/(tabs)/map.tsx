import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { SurfaceMap } from '@/components/SurfaceMap';
import { startRecording, stopRecording, isActive } from '@/services/RoadQualityRecorder';
import { saveSamples, getAllSamples, getSampleCount } from '@/services/RoadQualityDB';
import { useT } from '@/i18n';
import type { RoadQualitySample, GeoPoint } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

type TravelMode = 'walk' | 'bus' | 'car' | 'bike';

const MODES: { value: TravelMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { value: 'walk', icon: 'walk-outline', label: 'walk' },
  { value: 'bus', icon: 'bus-outline', label: 'bus' },
  { value: 'car', icon: 'car-outline', label: 'car' },
  { value: 'bike', icon: 'bicycle-outline', label: 'bike' },
];

const QUALITY_LEGEND: { quality: string; color: string; labelKey: string }[] = [
  { quality: 'smooth', color: '#4ade80', labelKey: 'qualitySmooth' },
  { quality: 'rough', color: '#facc15', labelKey: 'qualityRough' },
  { quality: 'poor', color: '#ef4444', labelKey: 'qualityPoor' },
];

export default function MapScreen() {
  const t = useT();
  const [recording, setRecording] = useState(isActive());
  const [selectedMode, setSelectedMode] = useState<TravelMode>('walk');
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [samples, setSamples] = useState<RoadQualitySample[]>([]);
  const [liveSamples, setLiveSamples] = useState<RoadQualitySample[]>([]);
  const [sampleCount, setSampleCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load existing samples from DB on mount
  useEffect(() => {
    loadSamples();
    getUserLocation();
  }, []);

  // Timer for recording duration
  useEffect(() => {
    if (recording) {
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsed(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  async function getUserLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch {
      // Location unavailable — use Moscow center
    }
  }

  async function loadSamples() {
    try {
      const all = await getAllSamples();
      setSamples(all);
      const count = await getSampleCount();
      setSampleCount(count);
    } catch {
      // DB not ready yet
    }
  }

  const handleNewSample = useCallback((sample: RoadQualitySample) => {
    setLiveSamples((prev) => [...prev, sample]);
    setUserLocation({ latitude: sample.latitude, longitude: sample.longitude });
  }, []);

  async function handleStartRecording() {
    const success = await startRecording(selectedMode, handleNewSample);
    if (!success) {
      Alert.alert(t('appName'), t('locationPermission'));
      return;
    }
    setRecording(true);
    setLiveSamples([]);
  }

  async function handleStopRecording() {
    const finalSamples = stopRecording();
    setRecording(false);

    if (finalSamples.length > 0) {
      try {
        await saveSamples(finalSamples);
      } catch {
        // Save failed silently
      }
    }

    // Reload all samples
    await loadSamples();
    setLiveSamples([]);
  }

  const allDisplaySamples = [...samples, ...liveSamples];

  const smoothCount = allDisplaySamples.filter((s) => s.quality === 'smooth').length;
  const roughCount = allDisplaySamples.filter((s) => s.quality === 'rough').length;
  const poorCount = allDisplaySamples.filter((s) => s.quality === 'poor').length;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <View style={styles.mapWrap}>
        <SurfaceMap
          center={userLocation ?? undefined}
          zoom={userLocation ? 15 : 12}
          userLocation={userLocation}
          qualitySamples={allDisplaySamples}
        />

        {/* Legend overlay */}
        <View style={styles.legend}>
          {QUALITY_LEGEND.map((q) => (
            <View key={q.quality} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: q.color }]} />
              <Text style={styles.legendText}>{t(q.labelKey as any)}</Text>
            </View>
          ))}
        </View>

        {/* Stats overlay */}
        {sampleCount > 0 && (
          <View style={styles.statsOverlay}>
            <Text style={styles.statsText}>
              {sampleCount} pts · <Text style={{ color: '#4ade80' }}>{smoothCount}</Text>
              {' / '}
              <Text style={{ color: '#facc15' }}>{roughCount}</Text>
              {' / '}
              <Text style={{ color: '#ef4444' }}>{poorCount}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Mode selector */}
        {!recording && (
          <View style={styles.modeRow}>
            {MODES.map((m) => (
              <Pressable
                key={m.value}
                style={[
                  styles.modeBtn,
                  selectedMode === m.value && styles.modeBtnActive,
                ]}
                onPress={() => setSelectedMode(m.value)}>
                <Ionicons
                  name={m.icon}
                  size={20}
                  color={selectedMode === m.value ? AppColors.background : AppColors.textSecondary}
                />
              </Pressable>
            ))}
          </View>
        )}

        {/* Recording status */}
        {recording && (
          <View style={styles.recordingInfo}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingTimer}>{formatTime(elapsed)}</Text>
            <Text style={styles.recordingCount}>
              {liveSamples.length} {t('stAbbr')}
            </Text>
          </View>
        )}

        {/* Start/Stop button */}
        <Pressable
          style={[styles.recordBtn, recording && styles.recordBtnStop]}
          onPress={recording ? handleStopRecording : handleStartRecording}>
          <Ionicons
            name={recording ? 'stop' : 'radio-button-on'}
            size={22}
            color={AppColors.background}
          />
          <Text style={styles.recordBtnText}>
            {recording
              ? (t('stop'))
              : (t('startJourney').split(' ')[0] + ' REC')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  mapWrap: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(13, 13, 26, 0.85)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.xs,
  },
  statsOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(13, 13, 26, 0.85)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  statsText: {
    color: AppColors.text,
    fontSize: FontSize.xs,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: Spacing.sm,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  modeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  modeBtnActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  recordingTimer: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  recordingCount: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  recordBtnStop: {
    backgroundColor: '#ef4444',
  },
  recordBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
