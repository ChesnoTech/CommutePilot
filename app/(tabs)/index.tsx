import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLineById, getStationById } from '@/data/metro';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { JourneySummary } from '@/components/JourneySummary';
import { SaveTemplateModal } from '@/components/SaveTemplateModal';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

export default function JourneyScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLineId = useJourneyStore((s) => s.selectedLineId);
  const departureStationId = useJourneyStore((s) => s.departureStationId);
  const destinationStationId = useJourneyStore((s) => s.destinationStationId);
  const clearJourney = useJourneyStore((s) => s.clearJourney);
  const addTemplate = useTemplateStore((s) => s.addTemplate);

  const line = selectedLineId ? getLineById(selectedLineId) : null;
  const departure = departureStationId ? getStationById(departureStationId) : null;
  const destination = destinationStationId ? getStationById(destinationStationId) : null;
  const journeyComplete = line && departure && destination;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>CommutePilot</Text>
      <Text style={styles.subtitle}>Set your commute. Sleep on the metro.</Text>

      {/* Line selector */}
      <Pressable
        style={styles.selectorBtn}
        onPress={() => router.push('/select-line')}>
        {line ? (
          <View style={styles.selectedRow}>
            <View style={[styles.lineDot, { backgroundColor: line.color }]} />
            <Text style={styles.selectedText}>
              {line.number} {line.nameRu}
            </Text>
          </View>
        ) : (
          <View style={styles.placeholderRow}>
            <Ionicons name="git-branch-outline" size={20} color={AppColors.textMuted} />
            <Text style={styles.placeholderText}>Select metro line</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={AppColors.textMuted} />
      </Pressable>

      {/* Departure selector */}
      <Pressable
        style={[styles.selectorBtn, !line && styles.selectorDisabled]}
        disabled={!line}
        onPress={() => router.push({ pathname: '/select-station', params: { type: 'departure' } })}>
        {departure ? (
          <View style={styles.selectedRow}>
            <Ionicons name="radio-button-on" size={16} color={AppColors.success} />
            <Text style={styles.selectedText}>{departure.nameRu}</Text>
          </View>
        ) : (
          <View style={styles.placeholderRow}>
            <Ionicons name="location-outline" size={20} color={AppColors.textMuted} />
            <Text style={styles.placeholderText}>Departure station</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={AppColors.textMuted} />
      </Pressable>

      {/* Destination selector */}
      <Pressable
        style={[styles.selectorBtn, !line && styles.selectorDisabled]}
        disabled={!line}
        onPress={() => router.push({ pathname: '/select-station', params: { type: 'destination' } })}>
        {destination ? (
          <View style={styles.selectedRow}>
            <Ionicons name="flag" size={16} color={AppColors.primary} />
            <Text style={styles.selectedText}>{destination.nameRu}</Text>
          </View>
        ) : (
          <View style={styles.placeholderRow}>
            <Ionicons name="flag-outline" size={20} color={AppColors.textMuted} />
            <Text style={styles.placeholderText}>Destination station</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={AppColors.textMuted} />
      </Pressable>

      {/* Journey summary */}
      {journeyComplete && (
        <View style={styles.summarySection}>
          <JourneySummary
            lineId={selectedLineId!}
            departureStationId={departureStationId!}
            destinationStationId={destinationStationId!}
          />
          <View style={styles.actionRow}>
            <Pressable style={styles.saveBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="bookmark-outline" size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Save Template</Text>
            </Pressable>
            <Pressable style={styles.clearBtn} onPress={clearJourney}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </Pressable>
          </View>
        </View>
      )}

      <SaveTemplateModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={(name) => {
          addTemplate(name, selectedLineId!, departureStationId!, destinationStationId!);
          setModalVisible(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    padding: Spacing.md,
    paddingTop: Spacing.xl,
  },
  title: {
    color: AppColors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  selectorDisabled: {
    opacity: 0.4,
  },
  placeholderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  placeholderText: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  selectedText: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  lineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  summarySection: {
    marginTop: Spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  clearBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  clearBtnText: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
  },
});
