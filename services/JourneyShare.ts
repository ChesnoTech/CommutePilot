/**
 * Journey Sharing — encode/decode multi-leg templates for offline sharing.
 *
 * Compresses journey data into a compact JSON string that fits in a QR code.
 * No server needed — everything is in the QR payload.
 *
 * Format: cp1:BASE64(JSON)
 * - cp1 = CommutePilot v1 protocol
 * - JSON contains legs array with minimal fields
 */

import type { JourneyLeg, MultiLegTemplate } from '@/data/types';

interface SharePayload {
  v: 1;
  n: string;           // template name
  l: CompactLeg[];     // legs
}

type CompactLeg =
  | { t: 'm'; li: string; d: string; a: string; e: number }  // metro
  | { t: 'b'; r: string; f: string; o: string; s: number; e: number }  // bus
  | { t: 'w'; f: string; o: string; d: number; e: number }  // walk
  | { t: 'x'; f: string; o: string; e: number };             // taxi

function compactLeg(leg: JourneyLeg): CompactLeg {
  switch (leg.type) {
    case 'metro':
      return { t: 'm', li: leg.lineId, d: leg.departureStationId, a: leg.destinationStationId, e: leg.estimatedDuration };
    case 'bus':
      return { t: 'b', r: leg.routeNumber, f: leg.fromStop, o: leg.toStop, s: leg.stopCount, e: leg.estimatedDuration };
    case 'walk':
      return { t: 'w', f: leg.fromLabel, o: leg.toLabel, d: leg.distanceMeters, e: leg.estimatedDuration };
    case 'taxi':
      return { t: 'x', f: leg.fromLabel, o: leg.toLabel, e: leg.estimatedDuration };
  }
}

function expandLeg(compact: CompactLeg): JourneyLeg {
  switch (compact.t) {
    case 'm':
      return { type: 'metro', lineId: compact.li, departureStationId: compact.d, destinationStationId: compact.a, estimatedDuration: compact.e };
    case 'b':
      return { type: 'bus', routeNumber: compact.r, fromStop: compact.f, toStop: compact.o, stopCount: compact.s, estimatedDuration: compact.e };
    case 'w':
      return { type: 'walk', fromLabel: compact.f, toLabel: compact.o, distanceMeters: compact.d, estimatedDuration: compact.e };
    case 'x':
      return { type: 'taxi', fromLabel: compact.f, toLabel: compact.o, estimatedDuration: compact.e };
  }
}

/** Encode a template into a QR-safe string */
export function encodeTemplate(name: string, legs: JourneyLeg[]): string {
  const payload: SharePayload = {
    v: 1,
    n: name,
    l: legs.map(compactLeg),
  };
  const json = JSON.stringify(payload);
  // Use base64 for safe QR encoding
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return `cp1:${base64}`;
}

/** Decode a QR payload back into template data */
export function decodeTemplate(raw: string): { name: string; legs: JourneyLeg[] } | null {
  try {
    if (!raw.startsWith('cp1:')) return null;
    const base64 = raw.slice(4);
    const json = decodeURIComponent(escape(atob(base64)));
    const payload: SharePayload = JSON.parse(json);
    if (payload.v !== 1 || !Array.isArray(payload.l)) return null;
    return {
      name: payload.n || 'Shared Route',
      legs: payload.l.map(expandLeg),
    };
  } catch {
    return null;
  }
}

/** Encode a single metro template (legacy format) */
export function encodeMetroRoute(name: string, lineId: string, depId: string, destId: string, duration: number): string {
  return encodeTemplate(name, [{
    type: 'metro',
    lineId,
    departureStationId: depId,
    destinationStationId: destId,
    estimatedDuration: duration,
  }]);
}
