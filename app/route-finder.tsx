import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { StationSearchInput } from '@/components/StationSearchInput';
import { RouteCard } from '@/components/RouteCard';
import { findRoutes, FoundRoute } from '@/data/routeFinder';
import { findNearestStations } from '@/data/metro';
import { geocodeAddress } from '@/services/Geocoder';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useMultiLegStore } from '@/store/useMultiLegStore';
import { useT } from '@/i18n';
import type { Station, MetroLine } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

type SearchMode = 'station' | 'address';

export default function RouteFinderScreen() {
  const router = useRouter();
  const t = useT();
  const insets = useSafeAreaInsets();

  const setLine = useJourneyStore((s) => s.setLine);
  const setDeparture = useJourneyStore((s) => s.setDepartureStation);
  const setDestination = useJourneyStore((s) => s.setDestinationStation);
  const clearDraft = useMultiLegStore((s) => s.clearDraft);
  const addLeg = useMultiLegStore((s) => s.addLeg);

  const [mode, setMode] = useState<SearchMode>('address');

  // Station mode state
  const [fromStation, setFromStation] = useState<{ station: Station; line: MetroLine } | null>(null);
  const [toStation, setToStation] = useState<{ station: Station; line: MetroLine } | null>(null);

  // Address mode state
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [fromNearby, setFromNearby] = useState<Array<{ station: Station; line: MetroLine; distanceKm: number }>>([]);
  const [toNearby, setToNearby] = useState<Array<{ station: Station; line: MetroLine; distanceKm: number }>>([]);
  const [geocodingFrom, setGeocodingFrom] = useState(false);
  const [geocodingTo, setGeocodingTo] = useState(false);
  const [fromError, setFromError] = useState(false);
  const [toError, setToError] = useState(false);

  // Route results
  const [routes, setRoutes] = useState<FoundRoute[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const resetResults = () => {
    setRoutes([]);
    setSearched(false);
  };

  // Geocode an address and find nearest stations
  const handleGeocodeFrom = useCallback(async () => {
    if (!fromAddress.trim()) return;
    setGeocodingFrom(true);
    setFromError(false);
    setFromNearby([]);
    resetResults();

    const result = await geocodeAddress(fromAddress.trim());
    if (result) {
      const nearby = findNearestStations(result.lat, result.lng, 3);
      setFromNearby(nearby);
      if (nearby.length > 0) {
        setFromStation({ station: nearby[0].station, line: nearby[0].line });
      }
    } else {
      setFromError(true);
    }
    setGeocodingFrom(false);
  }, [fromAddress]);

  const handleGeocodeTo = useCallback(async () => {
    if (!toAddress.trim()) return;
    setGeocodingTo(true);
    setToError(false);
    setToNearby([]);
    resetResults();

    const result = await geocodeAddress(toAddress.trim());
    if (result) {
      const nearby = findNearestStations(result.lat, result.lng, 3);
      setToNearby(nearby);
      if (nearby.length > 0) {
        setToStation({ station: nearby[0].station, line: nearby[0].line });
      }
    } else {
      setToError(true);
    }
    setGeocodingTo(false);
  }, [toAddress]);

  const handleFindRoutes = () => {
    if (!fromStation || !toStation) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSearching(true);
    // Use setTimeout to let the loading UI render before computing routes
    setTimeout(() => {
      const found = findRoutes(fromStation.station.id, toStation.station.id);
      setRoutes(found);
      setSearched(true);
      setSearching(false);
    }, 50);
  };

  const handleSelectRoute = (route: FoundRoute) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (route.legs.length === 1) {
      setLine(route.legs[0].lineId);
      setDeparture(route.legs[0].fromStationId);
      setDestination(route.legs[0].toStationId);
      router.dismiss();
    } else {
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

  const switchMode = (newMode: SearchMode) => {
    setMode(newMode);
    setFromStation(null);
    setToStation(null);
    setFromAddress('');
    setToAddress('');
    setFromNearby([]);
    setToNearby([]);
    setFromError(false);
    setToError(false);
    resetResults();
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

      {/* Mode toggle */}
      <View style={styles.modeToggle}>
        <Pressable
          style={[styles.modeBtn, mode === 'address' && styles.modeBtnActive]}
          onPress={() => switchMode('address')}>
          <Ionicons name="location-outline" size={14} color={mode === 'address' ? AppColors.background : AppColors.textSecondary} />
          <Text style={[styles.modeBtnText, mode === 'address' && styles.modeBtnTextActive]}>
            {t('searchByAddress')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeBtn, mode === 'station' && styles.modeBtnActive]}
          onPress={() => switchMode('station')}>
          <Ionicons name="train-outline" size={14} color={mode === 'station' ? AppColors.background : AppColors.textSecondary} />
          <Text style={[styles.modeBtnText, mode === 'station' && styles.modeBtnTextActive]}>
            {t('searchByStation')}
          </Text>
        </Pressable>
      </View>

      {/* Search inputs */}
      <View style={styles.searchSection}>
        {mode === 'station' ? (
          <>
            <StationSearchInput
              placeholder={t('searchFrom')}
              selectedStation={fromStation}
              onSelect={(station, line) => { setFromStation({ station, line }); resetResults(); }}
              onClear={() => { setFromStation(null); resetResults(); }}
              markerColor={AppColors.success}
            />
            <View style={styles.connectionDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <StationSearchInput
              placeholder={t('searchTo')}
              selectedStation={toStation}
              onSelect={(station, line) => { setToStation({ station, line }); resetResults(); }}
              onClear={() => { setToStation(null); resetResults(); }}
              markerColor={AppColors.error}
            />
          </>
        ) : (
          <>
            {/* From address */}
            <View style={styles.addressInputWrap}>
              <View style={[styles.marker, { backgroundColor: AppColors.success }]} />
              <TextInput
                style={styles.addressInput}
                placeholder={`${t('searchFrom')} — ${t('enterAddress')}`}
                placeholderTextColor={AppColors.textMuted}
                value={fromAddress}
                onChangeText={(text) => { setFromAddress(text); setFromError(false); }}
                onSubmitEditing={handleGeocodeFrom}
                returnKeyType="search"
              />
              {geocodingFrom ? (
                <ActivityIndicator size="small" color={AppColors.primary} />
              ) : fromAddress.length > 0 ? (
                <Pressable onPress={handleGeocodeFrom} hitSlop={16}>
                  <Ionicons name="search" size={18} color={AppColors.primary} />
                </Pressable>
              ) : null}
            </View>
            {fromError && (
              <Text style={styles.errorText}>{t('addressNotFound')}</Text>
            )}
            {fromNearby.length > 0 && (
              <View style={styles.nearbySection}>
                <Text style={styles.nearbyLabel}>{t('nearestStations')}</Text>
                {fromNearby.map((item) => (
                  <Pressable
                    key={item.station.id}
                    style={({ pressed }) => [
                      styles.nearbyRow,
                      fromStation?.station.id === item.station.id && styles.nearbyRowActive,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => { setFromStation({ station: item.station, line: item.line }); resetResults(); }}>
                    <View style={[styles.nearbyDot, { backgroundColor: item.line.color }]} />
                    <Text style={styles.nearbyLineNum}>{item.line.number}</Text>
                    <Text style={styles.nearbyName} numberOfLines={1}>{item.station.nameRu}</Text>
                    <Text style={styles.nearbyDist}>{item.distanceKm.toFixed(1)} {t('kmAway')}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.connectionDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>

            {/* To address */}
            <View style={styles.addressInputWrap}>
              <View style={[styles.marker, { backgroundColor: AppColors.error }]} />
              <TextInput
                style={styles.addressInput}
                placeholder={`${t('searchTo')} — ${t('enterAddress')}`}
                placeholderTextColor={AppColors.textMuted}
                value={toAddress}
                onChangeText={(text) => { setToAddress(text); setToError(false); }}
                onSubmitEditing={handleGeocodeTo}
                returnKeyType="search"
              />
              {geocodingTo ? (
                <ActivityIndicator size="small" color={AppColors.primary} />
              ) : toAddress.length > 0 ? (
                <Pressable onPress={handleGeocodeTo} hitSlop={16}>
                  <Ionicons name="search" size={18} color={AppColors.primary} />
                </Pressable>
              ) : null}
            </View>
            {toError && (
              <Text style={styles.errorText}>{t('addressNotFound')}</Text>
            )}
            {toNearby.length > 0 && (
              <View style={styles.nearbySection}>
                <Text style={styles.nearbyLabel}>{t('nearestStations')}</Text>
                {toNearby.map((item) => (
                  <Pressable
                    key={item.station.id}
                    style={({ pressed }) => [
                      styles.nearbyRow,
                      toStation?.station.id === item.station.id && styles.nearbyRowActive,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => { setToStation({ station: item.station, line: item.line }); resetResults(); }}>
                    <View style={[styles.nearbyDot, { backgroundColor: item.line.color }]} />
                    <Text style={styles.nearbyLineNum}>{item.line.number}</Text>
                    <Text style={styles.nearbyName} numberOfLines={1}>{item.station.nameRu}</Text>
                    <Text style={styles.nearbyDist}>{item.distanceKm.toFixed(1)} {t('kmAway')}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      {/* Find button */}
      {bothSelected && !searched && (
        <Pressable
          style={({ pressed }) => [styles.findBtn, searching && { opacity: 0.7 }, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
          onPress={handleFindRoutes}
          disabled={searching}>
          {searching ? (
            <>
              <ActivityIndicator size="small" color={AppColors.background} />
              <Text style={styles.findBtnText}>{t('searchingRoutes')}</Text>
            </>
          ) : (
            <>
              <Ionicons name="search" size={18} color={AppColors.background} />
              <Text style={styles.findBtnText}>{t('findRoute')}</Text>
            </>
          )}
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
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.full,
    padding: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  modeBtnActive: {
    backgroundColor: AppColors.primary,
  },
  modeBtnText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: AppColors.background,
  },
  searchSection: {
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
  // Address mode styles
  addressInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: Spacing.sm,
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addressInput: {
    flex: 1,
    color: AppColors.text,
    fontSize: FontSize.md,
    paddingVertical: 4,
  },
  errorText: {
    color: AppColors.error,
    fontSize: FontSize.xs,
    marginTop: 4,
    marginLeft: Spacing.md,
  },
  nearbySection: {
    marginTop: Spacing.xs,
    gap: 2,
  },
  nearbyLabel: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
    marginLeft: 4,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  nearbyRowActive: {
    backgroundColor: AppColors.accentSoft,
  },
  nearbyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nearbyLineNum: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '700',
    width: 24,
  },
  nearbyName: {
    flex: 1,
    color: AppColors.text,
    fontSize: FontSize.sm,
  },
  nearbyDist: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
  },
  // Common styles
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
    paddingTop: Spacing.xl,
  },
  emptyTitle: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  emptyHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
});
