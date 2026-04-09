/**
 * AccessibilityWarning — Modal that shows accessibility issues for a route.
 * Displayed before starting a journey when the user has an accessibility profile.
 */

import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useT } from '@/i18n';
import type { AccessibilityCheck, AccessibilityIssue } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface Props {
  visible: boolean;
  check: AccessibilityCheck;
  onContinue: () => void;
  onCancel: () => void;
}

const ISSUE_ICONS: Record<AccessibilityIssue['type'], keyof typeof Ionicons.glyphMap> = {
  no_elevator: 'arrow-up-outline',
  no_accessible_entrance: 'enter-outline',
  no_toilet: 'water-outline',
  no_tactile: 'hand-left-outline',
  no_level_boarding: 'warning-outline',
};

const ISSUE_LABEL_KEYS: Record<AccessibilityIssue['type'], string> = {
  no_elevator: 'noElevator',
  no_accessible_entrance: 'noAccessibleEntrance',
  no_toilet: 'noToilet',
  no_tactile: 'noTactileGuides',
  no_level_boarding: 'noLevelBoarding',
};

const SEVERITY_COLORS: Record<AccessibilityIssue['severity'], string> = {
  critical: AppColors.error,
  warning: AppColors.warning,
  info: AppColors.textMuted,
};

export default function AccessibilityWarning({ visible, check, onContinue, onCancel }: Props) {
  const t = useT();

  const criticalCount = check.warnings.filter((w) => w.severity === 'critical').length;
  const warningCount = check.warnings.filter((w) => w.severity === 'warning').length;
  const infoCount = check.warnings.filter((w) => w.severity === 'info').length;

  // Deduplicate: group by station
  const byStation = new Map<string, AccessibilityIssue[]>();
  for (const w of check.warnings) {
    const existing = byStation.get(w.stationId) || [];
    existing.push(w);
    byStation.set(w.stationId, existing);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      accessibilityViewIsModal>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.headerIconWrap,
                { backgroundColor: check.passable ? `${AppColors.warning}20` : `${AppColors.error}20` },
              ]}>
              <Ionicons
                name={check.passable ? 'alert-outline' : 'close-circle-outline'}
                size={28}
                color={check.passable ? AppColors.warning : AppColors.error}
              />
            </View>
            <Text
              style={styles.headerTitle}
              accessibilityRole="header">
              {t('accessWarningTitle' as any)}
            </Text>
            <Text style={styles.headerSubtitle}>
              {!check.passable ? t('accessWarningCritical' as any) : t('accessWarningInfo' as any)}
            </Text>
          </View>

          {/* Summary badges */}
          <View style={styles.summaryRow}>
            {criticalCount > 0 && (
              <View style={[styles.badge, { backgroundColor: `${AppColors.error}20` }]}>
                <Ionicons name="close-circle" size={14} color={AppColors.error} />
                <Text style={[styles.badgeText, { color: AppColors.error }]}>{criticalCount}</Text>
              </View>
            )}
            {warningCount > 0 && (
              <View style={[styles.badge, { backgroundColor: `${AppColors.warning}20` }]}>
                <Ionicons name="alert-circle" size={14} color={AppColors.warning} />
                <Text style={[styles.badgeText, { color: AppColors.warning }]}>{warningCount}</Text>
              </View>
            )}
            {infoCount > 0 && (
              <View style={[styles.badge, { backgroundColor: `${AppColors.textMuted}20` }]}>
                <Ionicons name="information-circle" size={14} color={AppColors.textMuted} />
                <Text style={[styles.badgeText, { color: AppColors.textMuted }]}>{infoCount}</Text>
              </View>
            )}
          </View>

          {/* Issues list */}
          <ScrollView
            style={styles.issueList}
            contentContainerStyle={styles.issueListContent}
            showsVerticalScrollIndicator={false}>
            {Array.from(byStation.entries()).map(([stationId, issues]) => (
              <View
                key={stationId}
                style={styles.stationGroup}
                accessible
                accessibilityLabel={`${issues[0].stationName}: ${issues.map((i) => t(ISSUE_LABEL_KEYS[i.type] as any)).join(', ')}`}>
                <Text style={styles.stationName}>{issues[0].stationName}</Text>
                {issues.map((issue, idx) => (
                  <View key={idx} style={styles.issueRow}>
                    <Ionicons
                      name={ISSUE_ICONS[issue.type]}
                      size={16}
                      color={SEVERITY_COLORS[issue.severity]}
                    />
                    <Text style={[styles.issueText, { color: SEVERITY_COLORS[issue.severity] }]}>
                      {t(ISSUE_LABEL_KEYS[issue.type] as any)}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Pressable
              style={styles.cancelBtn}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={t('cancelRoute' as any)}>
              <Text style={styles.cancelBtnText}>{t('cancelRoute' as any)}</Text>
            </Pressable>
            <Pressable
              style={[
                styles.continueBtn,
                !check.passable && styles.continueBtnDanger,
              ]}
              onPress={onContinue}
              accessibilityRole="button"
              accessibilityLabel={t('continueAnyway' as any)}>
              <Text style={styles.continueBtnText}>{t('continueAnyway' as any)}</Text>
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
    width: '100%',
    maxHeight: '80%',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  header: {
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  issueList: {
    maxHeight: 250,
  },
  issueListContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  stationGroup: {
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: AppColors.background,
    borderRadius: BorderRadius.sm,
  },
  stationName: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  issueText: {
    fontSize: FontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  continueBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
  },
  continueBtnDanger: {
    backgroundColor: AppColors.error,
  },
  continueBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
