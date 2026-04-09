/**
 * Moscow Metro Station Accessibility Data
 *
 * Maps station IDs to accessibility features.
 * Stations not listed here get the DEFAULT profile (basic features only).
 *
 * Data based on Moscow Metro accessibility program:
 * - New stations (post-2012) generally have full accessibility
 * - MCC (Line 14) stations have modern accessibility
 * - Older stations vary — many have been retrofitted with elevators
 * - Toilets are rare inside stations, but some have them at entrance level
 *
 * NOTE: This data is approximate for MVP. Real data should be verified
 * with official Moscow Metro accessibility maps.
 */

import type { StationAccessibility, AccessibilityProfile, AccessibilityCheck, AccessibilityIssue } from './types';

/** Default for stations not in the override map */
const DEFAULT_ACCESS: StationAccessibility = {
  hasElevator: false,
  hasAccessibleEntrance: false,
  hasToilet: false,
  hasTactileGuides: false,
  hasAudioAnnouncements: true, // Most stations have audio
  hasLevelBoarding: false,
};

/** Full accessibility (new stations, MCC, etc.) */
const FULL_ACCESS: StationAccessibility = {
  hasElevator: true,
  hasAccessibleEntrance: true,
  hasToilet: false,
  hasTactileGuides: true,
  hasAudioAnnouncements: true,
  hasLevelBoarding: true,
};

/** Full + toilet */
const FULL_WITH_TOILET: StationAccessibility = {
  ...FULL_ACCESS,
  hasToilet: true,
};

/** Partial accessibility (elevator but no level boarding) */
const PARTIAL_ACCESS: StationAccessibility = {
  hasElevator: true,
  hasAccessibleEntrance: true,
  hasToilet: false,
  hasTactileGuides: true,
  hasAudioAnnouncements: true,
  hasLevelBoarding: false,
};

/**
 * Override map — only stations with features ABOVE the default.
 * Station IDs follow the pattern: lineId-stationOrder (e.g. '1-01')
 */
const stationAccessOverrides: Record<string, Partial<StationAccessibility>> = {
  // ═══ Line 1 (Сокольническая) ═══
  // New extension stations (post-2014) — full accessibility
  '1-20': FULL_ACCESS, // Тропарёво (2014)
  '1-21': FULL_ACCESS, // Румянцево (2016)
  '1-22': FULL_ACCESS, // Саларьево (2016)
  '1-23': FULL_ACCESS, // Филатов Луг (2019)
  '1-24': FULL_ACCESS, // Прокшино (2019)
  '1-25': FULL_ACCESS, // Ольховая (2019)
  '1-26': FULL_ACCESS, // Коммунарка (2019)
  '1-27': FULL_ACCESS, // Потапово (2023)
  // Renovated older stations
  '1-06': PARTIAL_ACCESS, // Комсомольская — major hub, elevator added
  '1-10': PARTIAL_ACCESS, // Охотный Ряд — central, retrofitted
  '1-11': PARTIAL_ACCESS, // Библиотека имени Ленина — accessible entrance

  // ═══ Line 2 (Замоскворецкая) ═══
  '2-01': FULL_ACCESS,    // Ховрино (2017)
  '2-02': FULL_ACCESS,    // Беломорская (2018)
  '2-14': PARTIAL_ACCESS, // Павелецкая — railway hub, elevator
  '2-18': FULL_ACCESS,    // Алма-Атинская (2012)

  // ═══ Line 3 (Арбатско-Покровская) ═══
  '3-22': FULL_ACCESS, // Пятницкое шоссе (2012)
  '3-01': PARTIAL_ACCESS, // Щёлковская — retrofitted

  // ═══ Line 4 (Филёвская) ═══
  // Mostly older surface stations — limited accessibility

  // ═══ Line 5 (Кольцевая) ═══
  '5-01': PARTIAL_ACCESS, // Комсомольская — hub
  '5-06': PARTIAL_ACCESS, // Киевская — hub with railway
  '5-08': PARTIAL_ACCESS, // Павелецкая — hub

  // ═══ Line 6 (Калужско-Рижская) ═══
  '6-01': FULL_ACCESS, // Медведково — retrofitted

  // ═══ Line 7 (Таганско-Краснопресненская) ═══
  '7-23': FULL_ACCESS, // Жулебино (2013)
  '7-24': FULL_ACCESS, // Котельники (2015)

  // ═══ Line 8 (Калининская) ═══
  // Mix of old and new stations

  // ═══ Line 8A (Солнцевская) ═══
  // All new stations — full accessibility
  '8A-01': FULL_WITH_TOILET, // Рассказовка (2018)
  '8A-02': FULL_ACCESS, // Новопеределкино (2018)
  '8A-03': FULL_ACCESS, // Боровское шоссе (2018)
  '8A-04': FULL_ACCESS, // Солнцево (2018)
  '8A-05': FULL_ACCESS, // Говорово (2018)
  '8A-06': FULL_ACCESS, // Озёрная (2018)
  '8A-07': FULL_ACCESS, // Мичуринский проспект (2018)

  // ═══ Line 9 (Серпуховско-Тимирязевская) ═══
  // Mostly 1980s-90s stations

  // ═══ Line 10 (Люблинско-Дмитровская) ═══
  // Newer line — generally better accessibility
  '10-24': FULL_ACCESS,   // Селигерская (2018)
  '10-23': FULL_ACCESS,   // Верхние Лихоборы (2018)
  '10-22': FULL_ACCESS,   // Окружная (2018)
  '10-01': PARTIAL_ACCESS, // Марьина Роща — retrofitted
  '10-13': FULL_WITH_TOILET, // Братиславская — toilet available

  // ═══ Line 11 (Большая кольцевая / БКЛ) ═══
  // Russia's newest metro line — FULL accessibility everywhere
  '11-01': FULL_WITH_TOILET,
  '11-02': FULL_ACCESS,
  '11-03': FULL_ACCESS,
  '11-04': FULL_ACCESS,
  '11-05': FULL_ACCESS,
  '11-06': FULL_ACCESS,
  '11-07': FULL_ACCESS,
  '11-08': FULL_ACCESS,
  '11-09': FULL_ACCESS,
  '11-10': FULL_WITH_TOILET,
  '11-11': FULL_ACCESS,
  '11-12': FULL_ACCESS,
  '11-13': FULL_ACCESS,
  '11-14': FULL_ACCESS,
  '11-15': FULL_ACCESS,
  '11-16': FULL_ACCESS,
  '11-17': FULL_ACCESS,
  '11-18': FULL_ACCESS,
  '11-19': FULL_ACCESS,
  '11-20': FULL_ACCESS,
  '11-21': FULL_ACCESS,
  '11-22': FULL_ACCESS,
  '11-23': FULL_ACCESS,
  '11-24': FULL_ACCESS,
  '11-25': FULL_ACCESS,
  '11-26': FULL_ACCESS,
  '11-27': FULL_ACCESS,
  '11-28': FULL_ACCESS,
  '11-29': FULL_ACCESS,
  '11-30': FULL_ACCESS,
  '11-31': FULL_ACCESS,

  // ═══ Line 12 (Бутовская) ═══
  // Light metro — all stations have accessibility
  '12-01': FULL_ACCESS,
  '12-02': FULL_ACCESS,
  '12-03': FULL_ACCESS,
  '12-04': FULL_ACCESS,
  '12-05': FULL_ACCESS,
  '12-06': FULL_ACCESS,
  '12-07': FULL_ACCESS,

  // ═══ Line 14 (МЦК / Moscow Central Circle) ═══
  // Surface railway — all stations have modern accessibility
  '14-01': FULL_WITH_TOILET,
  '14-02': FULL_ACCESS,
  '14-03': FULL_ACCESS,
  '14-04': FULL_ACCESS,
  '14-05': FULL_ACCESS,
  '14-06': FULL_ACCESS,
  '14-07': FULL_ACCESS,
  '14-08': FULL_ACCESS,
  '14-09': FULL_ACCESS,
  '14-10': FULL_ACCESS,
  '14-11': FULL_ACCESS,
  '14-12': FULL_WITH_TOILET,
  '14-13': FULL_ACCESS,
  '14-14': FULL_ACCESS,
  '14-15': FULL_ACCESS,
  '14-16': FULL_ACCESS,
  '14-17': FULL_ACCESS,
  '14-18': FULL_ACCESS,
  '14-19': FULL_ACCESS,
  '14-20': FULL_ACCESS,
  '14-21': FULL_ACCESS,
  '14-22': FULL_ACCESS,
  '14-23': FULL_ACCESS,
  '14-24': FULL_ACCESS,
  '14-25': FULL_ACCESS,
  '14-26': FULL_ACCESS,
  '14-27': FULL_ACCESS,
  '14-28': FULL_ACCESS,
  '14-29': FULL_ACCESS,
  '14-30': FULL_ACCESS,
  '14-31': FULL_ACCESS,

  // ═══ Line 15 (Некрасовская) ═══
  // All new (2019) — full accessibility
  '15-01': FULL_WITH_TOILET,
  '15-02': FULL_ACCESS,
  '15-03': FULL_ACCESS,
  '15-04': FULL_ACCESS,
  '15-05': FULL_ACCESS,
  '15-06': FULL_ACCESS,
  '15-07': FULL_ACCESS,
  '15-08': FULL_ACCESS,
};

/** Get accessibility info for a station */
export function getStationAccessibility(stationId: string): StationAccessibility {
  const override = stationAccessOverrides[stationId];
  if (!override) return { ...DEFAULT_ACCESS };
  return { ...DEFAULT_ACCESS, ...override };
}

/** Check if a station meets the needs of a given profile */
export function stationMeetsProfile(
  stationId: string,
  profile: AccessibilityProfile
): boolean {
  if (profile === 'standard') return true;
  const access = getStationAccessibility(stationId);

  switch (profile) {
    case 'wheelchair':
      return access.hasElevator && access.hasAccessibleEntrance && access.hasLevelBoarding;
    case 'vision':
      return access.hasTactileGuides && access.hasAudioAnnouncements;
    case 'elderly':
      return access.hasElevator; // elderly mainly need elevator (avoid stairs)
  }
}

/** Check a full route (list of station IDs) for accessibility issues */
export function checkRouteAccessibility(
  stationIds: string[],
  stationNames: string[],
  profile: AccessibilityProfile
): AccessibilityCheck {
  if (profile === 'standard') {
    return { passable: true, warnings: [] };
  }

  const warnings: AccessibilityIssue[] = [];

  for (let i = 0; i < stationIds.length; i++) {
    const id = stationIds[i];
    const name = stationNames[i] || id;
    const access = getStationAccessibility(id);

    if (profile === 'wheelchair') {
      if (!access.hasElevator) {
        warnings.push({
          stationId: id,
          stationName: name,
          type: 'no_elevator',
          severity: 'critical',
        });
      }
      if (!access.hasAccessibleEntrance) {
        warnings.push({
          stationId: id,
          stationName: name,
          type: 'no_accessible_entrance',
          severity: 'critical',
        });
      }
      if (!access.hasLevelBoarding) {
        warnings.push({
          stationId: id,
          stationName: name,
          type: 'no_level_boarding',
          severity: 'warning',
        });
      }
    }

    if (profile === 'vision') {
      if (!access.hasTactileGuides) {
        warnings.push({
          stationId: id,
          stationName: name,
          type: 'no_tactile',
          severity: 'warning',
        });
      }
    }

    if (profile === 'elderly') {
      if (!access.hasElevator) {
        warnings.push({
          stationId: id,
          stationName: name,
          type: 'no_elevator',
          severity: 'warning',
        });
      }
      if (!access.hasToilet) {
        // Only flag departure and destination for toilet
        if (i === 0 || i === stationIds.length - 1) {
          warnings.push({
            stationId: id,
            stationName: name,
            type: 'no_toilet',
            severity: 'info',
          });
        }
      }
    }
  }

  // Route is passable if no critical issues
  const passable = !warnings.some((w) => w.severity === 'critical');

  return { passable, warnings };
}

/** Get summary counts for a station's accessibility features */
export function getAccessibilityFeatureCount(stationId: string): number {
  const access = getStationAccessibility(stationId);
  let count = 0;
  if (access.hasElevator) count++;
  if (access.hasAccessibleEntrance) count++;
  if (access.hasToilet) count++;
  if (access.hasTactileGuides) count++;
  if (access.hasLevelBoarding) count++;
  if (access.hasAudioAnnouncements) count++;
  return count;
}

/** Get human-readable feature list for a station */
export function getAccessibilityFeatures(stationId: string): string[] {
  const access = getStationAccessibility(stationId);
  const features: string[] = [];
  if (access.hasElevator) features.push('elevator');
  if (access.hasAccessibleEntrance) features.push('accessible_entrance');
  if (access.hasToilet) features.push('toilet');
  if (access.hasTactileGuides) features.push('tactile_guides');
  if (access.hasAudioAnnouncements) features.push('audio_announcements');
  if (access.hasLevelBoarding) features.push('level_boarding');
  return features;
}
