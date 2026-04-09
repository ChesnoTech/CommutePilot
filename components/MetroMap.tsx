import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Polyline } from 'react-native-svg';
import { metroLines } from '@/data/metro';
import { stationCoords, getLinePath, ringLineIds } from '@/data/mapCoordinates';
import { lineDefinitions } from '@/data/lines';
import { AppColors } from '@/constants/colors';

interface MetroMapProps {
  /** Currently selected line ID */
  selectedLineId?: string | null;
  /** Currently selected departure station ID */
  departureStationId?: string | null;
  /** Currently selected destination station ID */
  destinationStationId?: string | null;
  /** Callback when a station is tapped */
  onStationPress?: (stationId: string, lineId: string) => void;
  /** Active journey: array of station IDs in order */
  journeyStations?: string[];
  /** Current station index during active journey */
  currentStationIndex?: number;
  /** Compact mode (smaller, no labels) */
  compact?: boolean;
}

const VIEWBOX = '0 0 1000 1000';
const STATION_RADIUS = 5;
const STATION_RADIUS_SELECTED = 8;
const LINE_WIDTH = 3;
const LINE_WIDTH_SELECTED = 5;

function buildPolylinePoints(lineId: string): string {
  const path = getLinePath(lineId);
  return path.map((p) => `${p.x},${p.y}`).join(' ');
}

function buildRingPath(lineId: string): string {
  const path = getLinePath(lineId);
  if (path.length < 3) return '';
  // Close the ring with a smooth path
  const points = path.map((p) => `${p.x},${p.y}`);
  return `M${points[0]} L${points.slice(1).join(' L')} Z`;
}

export function MetroMap({
  selectedLineId,
  departureStationId,
  destinationStationId,
  onStationPress,
  journeyStations,
  currentStationIndex,
  compact = false,
}: MetroMapProps) {
  const lineColors = useMemo(() => {
    const map: Record<string, string> = {};
    lineDefinitions.forEach((l) => {
      map[l.id] = l.color;
    });
    return map;
  }, []);

  const journeySet = useMemo(
    () => new Set(journeyStations ?? []),
    [journeyStations]
  );

  const handleStationPress = useCallback(
    (stationId: string, lineId: string) => {
      onStationPress?.(stationId, lineId);
    },
    [onStationPress]
  );

  // Determine which lines to draw: all lines, but highlight selected
  const lineElements = useMemo(() => {
    return lineDefinitions.map((lineDef) => {
      const isRing = ringLineIds.includes(lineDef.id);
      const isSelected = lineDef.id === selectedLineId;
      const opacity = selectedLineId && !isSelected ? 0.2 : 0.8;
      const width = isSelected ? LINE_WIDTH_SELECTED : LINE_WIDTH;

      if (isRing) {
        const d = buildRingPath(lineDef.id);
        return (
          <Path
            key={`line-${lineDef.id}`}
            d={d}
            stroke={lineDef.color}
            strokeWidth={width}
            fill="none"
            opacity={opacity}
          />
        );
      }

      const points = buildPolylinePoints(lineDef.id);
      return (
        <Polyline
          key={`line-${lineDef.id}`}
          points={points}
          stroke={lineDef.color}
          strokeWidth={width}
          fill="none"
          opacity={opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    });
  }, [selectedLineId]);

  // Journey highlight path
  const journeyPath = useMemo(() => {
    if (!journeyStations || journeyStations.length < 2) return null;
    const points = journeyStations
      .map((id) => stationCoords[id])
      .filter(Boolean)
      .map((p) => `${p.x},${p.y}`)
      .join(' ');
    return points;
  }, [journeyStations]);

  // Station dots
  const stationElements = useMemo(() => {
    const elements: React.ReactElement[] = [];

    metroLines.forEach((line) => {
      const isLineSelected = line.id === selectedLineId;
      const lineOpacity = selectedLineId && !isLineSelected ? 0.15 : 1;

      line.stations.forEach((station) => {
        const coord = stationCoords[station.id];
        if (!coord) return;

        const isDeparture = station.id === departureStationId;
        const isDestination = station.id === destinationStationId;
        const isJourneyStation = journeySet.has(station.id);
        const isCurrentStation =
          journeyStations && currentStationIndex !== undefined
            ? journeyStations[currentStationIndex] === station.id
            : false;
        const isPassed =
          journeyStations && currentStationIndex !== undefined
            ? journeyStations.indexOf(station.id) < currentStationIndex
            : false;
        const hasTransfer = station.transfers.length > 0;

        let fill = '#fff';
        let stroke = lineColors[line.id] || '#888';
        let r = STATION_RADIUS;
        let strokeWidth = 1.5;
        let opacity = lineOpacity;

        if (isDeparture) {
          fill = AppColors.success;
          stroke = '#fff';
          r = STATION_RADIUS_SELECTED;
          strokeWidth = 2;
          opacity = 1;
        } else if (isDestination) {
          fill = AppColors.error;
          stroke = '#fff';
          r = STATION_RADIUS_SELECTED;
          strokeWidth = 2;
          opacity = 1;
        } else if (isCurrentStation) {
          fill = AppColors.primary;
          stroke = '#fff';
          r = STATION_RADIUS_SELECTED;
          strokeWidth = 2;
          opacity = 1;
        } else if (isPassed) {
          fill = '#555';
          opacity = 0.5;
        } else if (isJourneyStation) {
          fill = lineColors[line.id] || '#888';
          stroke = '#fff';
          r = 6;
          opacity = 1;
        } else if (hasTransfer) {
          fill = '#fff';
          stroke = lineColors[line.id] || '#888';
          r = 5.5;
          strokeWidth = 2;
        }

        elements.push(
          <Circle
            key={station.id}
            cx={coord.x}
            cy={coord.y}
            r={r}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            onPress={() => handleStationPress(station.id, line.id)}
          />
        );
      });
    });

    return elements;
  }, [
    selectedLineId,
    departureStationId,
    destinationStationId,
    journeySet,
    currentStationIndex,
    journeyStations,
    handleStationPress,
    lineColors,
  ]);

  return (
    <View style={styles.container}>
      <Svg viewBox={VIEWBOX} style={styles.svg}>
        {/* Line paths */}
        <G>{lineElements}</G>

        {/* Journey highlight */}
        {journeyPath && (
          <Polyline
            points={journeyPath}
            stroke={AppColors.primary}
            strokeWidth={7}
            fill="none"
            opacity={0.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Station dots */}
        <G>{stationElements}</G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
  },
  svg: {
    flex: 1,
  },
});
