import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { metroLines } from '@/data/metro';
import { LineCard } from '@/components/LineCard';
import { useJourneyStore } from '@/store/useJourneyStore';
import { AppColors } from '@/constants/colors';
import { Spacing } from '@/constants/layout';

export default function SelectLineScreen() {
  const router = useRouter();
  const selectedLineId = useJourneyStore((s) => s.selectedLineId);
  const setLine = useJourneyStore((s) => s.setLine);

  return (
    <View style={styles.container}>
      <FlatList
        data={metroLines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LineCard
            line={item}
            selected={item.id === selectedLineId}
            onPress={() => {
              setLine(item.id);
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
  list: {
    paddingVertical: Spacing.sm,
  },
});
