import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Station } from '@/data/types';
import { getLineById } from '@/data/metro';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface StationItemProps {
  station: Station;
  onPress: () => void;
  selected?: boolean;
}

export function StationItem({ station, onPress, selected }: StationItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.item, selected && styles.itemSelected]}>
      <View style={styles.orderBadge}>
        <Text style={styles.orderText}>{station.order}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nameRu}>{station.nameRu}</Text>
        <Text style={styles.nameEn}>{station.nameEn}</Text>
      </View>
      {station.transfers.length > 0 && (
        <View style={styles.transfers}>
          {station.transfers.map((lineId) => {
            const line = getLineById(lineId);
            return (
              <View
                key={lineId}
                style={[styles.transferDot, { backgroundColor: line?.color ?? '#888' }]}
              />
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  itemSelected: {
    backgroundColor: AppColors.surfaceLight,
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  nameRu: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  nameEn: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  transfers: {
    flexDirection: 'row',
    gap: 4,
    paddingLeft: Spacing.sm,
  },
  transferDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
