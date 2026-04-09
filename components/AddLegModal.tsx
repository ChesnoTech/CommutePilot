import { useState, useCallback } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { JourneyLeg, LegType } from '@/data/types';
import { metroLines, getLineById, calculateTravelTime } from '@/data/metro';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface AddLegModalProps {
  visible: boolean;
  onAdd: (leg: JourneyLeg) => void;
  onCancel: () => void;
}

type Step = 'type' | 'details';

const LEG_TYPE_DEFS: { type: LegType; icon: keyof typeof Ionicons.glyphMap; labelKey: string; color: string }[] = [
  { type: 'metro', icon: 'subway-outline', labelKey: 'legMetro', color: '#e74c3c' },
  { type: 'bus', icon: 'bus-outline', labelKey: 'legBus', color: '#3498db' },
  { type: 'walk', icon: 'walk-outline', labelKey: 'legWalk', color: '#4ade80' },
  { type: 'taxi', icon: 'car-outline', labelKey: 'legTaxi', color: '#f39c12' },
];

export function AddLegModal({ visible, onAdd, onCancel }: AddLegModalProps) {
  const t = useT();
  const [step, setStep] = useState<Step>('type');
  const [legType, setLegType] = useState<LegType>('metro');

  // Metro fields
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [depStationId, setDepStationId] = useState<string | null>(null);
  const [destStationId, setDestStationId] = useState<string | null>(null);

  // Bus fields
  const [busRoute, setBusRoute] = useState('');
  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [busStops, setBusStops] = useState('');
  const [busDuration, setBusDuration] = useState('');

  // Walk fields
  const [walkFrom, setWalkFrom] = useState('');
  const [walkTo, setWalkTo] = useState('');
  const [walkDistance, setWalkDistance] = useState('');
  const [walkDuration, setWalkDuration] = useState('');

  // Taxi fields
  const [taxiFrom, setTaxiFrom] = useState('');
  const [taxiTo, setTaxiTo] = useState('');
  const [taxiDuration, setTaxiDuration] = useState('');

  const reset = useCallback(() => {
    setStep('type');
    setLegType('metro');
    setSelectedLineId(null);
    setDepStationId(null);
    setDestStationId(null);
    setBusRoute('');
    setBusFrom('');
    setBusTo('');
    setBusStops('');
    setBusDuration('');
    setWalkFrom('');
    setWalkTo('');
    setWalkDistance('');
    setWalkDuration('');
    setTaxiFrom('');
    setTaxiTo('');
    setTaxiDuration('');
  }, []);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleSelectType = (type: LegType) => {
    setLegType(type);
    setStep('details');
  };

  const canAdd = (): boolean => {
    switch (legType) {
      case 'metro':
        return !!selectedLineId && !!depStationId && !!destStationId;
      case 'bus':
        return !!busRoute.trim() && !!busFrom.trim() && !!busTo.trim();
      case 'walk':
        return !!walkFrom.trim() && !!walkTo.trim();
      case 'taxi':
        return !!taxiFrom.trim() && !!taxiTo.trim();
    }
  };

  const handleAdd = () => {
    let leg: JourneyLeg;
    switch (legType) {
      case 'metro':
        leg = {
          type: 'metro',
          lineId: selectedLineId!,
          departureStationId: depStationId!,
          destinationStationId: destStationId!,
          estimatedDuration: calculateTravelTime(selectedLineId!, depStationId!, destStationId!),
        };
        break;
      case 'bus':
        leg = {
          type: 'bus',
          routeNumber: busRoute.trim(),
          fromStop: busFrom.trim(),
          toStop: busTo.trim(),
          stopCount: parseInt(busStops, 10) || 0,
          estimatedDuration: (parseInt(busDuration, 10) || 15) * 60,
        };
        break;
      case 'walk':
        leg = {
          type: 'walk',
          fromLabel: walkFrom.trim(),
          toLabel: walkTo.trim(),
          distanceMeters: parseInt(walkDistance, 10) || 0,
          estimatedDuration: (parseInt(walkDuration, 10) || 5) * 60,
        };
        break;
      case 'taxi':
        leg = {
          type: 'taxi',
          fromLabel: taxiFrom.trim(),
          toLabel: taxiTo.trim(),
          estimatedDuration: (parseInt(taxiDuration, 10) || 10) * 60,
        };
        break;
    }
    reset();
    onAdd(leg);
  };

  const selectedLine = selectedLineId ? getLineById(selectedLineId) : null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            {step === 'details' && (
              <Pressable hitSlop={12} onPress={() => setStep('type')}>
                <Ionicons name="arrow-back" size={22} color={AppColors.text} />
              </Pressable>
            )}
            <Text style={styles.title}>
              {step === 'type' ? t('legTypeTitle') : t('legDetails')}
            </Text>
            <Pressable hitSlop={12} onPress={handleCancel}>
              <Ionicons name="close" size={22} color={AppColors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            {step === 'type' && (
              <View style={styles.typeGrid}>
                {LEG_TYPE_DEFS.map((def) => (
                  <Pressable
                    key={def.type}
                    style={styles.typeCard}
                    onPress={() => handleSelectType(def.type)}>
                    <View style={[styles.typeIconWrap, { backgroundColor: def.color + '22' }]}>
                      <Ionicons name={def.icon} size={28} color={def.color} />
                    </View>
                    <Text style={styles.typeLabel}>{t(def.labelKey as any)}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {step === 'details' && legType === 'metro' && (
              <View style={styles.form}>
                <Text style={styles.formLabel}>{t('line')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lineScroll}>
                  {metroLines.map((line) => (
                    <Pressable
                      key={line.id}
                      style={[
                        styles.linePill,
                        {
                          backgroundColor: selectedLineId === line.id ? line.color : AppColors.surfaceLight,
                          borderColor: selectedLineId === line.id ? line.color : AppColors.border,
                        },
                      ]}
                      onPress={() => {
                        setSelectedLineId(line.id);
                        setDepStationId(null);
                        setDestStationId(null);
                      }}>
                      <Text
                        style={[
                          styles.linePillText,
                          { color: selectedLineId === line.id ? '#fff' : AppColors.textSecondary },
                        ]}>
                        {line.number}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                {selectedLine && (
                  <>
                    <Text style={styles.formLabel}>{t('departure')}</Text>
                    <ScrollView style={styles.stationList} nestedScrollEnabled>
                      {selectedLine.stations.map((s) => (
                        <Pressable
                          key={s.id}
                          style={[
                            styles.stationRow,
                            depStationId === s.id && styles.stationRowSelected,
                          ]}
                          onPress={() => setDepStationId(s.id)}>
                          <View
                            style={[
                              styles.stationDot,
                              {
                                backgroundColor:
                                  depStationId === s.id ? selectedLine.color : AppColors.textMuted,
                              },
                            ]}
                          />
                          <Text
                            style={[
                              styles.stationName,
                              depStationId === s.id && styles.stationNameSelected,
                            ]}>
                            {s.nameRu}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>

                    <Text style={styles.formLabel}>{t('destination')}</Text>
                    <ScrollView style={styles.stationList} nestedScrollEnabled>
                      {selectedLine.stations.map((s) => (
                        <Pressable
                          key={s.id}
                          style={[
                            styles.stationRow,
                            destStationId === s.id && styles.stationRowSelected,
                          ]}
                          onPress={() => setDestStationId(s.id)}>
                          <View
                            style={[
                              styles.stationDot,
                              {
                                backgroundColor:
                                  destStationId === s.id ? selectedLine.color : AppColors.textMuted,
                              },
                            ]}
                          />
                          <Text
                            style={[
                              styles.stationName,
                              destStationId === s.id && styles.stationNameSelected,
                            ]}>
                            {s.nameRu}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </>
                )}
              </View>
            )}

            {step === 'details' && legType === 'bus' && (
              <View style={styles.form}>
                <Text style={styles.formLabel}>{t('busRouteNumber')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('busRoutePlaceholder')}
                  placeholderTextColor={AppColors.textMuted}
                  value={busRoute}
                  onChangeText={setBusRoute}
                />
                <Text style={styles.formLabel}>{t('boardingStop')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('boardingStopPlaceholder')}
                  placeholderTextColor={AppColors.textMuted}
                  value={busFrom}
                  onChangeText={setBusFrom}
                />
                <Text style={styles.formLabel}>{t('alightingStop')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('alightingStopPlaceholder')}
                  placeholderTextColor={AppColors.textMuted}
                  value={busTo}
                  onChangeText={setBusTo}
                />
                <Text style={styles.formLabel}>{t('stopCount')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  placeholderTextColor={AppColors.textMuted}
                  keyboardType="numeric"
                  value={busStops}
                  onChangeText={setBusStops}
                />
                <Text style={styles.formLabel}>{t('travelTimeMin')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="15"
                  placeholderTextColor={AppColors.textMuted}
                  keyboardType="numeric"
                  value={busDuration}
                  onChangeText={setBusDuration}
                />
              </View>
            )}

            {step === 'details' && legType === 'walk' && (
              <View style={styles.form}>
                <Text style={styles.formLabel}>{t('walkFrom')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('walkFromPlaceholder')}
                  placeholderTextColor={AppColors.textMuted}
                  value={walkFrom}
                  onChangeText={setWalkFrom}
                />
                <Text style={styles.formLabel}>{t('walkTo')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('walkToPlaceholder')}
                  placeholderTextColor={AppColors.textMuted}
                  value={walkTo}
                  onChangeText={setWalkTo}
                />
                <Text style={styles.formLabel}>{t('distanceM')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="300"
                  placeholderTextColor={AppColors.textMuted}
                  keyboardType="numeric"
                  value={walkDistance}
                  onChangeText={setWalkDistance}
                />
                <Text style={styles.formLabel}>{t('timeMin')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  placeholderTextColor={AppColors.textMuted}
                  keyboardType="numeric"
                  value={walkDuration}
                  onChangeText={setWalkDuration}
                />
              </View>
            )}

            {step === 'details' && legType === 'taxi' && (
              <View style={styles.form}>
                <Text style={styles.formLabel}>{t('walkFrom')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('walkToPlaceholder')}
                  placeholderTextColor={AppColors.textMuted}
                  value={taxiFrom}
                  onChangeText={setTaxiFrom}
                />
                <Text style={styles.formLabel}>{t('walkTo')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('taxiToPlaceholder')}
                  placeholderTextColor={AppColors.textMuted}
                  value={taxiTo}
                  onChangeText={setTaxiTo}
                />
                <Text style={styles.formLabel}>{t('timeMin')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  placeholderTextColor={AppColors.textMuted}
                  keyboardType="numeric"
                  value={taxiDuration}
                  onChangeText={setTaxiDuration}
                />
              </View>
            )}
          </ScrollView>

          {/* Add button (details step only) */}
          {step === 'details' && (
            <View style={styles.footer}>
              <Pressable
                style={[styles.addBtn, !canAdd() && styles.addBtnDisabled]}
                onPress={handleAdd}
                disabled={!canAdd()}>
                <Ionicons name="add-circle" size={20} color={AppColors.background} />
                <Text style={styles.addBtnText}>{t('add')}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: AppColors.border,
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  title: {
    color: AppColors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeCard: {
    width: '47%',
    backgroundColor: AppColors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  typeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeLabel: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  form: {
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  formLabel: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.sm,
    marginBottom: 2,
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
  lineScroll: {
    maxHeight: 44,
    marginBottom: Spacing.xs,
  },
  linePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
    borderWidth: 1,
  },
  linePillText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  stationList: {
    maxHeight: 140,
    backgroundColor: AppColors.background,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  stationRowSelected: {
    backgroundColor: AppColors.accentSoft,
  },
  stationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stationName: {
    color: AppColors.textSecondary,
    fontSize: FontSize.sm,
  },
  stationNameSelected: {
    color: AppColors.text,
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  addBtnDisabled: {
    opacity: 0.35,
  },
  addBtnText: {
    color: AppColors.background,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
