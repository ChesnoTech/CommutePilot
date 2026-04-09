import { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Station } from '@/data/types';
import { getStationAccessibility } from '@/data/accessibility';
import { useSettingsStore } from '@/store/useSettingsStore';
import { t } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/layout';

interface StationProgressListProps {
  stations: Station[];
  currentIndex: number;
  lineColor: string;
}

export function StationProgressList({ stations, currentIndex, lineColor }: StationProgressListProps) {
  const listRef = useRef<FlatList>(null);
  const accessProfile = useSettingsStore((s) => s.accessibilityProfile);
  const showToiletInfo = useSettingsStore((s) => s.showToiletInfo);
  const showAccessIcons = accessProfile !== 'standard';

  const pulseScale = useSharedValue(1);
  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseScale]);
  const pulsingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 2 - pulseScale.value,
  }));

  useEffect(() => {
    if (listRef.current && currentIndex >= 0 && currentIndex < stations.length) {
      listRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.4,
      });
    }
  }, [currentIndex, stations.length]);

  return (
    <FlatList
      ref={listRef}
      data={stations}
      keyExtractor={(item) => item.id}
      style={styles.list}
      onScrollToIndexFailed={(info) => {
        listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
      }}
      renderItem={({ item, index }) => {
        const isPassed = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === stations.length - 1;

        return (
          <View style={styles.row}>
            {/* Track line */}
            <View style={styles.trackColumn}>
              {index > 0 && (
                <View
                  style={[
                    styles.trackLineTop,
                    { backgroundColor: isPassed || isCurrent ? lineColor : AppColors.border },
                  ]}
                />
              )}
              <View
                style={[
                  styles.dot,
                  isCurrent && styles.dotCurrent,
                  isPassed && styles.dotPassed,
                  {
                    borderColor: isPassed || isCurrent ? lineColor : AppColors.border,
                    backgroundColor: isPassed ? lineColor : isCurrent ? AppColors.primary : AppColors.background,
                  },
                ]}>
                {isPassed && (
                  <Ionicons name="checkmark" size={10} color="#fff" />
                )}
                {isCurrent && (
                  <Animated.View style={[styles.pulsingCore, pulsingStyle]} />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.trackLineBottom,
                    { backgroundColor: isPassed ? lineColor : AppColors.border },
                  ]}
                />
              )}
            </View>

            {/* Station info */}
            <View
              style={[styles.stationInfo, isCurrent && styles.stationInfoCurrent]}
              accessible
              accessibilityLabel={`${item.nameRu}${isCurrent ? `, ${t('stationNow')}` : ''}${isPassed ? ', passed' : ''}`}>
              <Text
                style={[
                  styles.stationName,
                  isPassed && styles.stationNamePassed,
                  isCurrent && styles.stationNameCurrent,
                ]}
                numberOfLines={1}>
                {item.nameRu}
              </Text>
              <View style={styles.nameRow}>
                <Text
                  style={[
                    styles.stationNameEn,
                    isPassed && styles.stationNamePassed,
                  ]}
                  numberOfLines={1}>
                  {item.nameEn}
                </Text>
                {showAccessIcons && (() => {
                  const access = getStationAccessibility(item.id);
                  return (
                    <View style={styles.accessIcons}>
                      {access.hasElevator && (
                        <Ionicons name="arrow-up-outline" size={9} color={isPassed ? AppColors.textMuted : AppColors.success} />
                      )}
                      {showToiletInfo && access.hasToilet && (
                        <Ionicons name="water-outline" size={9} color={isPassed ? AppColors.textMuted : AppColors.primary} />
                      )}
                    </View>
                  );
                })()}
              </View>
            </View>

            {/* Status indicator */}
            <View style={styles.statusColumn}>
              {isPassed && (
                <Text style={styles.passedLabel}>✓</Text>
              )}
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>{t('stationNow')}</Text>
                </View>
              )}
              {isLast && !isPassed && !isCurrent && (
                <Ionicons name="flag" size={14} color={AppColors.error} />
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },
  trackColumn: {
    width: 32,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  trackLineTop: {
    width: 2,
    flex: 1,
  },
  trackLineBottom: {
    width: 2,
    flex: 1,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotPassed: {
    borderWidth: 0,
  },
  dotCurrent: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
  },
  pulsingCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
  stationInfo: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  stationInfoCurrent: {
    backgroundColor: AppColors.accentSoft,
    borderRadius: 8,
    marginVertical: 2,
  },
  stationName: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  stationNameEn: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
  },
  accessIcons: {
    flexDirection: 'row',
    gap: 2,
  },
  stationNamePassed: {
    color: AppColors.textMuted,
  },
  stationNameCurrent: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  statusColumn: {
    width: 60,
    alignItems: 'center',
  },
  passedLabel: {
    color: AppColors.success,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  currentBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    color: AppColors.background,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
