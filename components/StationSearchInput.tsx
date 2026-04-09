import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchStations } from '@/data/metro';
import type { Station, MetroLine } from '@/data/types';
import { useT } from '@/i18n';
import { AppColors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/layout';

interface StationSearchInputProps {
  placeholder: string;
  selectedStation: { station: Station; line: MetroLine } | null;
  onSelect: (station: Station, line: MetroLine) => void;
  onClear: () => void;
  markerColor: string;
}

export function StationSearchInput({
  placeholder,
  selectedStation,
  onSelect,
  onClear,
  markerColor,
}: StationSearchInputProps) {
  const t = useT();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ station: Station; line: MetroLine }>>([]);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResults(searchStations(q));
    }, 150);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleChangeText = (text: string) => {
    setQuery(text);
    doSearch(text);
  };

  const handleSelect = (station: Station, line: MetroLine) => {
    setQuery('');
    setResults([]);
    setFocused(false);
    onSelect(station, line);
  };

  if (selectedStation) {
    return (
      <Pressable
        style={({ pressed }) => [styles.selectedWrap, pressed && { opacity: 0.7 }]}
        onPress={onClear}>
        <View style={[styles.marker, { backgroundColor: markerColor }]} />
        <View style={styles.selectedInfo}>
          <View style={styles.selectedRow}>
            <View style={[styles.lineDot, { backgroundColor: selectedStation.line.color }]} />
            <Text style={styles.lineNum}>{selectedStation.line.number}</Text>
            <Text style={styles.selectedName} numberOfLines={1}>
              {selectedStation.station.nameRu}
            </Text>
          </View>
          <Text style={styles.selectedNameEn} numberOfLines={1}>
            {selectedStation.station.nameEn}
          </Text>
        </View>
        <Ionicons name="close-circle" size={18} color={AppColors.textMuted} />
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <View style={[styles.marker, { backgroundColor: markerColor }]} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={AppColors.textMuted}
          value={query}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => { setQuery(''); setResults([]); }} hitSlop={16}>
            <Ionicons name="close-circle" size={16} color={AppColors.textMuted} />
          </Pressable>
        )}
      </View>

      {focused && results.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.station.id}
            keyboardShouldPersistTaps="handled"
            style={styles.resultList}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.resultRow, pressed && { backgroundColor: AppColors.surface }]}
                onPress={() => handleSelect(item.station, item.line)}>
                <View style={[styles.lineDot, { backgroundColor: item.line.color }]} />
                <Text style={styles.resultLineNum}>{item.line.number}</Text>
                <View style={styles.resultNames}>
                  <Text style={styles.resultName} numberOfLines={1}>{item.station.nameRu}</Text>
                  <Text style={styles.resultNameEn} numberOfLines={1}>{item.station.nameEn}</Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: Spacing.sm,
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    color: AppColors.text,
    fontSize: FontSize.md,
    paddingVertical: 4,
  },
  dropdown: {
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.sm,
    borderBottomRightRadius: BorderRadius.sm,
    maxHeight: 200,
    overflow: 'hidden',
  },
  resultList: {
    maxHeight: 200,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  lineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resultLineNum: {
    color: AppColors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    width: 22,
  },
  resultNames: {
    flex: 1,
  },
  resultName: {
    color: AppColors.text,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  resultNameEn: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
  },
  // Selected state
  selectedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: Spacing.sm,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  lineNum: {
    color: AppColors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  selectedName: {
    color: AppColors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    flex: 1,
  },
  selectedNameEn: {
    color: AppColors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 1,
  },
});
