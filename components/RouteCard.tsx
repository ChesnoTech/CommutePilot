import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FoundRoute } from '@/data/routeFinder';
import { getLineById, getStationById } from '@/data/metro';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface RouteCardProps {
  route: FoundRoute;
  onSelect: () => void;
}

export function RouteCard({ route, onSelect }: RouteCardProps) {
  const t = useT();
  const totalMin = Math.ceil(route.totalTimeSeconds / 60);
  const transferCount = route.transfers.length;

  return (
    <View style={styles.card}>
      {/* Line chain */}
      <View style={styles.lineChain}>
        {route.legs.map((leg, i) => {
          const line = getLineById(leg.lineId);
          const transferStation = i < route.transfers.length
            ? getStationById(route.transfers[i].fromStationId)
            : null;

          return (
            <View key={i} style={styles.legChain}>
              {i > 0 && transferStation && (
                <View style={styles.transferInfo}>
                  <Ionicons name="swap-horizontal" size={12} color={AppColors.textMuted} />
                  <Text style={styles.transferName} numberOfLines={1}>
                    {transferStation.nameRu}
                  </Text>
                </View>
              )}
              <View style={[styles.lineBadge, { backgroundColor: line?.color ?? AppColors.border }]}>
                <Text style={styles.lineBadgeText}>{line?.number ?? '?'}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="train-outline" size={14} color={AppColors.textSecondary} />
          <Text style={styles.statText}>
            {route.totalStationCount} {t('stAbbr')}
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={14} color={AppColors.textSecondary} />
          <Text style={styles.statText}>~{totalMin} {t('min')}</Text>
        </View>
        {transferCount > 0 && (
          <View style={styles.stat}>
            <Ionicons name="swap-horizontal-outline" size={14} color={AppColors.textSecondary} />
            <Text style={styles.statText}>
              {transferCount === 0 ? t('directRoute') : `${transferCount} ${t('transferCount').toLowerCase()}`}
            </Text>
          </View>
        )}
        {transferCount === 0 && (
          <View style={styles.directBadge}>
            <Text style={styles.directText}>{t('directRoute')}</Text>
          </View>
        )}
      </View>

      {/* Select button */}
      <Pressable
        style={({ pressed }) => [styles.selectBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
        onPress={onSelect}>
        <Text style={styles.selectText}>{t('selectRoute')}</Text>
        <Ionicons name="arrow-forward" size={16} color={AppColors.background} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: Spacing.sm,
  },
  lineChain: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  legChain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  lineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    minWidth: 28,
    alignItems: 'center',
  },
  lineBadgeText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  transferInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginRight: 2,
  },
  transferName: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
    maxWidth: 100,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.xs,
  },
  directBadge: {
    backgroundColor: AppColors.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  directText: {
    color: AppColors.primary,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  selectText: {
    color: AppColors.background,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
