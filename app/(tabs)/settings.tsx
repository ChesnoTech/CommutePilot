import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useSettingsStore, AlarmIntensity, AdvanceWarningStations } from '@/store/useSettingsStore';
import { useI18nStore, useT, pluralStations } from '@/i18n';
import type { Language } from '@/i18n';
import type { AccessibilityProfile } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

const WARNING_OPTIONS: AdvanceWarningStations[] = [1, 2, 3];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
];

const PROFILE_ICONS: Record<AccessibilityProfile, keyof typeof Ionicons.glyphMap> = {
  standard: 'person-outline',
  wheelchair: 'accessibility-outline',
  vision: 'eye-outline',
  elderly: 'heart-outline',
};

export default function SettingsScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const language = useI18nStore((s) => s.language);
  const setLanguage = useI18nStore((s) => s.setLanguage);
  const alarmIntensity = useSettingsStore((s) => s.alarmIntensity);
  const advanceWarningStations = useSettingsStore((s) => s.advanceWarningStations);
  const setAlarmIntensity = useSettingsStore((s) => s.setAlarmIntensity);
  const setAdvanceWarningStations = useSettingsStore((s) => s.setAdvanceWarningStations);

  // Accessibility settings
  const accessProfile = useSettingsStore((s) => s.accessibilityProfile);
  const setAccessProfile = useSettingsStore((s) => s.setAccessibilityProfile);
  const showAccessWarnings = useSettingsStore((s) => s.showAccessibilityWarnings);
  const setShowAccessWarnings = useSettingsStore((s) => s.setShowAccessibilityWarnings);
  const preferAccessible = useSettingsStore((s) => s.preferAccessibleRoutes);
  const setPreferAccessible = useSettingsStore((s) => s.setPreferAccessibleRoutes);
  const showToiletInfo = useSettingsStore((s) => s.showToiletInfo);
  const setShowToiletInfo = useSettingsStore((s) => s.setShowToiletInfo);
  const highContrast = useSettingsStore((s) => s.highContrastMode);
  const setHighContrast = useSettingsStore((s) => s.setHighContrastMode);
  const largeTouchTargets = useSettingsStore((s) => s.largeTouchTargets);
  const setLargeTouchTargets = useSettingsStore((s) => s.setLargeTouchTargets);

  const version = Constants.expoConfig?.version ?? '0.1.0';

  const intensities: { value: AlarmIntensity; label: string }[] = [
    { value: 'soft', label: t('alarmQuiet') },
    { value: 'normal', label: t('alarmNormal') },
    { value: 'loud', label: t('alarmLoud') },
  ];

  const profiles: { value: AccessibilityProfile; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'standard', label: t('profileStandard'), icon: PROFILE_ICONS.standard },
    { value: 'wheelchair', label: t('profileWheelchair'), icon: PROFILE_ICONS.wheelchair },
    { value: 'vision', label: t('profileVision'), icon: PROFILE_ICONS.vision },
    { value: 'elderly', label: t('profileElderly'), icon: PROFILE_ICONS.elderly },
  ];

  const toggleOptions: {
    label: string;
    hint: string;
    value: boolean;
    onToggle: () => void;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      label: t('showAccessWarnings'),
      hint: t('showAccessWarningsHint'),
      value: showAccessWarnings,
      onToggle: () => setShowAccessWarnings(!showAccessWarnings),
      icon: 'alert-circle-outline',
    },
    {
      label: t('preferAccessible'),
      hint: t('preferAccessibleHint'),
      value: preferAccessible,
      onToggle: () => setPreferAccessible(!preferAccessible),
      icon: 'navigate-outline',
    },
    {
      label: t('showToiletInfo'),
      hint: t('showToiletInfoHint'),
      value: showToiletInfo,
      onToggle: () => setShowToiletInfo(!showToiletInfo),
      icon: 'water-outline',
    },
    {
      label: t('highContrast'),
      hint: t('highContrastHint'),
      value: highContrast,
      onToggle: () => setHighContrast(!highContrast),
      icon: 'contrast-outline',
    },
    {
      label: t('largeTouchTargets'),
      hint: t('largeTouchTargetsHint'),
      value: largeTouchTargets,
      onToggle: () => setLargeTouchTargets(!largeTouchTargets),
      icon: 'resize-outline',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
      {/* Language section */}
      <Text style={styles.sectionLabel}>
        {t('sectionLanguage')}
      </Text>

      <View style={styles.card}>
        <View style={styles.segmentRow}>
          {LANGUAGES.map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.segmentBtn,
                language === item.value && styles.segmentBtnActive,
              ]}
              onPress={() => setLanguage(item.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: language === item.value }}
              accessibilityLabel={item.label}>
              <Text
                style={[
                  styles.segmentText,
                  language === item.value && styles.segmentTextActive,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Accessibility section */}
      <Text style={styles.sectionLabel}>{t('sectionAccessibility')}</Text>

      {/* Profile selector */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('accessibilityProfile')}</Text>
        <Text style={styles.cardHint}>{t('accessibilityProfileHint')}</Text>
        <View style={styles.profileGrid}>
          {profiles.map((p) => (
            <Pressable
              key={p.value}
              style={[
                styles.profileCard,
                accessProfile === p.value && styles.profileCardActive,
              ]}
              onPress={() => setAccessProfile(p.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: accessProfile === p.value }}
              accessibilityLabel={p.label}>
              <Ionicons
                name={p.icon}
                size={24}
                color={accessProfile === p.value ? AppColors.background : AppColors.textSecondary}
              />
              <Text
                style={[
                  styles.profileLabel,
                  accessProfile === p.value && styles.profileLabelActive,
                ]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Toggle options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('accessibilityOptions')}</Text>
        {toggleOptions.map((opt, i) => (
          <Pressable
            key={opt.label}
            style={[styles.toggleRow, i > 0 && styles.toggleRowBorder]}
            onPress={opt.onToggle}
            accessibilityRole="switch"
            accessibilityState={{ checked: opt.value }}
            accessibilityLabel={`${opt.label}: ${opt.hint}`}>
            <Ionicons
              name={opt.icon}
              size={20}
              color={opt.value ? AppColors.primary : AppColors.textMuted}
            />
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>{opt.label}</Text>
              <Text style={styles.toggleHint}>{opt.hint}</Text>
            </View>
            <View style={[styles.toggleSwitch, opt.value && styles.toggleSwitchActive]}>
              <View style={[styles.toggleKnob, opt.value && styles.toggleKnobActive]} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Alarm section */}
      <Text style={styles.sectionLabel}>{t('sectionAlarm')}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('alarmVolume')}</Text>
        <Text style={styles.cardHint}>{t('alarmVolumeHint')}</Text>
        <View style={styles.segmentRow}>
          {intensities.map((item) => (
            <Pressable
              key={item.value}
              style={[
                styles.segmentBtn,
                alarmIntensity === item.value && styles.segmentBtnActive,
              ]}
              onPress={() => setAlarmIntensity(item.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: alarmIntensity === item.value }}>
              <Text
                style={[
                  styles.segmentText,
                  alarmIntensity === item.value && styles.segmentTextActive,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('advanceWarning')}</Text>
        <Text style={styles.cardHint}>
          {t('advanceWarningHint')} ({pluralStations(advanceWarningStations)})
        </Text>
        <View style={styles.segmentRow}>
          {WARNING_OPTIONS.map((n) => (
            <Pressable
              key={n}
              style={[
                styles.segmentBtn,
                advanceWarningStations === n && styles.segmentBtnActive,
              ]}
              onPress={() => setAdvanceWarningStations(n)}
              accessibilityRole="button"
              accessibilityState={{ selected: advanceWarningStations === n }}>
              <Text
                style={[
                  styles.segmentText,
                  advanceWarningStations === n && styles.segmentTextActive,
                ]}>
                {n}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* About section */}
      <Text style={styles.sectionLabel}>{t('sectionAbout')}</Text>

      <View style={styles.card}>
        <Text style={styles.appName}>{t('appName')}</Text>
        <Text style={styles.versionText}>{t('version')} {version}</Text>
        <View style={styles.divider} />
        <Text style={styles.aboutText}>{t('appTagline')}</Text>
        <Text style={styles.developerText}>Ayoub Mohamed Samir</Text>
        <Pressable
          onPress={() => Linking.openURL('https://chesnotech.github.io/commutepilot')}
          accessibilityRole="link">
          <Text style={styles.linkText}>chesnotech.github.io/commutepilot</Text>
        </Pressable>
      </View>
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
    paddingBottom: Spacing.xxl,
  },
  sectionLabel: {
    color: AppColors.primary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  cardHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  segmentText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: AppColors.background,
    fontWeight: '700',
  },
  appName: {
    color: AppColors.primary,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  versionText: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.border,
    marginVertical: Spacing.md,
  },
  aboutText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    fontStyle: 'italic',
  },
  developerText: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
  linkText: {
    color: AppColors.primary,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  // ─── Accessibility styles ───
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  profileCard: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: Spacing.xs,
  },
  profileCardActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  profileLabel: {
    color: AppColors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileLabelActive: {
    color: AppColors.background,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  toggleRowBorder: {
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  toggleHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppColors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: AppColors.primary,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.textMuted,
  },
  toggleKnobActive: {
    backgroundColor: AppColors.background,
    alignSelf: 'flex-end',
  },
});
