import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, InfoWindow, Marker } from '@react-google-maps/api';
import { MapPin, Search, Navigation, Info, X, Loader2, RefreshCw } from 'lucide-react';
import { KEY_SEATS, STATE_VIEWS } from '../data/elections.js';
import { geoJsonToGMPaths, fetchConstituencies } from '../utils/geo.js';
import { trackEvent } from '../firebase.js';

/** In-memory cache — prevents re-fetching Overpass data on state switch */
const geoCache = {};

/**
 * Static fallback markers for key contested seats.
 * Shown when the Overpass API is unavailable, so the map remains useful.
 * Coordinates are approximate centroids of the constituency.
 */
const FALLBACK_MARKERS = {
  'Tamil Nadu': [
    { name: 'Kolathur',        lat: 13.1300, lng: 80.2176, candidate: 'M. K. Stalin (DMK)' },
    { name: 'Edappadi',        lat: 11.5943, lng: 77.8595, candidate: 'E. K. Palaniswami (AIADMK)' },
    { name: 'Aravakurichi',    lat: 10.9601, lng: 78.5132, candidate: 'K. Annamalai (BJP)' },
    { name: 'Harbour',         lat: 13.0827, lng: 80.2785, candidate: 'Seeman (NTK)' },
    { name: 'Coimbatore South',lat: 11.0168, lng: 76.9558, candidate: 'Contested (BJP vs DMK)' },
  ],
  'West Bengal': [
    { name: 'Bhawanipur',      lat: 22.5178, lng: 88.3458, candidate: 'Mamata Banerjee (AITC)' },
    { name: 'Nandigram',       lat: 22.0167, lng: 87.9833, candidate: 'Suvendu Adhikari (BJP)' },
    { name: 'Ballygunge',      lat: 22.5264, lng: 88.3700, candidate: 'Biman Bose (CPI-M)' },
    { name: 'Howrah North',    lat: 22.5958, lng: 88.2636, candidate: 'Contested' },
    { name: 'Asansol',         lat: 23.6889, lng: 86.9661, candidate: 'Contested (TMC vs BJP)' },
  ],
};

/** Clean silver Google Maps style — matches the app's light palette */
const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d3dc' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const MAP_OPTIONS = {
  styles: MAP_STYLES,
  disableDefaultUI: true,
  zoomControl: true,
  scrollwheel: true,
  gestureHandling: 'cooperative',
};

const POLYGON_DEFAULT  = { fillColor: '#93c5fd', fillOpacity: 0.22, strokeColor: '#3b82f6', strokeWeight: 0.7 };
const POLYGON_KEY_SEAT = { fillColor: '#7C3AED', fillOpacity: 0.40, strokeColor: '#6D28D9', strokeWeight: 1.6 };
const POLYGON_SELECTED = { fillColor: '#1A73E8', fillOpacity: 0.70, strokeColor: '#1557B0', strokeWeight: 2.5 };
const POLYGON_HOVER    = { fillOpacity: 0.60, strokeWeight: 2 };

/**
 * ConstituencyFinder — powered by Google Maps JavaScript API.
 *
 * Data flow:
 *  1. On state selection, fetch real boundary polygons from the Overpass API.
 *  2. Cache result in module-level `geoCache` — subsequent switches are instant.
 *  3. Render each constituency as a Google Maps Polygon with click/hover handlers.
 *  4. Selected constituency opens a styled InfoWindow with candidate details.
 */
export const ConstituencyFinder = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY || '',
    id: 'google-map-script',
  });

  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [geoData, setGeoData] = useState(null);
  const [fetchStatus, setFetchStatus] = useState('idle'); // idle | loading | success | error
  const [selected, setSelected] = useState(null);    // { name, candidate, status, position }
  const [infoPos, setInfoPos] = useState(null);       // google.maps.LatLng for InfoWindow
  const [searchVal, setSearchVal] = useState('');
  const [searchMsg, setSearchMsg] = useState('');
  const mapRef = useRef(null);

  const onMapLoad = useCallback((map) => { mapRef.current = map; }, []);

  const loadData = useCallback((state) => {
    // Serve from cache if available
    if (geoCache[state]) {
      setGeoData(geoCache[state]);
      setFetchStatus('success');
      return;
    }

    setFetchStatus('loading');
    setSelected(null);
    setInfoPos(null);
    setSearchMsg('');

    fetchConstituencies(state)
      .then((geo) => {
        geoCache[state] = geo;
        setGeoData(geo);
        setFetchStatus('success');
      })
      .catch((err) => {
        console.error('Overpass error (all mirrors failed):', err);
        setFetchStatus('error');
      });
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(selectedState); }, [selectedState, loadData]);

  // Pan map to new state when selection changes
  useEffect(() => {
    if (mapRef.current && STATE_VIEWS[selectedState]) {
      const { center, zoom } = STATE_VIEWS[selectedState];
      mapRef.current.panTo(center);
      mapRef.current.setZoom(zoom);
    }
  }, [selectedState]);

  const getKeySeat = (name) => {
    const seats = KEY_SEATS[selectedState] || {};
    return (
      seats[name] ||
      Object.entries(seats).find(([k]) => name?.toLowerCase().includes(k.toLowerCase()))?.[1]
    );
  };

  const handlePolygonClick = (feature, e) => {
    const name = feature.properties.AC_NAME || 'Unknown';
    const keySeat = getKeySeat(name);
    const info = {
      name,
      candidate: keySeat?.candidate || 'Data not available for this seat',
      status: keySeat?.status || `Voted — ${selectedState === 'West Bengal' ? 'Apr 23 or 29, 2026' : 'Apr 23, 2026'}`,
    };
    setSelected(info);
    setInfoPos(e.latLng);
    trackEvent('constituency_selected', { name, state: selectedState });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!geoData || !searchVal.trim()) return;
    const q = searchVal.trim().toLowerCase();
    const found = geoData.features.find((f) =>
      (f.properties.AC_NAME || '').toLowerCase().includes(q)
    );
    if (found) {
      const name = found.properties.AC_NAME;
      const keySeat = getKeySeat(name);
      setSelected({
        name,
        candidate: keySeat?.candidate || 'Data not available',
        status: keySeat?.status || 'Voted — 2026',
      });
      setSearchMsg('');
      // Centre map on first polygon coordinate as approximation
      const paths = geoJsonToGMPaths(found.geometry);
      if (paths.length && mapRef.current) mapRef.current.panTo(paths[0]);
    } else {
      setSearchMsg('No constituency found. Try a different name.');
    }
  };

  const { center, zoom } = STATE_VIEWS[selectedState];

  return (
    <section className="py-24 bg-white" id="finder" aria-labelledby="finder-heading">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <MapPin size={15} aria-hidden="true" /> Interactive Constituency Map — Google Maps
            </div>
            <h2 id="finder-heading" className="text-4xl font-bold text-slate-900 tracking-tight">
              Find Your Constituency
            </h2>
            <p className="mt-2 text-slate-500 max-w-lg">
              Real assembly constituency boundaries via OpenStreetMap · rendered on Google Maps. Click any constituency to see candidate info.
            </p>
          </div>
          <div className="flex gap-3" role="group" aria-label="Select state">
            {Object.keys(STATE_VIEWS).map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                aria-pressed={selectedState === state}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                  selectedState === state
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="flex flex-col gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2" role="search" aria-label="Search constituency">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
                <label htmlFor="constituency-search" className="sr-only">Search constituency name</label>
                <input
                  id="constituency-search"
                  type="text"
                  placeholder="Search constituency name..."
                  value={searchVal}
                  onChange={(e) => { setSearchVal(e.target.value); setSearchMsg(''); }}
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  disabled={fetchStatus !== 'success'}
                  aria-disabled={fetchStatus !== 'success'}
                  data-testid="constituency-search"
                />
              </div>
              <button
                type="submit"
                disabled={fetchStatus !== 'success'}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Go
              </button>
            </form>
            {searchMsg && <p className="text-xs text-red-500 px-1" role="alert">{searchMsg}</p>}

            {/* Selected info */}
            {selected ? (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 relative" role="region" aria-label="Selected constituency details">
                <button
                  onClick={() => { setSelected(null); setInfoPos(null); }}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  aria-label="Clear selection"
                >
                  <X size={15} aria-hidden="true" />
                </button>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2">Selected Constituency</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{selected.name}</h3>
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400 flex-shrink-0">Key Candidate</dt>
                    <dd className="font-medium text-slate-800 text-right">{selected.candidate}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400 flex-shrink-0">Voting Status</dt>
                    <dd className="font-semibold text-emerald-600">{selected.status}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-400 flex-shrink-0">Results</dt>
                    <dd className="font-semibold text-blue-600">May 4, 2026</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
                <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-slate-500">
                  Click any constituency on the map to view candidate details and voting status.
                </p>
              </div>
            )}

            {/* Legend */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4" role="list" aria-label="Map legend">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Legend</div>
              <div className="space-y-2 text-sm text-slate-600">
                {[
                  { color: 'bg-blue-600', label: 'Selected constituency' },
                  { color: 'bg-violet-600', label: 'Key contested seat' },
                  { color: 'bg-blue-300', label: 'Other constituencies' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2.5" role="listitem">
                    <div className={`w-4 h-4 rounded ${color} opacity-80`} aria-hidden="true" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official ECI link */}
            <a
              href="https://electoralsearch.eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Official ECI Voter Search (opens in new tab)"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              <Navigation size={15} aria-hidden="true" /> Official ECI Voter Search
            </a>
          </div>

          {/* Google Map */}
          <div
            className="lg:col-span-2 h-[560px] rounded-3xl overflow-hidden border border-slate-200 relative"
            style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.14), 0 3px 6px rgba(0,0,0,0.20)' }}
            role="application"
            aria-label={`Assembly constituency map — ${selectedState}`}
          >
            {/* Loading overlay */}
            {fetchStatus === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-[1000]" role="status" aria-live="polite">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-600">Loading {selectedState} constituency boundaries…</p>
                  <p className="text-xs text-slate-400">Fetching from OpenStreetMap (may take ~10s)</p>
                </div>
              </div>
            )}

            {/* Error banner — non-blocking so the map + fallback markers still render */}
            {fetchStatus === 'error' && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl shadow text-sm" role="alert">
                <span className="text-amber-600 font-semibold">⚠️ Boundary data unavailable</span>
                <span className="text-amber-700">— showing key seats only.</span>
                <button
                  onClick={() => loadData(selectedState)}
                  className="ml-2 flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw size={12} aria-hidden="true" /> Retry
                </button>
              </div>
            )}

            {/* Maps API load error */}
            {loadError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-[1000]" role="alert">
                <p className="text-red-600 font-semibold">Google Maps failed to load. Check your API key.</p>
              </div>
            )}

            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                center={center}
                zoom={zoom}
                options={MAP_OPTIONS}
                onLoad={onMapLoad}
              >
                {geoData && fetchStatus === 'success' &&
                  geoData.features.map((feature, idx) => {
                    const name = feature.properties.AC_NAME || '';
                    const isKeySeat = !!getKeySeat(name);
                    const isSelected = selected?.name === name;
                    const baseStyle = isSelected
                      ? POLYGON_SELECTED
                      : isKeySeat
                      ? POLYGON_KEY_SEAT
                      : POLYGON_DEFAULT;

                    return (
                      <Polygon
                        key={`${selectedState}-${idx}`}
                        paths={geoJsonToGMPaths(feature.geometry)}
                        options={baseStyle}
                        onClick={(e) => handlePolygonClick(feature, e)}
                        onMouseOver={(e) => {
                          e.target?.setOptions(POLYGON_HOVER);
                        }}
                        onMouseOut={(e) => {
                          e.target?.setOptions(baseStyle);
                        }}
                      />
                    );
                  })}

                {/* Fallback markers — shown when Overpass boundary data is unavailable */}
                {fetchStatus === 'error' &&
                  (FALLBACK_MARKERS[selectedState] || []).map((marker, idx) => (
                    <Marker
                      key={`fallback-${idx}`}
                      position={{ lat: marker.lat, lng: marker.lng }}
                      title={marker.name}
                      onClick={() => {
                        setSelected({
                          name: marker.name,
                          candidate: marker.candidate,
                          status: `Voted — ${selectedState === 'West Bengal' ? 'Apr 23 or 29, 2026' : 'Apr 23, 2026'}`,
                        });
                        setInfoPos({ lat: marker.lat, lng: marker.lng });
                        trackEvent('constituency_selected', { name: marker.name, state: selectedState, source: 'fallback' });
                      }}
                    />
                  ))}

                {selected && infoPos && (
                  <InfoWindow
                    position={infoPos}
                    onCloseClick={() => { setSelected(null); setInfoPos(null); }}
                    options={{ maxWidth: 260 }}
                  >
                    <div className="p-1">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                        {selectedState}
                      </p>
                      <h3 className="font-bold text-slate-900 text-base mb-2">{selected.name}</h3>
                      <p className="text-xs text-slate-600 mb-1">
                        <span className="font-semibold">Candidate:</span> {selected.candidate}
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold">{selected.status}</p>
                      <p className="text-xs text-blue-600 font-semibold mt-1">Results: May 4, 2026</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
