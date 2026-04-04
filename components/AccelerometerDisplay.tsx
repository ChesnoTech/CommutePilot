import { StyleSheet, Text, View } from 'react-native';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface AccelerometerDisplayProps {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

export function AccelerometerDisplay({ x, y, z, magnitude }: AccelerometerDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.axis, { borderLeftColor: '#ef4444' }]}>
          <Text style={styles.label}>X</Text>
          <Text style={styles.value}>{x.toFixed(3)}</Text>
        </View>
        <View style={[styles.axis, { borderLeftColor: '#22c55e' }]}>
          <Text style={styles.label}>Y</Text>
          <Text style={styles.value}>{y.toFixed(3)}</Text>
        </View>
        <View style={[styles.axis, { borderLeftColor: '#3b82f6' }]}>
          <Text style={styles.label}>Z</Text>
          <Text style={styles.value}>{z.toFixed(3)}</Text>
        </View>
      </View>
      <View style={styles.magnitudeRow}>
        <Text style={styles.magnitudeLabel}>Magnitude</Text>
        <Text style={styles.magnitudeValue}>{magnitude.toFixed(4)} g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  axis: {
    flex: 1,
    backgroundColor: AppColors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
  },
  label: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  value: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginTop: Spacing.xs,
    fontVariant: ['tabular-nums'],
  },
  magnitudeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppColors.border,
  },
  magnitudeLabel: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
  },
  magnitudeValue: {
    color: AppColors.accent,
    fontSize: FontSize.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
