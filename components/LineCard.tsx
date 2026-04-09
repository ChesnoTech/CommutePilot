import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MetroLine } from '@/data/types';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface LineCardProps {
  line: MetroLine;
  onPress: () => void;
  selected?: boolean;
}

export function LineCard({ line, onPress, selected }: LineCardProps) {
  const t = useT();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}>
      <View style={[styles.colorBar, { backgroundColor: line.color }]} />
      <View style={[styles.badge, { backgroundColor: line.color }]}>
        <Text style={styles.badgeText}>{line.number}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nameRu}>{line.nameRu}</Text>
        <Text style={styles.nameEn}>{line.nameEn}</Text>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{line.stations.length}</Text>
        <Text style={styles.countLabel}>{t('stAbbr')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs + 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.surfaceLight,
  },
  colorBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  badgeText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  nameRu: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  nameEn: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  countBadge: {
    alignItems: 'center',
    paddingRight: Spacing.md,
  },
  countText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  countLabel: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
  },
});
