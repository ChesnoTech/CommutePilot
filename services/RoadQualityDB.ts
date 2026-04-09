/**
 * SQLite storage for road quality samples.
 * Stores GPS + vibration data locally on device.
 * Zero data leaves the phone unless user opts in.
 */

import * as SQLite from 'expo-sqlite';
import type { RoadQualitySample, SurfaceQuality, GeoPoint } from '@/data/types';

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('roadquality.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS samples (
        id TEXT PRIMARY KEY,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        quality TEXT NOT NULL,
        vibration_rms REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        mode TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_samples_geo
        ON samples(latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_samples_time
        ON samples(timestamp);
    `);
  }
  return db;
}

export async function saveSamples(samples: RoadQualitySample[]): Promise<void> {
  if (samples.length === 0) return;
  const database = await getDb();

  const stmt = await database.prepareAsync(
    'INSERT OR REPLACE INTO samples (id, latitude, longitude, quality, vibration_rms, timestamp, mode) VALUES ($id, $lat, $lng, $quality, $rms, $ts, $mode)'
  );

  try {
    for (const s of samples) {
      await stmt.executeAsync({
        $id: s.id,
        $lat: s.latitude,
        $lng: s.longitude,
        $quality: s.quality,
        $rms: s.vibrationRms,
        $ts: s.timestamp,
        $mode: s.mode,
      });
    }
  } finally {
    await stmt.finalizeAsync();
  }
}

export async function getSamplesInBounds(
  sw: GeoPoint,
  ne: GeoPoint
): Promise<RoadQualitySample[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: string;
    latitude: number;
    longitude: number;
    quality: string;
    vibration_rms: number;
    timestamp: number;
    mode: string;
  }>(
    'SELECT * FROM samples WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT 5000',
    [sw.latitude, ne.latitude, sw.longitude, ne.longitude]
  );

  return rows.map((r) => ({
    id: r.id,
    latitude: r.latitude,
    longitude: r.longitude,
    quality: r.quality as SurfaceQuality,
    vibrationRms: r.vibration_rms,
    timestamp: r.timestamp,
    mode: r.mode as RoadQualitySample['mode'],
  }));
}

export async function getAllSamples(): Promise<RoadQualitySample[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: string;
    latitude: number;
    longitude: number;
    quality: string;
    vibration_rms: number;
    timestamp: number;
    mode: string;
  }>('SELECT * FROM samples ORDER BY timestamp DESC LIMIT 10000');

  return rows.map((r) => ({
    id: r.id,
    latitude: r.latitude,
    longitude: r.longitude,
    quality: r.quality as SurfaceQuality,
    vibrationRms: r.vibration_rms,
    timestamp: r.timestamp,
    mode: r.mode as RoadQualitySample['mode'],
  }));
}

export async function getSampleCount(): Promise<number> {
  const database = await getDb();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM samples'
  );
  return result?.count ?? 0;
}

export async function clearOldSamples(olderThanDays: number = 90): Promise<void> {
  const database = await getDb();
  const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  await database.runAsync('DELETE FROM samples WHERE timestamp < ?', [cutoff]);
}
