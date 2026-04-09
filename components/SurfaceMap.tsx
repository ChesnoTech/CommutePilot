/**
 * Surface map using WebView + Leaflet.js + OpenStreetMap tiles.
 * 100% free, no API key, no limits.
 * Supports: user location, route paths, road quality heatmap overlay.
 */

import { useRef, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { GeoPoint, RoadQualitySample } from '@/data/types';
import { AppColors } from '@/constants/colors';

interface SurfaceMapProps {
  /** Center point for the map */
  center?: GeoPoint;
  /** Zoom level (default 14) */
  zoom?: number;
  /** User's current location */
  userLocation?: GeoPoint | null;
  /** Route waypoints to draw as a polyline */
  routePoints?: GeoPoint[];
  /** Road quality samples to display as colored circles */
  qualitySamples?: RoadQualitySample[];
  /** Markers: departure, destination, bus stops, etc. */
  markers?: Array<{
    position: GeoPoint;
    label: string;
    color: 'green' | 'red' | 'blue' | 'orange';
  }>;
  /** Called when user taps the map */
  onMapPress?: (point: GeoPoint) => void;
}

// Moscow center default
const MOSCOW_CENTER: GeoPoint = { latitude: 55.7558, longitude: 37.6173 };

function buildHtml(
  center: GeoPoint,
  zoom: number,
  userLocation: GeoPoint | null,
  routePoints: GeoPoint[],
  qualitySamples: RoadQualitySample[],
  markers: SurfaceMapProps['markers']
): string {
  const qualityColors: Record<string, string> = {
    smooth: '#4ade80',
    rough: '#facc15',
    poor: '#ef4444',
  };

  const markersJs = (markers ?? [])
    .map(
      (m) =>
        `L.circleMarker([${m.position.latitude}, ${m.position.longitude}], {
          radius: 10, fillColor: '${m.color}', color: '#fff', weight: 2, fillOpacity: 0.9
        }).addTo(map).bindTooltip('${m.label.replace(/'/g, "\\'")}', {permanent: true, direction: 'top', offset: [0, -10]});`
    )
    .join('\n');

  const routeJs =
    routePoints.length >= 2
      ? `L.polyline([${routePoints.map((p) => `[${p.latitude}, ${p.longitude}]`).join(',')}], {color: '${AppColors.primary}', weight: 4, opacity: 0.8}).addTo(map);`
      : '';

  const qualityJs = qualitySamples
    .map(
      (s) =>
        `L.circleMarker([${s.latitude}, ${s.longitude}], {
          radius: 6, fillColor: '${qualityColors[s.quality] || '#888'}',
          color: 'transparent', fillOpacity: 0.7
        }).addTo(qualityLayer);`
    )
    .join('\n');

  const userJs = userLocation
    ? `L.circleMarker([${userLocation.latitude}, ${userLocation.longitude}], {
        radius: 8, fillColor: '#3b82f6', color: '#fff', weight: 3, fillOpacity: 1
      }).addTo(map);
      L.circle([${userLocation.latitude}, ${userLocation.longitude}], {
        radius: 30, fillColor: '#3b82f6', color: 'transparent', fillOpacity: 0.15
      }).addTo(map);`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    #map { width: 100vw; height: 100vh; background: ${AppColors.background}; }
    .leaflet-control-attribution { display: none !important; }
    .leaflet-tooltip {
      background: rgba(13,13,26,0.9); color: #fff; border: 1px solid #d4a853;
      font-size: 11px; padding: 2px 6px; border-radius: 4px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      center: [${center.latitude}, ${center.longitude}],
      zoom: ${zoom},
      zoomControl: false,
      attributionControl: false
    });

    // Dark OSM tiles (CartoDB Dark Matter — free, no key)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Quality heatmap layer
    var qualityLayer = L.layerGroup().addTo(map);
    ${qualityJs}

    // Route
    ${routeJs}

    // Markers
    ${markersJs}

    // User location
    ${userJs}

    // Map tap handler
    map.on('click', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'mapPress',
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }));
    });
  </script>
</body>
</html>`;
}

export function SurfaceMap({
  center = MOSCOW_CENTER,
  zoom = 14,
  userLocation = null,
  routePoints = [],
  qualitySamples = [],
  markers = [],
  onMapPress,
}: SurfaceMapProps) {
  const webViewRef = useRef<WebView>(null);

  const html = useMemo(
    () => buildHtml(center, zoom, userLocation, routePoints, qualitySamples, markers),
    [center, zoom, userLocation, routePoints, qualitySamples, markers]
  );

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'mapPress' && onMapPress) {
          onMapPress({ latitude: data.latitude, longitude: data.longitude });
        }
      } catch {
        // ignore
      }
    },
    [onMapPress]
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});
