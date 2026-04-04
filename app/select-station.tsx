import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLineById } from '@/data/metro';
import { StationItem } from '@/components/StationItem';
import { useJourneyStore } from '@/store/useJourneyStore';
import { AppColors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/layout';

export default function SelectStationScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'departure' | 'destination' }>();
  const selectedLineId = useJourneyStore((s) => s.selectedLineId);
  const departureStationId = useJourneyStore((s) => s.departureStationId);
  const destinationStationId = useJourneyStore((s) => s.destinationStationId);
  const setDeparture = useJourneyStore((s) => s.setDepartureStation);
  const setDestination = useJourneyStore((s) => s.setDestinationStation);

  const line = selectedLineId ? getLineById(selectedLineId) : null;

  if (!line) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Select a line first</Text>
      </View>
    );
  }

  const currentSelection = type === 'departure' ? departureStationId : destinationStationId;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: line.color }]}>
        <Text style={[styles.headerLine, { color: line.color }]}>
          {line.number} {line.nameRu}
        </Text>
        <Text style={styles.headerType}>
          Select {type === 'departure' ? 'departure' : 'destination'} station
        </Text>
      </View>
      <FlatList
        data={line.stations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StationItem
            station={item}
            selected={item.id === currentSelection}
            onPress={() => {
              if (type === 'departure') {
                setDeparture(item.id);
              } else {
                setDestination(item.id);
              }
              router.back();
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    padding: Spacing.md,
    borderBottomWidth: 2,
  },
  headerLine: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  headerType: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  empty: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
  },
});
