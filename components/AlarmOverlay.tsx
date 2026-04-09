import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { AlarmPhase } from '@/data/types';
import { t, pluralStations } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface AlarmOverlayProps {
  phase: AlarmPhase;
  stationName: string;
  remainingStations: number;
  onDismiss: () => void;
}

export function AlarmOverlay({ phase, stationName, remainingStations, onDismiss }: AlarmOverlayProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (phase === 'none') {
      cancelAnimation(opacity);
      opacity.value = 0;
      return;
    }

    if (phase === 'gentle') {
      opacity.value = withRepeat(
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else if (phase === 'warning') {
      opacity.value = withRepeat(
        withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else if (phase === 'full') {
      opacity.value = withRepeat(
        withTiming(0.7, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [phase, opacity]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (phase === 'none') return null;

  const overlayColor =
    phase === 'gentle' ? AppColors.primary :
    phase === 'warning' ? '#f59e0b' :
    '#ef4444';

  const message =
    phase === 'gentle' ? `${t('alarmRemaining')} ${pluralStations(remainingStations)}` :
    phase === 'warning' ? t('alarmNextIsYours') :
    t('alarmYourStation');

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[styles.overlay, { backgroundColor: overlayColor }, overlayStyle]}
        pointerEvents="none"
      />

      <View style={styles.content} pointerEvents="box-none">
        <View style={[styles.banner, { borderColor: overlayColor }]}>
          <Text style={[styles.message, phase === 'full' && styles.messageFull]}>
            {message}
          </Text>
          <Text style={styles.stationName}>{stationName}</Text>

          {phase === 'full' && (
            <Pressable style={styles.dismissBtn} onPress={onDismiss}>
              <Text style={styles.dismissText}>{t('alarmDismiss')}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  banner: {
    backgroundColor: 'rgba(13, 13, 26, 0.95)',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    padding: Spacing.xl,
    alignItems: 'center',
    minWidth: 280,
  },
  message: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  messageFull: {
    fontSize: FontSize.xxl,
    color: '#ef4444',
  },
  stationName: {
    color: AppColors.primary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  dismissBtn: {
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
  },
  dismissText: {
    color: AppColors.background,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
});
