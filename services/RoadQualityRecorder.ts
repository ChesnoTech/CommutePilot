/**
 * Road Quality Recorder — captures accelerometer vibrations + GPS position
 * to build a surface quality heatmap layer.
 *
 * Records RMS (root-mean-square) of accelerometer Z-axis vibrations over
 * a sliding window, paired with GPS coordinates. Classifies each sample as
 * smooth / rough / poor based on vibration thresholds.
 *
 * All data stored locally in SQLite. Zero network required.
 */

import * as Location from 'expo-location';
import { Accelerometer, type AccelerometerMeasurement } from 'expo-sensors';
import type { RoadQualitySample, SurfaceQuality } from '@/data/types';

// Thresholds for vibration RMS (in g-force)
const SMOOTH_THRESHOLD = 0.15;
const ROUGH_THRESHOLD = 0.4;

// Recording config
const SAMPLE_INTERVAL_MS = 5000; // Record one quality sample every 5 seconds
const ACCEL_UPDATE_MS = 100;     // Accelerometer reads at 10Hz
const WINDOW_SIZE = 50;          // 50 readings per window (5 seconds at 10Hz)

let isRecording = false;
let accelSubscription: ReturnType<typeof Accelerometer.addListener> | null = null;
let locationWatcher: Location.LocationSubscription | null = null;
let sampleTimer: ReturnType<typeof setInterval> | null = null;

// Buffers
let zBuffer: number[] = [];
let currentLat = 0;
let currentLng = 0;
let hasLocation = false;
let currentMode: RoadQualitySample['mode'] = 'walk';

// Collected samples (flushed to SQLite periodically)
let pendingSamples: RoadQualitySample[] = [];
let onSampleCallback: ((sample: RoadQualitySample) => void) | null = null;

function classifyQuality(rms: number): SurfaceQuality {
  if (rms < SMOOTH_THRESHOLD) return 'smooth';
  if (rms < ROUGH_THRESHOLD) return 'rough';
  return 'poor';
}

function computeRms(values: number[]): number {
  if (values.length === 0) return 0;
  const sumSq = values.reduce((sum, v) => sum + v * v, 0);
  return Math.sqrt(sumSq / values.length);
}

function handleAccelData(data: AccelerometerMeasurement): void {
  // Use Z-axis deviation from gravity (1g baseline)
  const deviation = Math.abs(data.z - 1.0);
  zBuffer.push(deviation);
  if (zBuffer.length > WINDOW_SIZE) {
    zBuffer = zBuffer.slice(-WINDOW_SIZE);
  }
}

function captureSample(): void {
  if (!hasLocation || zBuffer.length < 10) return;

  const rms = computeRms(zBuffer);
  const quality = classifyQuality(rms);

  const sample: RoadQualitySample = {
    id: `rq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    latitude: currentLat,
    longitude: currentLng,
    quality,
    vibrationRms: Math.round(rms * 1000) / 1000,
    timestamp: Date.now(),
    mode: currentMode,
  };

  pendingSamples.push(sample);
  onSampleCallback?.(sample);

  // Reset buffer for next window
  zBuffer = [];
}

export async function startRecording(
  mode: RoadQualitySample['mode'] = 'walk',
  onSample?: (sample: RoadQualitySample) => void
): Promise<boolean> {
  if (isRecording) return true;

  // Request location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return false;

  currentMode = mode;
  onSampleCallback = onSample ?? null;
  zBuffer = [];
  isRecording = true;

  // Start accelerometer
  Accelerometer.setUpdateInterval(ACCEL_UPDATE_MS);
  accelSubscription = Accelerometer.addListener(handleAccelData);

  // Start GPS tracking
  locationWatcher = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 5, // Update every 5 meters
      timeInterval: 2000,
    },
    (loc) => {
      currentLat = loc.coords.latitude;
      currentLng = loc.coords.longitude;
      hasLocation = true;
    }
  );

  // Sample timer
  sampleTimer = setInterval(captureSample, SAMPLE_INTERVAL_MS);

  return true;
}

export function stopRecording(): RoadQualitySample[] {
  isRecording = false;

  accelSubscription?.remove();
  accelSubscription = null;

  locationWatcher?.remove();
  locationWatcher = null;

  if (sampleTimer) {
    clearInterval(sampleTimer);
    sampleTimer = null;
  }

  // Capture final sample
  captureSample();

  const samples = [...pendingSamples];
  pendingSamples = [];
  onSampleCallback = null;
  hasLocation = false;

  return samples;
}

export function isActive(): boolean {
  return isRecording;
}

export function getPendingSamples(): RoadQualitySample[] {
  return [...pendingSamples];
}

export function clearPendingSamples(): void {
  pendingSamples = [];
}
