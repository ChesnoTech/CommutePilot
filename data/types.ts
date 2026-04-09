export interface MetroLine {
  id: string;
  number: string;
  nameRu: string;
  nameEn: string;
  color: string;
  stations: Station[];
}

export interface Station {
  id: string;
  lineId: string;
  order: number;
  nameRu: string;
  nameEn: string;
  transfers: string[];
  timeToNext: number;
}

export interface JourneyTemplate {
  id: string;
  name: string;
  lineId: string;
  departureStationId: string;
  destinationStationId: string;
  createdAt: number;
}

export type AlarmPhase = 'none' | 'gentle' | 'warning' | 'full';
export type DetectionMethod = 'time' | 'accelerometer' | 'manual';

export interface StationArrival {
  stationId: string;
  timestamp: number;
  method: DetectionMethod;
}

export interface ActiveJourney {
  lineId: string;
  stations: Station[];
  segmentDurations: number[];
  currentStationIndex: number;
  totalStations: number;
  startedAt: number;
  arrivals: StationArrival[];
  alarmPhase: AlarmPhase;
  alarmDismissed: boolean;
}

// ═══════════════════════════════════════════
// Multi-leg journey types
// ═══════════════════════════════════════════

export type LegType = 'metro' | 'bus' | 'walk' | 'taxi';

export interface MetroLeg {
  type: 'metro';
  lineId: string;
  departureStationId: string;
  destinationStationId: string;
  /** Estimated duration in seconds */
  estimatedDuration: number;
}

export interface BusLeg {
  type: 'bus';
  routeNumber: string;
  fromStop: string;
  toStop: string;
  stopCount: number;
  estimatedDuration: number;
}

export interface WalkLeg {
  type: 'walk';
  fromLabel: string;
  toLabel: string;
  distanceMeters: number;
  estimatedDuration: number;
}

export interface TaxiLeg {
  type: 'taxi';
  fromLabel: string;
  toLabel: string;
  estimatedDuration: number;
}

export type JourneyLeg = MetroLeg | BusLeg | WalkLeg | TaxiLeg;

export interface MultiLegTemplate {
  id: string;
  name: string;
  legs: JourneyLeg[];
  createdAt: number;
}

// ═══════════════════════════════════════════
// Road quality types
// ═══════════════════════════════════════════

export type SurfaceQuality = 'smooth' | 'rough' | 'poor';

export interface RoadQualitySample {
  id: string;
  latitude: number;
  longitude: number;
  quality: SurfaceQuality;
  /** RMS vibration amplitude (g-force) */
  vibrationRms: number;
  timestamp: number;
  /** Transport mode when recorded */
  mode: 'walk' | 'bus' | 'car' | 'bike';
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// ═══════════════════════════════════════════
// Accessibility types
// ═══════════════════════════════════════════

export type AccessibilityProfile = 'standard' | 'wheelchair' | 'vision' | 'elderly';

export interface StationAccessibility {
  /** Station has elevator access (platform ↔ surface) */
  hasElevator: boolean;
  /** Station has accessible entrance (ramp / wide turnstile) */
  hasAccessibleEntrance: boolean;
  /** Public toilet available at or very near the station */
  hasToilet: boolean;
  /** Tactile guidance strips installed for blind users */
  hasTactileGuides: boolean;
  /** Audio announcements available in station */
  hasAudioAnnouncements: boolean;
  /** Gap between platform and train is wheelchair-safe (<5cm) */
  hasLevelBoarding: boolean;
  /** Free-form accessibility notes (shown to user) */
  notes?: string;
}

/** Result of checking route accessibility for a given profile */
export interface AccessibilityCheck {
  passable: boolean;
  warnings: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  stationId: string;
  stationName: string;
  type: 'no_elevator' | 'no_accessible_entrance' | 'no_toilet' | 'no_tactile' | 'no_level_boarding';
  severity: 'critical' | 'warning' | 'info';
}
