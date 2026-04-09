/**
 * Free geocoding using OpenStreetMap Nominatim.
 * No API key required. Rate limit: 1 request/second.
 * Usage policy: https://operations.osmfoundation.org/policies/nominatim/
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocode an address string to coordinates.
 * Biased to Moscow, Russia for best results.
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const query = `${address}, Москва, Россия`;
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      addressdetails: '0',
      // Bias to Moscow bounding box
      viewbox: '37.2,56.05,37.95,55.5',
      bounded: '1',
    });

    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': 'CommutePilot/0.1.0 (commute alarm app)',
        'Accept-Language': 'ru,en',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch {
    return null;
  }
}
