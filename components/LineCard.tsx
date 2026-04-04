import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MetroLine } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface LineCardProps {
  line: MetroLine;
  onPress: () => void;
  selected?: boolean;
}

export function LineCard({ line, onPress, selected }: LineCardProps) {
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
      <Text style={styles.stationCount}>{line.stations.length} st.</Text>
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
    marginVertical: Spacing.xs,
    overflow: 'hidden',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: AppColors.accent,
  },
  colorBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  badgeText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  nameRu: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  nameEn: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  stationCount: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    paddingRight: Spacing.md,
  },
});
