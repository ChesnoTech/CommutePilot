import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLineById } from '@/data/metro';
import { StationItem } from '@/components/StationItem';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/layout';

export default function SelectStationScreen() {
  const router = useRouter();
  const t = useT();
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
        <Text style={styles.emptyText}>{t('selectLineFirst')}</Text>
      </View>
    );
  }

  const currentSelection = type === 'departure' ? departureStationId : destinationStationId;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: line.color }]}>
        <View style={styles.headerRow}>
          <View style={[styles.lineBadge, { backgroundColor: line.color }]}>
            <Text style={styles.lineBadgeText}>{line.number}</Text>
          </View>
          <Text style={styles.headerLine}>{line.nameRu}</Text>
        </View>
        <Text style={styles.headerType}>
          {type === 'departure' ? t('selectDepartureStation') : t('selectDestinationStation')}
        </Text>
      </View>
      <FlatList
        data={line.stations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StationItem
            station={item}
            lineColor={line.color}
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
    paddingLeft: Spacing.lg,
    borderBottomWidth: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
  headerLine: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  headerType: {
    color: AppColors.textMuted,
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
    color: AppColors.textMuted,
    fontSize: FontSize.md,
  },
});
