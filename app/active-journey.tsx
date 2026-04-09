import { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useActiveJourneyStore } from '@/store/useActiveJourneyStore';
import { useStationTracker } from '@/hooks/useStationTracker';
import { useAlarm } from '@/hooks/useAlarm';
import { getLineById } from '@/data/metro';
import { StationProgressList } from '@/components/StationProgressList';
import { AlarmOverlay } from '@/components/AlarmOverlay';
import { MetroMap } from '@/components/MetroMap';
import { useT, pluralStations } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function ActiveJourneyScreen() {
  const router = useRouter();
  const t = useT();
  const insets = useSafeAreaInsets();
  const journey = useActiveJourneyStore((s) => s.journey);
  const stopJourney = useActiveJourneyStore((s) => s.stopJourney);
  const dismissAlarm = useActiveJourneyStore((s) => s.dismissAlarm);

  const {
    remainingStations,
    elapsedSeconds,
    estimatedTimeRemaining,
    manualAdvance,
  } = useStationTracker();

  useAlarm();

  const line = journey ? getLineById(journey.lineId) : null;

  const handleStop = () => {
    Alert.alert(t('finishJourney'), t('areYouSure'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('finish'),
        style: 'destructive',
        onPress: () => {
          stopJourney();
          router.back();
        },
      },
    ]);
  };

  const handleDismissAlarm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dismissAlarm();
  };

  if (!journey || !line) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{t('noActiveJourney')}</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>{t('back')}</Text>
        </Pressable>
      </View>
    );
  }

  const journeyStationIds = useMemo(
    () => journey.stations.map((s) => s.id),
    [journey.stations]
  );

  const isAtDestination = journey.currentStationIndex >= journey.totalStations - 1;
  const destinationStation = journey.stations[journey.totalStations - 1];
  const estimatedMin = Math.ceil(estimatedTimeRemaining / 60);
  const alarmPhase = journey.alarmDismissed ? 'none' : journey.alarmPhase;

  // Next station name for alarm overlay
  const alarmStationName =
    alarmPhase === 'full' || alarmPhase === 'warning'
      ? destinationStation?.nameRu ?? ''
      : journey.stations[Math.min(journey.currentStationIndex + 2, journey.totalStations - 1)]?.nameRu ?? '';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.lineBadge, { backgroundColor: line.color }]}>
            <Text style={styles.lineBadgeText}>{line.number}</Text>
          </View>
          <Text style={styles.headerTimer}>{formatElapsed(elapsedSeconds)}</Text>
        </View>
        <Pressable onPress={handleStop} hitSlop={12}>
          <Ionicons name="close-circle" size={28} color={AppColors.textMuted} />
        </Pressable>
      </View>

      {/* Status bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {isAtDestination
            ? t('arrived')
            : `${journey.currentStationIndex + 1} ${t('of')} ${journey.totalStations} · ${t('alarmRemaining')} ${pluralStations(remainingStations)} ~ ${estimatedMin} ${t('min')}`}
        </Text>
      </View>

      {/* Journey map */}
      <View style={styles.mapSection}>
        <MetroMap
          selectedLineId={journey.lineId}
          departureStationId={journey.stations[0]?.id}
          destinationStationId={destinationStation?.id}
          journeyStations={journeyStationIds}
          currentStationIndex={journey.currentStationIndex}
        />
      </View>

      {/* Station list */}
      <View style={styles.listContainer}>
        <StationProgressList
          stations={journey.stations}
          currentIndex={journey.currentStationIndex}
          lineColor={line.color}
        />
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {!isAtDestination ? (
          <Pressable
            style={({ pressed }) => [styles.manualBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); manualAdvance(); }}>
            <Ionicons name="locate" size={20} color={AppColors.background} />
            <Text style={styles.manualBtnText}>{t('arrivedAtStation')}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.manualBtn, styles.finishBtn]}
            onPress={() => {
              stopJourney();
              router.back();
            }}>
            <Ionicons name="checkmark-circle" size={20} color={AppColors.background} />
            <Text style={styles.manualBtnText}>{t('finishJourneyBtn')}</Text>
          </Pressable>
        )}

        {!isAtDestination && (
          <Pressable style={styles.stopBtn} onPress={handleStop}>
            <Text style={styles.stopBtnText}>{t('stop')}</Text>
          </Pressable>
        )}
      </View>

      {/* Alarm overlay */}
      <AlarmOverlay
        phase={alarmPhase}
        stationName={alarmStationName}
        remainingStations={remainingStations}
        onDismiss={handleDismissAlarm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  empty: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    color: AppColors.textMuted,
    fontSize: FontSize.lg,
  },
  backBtn: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.full,
  },
  backBtnText: {
    color: AppColors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  lineBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineBadgeText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  headerTimer: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  statusBar: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  statusText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    fontVariant: ['tabular-nums'],
  },
  mapSection: {
    height: 200,
    marginHorizontal: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  bottomControls: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    width: '100%',
  },
  finishBtn: {
    backgroundColor: AppColors.success,
  },
  manualBtnText: {
    color: AppColors.background,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  stopBtn: {
    paddingVertical: Spacing.xs,
  },
  stopBtnText: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
  },
});
