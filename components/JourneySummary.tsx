import { StyleSheet, Text, View } from 'react-native';
import { getLineById, getStationById, calculateTravelTime, getStationCount } from '@/data/metro';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface JourneySummaryProps {
  lineId: string;
  departureStationId: string;
  destinationStationId: string;
}

export function JourneySummary({ lineId, departureStationId, destinationStationId }: JourneySummaryProps) {
  const line = getLineById(lineId);
  const departure = getStationById(departureStationId);
  const destination = getStationById(destinationStationId);

  if (!line || !departure || !destination) return null;

  const travelTime = calculateTravelTime(lineId, departureStationId, destinationStationId);
  const stationCount = getStationCount(lineId, departureStationId, destinationStationId);
  const minutes = Math.ceil(travelTime / 60);

  return (
    <View style={styles.container}>
      <View style={[styles.lineBadge, { backgroundColor: line.color }]}>
        <Text style={styles.lineBadgeText}>{line.number}</Text>
      </View>
      <View style={styles.route}>
        <Text style={styles.stationName}>{departure.nameRu}</Text>
        <Text style={styles.arrow}>  ➜  </Text>
        <Text style={styles.stationName}>{destination.nameRu}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailText}>
          {stationCount} {stationCount === 1 ? 'station' : 'stations'} ~ {minutes} min
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  lineBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  lineBadgeText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stationName: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  arrow: {
    color: AppColors.accent,
    fontSize: FontSize.lg,
  },
  details: {
    marginTop: Spacing.md,
  },
  detailText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
  },
});
