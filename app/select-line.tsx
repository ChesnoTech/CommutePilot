import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { metroLines } from '@/data/metro';
import { MetroLine } from '@/data/types';
import { LineCard } from '@/components/LineCard';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/layout';

export default function SelectLineScreen() {
  const router = useRouter();
  const t = useT();
  const selectedLineId = useJourneyStore((s) => s.selectedLineId);
  const setLine = useJourneyStore((s) => s.setLine);

  const metroSection = metroLines.filter((l) => !l.id.startsWith('D'));
  const mcdSection = metroLines.filter((l) => l.id.startsWith('D'));

  const sections: { title: string; data: MetroLine[] }[] = [
    { title: t('sectionMetroLines'), data: metroSection },
    { title: t('sectionMCDLines'), data: mcdSection },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
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
    paddingTop: Spacing.sm,
    paddingBottom: 120,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  sectionTitle: {
    color: AppColors.primary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
