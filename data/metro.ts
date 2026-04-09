import { MetroLine, Station } from './types';
import { lineDefinitions } from './lines';
import { line1Stations } from './stations/line1';
import { line2Stations } from './stations/line2';
import { line3Stations } from './stations/line3';
import { line4Stations } from './stations/line4';
import { line5Stations } from './stations/line5';
import { line6Stations } from './stations/line6';
import { line7Stations } from './stations/line7';
import { line8Stations } from './stations/line8';
import { line8aStations } from './stations/line8a';
import { line9Stations } from './stations/line9';
import { line10Stations } from './stations/line10';
import { line11Stations } from './stations/line11';
import { line12Stations } from './stations/line12';
import { line14Stations } from './stations/line14';
import { line15Stations } from './stations/line15';
import { lineD1Stations } from './stations/lineD1';
import { lineD2Stations } from './stations/lineD2';
import { lineD3Stations } from './stations/lineD3';
import { lineD4Stations } from './stations/lineD4';

const stationsByLine: Record<string, Station[]> = {
  '1': line1Stations,
  '2': line2Stations,
  '3': line3Stations,
  '4': line4Stations,
  '5': line5Stations,
  '6': line6Stations,
  '7': line7Stations,
  '8': line8Stations,
  '8A': line8aStations,
  '9': line9Stations,
  '10': line10Stations,
  '11': line11Stations,
  '12': line12Stations,
  '14': line14Stations,
  '15': line15Stations,
  'D1': lineD1Stations,
  'D2': lineD2Stations,
  'D3': lineD3Stations,
  'D4': lineD4Stations,
};

export const metroLines: MetroLine[] = lineDefinitions.map((line) => ({
  ...line,
  stations: stationsByLine[line.id] || [],
}));

export function getLineById(id: string): MetroLine | undefined {
  return metroLines.find((line) => line.id === id);
}

export function getStationById(id: string): Station | undefined {
  for (const line of metroLines) {
    const station = line.stations.find((s) => s.id === id);
    if (station) return station;
  }
  return undefined;
}

export function getStationsBetween(
  lineId: string,
  fromStationId: string,
  toStationId: string
): Station[] {
  const line = getLineById(lineId);
  if (!line) return [];

  const fromStation = line.stations.find((s) => s.id === fromStationId);
  const toStation = line.stations.find((s) => s.id === toStationId);
  if (!fromStation || !toStation) return [];

  const fromOrder = Math.min(fromStation.order, toStation.order);
  const toOrder = Math.max(fromStation.order, toStation.order);

  return line.stations.filter((s) => s.order >= fromOrder && s.order <= toOrder);
}

export function calculateTravelTime(
  lineId: string,
  fromStationId: string,
  toStationId: string
): number {
  const stations = getStationsBetween(lineId, fromStationId, toStationId);
  if (stations.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < stations.length - 1; i++) {
    total += stations[i].timeToNext;
  }
  return total;
}

export function getStationCount(
  lineId: string,
  fromStationId: string,
  toStationId: string
): number {
  const stations = getStationsBetween(lineId, fromStationId, toStationId);
  return Math.max(0, stations.length - 1);
}
