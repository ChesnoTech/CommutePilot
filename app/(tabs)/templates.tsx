import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useMultiLegStore } from '@/store/useMultiLegStore';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useActiveJourneyStore } from '@/store/useActiveJourneyStore';
import { getLineById, getStationById, getStationCount, calculateTravelTime } from '@/data/metro';
import { JourneyTemplate } from '@/data/types';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

const LEG_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  metro: 'subway-outline',
  bus: 'bus-outline',
  walk: 'walk-outline',
  taxi: 'car-outline',
};

export default function TemplatesScreen() {
  const router = useRouter();
  const t = useT();
  const templates = useTemplateStore((s) => s.templates);
  const removeTemplate = useTemplateStore((s) => s.removeTemplate);
  const renameTemplate = useTemplateStore((s) => s.renameTemplate);
  const multiLegTemplates = useMultiLegStore((s) => s.templates);
  const deleteMultiLeg = useMultiLegStore((s) => s.deleteTemplate);
  const loadMultiLeg = useMultiLegStore((s) => s.loadTemplate);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const setLine = useJourneyStore((s) => s.setLine);
  const setDeparture = useJourneyStore((s) => s.setDepartureStation);
  const setDestination = useJourneyStore((s) => s.setDestinationStation);
  const startJourney = useActiveJourneyStore((s) => s.startJourney);

  const loadTemplate = (template: JourneyTemplate) => {
    setLine(template.lineId);
    setDeparture(template.departureStationId);
    setDestination(template.destinationStationId);
    router.navigate('/(tabs)');
  };

  const confirmDelete = (template: JourneyTemplate) => {
    Alert.alert(t('deleteRoute'), `${t('delete')} "${template.name}"?`, [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => removeTemplate(template.id) },
    ]);
  };

  const confirmDeleteMultiLeg = (id: string, name: string) => {
    Alert.alert(t('deleteRoute'), `${t('delete')} "${name}"?`, [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => deleteMultiLeg(id) },
    ]);
  };

  const hasAnyTemplates = templates.length > 0 || multiLegTemplates.length > 0;

  if (!hasAnyTemplates) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="layers-outline" size={40} color={AppColors.primary} />
        </View>
        <Text style={styles.emptyTitle}>{t('noSavedTemplates')}</Text>
        <Text style={styles.emptyHint}>
          {t('noSavedTemplatesHint')}
        </Text>
        <Pressable
          style={styles.multiLegBtn}
          onPress={() => router.push('/multi-leg-builder')}>
          <Ionicons name="git-merge-outline" size={18} color={AppColors.background} />
          <Text style={styles.multiLegBtnText}>{t('createMultiLeg')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Action buttons row */}
            <View style={styles.topActions}>
              <Pressable
                style={styles.topActionBtn}
                onPress={() => router.push('/multi-leg-builder')}>
                <Ionicons name="git-merge-outline" size={18} color={AppColors.primary} />
                <Text style={styles.topActionText}>{t('createMultiLeg')}</Text>
              </Pressable>
              <Pressable
                style={styles.topActionBtn}
                onPress={() => router.push('/scan-journey')}>
                <Ionicons name="qr-code-outline" size={18} color={AppColors.success} />
                <Text style={[styles.topActionText, { color: AppColors.success }]}>
                  {t('receive')}
                </Text>
              </Pressable>
            </View>

            {/* Multi-leg templates */}
            {multiLegTemplates.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>{t('sectionMultiLeg')}</Text>
                {multiLegTemplates.map((ml) => {
                  const totalMin = Math.ceil(
                    ml.legs.reduce((s, l) => s + l.estimatedDuration, 0) / 60
                  );
                  return (
                    <Pressable
                      key={ml.id}
                      style={styles.mlCard}
                      onPress={() => {
                        loadMultiLeg(ml.id);
                        router.push('/multi-leg-builder');
                      }}>
                      <View style={styles.mlCardContent}>
                        <Text style={styles.templateName}>{ml.name}</Text>
                        <View style={styles.mlLegIcons}>
                          {ml.legs.map((leg, i) => (
                            <View key={i} style={styles.mlLegIcon}>
                              <Ionicons
                                name={LEG_ICONS[leg.type]}
                                size={14}
                                color={AppColors.textSecondary}
                              />
                              {i < ml.legs.length - 1 && (
                                <Ionicons name="arrow-forward" size={10} color={AppColors.textMuted} />
                              )}
                            </View>
                          ))}
                        </View>
                        <Text style={styles.metaText}>
                          {ml.legs.length} {t('legAbbr')} · ~{totalMin} {t('min')}
                        </Text>
                      </View>
                      <View style={styles.cardActions}>
                        <Pressable
                          hitSlop={16}
                          onPress={() => router.push({ pathname: '/share-journey', params: { type: 'multileg', id: ml.id } })}>
                          <Ionicons name="share-outline" size={18} color={AppColors.primary} />
                        </Pressable>
                        <Pressable
                          hitSlop={16}
                          onPress={() => confirmDeleteMultiLeg(ml.id, ml.name)}>
                          <Ionicons name="close-circle-outline" size={18} color={AppColors.textMuted} />
                        </Pressable>
                      </View>
                    </Pressable>
                  );
                })}
              </>
            )}

            {/* Metro templates header */}
            {templates.length > 0 && (
              <Text style={styles.sectionLabel}>{t('sectionMetro')}</Text>
            )}
          </>
        }
        renderItem={({ item }) => {
          const line = getLineById(item.lineId);
          const dep = getStationById(item.departureStationId);
          const dest = getStationById(item.destinationStationId);
          const stations = getStationCount(item.lineId, item.departureStationId, item.destinationStationId);
          const time = Math.ceil(calculateTravelTime(item.lineId, item.departureStationId, item.destinationStationId) / 60);
          return (
            <Pressable style={styles.card} onPress={() => loadTemplate(item)}>
              <View style={styles.cardLeft}>
                {line && (
                  <View style={[styles.lineStrip, { backgroundColor: line.color }]} />
                )}
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  {editingId === item.id ? (
                    <TextInput
                      style={styles.templateNameInput}
                      value={editName}
                      onChangeText={setEditName}
                      autoFocus
                      selectTextOnFocus
                      onBlur={() => {
                        if (editName.trim()) renameTemplate(item.id, editName);
                        setEditingId(null);
                      }}
                      onSubmitEditing={() => {
                        if (editName.trim()) renameTemplate(item.id, editName);
                        setEditingId(null);
                      }}
                    />
                  ) : (
                    <Pressable
                      style={styles.templateNameWrap}
                      onLongPress={() => {
                        setEditingId(item.id);
                        setEditName(item.name);
                      }}>
                      <Text style={styles.templateName}>{item.name}</Text>
                    </Pressable>
                  )}
                  <View style={styles.cardActions}>
                    <Pressable
                      hitSlop={8}
                      style={styles.quickStartBtn}
                      onPress={() => {
                        startJourney(item.lineId, item.departureStationId, item.destinationStationId);
                        router.push('/active-journey');
                      }}>
                      <Ionicons name="play" size={14} color={AppColors.background} />
                    </Pressable>
                    <Pressable
                      hitSlop={8}
                      onPress={() => router.push({ pathname: '/share-journey', params: { type: 'metro', id: item.id } })}>
                      <Ionicons name="share-outline" size={18} color={AppColors.primary} />
                    </Pressable>
                    <Pressable hitSlop={12} onPress={() => confirmDelete(item)}>
                      <Ionicons name="close-circle-outline" size={20} color={AppColors.textMuted} />
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.routeText} numberOfLines={1}>
                  {dep?.nameRu ?? '?'}  →  {dest?.nameRu ?? '?'}
                </Text>
                <Text style={styles.metaText}>
                  {stations} {t('stAbbr')} ~ {time} {t('min')}
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
    padding: Spacing.xxl,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AppColors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  emptyHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardLeft: {
    width: 5,
  },
  lineStrip: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickStartBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateNameWrap: {
    flex: 1,
  },
  templateName: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  templateNameInput: {
    flex: 1,
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.primary,
    paddingVertical: 0,
    marginRight: Spacing.sm,
  },
  routeText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  metaText: {
    color: AppColors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  multiLegBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  multiLegBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  multiLegTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  multiLegTopBtnText: {
    flex: 1,
    color: AppColors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  sectionLabel: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  mlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  mlCardContent: {
    flex: 1,
  },
  mlLegIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  mlLegIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  topActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  topActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  topActionText: {
    color: AppColors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
