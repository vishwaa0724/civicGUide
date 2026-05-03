/* eslint-disable */
import { describe, it, expect } from 'vitest';
import { overpassToGeoJSON, buildOverpassQuery, geoJsonToGMPaths } from '../../utils/geo.js';

// ── buildOverpassQuery ────────────────────────────────────────────────────────

describe('buildOverpassQuery', () => {
  it('includes the correct state name for Tamil Nadu', () => {
    const query = buildOverpassQuery('Tamil Nadu');
    expect(query).toContain('"Tamil Nadu"');
    expect(query).toContain('admin_level"="6"');
  });

  it('includes the correct state name for West Bengal', () => {
    const query = buildOverpassQuery('West Bengal');
    expect(query).toContain('"West Bengal"');
  });

  it('returns a string with Overpass QL syntax', () => {
    const query = buildOverpassQuery('Tamil Nadu');
    expect(query).toContain('[out:json]');
    expect(query).toContain('boundary"="political"');
  });
});

// ── overpassToGeoJSON ─────────────────────────────────────────────────────────

const MOCK_OVERPASS_RESPONSE = {
  elements: [
    {
      type: 'relation',
      id: 12345,
      tags: { name: 'Kolathur', 'name:en': 'Kolathur' },
      members: [
        {
          type: 'way',
          role: 'outer',
          geometry: [
            { lat: 13.0, lon: 80.2 },
            { lat: 13.1, lon: 80.3 },
            { lat: 13.0, lon: 80.2 },
          ],
        },
      ],
    },
    {
      type: 'relation',
      id: 67890,
      tags: {},
      members: [], // No outer ways — should be filtered out
    },
    {
      type: 'node', // Non-relation — should be filtered out
      id: 99999,
    },
  ],
};

describe('overpassToGeoJSON', () => {
  it('returns a GeoJSON FeatureCollection', () => {
    const result = overpassToGeoJSON(MOCK_OVERPASS_RESPONSE);
    expect(result.type).toBe('FeatureCollection');
    expect(Array.isArray(result.features)).toBe(true);
  });

  it('converts valid relation with outer ways to a Feature', () => {
    const result = overpassToGeoJSON(MOCK_OVERPASS_RESPONSE);
    expect(result.features).toHaveLength(1);
    expect(result.features[0].type).toBe('Feature');
  });

  it('sets AC_NAME from the relation tags', () => {
    const result = overpassToGeoJSON(MOCK_OVERPASS_RESPONSE);
    expect(result.features[0].properties.AC_NAME).toBe('Kolathur');
  });

  it('creates a MultiPolygon geometry', () => {
    const result = overpassToGeoJSON(MOCK_OVERPASS_RESPONSE);
    expect(result.features[0].geometry.type).toBe('MultiPolygon');
  });

  it('converts lat/lon to [lon, lat] GeoJSON coordinate order', () => {
    const result = overpassToGeoJSON(MOCK_OVERPASS_RESPONSE);
    const coord = result.features[0].geometry.coordinates[0][0][0];
    // GeoJSON uses [longitude, latitude]
    expect(coord[0]).toBe(80.2); // lon
    expect(coord[1]).toBe(13.0); // lat
  });

  it('filters out relations with no outer way members', () => {
    const result = overpassToGeoJSON(MOCK_OVERPASS_RESPONSE);
    // relation 67890 has no members with role=outer — should be excluded
    const ids = result.features.map((f) => f.properties.OSM_ID);
    expect(ids).not.toContain(67890);
  });

  it('filters out non-relation elements', () => {
    const result = overpassToGeoJSON(MOCK_OVERPASS_RESPONSE);
    const ids = result.features.map((f) => f.properties.OSM_ID);
    expect(ids).not.toContain(99999);
  });

  it('falls back to Constituency ID when name tag is missing', () => {
    const noNameResponse = {
      elements: [
        {
          type: 'relation',
          id: 111,
          tags: {},
          members: [{ type: 'way', role: 'outer', geometry: [{ lat: 10, lon: 78 }] }],
        },
      ],
    };
    const result = overpassToGeoJSON(noNameResponse);
    expect(result.features[0].properties.AC_NAME).toBe('Constituency 111');
  });
});

// ── geoJsonToGMPaths ──────────────────────────────────────────────────────────

describe('geoJsonToGMPaths', () => {
  it('converts MultiPolygon GeoJSON to {lat, lng} array', () => {
    const geometry = {
      type: 'MultiPolygon',
      coordinates: [[[[80.2, 13.0], [80.3, 13.1], [80.2, 13.0]]]],
    };
    const paths = geoJsonToGMPaths(geometry);
    expect(paths).toEqual([
      { lat: 13.0, lng: 80.2 },
      { lat: 13.1, lng: 80.3 },
      { lat: 13.0, lng: 80.2 },
    ]);
  });

  it('converts Polygon GeoJSON to {lat, lng} array', () => {
    const geometry = {
      type: 'Polygon',
      coordinates: [[[78.0, 10.0], [78.1, 10.1], [78.0, 10.0]]],
    };
    const paths = geoJsonToGMPaths(geometry);
    expect(paths[0]).toEqual({ lat: 10.0, lng: 78.0 });
  });

  it('returns an empty array for null geometry', () => {
    expect(geoJsonToGMPaths(null)).toEqual([]);
  });

  it('returns an empty array for geometry with no coordinates', () => {
    expect(geoJsonToGMPaths({ type: 'MultiPolygon' })).toEqual([]);
  });
});
