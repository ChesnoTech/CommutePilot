import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { JourneyLeg } from '@/data/types';
import { getLineById, getStationById, getStationCount, calculateTravelTime } from '@/data/metro';
import { t } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

const LEG_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  metro: 'subway-outline',
  bus: 'bus-outline',
  walk: 'walk-outline',
  taxi: 'car-outline',
};

const LEG_COLORS: Record<string, string> = {
  metro: '#e74c3c',
  bus: '#3498db',
  walk: '#4ade80',
  taxi: '#f39c12',
};

function getLegLabel(type: string): string {
  switch (type) {
    case 'metro': return t('legMetro');
    case 'bus': return t('legBus');
    case 'walk': return t('legWalk');
    case 'taxi': return t('legTaxi');
    default: return type;
  }
}

function formatDuration(seconds: number): string {
  const m = Math.ceil(seconds / 60);
  return `~${m} ${t('min')}`;
}

function getLegDescription(leg: JourneyLeg): string {
  switch (leg.type) {
    case 'metro': {
      const dep = getStationById(leg.departureStationId);
      const dest = getStationById(leg.destinationStationId);
      return `${dep?.nameRu ?? '?'} → ${dest?.nameRu ?? '?'}`;
    }
    case 'bus':
      return `${leg.routeNumber}: ${leg.fromStop} → ${leg.toStop}`;
    case 'walk':
      return `${leg.fromLabel} → ${leg.toLabel}`;
    case 'taxi':
      return `${leg.fromLabel} → ${leg.toLabel}`;
  }
}

function getLegMeta(leg: JourneyLeg): string {
  switch (leg.type) {
    case 'metro': {
      const line = getLineById(leg.lineId);
      const count = getStationCount(leg.lineId, leg.departureStationId, leg.destinationStationId);
      return `${line?.nameRu ?? ''} · ${count} ${t('stAbbr')}`;
    }
    case 'bus':
      return `${leg.stopCount} ${t('stopAbbr')}`;
    case 'walk':
      return `${leg.distanceMeters} ${t('m')}`;
    case 'taxi':
      return '';
  }
}

interface LegCardProps {
  leg: JourneyLeg;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export function LegCard({ leg, index, total, onMoveUp, onMoveDown, onDelete }: LegCardProps) {
  const color = LEG_COLORS[leg.type] ?? AppColors.textMuted;
  const lineColor = leg.type === 'metro' ? getLineById(leg.lineId)?.color : undefined;

  return (
    <View style={styles.card}>
      <View style={[styles.strip, { backgroundColor: lineColor ?? color }]} />
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.typeRow}>
            <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
              <Ionicons name={LEG_ICONS[leg.type]} size={18} color={color} />
            </View>
            <View style={styles.typeLabel}>
              <Text style={styles.typeName}>{getLegLabel(leg.type)}</Text>
              <Text style={styles.duration}>{formatDuration(leg.estimatedDuration)}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            {index > 0 && (
              <Pressable hitSlop={8} onPress={onMoveUp} style={styles.arrowBtn}>
                <Ionicons name="chevron-up" size={16} color={AppColors.textMuted} />
              </Pressable>
            )}
            {index < total - 1 && (
              <Pressable hitSlop={8} onPress={onMoveDown} style={styles.arrowBtn}>
                <Ionicons name="chevron-down" size={16} color={AppColors.textMuted} />
              </Pressable>
            )}
            <Pressable hitSlop={8} onPress={onDelete}>
              <Ionicons name="close-circle-outline" size={18} color={AppColors.textMuted} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={1}>
          {getLegDescription(leg)}
        </Text>
        {getLegMeta(leg) !== '' && (
          <Text style={styles.meta}>{getLegMeta(leg)}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  strip: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: Spacing.md,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeLabel: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  typeName: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  duration: {
    color: AppColors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  arrowBtn: {
    padding: 2,
  },
  description: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  meta: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
