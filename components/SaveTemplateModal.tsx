import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface SaveTemplateModalProps {
  visible: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function SaveTemplateModal({ visible, onSave, onCancel }: SaveTemplateModalProps) {
  const t = useT();
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  const handleCancel = () => {
    setName('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{t('saveRoute')}</Text>
          <Text style={styles.hint}>{t('saveRouteHint')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('saveRoutePlaceholder')}
            placeholderTextColor={AppColors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <View style={styles.buttons}>
            <Pressable style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </Pressable>
            <Pressable
              style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}>
              <Text style={styles.saveText}>{t('save')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
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
  title: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  hint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: AppColors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    color: AppColors.text,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  cancelBtn: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  cancelText: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
  },
  saveBtn: {
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  saveBtnDisabled: {
    opacity: 0.35,
  },
  saveText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
