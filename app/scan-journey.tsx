import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { decodeTemplate } from '@/services/JourneyShare';
import { useMultiLegStore } from '@/store/useMultiLegStore';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

export default function ScanJourneyScreen() {
  const router = useRouter();
  const t = useT();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const addLeg = useMultiLegStore((s) => s.addLeg);
  const clearDraft = useMultiLegStore((s) => s.clearDraft);
  const saveTemplate = useMultiLegStore((s) => s.saveTemplate);

  function handleQrData(data: string) {
    if (scanned) return;
    setScanned(true);

    const result = decodeTemplate(data);
    if (!result) {
      Alert.alert(t('appName'), t('invalidQR'), [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
      return;
    }

    // Load the shared route into draft and save as template
    clearDraft();
    for (const leg of result.legs) {
      addLeg(leg);
    }
    saveTemplate(result.name);

    Alert.alert(
      t('appName'),
      `${t('routeReceived')} "${result.name}" (${result.legs.length})`,
      [{
        text: 'OK',
        onPress: () => {
          clearDraft();
          for (const leg of result.legs) {
            addLeg(leg);
          }
          router.replace('/multi-leg-builder');
        },
      }]
    );
  }

  function handleManualSubmit() {
    if (!manualCode.trim()) return;
    handleQrData(manualCode.trim());
  }

  // Manual code entry fallback
  if (showManual) {
    return (
      <View style={styles.container}>
        <View style={styles.manualWrap}>
          <Ionicons name="code-outline" size={40} color={AppColors.primary} />
          <Text style={styles.manualTitle}>{t('pasteCodeHint')}</Text>
          <Text style={styles.manualHint}>{t('codeStartsWith')}</Text>
          <TextInput
            style={styles.manualInput}
            placeholder="cp1:..."
            placeholderTextColor={AppColors.textMuted}
            value={manualCode}
            onChangeText={setManualCode}
            multiline
            autoFocus
          />
          <Pressable
            style={[styles.submitBtn, !manualCode.trim() && styles.submitBtnDisabled]}
            onPress={handleManualSubmit}
            disabled={!manualCode.trim()}>
            <Text style={styles.submitBtnText}>{t('load')}</Text>
          </Pressable>
          <Pressable onPress={() => setShowManual(false)}>
            <Text style={styles.switchText}>{t('scanQR')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Camera permission handling
  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permWrap}>
          <Ionicons name="camera-outline" size={48} color={AppColors.primary} />
          <Text style={styles.permTitle}>{t('needCamera')}</Text>
          <Text style={styles.permHint}>{t('needCameraHint')}</Text>
          <Pressable style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>{t('allowCamera')}</Text>
          </Pressable>
          <Pressable onPress={() => setShowManual(true)}>
            <Text style={styles.switchText}>{t('enterCodeManually')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={(result) => handleQrData(result.data)}>
        {/* Scan frame overlay */}
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.scanHint}>{t('aimCamera')}</Text>
        </View>
      </CameraView>

      {/* Manual entry button */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.manualBtn} onPress={() => setShowManual(true)}>
          <Ionicons name="code-outline" size={18} color={AppColors.primary} />
          <Text style={styles.manualBtnText}>{t('enterCode')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: AppColors.primary,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  scanHint: {
    color: '#fff',
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.lg,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 4,
  },
  bottomBar: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: AppColors.background,
  },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  manualBtnText: {
    color: AppColors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  permWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  permTitle: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  permHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  permBtn: {
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  permBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  manualWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  manualTitle: {
    color: AppColors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  manualHint: {
    color: AppColors.textMuted,
    fontSize: FontSize.sm,
  },
  manualInput: {
    width: '100%',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    color: AppColors.text,
    fontSize: FontSize.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
  },
  submitBtnDisabled: {
    opacity: 0.35,
  },
  submitBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  switchText: {
    color: AppColors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
});
