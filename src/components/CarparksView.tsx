import React, { useState, useEffect } from 'react';
import { Car, RefreshCw, Search, Clock, DollarSign, MapPin, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface CarparkItem {
  id: string;
  code: string;
  name: string;
  vehCat: string;
  capacity: number;
  lotsAvailable: number;
  occupancyRate: number;
  weekdayRate: string;
  weekdayMin: string;
  satdayRate: string;
  satdayMin: string;
  sunPHRate: string;
  sunPHMin: string;
  startTime: string;
  endTime: string;
  area?: string;
}

export const CarparksView: React.FC = () => {
  const [carparks, setCarparks] = useState<CarparkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchCarparks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ura/carparks');
      const data = await res.json();
      setCarparks(data.data || []);
      setIsLive(Boolean(data.isLive));
      setStatusMessage(data.message || 'Carpark telemetry loaded.');
      setLastRefreshed(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err: any) {
      console.error('Failed to fetch carpark telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarparks();
  }, []);

  const filteredCarparks = carparks.filter((cp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cp.name.toLowerCase().includes(q) ||
      cp.code.toLowerCase().includes(q) ||
      (cp.area && cp.area.toLowerCase().includes(q))
    );
  });

  const totalLots = filteredCarparks.reduce((sum, c) => sum + c.lotsAvailable, 0);
  const totalCapacity = filteredCarparks.reduce((sum, c) => sum + c.capacity, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Real-time Status */}
      <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase ${
                isLive ? 'bg-[#00695c] text-white' : 'bg-[#004d99] text-white'
              }`}>
                {isLive ? 'Live URA DataService' : 'URA Carpark Stream'}
              </span>
              <span className="text-xs font-bold text-[#1b1c1c]">
                Live Urban Car Park Availability & Pricing Telemetry
              </span>
            </div>
            <p className="text-xs text-[#555a64] mt-1 leading-relaxed">
              Real-time lot availability and parking fee schedules retrieved via URA DataService (<code>Car_Park_Availability</code> & <code>Car_Park_Details</code>).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right text-xs">
              <span className="text-[#727783] text-[11px] block">Last Polled</span>
              <span className="font-mono font-semibold text-[#1b1c1c]">{lastRefreshed || 'Just now'}</span>
            </div>
            <button
              onClick={fetchCarparks}
              disabled={isLoading}
              className="px-3 py-1.5 bg-[#004d99] hover:bg-[#003870] text-white rounded-xs text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Lots</span>
            </button>
          </div>
        </div>

        {/* Status notice */}
        {statusMessage && (
          <div className="mt-3 pt-3 border-t border-[#f0eded] text-[11px] text-[#555a64] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00695c] flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Summary Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#e2e4e8] p-3.5 rounded-xs shadow-xs">
          <span className="text-[11px] text-[#727783] block">Active Car Parks</span>
          <span className="font-mono text-xl font-bold text-[#004d99] tabular-nums">
            {filteredCarparks.length}
          </span>
          <span className="text-[10px] text-[#555a64] block mt-0.5">Commercial & Central</span>
        </div>

        <div className="bg-white border border-[#e2e4e8] p-3.5 rounded-xs shadow-xs">
          <span className="text-[11px] text-[#727783] block">Total Available Lots</span>
          <span className="font-mono text-xl font-bold text-[#00695c] tabular-nums">
            {totalLots.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#555a64] block mt-0.5">Vacant bays right now</span>
        </div>

        <div className="bg-white border border-[#e2e4e8] p-3.5 rounded-xs shadow-xs">
          <span className="text-[11px] text-[#727783] block">Total Bay Capacity</span>
          <span className="font-mono text-xl font-bold text-[#1b1c1c] tabular-nums">
            {totalCapacity.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#555a64] block mt-0.5">Designed lot inventory</span>
        </div>

        <div className="bg-white border border-[#e2e4e8] p-3.5 rounded-xs shadow-xs">
          <span className="text-[11px] text-[#727783] block">Average Occupancy</span>
          <span className="font-mono text-xl font-bold text-[#b6171e] tabular-nums">
            {totalCapacity > 0 ? Math.round(((totalCapacity - totalLots) / totalCapacity) * 100) : 0}%
          </span>
          <span className="text-[10px] text-[#555a64] block mt-0.5">Peak utilization index</span>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="bg-white border border-[#e2e4e8] p-3 rounded-xs shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-[#727783] ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by car park name or area (e.g. Maxwell, Clarke Quay, Orchard, Bugis, Chinatown, Katong)..."
          className="w-full text-xs text-[#1b1c1c] placeholder-[#727783] focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#727783] hover:text-[#1b1c1c] px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Carparks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCarparks.map((cp) => {
          const isFull = cp.lotsAvailable <= 5;
          const isMedium = cp.lotsAvailable > 5 && cp.lotsAvailable <= 25;
          const statusBadge = isFull
            ? 'bg-[#ffdad6] text-[#b6171e] border-[#b6171e]/30'
            : isMedium
            ? 'bg-[#fff8e1] text-[#b78103] border-[#ffe082]'
            : 'bg-[#e0f2f1] text-[#00695c] border-[#80cbc4]';

          return (
            <div
              key={cp.id}
              className="bg-white border border-[#e2e4e8] rounded-xs p-4 shadow-xs hover:border-[#004d99] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-[#1b1c1c] leading-tight">
                      {cp.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#555a64] block mt-0.5">
                      Code: {cp.code} · {cp.vehCat}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${statusBadge}`}>
                    {isFull ? 'Almost Full' : isMedium ? 'Moderate' : 'Lots Available'}
                  </span>
                </div>

                {/* Lots availability gauge */}
                <div className="p-3 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs my-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-[#727783]">Available Lots</span>
                    <span className="font-mono text-xl font-extrabold text-[#004d99] tabular-nums">
                      {cp.lotsAvailable}{' '}
                      <span className="text-xs font-normal text-[#555a64]">/ {cp.capacity}</span>
                    </span>
                  </div>

                  <div className="w-full bg-[#e2e4e8] h-2 rounded-xs mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFull ? 'bg-[#b6171e]' : isMedium ? 'bg-[#f57c00]' : 'bg-[#00695c]'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((cp.lotsAvailable / cp.capacity) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Rates breakdown */}
                <div className="space-y-1.5 text-xs text-[#424752] pt-1">
                  <div className="flex justify-between items-center py-1 border-b border-[#f0eded]">
                    <span className="text-[11px] text-[#727783]">Weekday Parking:</span>
                    <span className="font-mono font-semibold text-[#1b1c1c]">
                      {cp.weekdayRate} / {cp.weekdayMin}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#f0eded]">
                    <span className="text-[11px] text-[#727783]">Saturday Rate:</span>
                    <span className="font-mono font-semibold text-[#1b1c1c]">
                      {cp.satdayRate} / {cp.satdayMin}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-[#f0eded]">
                    <span className="text-[11px] text-[#727783]">Sunday & PH Rate:</span>
                    <span className="font-mono font-semibold text-[#1b1c1c]">
                      {cp.sunPHRate} / {cp.sunPHMin}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-[11px] text-[#555a64]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#727783]" />
                      Operating Hours
                    </span>
                    <span className="font-mono font-medium">
                      {cp.startTime} – {cp.endTime}
                    </span>
                  </div>
                </div>
              </div>

              {cp.area && (
                <div className="mt-3 pt-2 border-t border-[#f0eded] text-[10px] text-[#727783] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#004d99]" />
                  <span>{cp.area}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
