import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { getLineById, getStationById } from '@/data/metro';
import { checkRouteAccessibility } from '@/data/accessibility';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useActiveJourneyStore } from '@/store/useActiveJourneyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { JourneySummary } from '@/components/JourneySummary';
import { SaveTemplateModal } from '@/components/SaveTemplateModal';
import AccessibilityWarning from '@/components/AccessibilityWarning';
import AccessibilityBadge from '@/components/AccessibilityBadge';
import { MetroMap } from '@/components/MetroMap';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

export default function JourneyScreen() {
  const router = useRouter();
  const t = useT();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [accessWarningVisible, setAccessWarningVisible] = useState(false);

  const selectedLineId = useJourneyStore((s) => s.selectedLineId);
  const departureStationId = useJourneyStore((s) => s.departureStationId);
  const destinationStationId = useJourneyStore((s) => s.destinationStationId);
  const clearJourney = useJourneyStore((s) => s.clearJourney);
  const addTemplate = useTemplateStore((s) => s.addTemplate);
  const startJourney = useActiveJourneyStore((s) => s.startJourney);
  const accessProfile = useSettingsStore((s) => s.accessibilityProfile);
  const showAccessWarnings = useSettingsStore((s) => s.showAccessibilityWarnings);

  const setLine = useJourneyStore((s) => s.setLine);
  const setDeparture = useJourneyStore((s) => s.setDepartureStation);
  const setDestination = useJourneyStore((s) => s.setDestinationStation);

  const line = selectedLineId ? getLineById(selectedLineId) : null;
  const departure = departureStationId ? getStationById(departureStationId) : null;
  const destination = destinationStationId ? getStationById(destinationStationId) : null;
  const journeyComplete = line && departure && destination;

  // Build route station list for accessibility check
  const routeStations = journeyComplete && line
    ? line.stations
        .filter((s) => {
          const depOrder = departure!.order;
          const destOrder = destination!.order;
          return depOrder < destOrder
            ? s.order >= depOrder && s.order <= destOrder
            : s.order >= destOrder && s.order <= depOrder;
        })
        .sort((a, b) => a.order - b.order)
    : [];

  const accessCheck = checkRouteAccessibility(
    routeStations.map((s) => s.id),
    routeStations.map((s) => s.nameRu),
    accessProfile
  );

  const handleStartJourney = () => {
    if (accessProfile !== 'standard' && showAccessWarnings && accessCheck.warnings.length > 0) {
      setAccessWarningVisible(true);
      return;
    }
    doStartJourney();
  };

  const doStartJourney = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    startJourney(selectedLineId!, departureStationId!, destinationStationId!);
    router.push('/active-journey');
  };

  // Map tap: select line, then departure, then destination
  const handleMapStationPress = useCallback(
    (stationId: string, lineId: string) => {
      if (!selectedLineId) {
        // No line selected — select the line
        setLine(lineId);
      } else if (lineId !== selectedLineId) {
        // Different line tapped — switch line
        setLine(lineId);
      } else if (!departureStationId) {
        // Same line, no departure — set departure
        setDeparture(stationId);
      } else if (!destinationStationId) {
        // Same line, no destination — set destination
        setDestination(stationId);
      } else {
        // Both set — reset and start fresh on this station as departure
        setLine(lineId);
        setDeparture(stationId);
      }
    },
    [selectedLineId, departureStationId, destinationStationId, setLine, setDeparture, setDestination]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>COMMUTE</Text>
        <Text style={styles.logoBold}>PILOT</Text>
      </View>
      <Text style={styles.subtitle}>{t('appTagline')}</Text>

      {/* Metro Map */}
      <View style={styles.mapContainer}>
        <MetroMap
          selectedLineId={selectedLineId}
          departureStationId={departureStationId}
          destinationStationId={destinationStationId}
          onStationPress={handleMapStationPress}
        />
        {!selectedLineId && (
          <Text style={styles.mapHint}>{t('mapHint')}</Text>
        )}
      </View>

      {/* Line selector */}
      <Text style={styles.sectionLabel}>{t('sectionLine')}</Text>
      <Pressable
        style={({ pressed }) => [styles.selectorBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
        onPress={() => router.push('/select-line')}>
        {line ? (
          <View style={styles.selectedRow}>
            <View style={[styles.lineDot, { backgroundColor: line.color }]} />
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedText}>{line.nameRu}</Text>
              <Text style={styles.selectedSub}>{line.nameEn}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderRow}>
            <View style={styles.placeholderIcon}>
              <Ionicons name="git-branch-outline" size={18} color={AppColors.primary} />
            </View>
            <Text style={styles.placeholderText}>{t('selectLinePlaceholder')}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
      </Pressable>

      {/* Station selectors */}
      <Text style={styles.sectionLabel}>{t('sectionStations')}</Text>

      {/* Departure */}
      <Pressable
        style={({ pressed }) => [styles.selectorBtn, !line && styles.selectorDisabled, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
        disabled={!line}
        onPress={() => router.push({ pathname: '/select-station', params: { type: 'departure' } })}>
        {departure ? (
          <View style={styles.selectedRow}>
            <View style={[styles.stationMarker, styles.departureMarker]}>
              <Ionicons name="ellipse" size={8} color="#fff" />
            </View>
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedText}>{departure.nameRu}</Text>
              <Text style={styles.selectedSub}>{departure.nameEn}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderRow}>
            <View style={[styles.placeholderIcon, { backgroundColor: 'rgba(74, 222, 128, 0.1)' }]}>
              <Ionicons name="radio-button-on-outline" size={16} color={AppColors.success} />
            </View>
            <Text style={styles.placeholderText}>{t('fromPlaceholder')}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
      </Pressable>

      {/* Connection line between stations */}
      {line && (
        <View style={styles.connectionLine}>
          <View style={[styles.connectionDot, { backgroundColor: line.color }]} />
          <View style={[styles.connectionBar, { backgroundColor: line.color }]} />
          <View style={[styles.connectionDot, { backgroundColor: line.color }]} />
        </View>
      )}

      {/* Destination */}
      <Pressable
        style={({ pressed }) => [styles.selectorBtn, !line && styles.selectorDisabled, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
        disabled={!line}
        onPress={() => router.push({ pathname: '/select-station', params: { type: 'destination' } })}>
        {destination ? (
          <View style={styles.selectedRow}>
            <View style={[styles.stationMarker, styles.destinationMarker]}>
              <Ionicons name="flag" size={10} color="#fff" />
            </View>
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedText}>{destination.nameRu}</Text>
              <Text style={styles.selectedSub}>{destination.nameEn}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderRow}>
            <View style={[styles.placeholderIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Ionicons name="flag-outline" size={16} color={AppColors.error} />
            </View>
            <Text style={styles.placeholderText}>{t('toPlaceholder')}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={AppColors.textMuted} />
      </Pressable>

      {/* Journey summary */}
      {journeyComplete && (
        <View style={styles.summarySection}>
          <JourneySummary
            lineId={selectedLineId!}
            departureStationId={departureStationId!}
            destinationStationId={destinationStationId!}
          />

          {/* Accessibility info for departure & destination */}
          {accessProfile !== 'standard' && (
            <View style={styles.accessRow}>
              <View style={styles.accessStation}>
                <Text style={styles.accessStationLabel}>{departure!.nameRu}</Text>
                <AccessibilityBadge
                  stationId={departureStationId!}
                  highlight={accessProfile === 'wheelchair' ? 'elevator' : accessProfile === 'vision' ? 'tactile' : undefined}
                />
              </View>
              <Ionicons name="arrow-forward" size={14} color={AppColors.textMuted} />
              <View style={styles.accessStation}>
                <Text style={styles.accessStationLabel}>{destination!.nameRu}</Text>
                <AccessibilityBadge
                  stationId={destinationStationId!}
                  highlight={accessProfile === 'wheelchair' ? 'elevator' : accessProfile === 'vision' ? 'tactile' : undefined}
                />
              </View>
            </View>
          )}

          {/* Route accessibility warning badge */}
          {accessProfile !== 'standard' && accessCheck.warnings.length > 0 && (
            <Pressable
              style={styles.accessBanner}
              onPress={() => setAccessWarningVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={t('accessWarningTitle')}>
              <Ionicons
                name={accessCheck.passable ? 'alert-circle' : 'close-circle'}
                size={18}
                color={accessCheck.passable ? AppColors.warning : AppColors.error}
              />
              <Text style={[
                styles.accessBannerText,
                { color: accessCheck.passable ? AppColors.warning : AppColors.error },
              ]}>
                {accessCheck.passable ? t('accessWarningInfo') : t('accessWarningCritical')}
                {' · '}{accessCheck.warnings.length}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={AppColors.textMuted} />
            </Pressable>
          )}

          <Pressable
            style={styles.startBtn}
            onPress={handleStartJourney}
            accessibilityRole="button"
            accessibilityLabel={t('startJourney')}>
            <Ionicons name="play" size={20} color={AppColors.background} />
            <Text style={styles.startBtnText}>{t('startJourney')}</Text>
          </Pressable>
          <View style={styles.actionRow}>
            <Pressable style={styles.saveBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="bookmark" size={16} color={AppColors.background} />
              <Text style={styles.saveBtnText}>{t('save')}</Text>
            </Pressable>
            <Pressable style={styles.clearBtn} onPress={clearJourney}>
              <Text style={styles.clearBtnText}>{t('reset')}</Text>
            </Pressable>
          </View>
        </View>
      )}

      <SaveTemplateModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={(name) => {
          addTemplate(name, selectedLineId!, departureStationId!, destinationStationId!);
          setModalVisible(false);
        }}
      />

      {/* Accessibility warning modal */}
      <AccessibilityWarning
        visible={accessWarningVisible}
        check={accessCheck}
        onContinue={() => {
          setAccessWarningVisible(false);
          doStartJourney();
        }}
        onCancel={() => setAccessWarningVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  logo: {
    color: AppColors.textSecondary,
    fontSize: FontSize.hero,
    fontWeight: '200',
    letterSpacing: 4,
  },
  logoBold: {
    color: AppColors.primary,
    fontSize: FontSize.hero,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  mapContainer: {
    marginBottom: Spacing.sm,
  },
  mapHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  sectionLabel: {
    color: AppColors.primary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  selectorDisabled: {
    opacity: 0.35,
  },
  placeholderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  placeholderIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: AppColors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedText: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  selectedSub: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    marginTop: 1,
  },
  lineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  departureMarker: {
    backgroundColor: AppColors.success,
  },
  destinationMarker: {
    backgroundColor: AppColors.error,
  },
  connectionLine: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  connectionBar: {
    width: 2,
    height: 16,
    opacity: 0.4,
  },
  summarySection: {
    marginTop: Spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  saveBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  clearBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  clearBtnText: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  startBtnText: {
    color: AppColors.background,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  // ─── Accessibility styles ───
  accessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: Spacing.sm,
  },
  accessStation: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  accessStationLabel: {
    color: AppColors.textSecondary,
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  accessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  accessBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
