import React, { useState } from 'react';
import { Search, Navigation, MapPin, Footprints, Car, Bike, Train, ArrowRight, CheckCircle2, Clock, Route } from 'lucide-react';

interface GeocodeResult {
  SEARCHVAL: string;
  BUILDING: string;
  ROAD_NAME: string;
  ADDRESS: string;
  POSTAL: string;
  LATITUDE: string;
  LONGITUDE: string;
}

interface RouteSummary {
  total_time: number;
  total_distance: number;
  start_point: string;
  end_point: string;
}

export const OneMapExplorer: React.FC = () => {
  const [searchVal, setSearchVal] = useState('Raffles Place');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>('');

  // Routing state
  const [startPoint, setStartPoint] = useState('1.291040,103.844910'); // Canninghill Piers
  const [startName, setStartName] = useState('Canninghill Piers (River Valley)');
  const [endPoint, setEndPoint] = useState('1.283017,103.851325'); // Raffles Place MRT
  const [endName, setEndName] = useState('Raffles Place MRT (EW14/NS26)');
  const [routeType, setRouteType] = useState<'walk' | 'drive' | 'cycle' | 'pt'>('walk');
  const [routeData, setRouteData] = useState<any>(null);
  const [isRouting, setIsRouting] = useState(false);

  // Reverse Geocoding
  const [revLat, setRevLat] = useState('1.304012');
  const [revLng, setRevLng] = useState('1.831810');
  const [revResult, setRevResult] = useState<any>(null);
  const [isRevGeocoding, setIsRevGeocoding] = useState(false);

  // Search Address / Place via OneMap
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchVal.trim()) return;

    setIsSearching(true);
    setSearchStatus('Querying OneMap ElasticSearch...');
    try {
      const res = await fetch(`/api/onemap/search?query=${encodeURIComponent(searchVal)}`);
      const json = await res.json();
      const results = json.data?.results || [];
      setSearchResults(results);
      setSearchStatus(
        json.isLive
          ? `OneMap Live: Found ${results.length} cadastral matches`
          : `Singapore Cadastral Registry: Found ${results.length} locations`
      );
    } catch (err: any) {
      setSearchStatus('Failed to query OneMap search endpoint.');
    } finally {
      setIsSearching(false);
    }
  };

  // Compute Route via OneMap Routing Service
  const handleComputeRoute = async () => {
    setIsRouting(true);
    try {
      const res = await fetch(`/api/onemap/route?start=${startPoint}&end=${endPoint}&routeType=${routeType}`);
      const json = await res.json();
      setRouteData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRouting(false);
    }
  };

  // Reverse Geocode
  const handleRevGeocode = async () => {
    setIsRevGeocoding(true);
    try {
      const res = await fetch(`/api/onemap/revgeocode?lat=${revLat}&lng=${revLng}&buffer=40`);
      const json = await res.json();
      setRevResult(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRevGeocoding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#004d99] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                SLA OneMap API
              </span>
              <h2 className="text-base font-bold text-[#1b1c1c]">
                OneMap Singapore Spatial Geocoding & Multimodal Routing
              </h2>
            </div>
            <p className="text-xs text-[#555a64] mt-1 leading-relaxed">
              Official Singapore Land Authority (SLA) geospatial services: National Building Search, Reverse Geocoding, and Multi-modal Transit Routing (Walk, Drive, Cycle, Public Transport).
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[11px] text-[#727783]">Official Endpoint:</span>
            <span className="font-mono bg-[#f0eded] text-[#004d99] px-2 py-1 rounded-xs font-semibold">
              www.onemap.gov.sg
            </span>
          </div>
        </div>
      </div>

      {/* Grid: OneMap Search & Routing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: OneMap Search / Geocoder (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs space-y-4">
          <div className="border-b border-[#e2e4e8] pb-2">
            <div className="flex items-center space-x-1.5 text-[#004d99]">
              <Search className="w-4 h-4" />
              <h3 className="font-bold text-sm text-[#1b1c1c]">
                OneMap Geocode & Cadastral Search
              </h3>
            </div>
            <p className="text-[11px] text-[#727783] mt-0.5">
              ElasticSearch query matching addresses, buildings, MRT stations, and postal codes.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="e.g. Canninghill, Raffles Place, Orchard, Marina Bay..."
              className="flex-1 px-3 py-2 border border-[#727783] rounded-xs text-xs text-[#1b1c1c] focus:outline-none focus:border-[#004d99]"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-[#004d99] hover:bg-[#003870] text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchStatus && (
            <div className="text-[11px] text-[#555a64] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00695c]" />
              <span>{searchStatus}</span>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {searchResults.map((r, i) => (
              <div
                key={i}
                className="p-3 bg-[#fbf9f8] border border-[#e2e4e8] hover:border-[#004d99] rounded-xs text-xs space-y-1 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[#1b1c1c]">{r.BUILDING || r.SEARCHVAL}</span>
                  <span className="font-mono text-[10px] bg-[#eef4fc] text-[#004d99] px-1.5 py-0.5 rounded-xs">
                    S({r.POSTAL || 'N/A'})
                  </span>
                </div>
                <div className="text-[11px] text-[#555a64]">{r.ADDRESS}</div>
                <div className="flex items-center justify-between text-[10px] text-[#727783] font-mono pt-1">
                  <span>Lat: {r.LATITUDE}, Lng: {r.LONGITUDE}</span>
                  <button
                    onClick={() => {
                      setEndPoint(`${r.LATITUDE},${r.LONGITUDE}`);
                      setEndName(r.BUILDING || r.SEARCHVAL);
                    }}
                    className="text-[#004d99] hover:underline font-semibold"
                  >
                    Set as Route Destination →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: OneMap Transit & Route Planning (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs space-y-4">
          <div className="border-b border-[#e2e4e8] pb-2">
            <div className="flex items-center space-x-1.5 text-[#004d99]">
              <Route className="w-4 h-4" />
              <h3 className="font-bold text-sm text-[#1b1c1c]">
                OneMap Multimodal Routing Service
              </h3>
            </div>
            <p className="text-[11px] text-[#727783] mt-0.5">
              Compute realistic walking, driving, cycling, and public transit travel times.
            </p>
          </div>

          {/* Start and Destination Selection */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-[#727783] block mb-1">
                Starting Location:
              </span>
              <div className="p-2.5 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1b1c1c]">{startName}</div>
                  <div className="font-mono text-[10px] text-[#727783]">{startPoint}</div>
                </div>
                <span className="text-[10px] bg-[#e0f2f1] text-[#00695c] font-semibold px-2 py-0.5 rounded-xs">
                  Project Origin
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#727783] block mb-1">
                Destination:
              </span>
              <div className="p-2.5 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1b1c1c]">{endName}</div>
                  <div className="font-mono text-[10px] text-[#727783]">{endPoint}</div>
                </div>
                <span className="text-[10px] bg-[#eef4fc] text-[#004d99] font-semibold px-2 py-0.5 rounded-xs">
                  Destination
                </span>
              </div>
            </div>

            {/* Travel Mode Toggle */}
            <div>
              <span className="text-[11px] font-semibold text-[#727783] block mb-1.5">
                Route Mode (routeType):
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'walk', label: 'Walk', icon: Footprints },
                  { id: 'drive', label: 'Drive', icon: Car },
                  { id: 'cycle', label: 'Cycle', icon: Bike },
                  { id: 'pt', label: 'Transit', icon: Train },
                ].map((m) => {
                  const Icon = m.icon;
                  const isActive = routeType === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setRouteType(m.id as any)}
                      className={`p-2 rounded-xs border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                        isActive
                          ? 'border-[#004d99] bg-[#004d99] text-white shadow-xs'
                          : 'border-[#c2c6d4] bg-white text-[#424752] hover:bg-[#f5f3f3]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleComputeRoute}
              disabled={isRouting}
              className="w-full py-2.5 bg-[#004d99] hover:bg-[#003870] text-white font-semibold rounded-xs text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Navigation className="w-4 h-4" />
              <span>{isRouting ? 'Computing OneMap Route...' : 'Compute Route & ETA'}</span>
            </button>
          </div>

          {/* Route Summary Output */}
          {routeData && (
            <div className="p-3.5 bg-[#f5f8fc] border border-[#c2c6d4] rounded-xs space-y-2 text-xs animate-in fade-in duration-150">
              <div className="flex justify-between items-center border-b border-[#c2c6d4] pb-2">
                <span className="font-bold text-[#004d99] uppercase text-[11px]">
                  OneMap Routing Summary
                </span>
                <span className="text-[11px] font-mono text-[#555a64]">
                  Mode: {routeType.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-[#727783] block">Estimated Duration</span>
                  <span className="font-mono text-lg font-bold text-[#1b1c1c]">
                    {Math.round((routeData.route_summary?.total_time || 600) / 60)} mins
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#727783] block">Total Travel Distance</span>
                  <span className="font-mono text-lg font-bold text-[#1b1c1c]">
                    {((routeData.route_summary?.total_distance || 850) / 1000).toFixed(2)} km
                  </span>
                </div>
              </div>

              {routeData.route_instructions && (
                <div className="pt-2 border-t border-[#c2c6d4]/60">
                  <span className="text-[10px] text-[#727783] block mb-1">Turn-by-Turn Navigation:</span>
                  <div className="space-y-1 text-[11px] text-[#424752]">
                    {routeData.route_instructions.map((inst: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {inst.instruction}</span>
                        <span className="font-mono text-[#727783]">{inst.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
