import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Station } from '@/data/types';
import { getLineById } from '@/data/metro';
import { getStationAccessibility } from '@/data/accessibility';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface StationItemProps {
  station: Station;
  onPress: () => void;
  selected?: boolean;
  lineColor?: string;
}

export function StationItem({ station, onPress, selected, lineColor }: StationItemProps) {
  const t = useT();
  const accessProfile = useSettingsStore((s) => s.accessibilityProfile);
  const showToiletInfo = useSettingsStore((s) => s.showToiletInfo);
  const access = getStationAccessibility(station.id);

  // Determine which accessibility icons to show
  const showAccessIcons = accessProfile !== 'standard';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.item, selected && styles.itemSelected]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${station.nameRu}, ${station.nameEn}${selected ? `, ${t('accessibilitySelected')}` : ''}`}
      accessibilityState={{ selected }}>
      {/* Metro-style vertical line with station dot */}
      <View style={styles.trackColumn}>
        <View style={[styles.trackLine, { backgroundColor: lineColor ?? AppColors.border }]} />
        <View style={[
          styles.stationDot,
          { borderColor: lineColor ?? AppColors.border },
          selected && styles.stationDotSelected,
        ]} />
        <View style={[styles.trackLine, { backgroundColor: lineColor ?? AppColors.border }]} />
      </View>

      <View style={styles.info}>
        <Text style={[styles.nameRu, selected && styles.nameRuSelected]}>{station.nameRu}</Text>
        <View style={styles.nameRow}>
          <Text style={styles.nameEn}>{station.nameEn}</Text>
          {/* Accessibility mini-badges */}
          {showAccessIcons && (
            <View style={styles.accessIcons}>
              {access.hasElevator && (
                <Ionicons name="arrow-up-outline" size={10} color={AppColors.success} />
              )}
              {showToiletInfo && access.hasToilet && (
                <Ionicons name="water-outline" size={10} color={AppColors.primary} />
              )}
              {accessProfile === 'vision' && access.hasTactileGuides && (
                <Ionicons name="hand-left-outline" size={10} color={AppColors.success} />
              )}
              {accessProfile === 'wheelchair' && access.hasLevelBoarding && (
                <Ionicons name="swap-horizontal-outline" size={10} color={AppColors.success} />
              )}
            </View>
          )}
        </View>
      </View>

      {station.transfers.length > 0 && (
        <View style={styles.transfers}>
          {station.transfers.map((lineId) => {
            const transferLine = getLineById(lineId);
            return (
              <View
                key={lineId}
                style={[styles.transferBadge, { backgroundColor: transferLine?.color ?? '#888' }]}>
                <Text style={styles.transferText}>{transferLine?.number ?? '?'}</Text>
              </View>
            );
          })}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    paddingRight: Spacing.md,
    minHeight: 56,
  },
  itemSelected: {
    backgroundColor: AppColors.accentSoft,
  },
  trackColumn: {
    width: 40,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  trackLine: {
    flex: 1,
    width: 3,
    opacity: 0.35,
  },
  stationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    backgroundColor: AppColors.background,
  },
  stationDotSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  info: {
    flex: 1,
    paddingVertical: Spacing.md,
  },
  nameRu: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  nameRuSelected: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 1,
  },
  nameEn: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
  },
  accessIcons: {
    flexDirection: 'row',
    gap: 3,
    marginLeft: 2,
  },
  transfers: {
    flexDirection: 'row',
    gap: 3,
    paddingLeft: Spacing.sm,
  },
  transferBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transferText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});
