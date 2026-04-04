import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useJourneyStore } from '@/store/useJourneyStore';
import { getLineById, getStationById } from '@/data/metro';
import { JourneyTemplate } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

export default function TemplatesScreen() {
  const templates = useTemplateStore((s) => s.templates);
  const removeTemplate = useTemplateStore((s) => s.removeTemplate);
  const setLine = useJourneyStore((s) => s.setLine);
  const setDeparture = useJourneyStore((s) => s.setDepartureStation);
  const setDestination = useJourneyStore((s) => s.setDestinationStation);

  const loadTemplate = (template: JourneyTemplate) => {
    setLine(template.lineId);
    setDeparture(template.departureStationId);
    setDestination(template.destinationStationId);
  };

  const confirmDelete = (template: JourneyTemplate) => {
    Alert.alert('Delete Template', `Remove "${template.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeTemplate(template.id) },
    ]);
  };

  if (templates.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="bookmark-outline" size={48} color={AppColors.textMuted} />
        <Text style={styles.emptyTitle}>No saved templates</Text>
        <Text style={styles.emptyHint}>
          Create a journey and save it as a template for one-tap access.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const line = getLineById(item.lineId);
          const dep = getStationById(item.departureStationId);
          const dest = getStationById(item.destinationStationId);
          return (
            <Pressable style={styles.card} onPress={() => loadTemplate(item)}>
              <View style={styles.cardHeader}>
                <Text style={styles.templateName}>{item.name}</Text>
                <Pressable hitSlop={8} onPress={() => confirmDelete(item)}>
                  <Ionicons name="trash-outline" size={18} color={AppColors.textMuted} />
                </Pressable>
              </View>
              <View style={styles.routeRow}>
                {line && (
                  <View style={[styles.lineBadge, { backgroundColor: line.color }]}>
                    <Text style={styles.lineBadgeText}>{line.number}</Text>
                  </View>
                )}
                <Text style={styles.routeText} numberOfLines={1}>
                  {dep?.nameRu ?? '?'} → {dest?.nameRu ?? '?'}
                </Text>
              </View>
            </Pressable>
          );
        }}
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
    padding: Spacing.md,
  },
  empty: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    color: AppColors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  emptyHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  templateName: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  lineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lineBadgeText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  routeText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    flex: 1,
  },
});
