import { useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useMultiLegStore } from '@/store/useMultiLegStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { encodeTemplate, encodeMetroRoute } from '@/services/JourneyShare';
import { getLineById, getStationById, calculateTravelTime } from '@/data/metro';
import { useT } from '@/i18n';
import type { JourneyLeg } from '@/data/types';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

const LEG_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  metro: 'subway-outline',
  bus: 'bus-outline',
  walk: 'walk-outline',
  taxi: 'car-outline',
};

export default function ShareJourneyScreen() {
  const router = useRouter();
  const t = useT();
  const params = useLocalSearchParams<{ type: 'metro' | 'multileg'; id?: string }>();

  // Get template data
  const metroTemplates = useTemplateStore((s) => s.templates);
  const multiLegTemplates = useMultiLegStore((s) => s.templates);
  const draftLegs = useMultiLegStore((s) => s.draftLegs);

  let qrData = '';
  let templateName = '';
  let legs: JourneyLeg[] = [];

  if (params.type === 'metro' && params.id) {
    const tmpl = metroTemplates.find((t) => t.id === params.id);
    if (tmpl) {
      templateName = tmpl.name;
      const duration = calculateTravelTime(tmpl.lineId, tmpl.departureStationId, tmpl.destinationStationId);
      qrData = encodeMetroRoute(tmpl.name, tmpl.lineId, tmpl.departureStationId, tmpl.destinationStationId, duration);
      legs = [{
        type: 'metro',
        lineId: tmpl.lineId,
        departureStationId: tmpl.departureStationId,
        destinationStationId: tmpl.destinationStationId,
        estimatedDuration: duration,
      }];
    }
  } else if (params.type === 'multileg' && params.id) {
    const tmpl = multiLegTemplates.find((t) => t.id === params.id);
    if (tmpl) {
      templateName = tmpl.name;
      legs = tmpl.legs;
      qrData = encodeTemplate(tmpl.name, tmpl.legs);
    }
  } else if (params.type === 'multileg' && draftLegs.length > 0) {
    templateName = t('draftRoute');
    legs = draftLegs;
    qrData = encodeTemplate(t('sharedRoute'), draftLegs);
  }

  const totalMin = Math.ceil(legs.reduce((s, l) => s + l.estimatedDuration, 0) / 60);

  const handleShareText = async () => {
    try {
      await Share.share({
        message: `${t('appName')}: ${templateName}\n${qrData}`,
        title: `${t('appName')} - ${templateName}`,
      });
    } catch {
      // Share cancelled
    }
  };

  if (!qrData) {
    return (
      <View style={styles.empty}>
        <Ionicons name="alert-circle-outline" size={40} color={AppColors.textMuted} />
        <Text style={styles.emptyText}>{t('noRouteToShare')}</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>{t('back')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Route info */}
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{templateName}</Text>
        <View style={styles.legRow}>
          {legs.map((leg, i) => (
            <View key={i} style={styles.legIcon}>
              <Ionicons name={LEG_ICONS[leg.type]} size={16} color={AppColors.textSecondary} />
              {i < legs.length - 1 && (
                <Ionicons name="arrow-forward" size={10} color={AppColors.textMuted} />
              )}
            </View>
          ))}
        </View>
        <Text style={styles.routeMeta}>
          {legs.length} {t('legAbbr')} · ~{totalMin} {t('min')}
        </Text>
      </View>

      {/* QR Code */}
      <View style={styles.qrWrap}>
        <View style={styles.qrCard}>
          <QRCode
            value={qrData}
            size={220}
            backgroundColor="#fff"
            color="#0d0d1a"
          />
        </View>
        <Text style={styles.qrHint}>{t('showQRHint')}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.shareBtn} onPress={handleShareText}>
          <Ionicons name="share-outline" size={20} color={AppColors.background} />
          <Text style={styles.shareBtnText}>{t('sendAsText')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    padding: Spacing.lg,
  },
  empty: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
  },
  backBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.full,
  },
  backBtnText: {
    color: AppColors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  routeInfo: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  routeName: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  legRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  legIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  routeMeta: {
    color: AppColors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  qrWrap: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    elevation: 4,
  },
  qrHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  shareBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
