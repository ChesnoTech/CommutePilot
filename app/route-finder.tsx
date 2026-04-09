import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { StationSearchInput } from '@/components/StationSearchInput';
import { RouteCard } from '@/components/RouteCard';
import { findRoutes, FoundRoute } from '@/data/routeFinder';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useMultiLegStore } from '@/store/useMultiLegStore';
import { useT } from '@/i18n';
import type { Station, MetroLine } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

export default function RouteFinderScreen() {
  const router = useRouter();
  const t = useT();
  const insets = useSafeAreaInsets();

  const setLine = useJourneyStore((s) => s.setLine);
  const setDeparture = useJourneyStore((s) => s.setDepartureStation);
  const setDestination = useJourneyStore((s) => s.setDestinationStation);
  const clearDraft = useMultiLegStore((s) => s.clearDraft);
  const addLeg = useMultiLegStore((s) => s.addLeg);

  const [fromStation, setFromStation] = useState<{ station: Station; line: MetroLine } | null>(null);
  const [toStation, setToStation] = useState<{ station: Station; line: MetroLine } | null>(null);
  const [routes, setRoutes] = useState<FoundRoute[]>([]);
  const [searched, setSearched] = useState(false);

  const handleFindRoutes = () => {
    if (!fromStation || !toStation) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const found = findRoutes(fromStation.station.id, toStation.station.id);
    setRoutes(found);
    setSearched(true);
  };

  const handleSelectRoute = (route: FoundRoute) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (route.legs.length === 1) {
      // Direct route — use single-leg journey flow
      setLine(route.legs[0].lineId);
      setDeparture(route.legs[0].fromStationId);
      setDestination(route.legs[0].toStationId);
      router.dismiss();
    } else {
      // Multi-leg route — load into multi-leg builder
      clearDraft();
      for (const leg of route.legs) {
        addLeg({
          type: 'metro',
          lineId: leg.lineId,
          departureStationId: leg.fromStationId,
          destinationStationId: leg.toStationId,
          estimatedDuration: leg.travelTimeSeconds,
        });
      }
      router.replace('/multi-leg-builder');
    }
  };

  const bothSelected = fromStation && toStation;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={16}>
          <Ionicons name="arrow-back" size={24} color={AppColors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('routeFinder')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search inputs */}
      <View style={styles.searchSection}>
        <StationSearchInput
          placeholder={t('searchFrom')}
          selectedStation={fromStation}
          onSelect={(station, line) => { setFromStation({ station, line }); setSearched(false); setRoutes([]); }}
          onClear={() => { setFromStation(null); setSearched(false); setRoutes([]); }}
          markerColor={AppColors.success}
        />

        {/* Connection dots */}
        <View style={styles.connectionDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <StationSearchInput
          placeholder={t('searchTo')}
          selectedStation={toStation}
          onSelect={(station, line) => { setToStation({ station, line }); setSearched(false); setRoutes([]); }}
          onClear={() => { setToStation(null); setSearched(false); setRoutes([]); }}
          markerColor={AppColors.error}
        />
      </View>

      {/* Find button */}
      {bothSelected && !searched && (
        <Pressable
          style={({ pressed }) => [styles.findBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
          onPress={handleFindRoutes}>
          <Ionicons name="search" size={18} color={AppColors.background} />
          <Text style={styles.findBtnText}>{t('findRoute')}</Text>
        </Pressable>
      )}

      {/* Results */}
      {searched && routes.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsLabel}>{t('routeResults')}</Text>
          <FlatList
            data={routes}
            keyExtractor={(_, i) => String(i)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <RouteCard route={item} onSelect={() => handleSelectRoute(item)} />
            )}
          />
        </View>
      )}

      {/* Empty state */}
      {searched && routes.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={40} color={AppColors.textMuted} />
          <Text style={styles.emptyTitle}>{t('noRoutesFound')}</Text>
          <Text style={styles.emptyHint}>{t('noRoutesFoundHint')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  searchSection: {
    gap: 0,
    marginBottom: Spacing.md,
    zIndex: 10,
  },
  connectionDots: {
    alignItems: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: AppColors.textMuted,
  },
  findBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  findBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  resultsSection: {
    flex: 1,
  },
  resultsLabel: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyTitle: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  emptyHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
  },
});
