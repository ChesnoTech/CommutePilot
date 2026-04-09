import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLineById, getStationById, calculateTravelTime, getStationCount } from '@/data/metro';
import { pluralStations, pluralMinutes } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface JourneySummaryProps {
  lineId: string;
  departureStationId: string;
  destinationStationId: string;
}

export const JourneySummary = memo(function JourneySummary({ lineId, departureStationId, destinationStationId }: JourneySummaryProps) {
  const line = getLineById(lineId);
  const departure = getStationById(departureStationId);
  const destination = getStationById(destinationStationId);

  if (!line || !departure || !destination) return null;

  const travelTime = calculateTravelTime(lineId, departureStationId, destinationStationId);
  const stationCount = getStationCount(lineId, departureStationId, destinationStationId);
  const minutes = Math.ceil(travelTime / 60);

  return (
    <View style={styles.container}>
      {/* Line indicator */}
      <View style={[styles.lineRow, { borderLeftColor: line.color }]}>
        <View style={[styles.lineBadge, { backgroundColor: line.color }]}>
          <Text style={styles.lineBadgeText}>{line.number}</Text>
        </View>
        <Text style={styles.lineName}>{line.nameRu}</Text>
      </View>

      {/* Route */}
      <View style={styles.routeRow}>
        <View style={styles.routeStation}>
          <View style={[styles.dot, { backgroundColor: AppColors.success }]} />
          <Text style={styles.stationName}>{departure.nameRu}</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={AppColors.primary} style={styles.arrow} />
        <View style={styles.routeStation}>
          <View style={[styles.dot, { backgroundColor: AppColors.error }]} />
          <Text style={styles.stationName}>{destination.nameRu}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{pluralStations(stationCount)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>~ {pluralMinutes(minutes)}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    marginBottom: Spacing.lg,
  },
  lineBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineBadgeText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  lineName: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  routeStation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stationName: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  arrow: {
    marginHorizontal: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: AppColors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: AppColors.border,
  },
});
