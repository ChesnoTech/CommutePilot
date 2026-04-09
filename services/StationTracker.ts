import { DetectionMethod } from '@/data/types';

export interface StationTrackerConfig {
  segmentDurations: number[];
  totalStations: number;
  onStationAdvance: (method: DetectionMethod) => void;
}

const TIME_THRESHOLD_FACTOR = 1.1;
const ACCEL_MIN_PROGRESS = 0.5;
const ACCEL_CONFIRM_PROGRESS = 0.8;
const ADVANCE_COOLDOWN_MS = 30000;

export class StationTracker {
  private segmentDurations: number[];
  private totalStations: number;
  private onStationAdvance: (method: DetectionMethod) => void;

  private currentIndex = 0;
  private segmentElapsed = 0;
  private lastAdvanceTime = 0;
  private destroyed = false;

  constructor(config: StationTrackerConfig) {
    this.segmentDurations = config.segmentDurations;
    this.totalStations = config.totalStations;
    this.onStationAdvance = config.onStationAdvance;
    this.lastAdvanceTime = Date.now();
  }

  /** Called every 1s */
  tick(): void {
    if (this.destroyed) return;
    if (this.currentIndex >= this.totalStations - 1) return;

    this.segmentElapsed += 1;
    const expectedDuration = this.segmentDurations[this.currentIndex] ?? 120;

    // Auto-advance when elapsed exceeds expected duration * threshold
    if (this.segmentElapsed >= expectedDuration * TIME_THRESHOLD_FACTOR) {
      this.advance('time');
    }
  }

  /** Feed a deceleration event from accelerometer */
  feedDeceleration(): void {
    if (this.destroyed) return;
    if (this.currentIndex >= this.totalStations - 1) return;

    // Cooldown check
    if (Date.now() - this.lastAdvanceTime < ADVANCE_COOLDOWN_MS) return;

    const expectedDuration = this.segmentDurations[this.currentIndex] ?? 120;
    const progress = this.segmentElapsed / expectedDuration;

    // Ignore if too early (likely false positive)
    if (progress < ACCEL_MIN_PROGRESS) return;

    // Confirm advance if we're past 80% of expected time
    if (progress >= ACCEL_CONFIRM_PROGRESS) {
      this.advance('accelerometer');
    }
  }

  /** Manual advance — unconditional */
  manualAdvance(): void {
    if (this.destroyed) return;
    if (this.currentIndex >= this.totalStations - 1) return;
    this.advance('manual');
  }

  /** Recover from background — advance through missed stations */
  recoverFromBackground(elapsedSinceStartMs: number): void {
    if (this.destroyed) return;

    let totalTime = 0;
    let targetIndex = 0;

    for (let i = 0; i < this.segmentDurations.length; i++) {
      totalTime += this.segmentDurations[i];
      if (elapsedSinceStartMs / 1000 >= totalTime) {
        targetIndex = i + 1;
      } else {
        break;
      }
    }

    while (this.currentIndex < targetIndex && this.currentIndex < this.totalStations - 1) {
      this.advance('time');
    }
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getSegmentElapsed(): number {
    return this.segmentElapsed;
  }

  destroy(): void {
    this.destroyed = true;
  }

  private advance(method: DetectionMethod): void {
    this.currentIndex++;
    this.segmentElapsed = 0;
    this.lastAdvanceTime = Date.now();
    this.onStationAdvance(method);
  }
}
