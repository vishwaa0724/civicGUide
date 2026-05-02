/**
 * @file geo.js
 * Pure utility functions for geographic data processing.
 * Extracted from ConstituencyFinder for testability and reuse.
 */

/**
 * Overpass API mirrors — tried in order until one succeeds.
 * Multiple public endpoints reduce the impact of any single server being down.
 */
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

/**
 * Builds an Overpass QL query to fetch assembly constituency
 * boundaries (admin_level=6, boundary=political) for a given Indian state.
 * @param {string} stateName - e.g. 'Tamil Nadu' or 'West Bengal'
 * @returns {string} Overpass QL query string
 */
export const buildOverpassQuery = (stateName) => {
  const stateOSMName = stateName === 'West Bengal' ? 'West Bengal' : 'Tamil Nadu';
  return `[out:json][timeout:45];
area["name"="${stateOSMName}"]["admin_level"="4"]->.searchArea;
relation["boundary"="political"]["admin_level"="6"](area.searchArea);
out geom;`;
};

/**
 * Converts Overpass API JSON response to a GeoJSON FeatureCollection.
 * Each relation becomes a Feature with a MultiPolygon geometry.
 * @param {Object} data - Raw Overpass API response
 * @returns {{ type: 'FeatureCollection', features: Array }}
 */
export const overpassToGeoJSON = (data) => {
  const features = data.elements
    .filter((el) => el.type === 'relation' && el.members)
    .map((relation) => {
      const name =
        relation.tags?.name ||
        relation.tags?.['name:en'] ||
        `Constituency ${relation.id}`;

      const ways = relation.members.filter(
        (m) => m.type === 'way' && m.role === 'outer' && m.geometry,
      );

      if (ways.length === 0) return null;

      const rings = ways.map((w) => w.geometry.map((pt) => [pt.lon, pt.lat]));

      return {
        type: 'Feature',
        properties: {
          AC_NAME: name,
          OSM_ID: relation.id,
          TAGS: relation.tags,
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: rings.map((ring) => [ring]),
        },
      };
    })
    .filter(Boolean);

  return { type: 'FeatureCollection', features };
};

/**
 * Fetches from Overpass API with automatic mirror fallback.
 * Tries each mirror in sequence; throws only if all fail.
 * @param {string} query - Overpass QL query string
 * @returns {Promise<Object>} Raw Overpass JSON response
 */
const fetchFromOverpass = async (query) => {
  let lastError;
  for (const url of OVERPASS_MIRRORS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(30000), // 30s timeout per mirror
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn(`Overpass mirror ${url} failed:`, err.message);
      lastError = err;
    }
  }
  throw lastError;
};

/**
 * Fetches constituency GeoJSON for a given state from Overpass API.
 * Automatically retries across multiple mirror servers before failing.
 * @param {string} stateName
 * @returns {Promise<{ type: 'FeatureCollection', features: Array }>}
 */
export const fetchConstituencies = async (stateName) => {
  const query = buildOverpassQuery(stateName);
  const data = await fetchFromOverpass(query);
  const geo = overpassToGeoJSON(data);
  if (geo.features.length === 0) throw new Error('No features returned');
  return geo;
};

/**
 * Converts a GeoJSON MultiPolygon or Polygon geometry to an array of
 * Google Maps LatLng-compatible objects ({ lat, lng }).
 * Takes only the first ring of the first polygon for simplicity.
 * @param {{ type: string, coordinates: Array }} geometry
 * @returns {Array<{ lat: number, lng: number }>}
 */
export const geoJsonToGMPaths = (geometry) => {
  if (!geometry?.coordinates) return [];
  const coords =
    geometry.type === 'MultiPolygon'
      ? geometry.coordinates[0][0]
      : geometry.coordinates[0];
  return (coords || []).map(([lng, lat]) => ({ lat, lng }));
};
