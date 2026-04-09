import {
  metroLines,
  getLineById,
  getStationById,
  getStationsBetween,
  calculateTravelTime,
  getStationCount,
  findTransferStation,
} from './metro';
import type { Station } from './types';

/* ── Types ─────────────────────────────────────────────── */

export interface RouteLeg {
  lineId: string;
  fromStationId: string;
  toStationId: string;
  stationCount: number;
  travelTimeSeconds: number;
}

export interface TransferStep {
  fromStationId: string;
  toStationId: string;
  transferTimeSeconds: number;
}

export interface FoundRoute {
  legs: RouteLeg[];
  transfers: TransferStep[];
  totalStationCount: number;
  totalTravelTimeSeconds: number;
  totalTransferTimeSeconds: number;
  totalTimeSeconds: number;
}

const TRANSFER_WALK_SECONDS = 180;
const MAX_RESULTS = 5;

/* ── Helpers ───────────────────────────────────────────── */

function buildLeg(lineId: string, fromId: string, toId: string): RouteLeg | null {
  const count = getStationCount(lineId, fromId, toId);
  if (count <= 0) return null;
  return {
    lineId,
    fromStationId: fromId,
    toStationId: toId,
    stationCount: count,
    travelTimeSeconds: calculateTravelTime(lineId, fromId, toId),
  };
}

function routeKey(legs: RouteLeg[]): string {
  return legs.map((l) => `${l.lineId}:${l.fromStationId}-${l.toStationId}`).join('|');
}

function assembleRoute(legs: RouteLeg[], transferSteps: TransferStep[]): FoundRoute {
  const totalStationCount = legs.reduce((s, l) => s + l.stationCount, 0);
  const totalTravelTimeSeconds = legs.reduce((s, l) => s + l.travelTimeSeconds, 0);
  const totalTransferTimeSeconds = transferSteps.reduce((s, t) => s + t.transferTimeSeconds, 0);
  return {
    legs,
    transfers: transferSteps,
    totalStationCount,
    totalTravelTimeSeconds,
    totalTransferTimeSeconds,
    totalTimeSeconds: totalTravelTimeSeconds + totalTransferTimeSeconds,
  };
}

/* ── Build line-to-line adjacency ──────────────────────── */

let _adjacency: Map<string, Set<string>> | null = null;

function getLineAdjacency(): Map<string, Set<string>> {
  if (_adjacency) return _adjacency;
  _adjacency = new Map();
  for (const line of metroLines) {
    const connections = new Set<string>();
    for (const station of line.stations) {
      for (const t of station.transfers) {
        connections.add(t);
      }
    }
    _adjacency.set(line.id, connections);
  }
  return _adjacency;
}

/* ── Main route finder ─────────────────────────────────── */

export function findRoutes(fromStationId: string, toStationId: string): FoundRoute[] {
  const fromStation = getStationById(fromStationId);
  const toStation = getStationById(toStationId);
  if (!fromStation || !toStation) return [];
  if (fromStationId === toStationId) return [];

  const routes: FoundRoute[] = [];
  const seen = new Set<string>();

  const fromLineId = fromStation.lineId;
  const toLineId = toStation.lineId;
  const adjacency = getLineAdjacency();

  // Phase 1: Direct (same line, 0 transfers)
  if (fromLineId === toLineId) {
    const leg = buildLeg(fromLineId, fromStationId, toStationId);
    if (leg) {
      const route = assembleRoute([leg], []);
      const key = routeKey(route.legs);
      if (!seen.has(key)) {
        seen.add(key);
        routes.push(route);
      }
    }
  }

  // Phase 2: 1 transfer
  const fromConnections = adjacency.get(fromLineId) ?? new Set();
  const toConnections = adjacency.get(toLineId) ?? new Set();

  // Lines directly reachable from the departure line
  for (const midLineId of fromConnections) {
    if (midLineId === fromLineId) continue;

    // Case A: destination is on the mid line itself
    if (midLineId === toLineId) {
      const transfer = findTransferStation(fromLineId, midLineId);
      if (!transfer) continue;
      const leg1 = buildLeg(fromLineId, fromStationId, transfer.from.id);
      const leg2 = buildLeg(toLineId, transfer.to.id, toStationId);
      if (leg1 && leg2) {
        const route = assembleRoute(
          [leg1, leg2],
          [{ fromStationId: transfer.from.id, toStationId: transfer.to.id, transferTimeSeconds: TRANSFER_WALK_SECONDS }]
        );
        const key = routeKey(route.legs);
        if (!seen.has(key)) {
          seen.add(key);
          routes.push(route);
        }
      }
    }

    // Case B: mid line connects to destination line
    const midConnections = adjacency.get(midLineId) ?? new Set();
    if (midConnections.has(toLineId) && midLineId !== toLineId) {
      // This is a 2-transfer route — handled in Phase 3
    }
  }

  // Phase 3: 2 transfers (route through any shared mid line)
  for (const midLineId of fromConnections) {
    if (midLineId === fromLineId || midLineId === toLineId) continue;
    const midConnections = adjacency.get(midLineId) ?? new Set();
    if (!midConnections.has(toLineId)) continue;

    const transfer1 = findTransferStation(fromLineId, midLineId);
    const transfer2 = findTransferStation(midLineId, toLineId);
    if (!transfer1 || !transfer2) continue;

    const leg1 = buildLeg(fromLineId, fromStationId, transfer1.from.id);
    const leg2 = buildLeg(midLineId, transfer1.to.id, transfer2.from.id);
    const leg3 = buildLeg(toLineId, transfer2.to.id, toStationId);
    if (leg1 && leg2 && leg3) {
      const route = assembleRoute(
        [leg1, leg2, leg3],
        [
          { fromStationId: transfer1.from.id, toStationId: transfer1.to.id, transferTimeSeconds: TRANSFER_WALK_SECONDS },
          { fromStationId: transfer2.from.id, toStationId: transfer2.to.id, transferTimeSeconds: TRANSFER_WALK_SECONDS },
        ]
      );
      const key = routeKey(route.legs);
      if (!seen.has(key)) {
        seen.add(key);
        routes.push(route);
      }
    }
  }

  // Sort by total time, cap results
  routes.sort((a, b) => a.totalTimeSeconds - b.totalTimeSeconds);
  return routes.slice(0, MAX_RESULTS);
}
