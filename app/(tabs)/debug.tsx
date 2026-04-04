import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAccelerometer } from '@/hooks/useAccelerometer';
import { useDecelerationDetector } from '@/hooks/useDecelerationDetector';
import { AccelerometerDisplay } from '@/components/AccelerometerDisplay';
import { DecelerationLog } from '@/components/DecelerationLog';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

const INTERVALS = [50, 100, 200] as const;

export default function DebugScreen() {
  const { data, isActive, isAvailable, start, stop } = useAccelerometer();
  const { events, feed, clearEvents } = useDecelerationDetector();
  const [intervalMs, setIntervalMs] = useState<number>(100);

  useEffect(() => {
    if (isActive) {
      feed(data.magnitude);
    }
  }, [data.magnitude, isActive, feed]);

  const toggle = () => {
    if (isActive) {
      stop();
    } else {
      start(intervalMs);
    }
  };

  if (!isAvailable) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Accelerometer not available on this device.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AccelerometerDisplay
        x={data.x}
        y={data.y}
        z={data.z}
        magnitude={data.magnitude}
      />

      <View style={styles.controls}>
        <Pressable
          style={[styles.toggleBtn, isActive && styles.toggleBtnActive]}
          onPress={toggle}>
          <Text style={styles.toggleText}>{isActive ? 'Stop' : 'Start'}</Text>
        </Pressable>

        <View style={styles.intervalRow}>
          {INTERVALS.map((ms) => (
            <Pressable
              key={ms}
              style={[styles.intervalBtn, ms === intervalMs && styles.intervalBtnActive]}
              onPress={() => {
                setIntervalMs(ms);
                if (isActive) {
                  stop();
                  start(ms);
                }
              }}>
              <Text
                style={[
                  styles.intervalText,
                  ms === intervalMs && styles.intervalTextActive,
                ]}>
                {ms}ms
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.logSection}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>Deceleration Events ({events.length})</Text>
          {events.length > 0 && (
            <Pressable onPress={clearEvents}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          )}
        </View>
        <DecelerationLog events={events} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    padding: Spacing.md,
  },
  empty: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  toggleBtn: {
    backgroundColor: AppColors.success,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
  },
  toggleBtnActive: {
    backgroundColor: AppColors.error,
  },
  toggleText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  intervalRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  intervalBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: AppColors.surface,
  },
  intervalBtnActive: {
    backgroundColor: AppColors.accent,
  },
  intervalText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
  },
  intervalTextActive: {
    color: AppColors.background,
    fontWeight: '600',
  },
  logSection: {
    flex: 1,
    marginTop: Spacing.md,
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  logTitle: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  clearText: {
    color: AppColors.primary,
    fontSize: FontSize.sm,
  },
});
