import { useState, useCallback } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMultiLegStore } from '@/store/useMultiLegStore';
import { LegCard } from '@/components/LegCard';
import { AddLegModal } from '@/components/AddLegModal';
import { useT, pluralLegs } from '@/i18n';
import type { JourneyLeg } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

export default function MultiLegBuilderScreen() {
  const router = useRouter();
  const t = useT();
  const draftLegs = useMultiLegStore((s) => s.draftLegs);
  const addLeg = useMultiLegStore((s) => s.addLeg);
  const removeLeg = useMultiLegStore((s) => s.removeLeg);
  const moveLeg = useMultiLegStore((s) => s.moveLeg);
  const clearDraft = useMultiLegStore((s) => s.clearDraft);
  const saveTemplate = useMultiLegStore((s) => s.saveTemplate);
  const startMultiLeg = useMultiLegStore((s) => s.startMultiLeg);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const totalDuration = draftLegs.reduce((sum, leg) => sum + leg.estimatedDuration, 0);
  const totalMin = Math.ceil(totalDuration / 60);

  const handleAddLeg = useCallback(
    (leg: JourneyLeg) => {
      addLeg(leg);
      setShowAddModal(false);
    },
    [addLeg]
  );

  const handleSave = () => {
    if (!templateName.trim()) return;
    saveTemplate(templateName.trim());
    setTemplateName('');
    setShowSaveDialog(false);
    clearDraft();
    router.back();
  };

  const handleClear = () => {
    Alert.alert(t('clearRoute'), t('clearRouteConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: clearDraft },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Summary bar */}
      {draftLegs.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {pluralLegs(draftLegs.length)} · ~{totalMin} {t('min')}
          </Text>
          <Pressable hitSlop={8} onPress={handleClear}>
            <Ionicons name="trash-outline" size={18} color={AppColors.textMuted} />
          </Pressable>
        </View>
      )}

      {/* Legs list */}
      {draftLegs.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="git-merge-outline" size={40} color={AppColors.primary} />
          </View>
          <Text style={styles.emptyTitle}>{t('emptyRoute')}</Text>
          <Text style={styles.emptyHint}>
            {t('emptyRouteHint')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={draftLegs}
          keyExtractor={(_, i) => `leg-${i}`}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <LegCard
              leg={item}
              index={index}
              total={draftLegs.length}
              onMoveUp={() => moveLeg(index, index - 1)}
              onMoveDown={() => moveLeg(index, index + 1)}
              onDelete={() => removeLeg(index)}
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.connector}>
              <View style={styles.connectorDot} />
              <View style={styles.connectorLine} />
              <View style={styles.connectorDot} />
            </View>
          )}
        />
      )}

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.addLegBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={22} color={AppColors.background} />
          <Text style={styles.addLegText}>{t('addLeg')}</Text>
        </Pressable>

        {draftLegs.length >= 1 && (
          <Pressable
            style={styles.startBtn}
            onPress={() => {
              startMultiLeg();
              router.push('/active-multi-leg');
            }}>
            <Ionicons name="play" size={20} color={AppColors.background} />
            <Text style={styles.startBtnText}>{t('startRoute')}</Text>
          </Pressable>
        )}

        {draftLegs.length >= 2 && (
          <Pressable style={styles.saveBtn} onPress={() => setShowSaveDialog(true)}>
            <Ionicons name="bookmark" size={18} color={AppColors.primary} />
            <Text style={styles.saveBtnText}>{t('saveTemplate')}</Text>
          </Pressable>
        )}
      </View>

      {/* Add leg modal */}
      <AddLegModal
        visible={showAddModal}
        onAdd={handleAddLeg}
        onCancel={() => setShowAddModal(false)}
      />

      {/* Save dialog */}
      {showSaveDialog && (
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.dialogOverlay} onPress={() => setShowSaveDialog(false)}>
            <View style={styles.dialog} onStartShouldSetResponder={() => true}>
              <Text style={styles.dialogTitle}>{t('saveTemplate')}</Text>
              <Text style={styles.dialogHint}>{t('saveTemplateName')}</Text>
              <TextInput
                style={styles.dialogInput}
                placeholder={t('saveTemplatePlaceholder')}
                placeholderTextColor={AppColors.textMuted}
                value={templateName}
                onChangeText={setTemplateName}
                autoFocus
              />
              <View style={styles.dialogButtons}>
                <Pressable
                  style={styles.dialogCancel}
                  onPress={() => {
                    setTemplateName('');
                    setShowSaveDialog(false);
                  }}>
                  <Text style={styles.dialogCancelText}>{t('cancel')}</Text>
                </Pressable>
                <Pressable
                  style={[styles.dialogSave, !templateName.trim() && styles.dialogSaveDisabled]}
                  onPress={handleSave}
                  disabled={!templateName.trim()}>
                  <Text style={styles.dialogSaveText}>{t('save')}</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  summaryText: {
    color: AppColors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
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
  list: {
    padding: Spacing.md,
  },
  connector: {
    alignItems: 'center',
    marginVertical: -Spacing.xs,
    height: 20,
    justifyContent: 'center',
  },
  connectorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.textMuted,
  },
  connectorLine: {
    width: 1,
    height: 8,
    backgroundColor: AppColors.textMuted,
  },
  bottomBar: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: Spacing.sm,
  },
  addLegBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  addLegText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  startBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.accentSoft,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  saveBtnText: {
    color: AppColors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  dialogOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  dialog: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  dialogTitle: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  dialogHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  dialogInput: {
    backgroundColor: AppColors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    color: AppColors.text,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  dialogCancel: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  dialogCancelText: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
  },
  dialogSave: {
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  dialogSaveDisabled: {
    opacity: 0.35,
  },
  dialogSaveText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
