/**
 * AccessibilityBadge — Shows accessibility feature icons for a station.
 * Compact row of icons (elevator, toilet, tactile, etc.)
 */

import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStationAccessibility } from '@/data/accessibility';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface Props {
  stationId: string;
  /** Compact mode shows only icons; full mode shows labels too */
  mode?: 'compact' | 'full';
  /** Show only relevant features for this concern */
  highlight?: 'elevator' | 'toilet' | 'tactile';
}

const FEATURE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  elevator: 'arrow-up-outline',
  accessible_entrance: 'enter-outline',
  toilet: 'water-outline',
  tactile: 'hand-left-outline',
  audio: 'volume-medium-outline',
  level_boarding: 'swap-horizontal-outline',
};

export default function AccessibilityBadge({ stationId, mode = 'compact', highlight }: Props) {
  const t = useT();
  const access = getStationAccessibility(stationId);

  const features: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string; active: boolean }[] = [
    { key: 'elevator', icon: FEATURE_ICONS.elevator, label: t('hasElevator' as any), active: access.hasElevator },
    { key: 'entrance', icon: FEATURE_ICONS.accessible_entrance, label: t('hasAccessibleEntrance' as any), active: access.hasAccessibleEntrance },
    { key: 'toilet', icon: FEATURE_ICONS.toilet, label: t('hasToilet' as any), active: access.hasToilet },
    { key: 'tactile', icon: FEATURE_ICONS.tactile, label: t('hasTactileGuides' as any), active: access.hasTactileGuides },
    { key: 'level', icon: FEATURE_ICONS.level_boarding, label: t('hasLevelBoarding' as any), active: access.hasLevelBoarding },
  ];

  // Filter by highlight if specified
  let visibleFeatures = features;
  if (highlight === 'elevator') {
    visibleFeatures = features.filter((f) => f.key === 'elevator' || f.key === 'entrance' || f.key === 'level');
  } else if (highlight === 'toilet') {
    visibleFeatures = features.filter((f) => f.key === 'toilet');
  } else if (highlight === 'tactile') {
    visibleFeatures = features.filter((f) => f.key === 'tactile');
  }

  // Don't show badge if no relevant features are active
  const activeFeatures = visibleFeatures.filter((f) => f.active);
  if (activeFeatures.length === 0 && mode === 'compact') return null;

  if (mode === 'full') {
    return (
      <View
        style={styles.fullContainer}
        accessible
        accessibilityLabel={activeFeatures.map((f) => f.label).join(', ')}>
        {visibleFeatures.map((f) => (
          <View
            key={f.key}
            style={[styles.fullRow, !f.active && styles.fullRowInactive]}>
            <Ionicons
              name={f.icon}
              size={16}
              color={f.active ? AppColors.success : AppColors.textMuted}
            />
            <Text style={[styles.fullLabel, !f.active && styles.fullLabelInactive]}>
              {f.label}
            </Text>
            <Ionicons
              name={f.active ? 'checkmark-circle' : 'close-circle-outline'}
              size={14}
              color={f.active ? AppColors.success : AppColors.textMuted}
            />
          </View>
        ))}
      </View>
    );
  }

  // Compact: just icons
  return (
    <View
      style={styles.compactContainer}
      accessible
      accessibilityLabel={`${t('accessibleStation' as any)}: ${activeFeatures.map((f) => f.label).join(', ')}`}>
      {activeFeatures.map((f) => (
        <View key={f.key} style={styles.compactIcon}>
          <Ionicons name={f.icon} size={12} color={AppColors.success} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  compactIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: `${AppColors.success}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullContainer: {
    gap: Spacing.xs,
  },
  fullRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: `${AppColors.success}10`,
    borderRadius: BorderRadius.sm,
  },
  fullRowInactive: {
    backgroundColor: 'transparent',
  },
  fullLabel: {
    flex: 1,
    color: AppColors.text,
    fontSize: FontSize.sm,
  },
  fullLabelInactive: {
    color: AppColors.textMuted,
  },
});
