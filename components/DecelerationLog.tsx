import { FlatList, StyleSheet, Text, View } from 'react-native';
import { DecelerationEvent } from '@/hooks/useDecelerationDetector';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface DecelerationLogProps {
  events: DecelerationEvent[];
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function DecelerationLog({ events }: DecelerationLogProps) {
  if (events.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Торможений пока не обнаружено.</Text>
        <Text style={styles.emptyHint}>Включите датчик и проверьте в метро.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[...events].reverse()}
      keyExtractor={(item) => item.id}
      style={styles.list}
      renderItem={({ item }) => (
        <View style={styles.eventRow}>
          <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
          <Text style={styles.duration}>{item.duration}ms</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  emptyHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  time: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontVariant: ['tabular-nums'],
  },
  duration: {
    color: AppColors.accent,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
