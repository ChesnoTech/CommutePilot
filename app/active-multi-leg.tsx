import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMultiLegStore } from '@/store/useMultiLegStore';
import { useActiveJourneyStore } from '@/store/useActiveJourneyStore';
import { getLineById, getStationById } from '@/data/metro';
import { MetroMap } from '@/components/MetroMap';
import { SurfaceMap } from '@/components/SurfaceMap';
import { StationProgressList } from '@/components/StationProgressList';
import { useStationTracker } from '@/hooks/useStationTracker';
import { useAlarm } from '@/hooks/useAlarm';
import { AlarmOverlay } from '@/components/AlarmOverlay';
import { useT } from '@/i18n';
import type { JourneyLeg } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

const LEG_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  metro: 'subway-outline',
  bus: 'bus-outline',
  walk: 'walk-outline',
  taxi: 'car-outline',
};

const LEG_COLORS: Record<string, string> = {
  metro: '#e74c3c',
  bus: '#3498db',
  walk: '#4ade80',
  taxi: '#f39c12',
};

// LEG_LABELS removed — use t('legMetro') etc. via i18n

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getLegSummary(leg: JourneyLeg): string {
  switch (leg.type) {
    case 'metro': {
      const dep = getStationById(leg.departureStationId);
      const dest = getStationById(leg.destinationStationId);
      return `${dep?.nameRu ?? '?'} → ${dest?.nameRu ?? '?'}`;
    }
    case 'bus':
      return `${leg.routeNumber}: ${leg.fromStop} → ${leg.toStop}`;
    case 'walk':
      return `${leg.fromLabel} → ${leg.toLabel}`;
    case 'taxi':
      return `${leg.fromLabel} → ${leg.toLabel}`;
  }
}

/** Timer-based view for surface legs (bus/walk/taxi) */
function SurfaceLegView({ leg }: { leg: JourneyLeg & { type: 'bus' | 'walk' | 'taxi' } }) {
  const t = useT();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [leg]);

  const estimatedMin = Math.ceil(leg.estimatedDuration / 60);
  const elapsedMin = Math.floor(elapsed / 60);
  const progress = Math.min(elapsed / leg.estimatedDuration, 1);

  return (
    <View style={surfaceStyles.container}>
      {/* Map placeholder */}
      <View style={surfaceStyles.mapWrap}>
        <SurfaceMap zoom={15} />
      </View>

      {/* Progress */}
      <View style={surfaceStyles.progressWrap}>
        <View style={surfaceStyles.progressBar}>
          <View style={[surfaceStyles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={surfaceStyles.timeRow}>
          <Text style={surfaceStyles.elapsed}>{formatTime(elapsed)}</Text>
          <Text style={surfaceStyles.estimate}>~{estimatedMin} {t('min')}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={surfaceStyles.details}>
        {leg.type === 'bus' && (
          <Text style={surfaceStyles.detailText}>
            {leg.stopCount} ост. · {leg.fromStop} → {leg.toStop}
          </Text>
        )}
        {leg.type === 'walk' && (
          <Text style={surfaceStyles.detailText}>
            {leg.distanceMeters} м · {leg.fromLabel} → {leg.toLabel}
          </Text>
        )}
        {leg.type === 'taxi' && (
          <Text style={surfaceStyles.detailText}>
            {leg.fromLabel} → {leg.toLabel}
          </Text>
        )}
      </View>
    </View>
  );
}

/** Metro leg view — reuses existing station tracking + alarm system */
function MetroLegView({ leg }: { leg: JourneyLeg & { type: 'metro' } }) {
  const t = useT();
  const journey = useActiveJourneyStore((s) => s.journey);
  const dismissAlarm = useActiveJourneyStore((s) => s.dismissAlarm);
  const { remainingStations, elapsedSeconds, manualAdvance } = useStationTracker();
  useAlarm();

  const line = getLineById(leg.lineId);
  const journeyStationIds = useMemo(
    () => journey?.stations.map((s) => s.id) ?? [],
    [journey?.stations]
  );

  if (!journey || !line) return null;

  const destinationStation = journey.stations[journey.totalStations - 1];
  const isAtDestination = journey.currentStationIndex >= journey.totalStations - 1;
  const alarmPhase = journey.alarmDismissed ? 'none' : journey.alarmPhase;

  return (
    <View style={metroStyles.container}>
      <View style={metroStyles.mapWrap}>
        <MetroMap
          selectedLineId={journey.lineId}
          departureStationId={journey.stations[0]?.id}
          destinationStationId={destinationStation?.id}
          journeyStations={journeyStationIds}
          currentStationIndex={journey.currentStationIndex}
        />
      </View>

      <View style={metroStyles.listWrap}>
        <StationProgressList
          stations={journey.stations}
          currentIndex={journey.currentStationIndex}
          lineColor={line.color}
        />
      </View>

      {!isAtDestination && (
        <Pressable style={metroStyles.manualBtn} onPress={manualAdvance}>
          <Ionicons name="locate" size={18} color={AppColors.background} />
          <Text style={metroStyles.manualText}>{t('arrivedAtStation')}</Text>
        </Pressable>
      )}

      <AlarmOverlay
        phase={alarmPhase}
        stationName={destinationStation?.nameRu ?? ''}
        remainingStations={remainingStations}
        onDismiss={dismissAlarm}
      />
    </View>
  );
}

const LEG_LABEL_KEYS: Record<string, string> = {
  metro: 'legMetro',
  bus: 'legBus',
  walk: 'legWalk',
  taxi: 'legTaxi',
};

export default function ActiveMultiLegScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useT();
  const draftLegs = useMultiLegStore((s) => s.draftLegs);
  const activeLegIndex = useMultiLegStore((s) => s.activeLegIndex);
  const isActive = useMultiLegStore((s) => s.isActive);
  const advanceLeg = useMultiLegStore((s) => s.advanceLeg);
  const stopMultiLeg = useMultiLegStore((s) => s.stopMultiLeg);
  const startJourney = useActiveJourneyStore((s) => s.startJourney);
  const stopJourney = useActiveJourneyStore((s) => s.stopJourney);
  const metroJourney = useActiveJourneyStore((s) => s.journey);

  const currentLeg = draftLegs[activeLegIndex];
  const isLastLeg = activeLegIndex >= draftLegs.length - 1;

  // Start metro journey when entering a metro leg
  useEffect(() => {
    if (!isActive || !currentLeg) return;
    if (currentLeg.type === 'metro') {
      startJourney(currentLeg.lineId, currentLeg.departureStationId, currentLeg.destinationStationId);
    }
    return () => {
      if (currentLeg?.type === 'metro') {
        stopJourney();
      }
    };
  }, [activeLegIndex, isActive]);

  // Check if metro leg is complete (arrived at destination)
  const metroComplete =
    currentLeg?.type === 'metro' &&
    metroJourney &&
    metroJourney.currentStationIndex >= metroJourney.totalStations - 1;

  const handleAdvance = () => {
    if (currentLeg?.type === 'metro') {
      stopJourney();
    }
    if (isLastLeg) {
      stopMultiLeg();
      router.back();
    } else {
      advanceLeg();
    }
  };

  const handleStop = () => {
    Alert.alert(t('finishJourney'), t('stopMultiLeg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('finish'),
        style: 'destructive',
        onPress: () => {
          if (currentLeg?.type === 'metro') stopJourney();
          stopMultiLeg();
          router.back();
        },
      },
    ]);
  };

  if (!isActive || !currentLeg) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{t('noActiveRoute')}</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>{t('back')}</Text>
        </Pressable>
      </View>
    );
  }

  const legColor = LEG_COLORS[currentLeg.type];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.legBadge, { backgroundColor: legColor + '33' }]}>
            <Ionicons name={LEG_ICONS[currentLeg.type]} size={20} color={legColor} />
          </View>
          <View>
            <Text style={styles.headerType}>{t(LEG_LABEL_KEYS[currentLeg.type] as any)}</Text>
            <Text style={styles.headerProgress}>
              {t('legOf')} {activeLegIndex + 1} {t('of')} {draftLegs.length}
            </Text>
          </View>
        </View>
        <Pressable onPress={handleStop} hitSlop={12}>
          <Ionicons name="close-circle" size={28} color={AppColors.textMuted} />
        </Pressable>
      </View>

      {/* Leg progress dots */}
      <View style={styles.dotsRow}>
        {draftLegs.map((leg, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < activeLegIndex
                    ? AppColors.success
                    : i === activeLegIndex
                      ? LEG_COLORS[leg.type]
                      : AppColors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Route summary */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText} numberOfLines={1}>
          {getLegSummary(currentLeg)}
        </Text>
      </View>

      {/* Leg content */}
      <View style={styles.legContent}>
        {currentLeg.type === 'metro' ? (
          <MetroLegView leg={currentLeg} />
        ) : (
          <SurfaceLegView leg={currentLeg} />
        )}
      </View>

      {/* Bottom: advance to next leg */}
      <View style={styles.bottomBar}>
        {(currentLeg.type !== 'metro' || metroComplete) && (
          <Pressable style={styles.advanceBtn} onPress={handleAdvance}>
            <Ionicons
              name={isLastLeg ? 'checkmark-circle' : 'arrow-forward-circle'}
              size={20}
              color={AppColors.background}
            />
            <Text style={styles.advanceBtnText}>
              {isLastLeg ? t('finishRoute') : t('nextLeg')}
            </Text>
          </Pressable>
        )}
      </View>
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
    gap: Spacing.sm,
  },
  legBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerType: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  headerProgress: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryRow: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  summaryText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
  },
  legContent: {
    flex: 1,
  },
  bottomBar: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  advanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  advanceBtnText: {
    color: AppColors.background,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});

const surfaceStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  mapWrap: {
    flex: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  progressWrap: {
    paddingHorizontal: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: AppColors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  elapsed: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  estimate: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
  },
  details: {
    paddingHorizontal: Spacing.sm,
  },
  detailText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
  },
});

const metroStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapWrap: {
    height: 180,
    marginHorizontal: Spacing.sm,
    marginTop: Spacing.xs,
  },
  listWrap: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surfaceLight,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  manualText: {
    color: AppColors.text,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
