import React, { useState, useMemo } from 'react';
import { MapPin, Flame, DollarSign, Layers, ArrowRight, Building, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { POSTAL_DISTRICTS, PROJECTS_DATABASE } from '../data/mockUraData';
import { PostalDistrictInfo, MarketSegment, TransactionRecord } from '../types/ura';

interface DistrictMapExplorerProps {
  onSelectDistrictToFilter: (districtNumber: number) => void;
  transactions?: TransactionRecord[];
}

interface DistrictGeoCoord {
  district: number;
  x: number;
  y: number;
  radius: number;
  labelX?: number;
  labelY?: number;
}

export interface DistrictMetricItem extends PostalDistrictInfo {
  activeVolume: number;
  displayMedianPsf: number;
}

// Spatial coordinates anchored to Singapore island geometry (900x460 canvas)
const DISTRICT_GEO_COORDS: Record<number, DistrictGeoCoord> = {
  // South & Central Core (CCR)
  1: { district: 1, x: 535, y: 360, radius: 24, labelX: 535, labelY: 360 }, // Marina Bay / Raffles
  2: { district: 2, x: 505, y: 375, radius: 22, labelX: 505, labelY: 375 }, // Tanjong Pagar
  4: { district: 4, x: 450, y: 415, radius: 26, labelX: 450, labelY: 415 }, // Sentosa / Telok Blangah
  6: { district: 6, x: 520, y: 335, radius: 18, labelX: 520, labelY: 335 }, // City Hall
  9: { district: 9, x: 495, y: 310, radius: 25, labelX: 495, labelY: 310 }, // Orchard / River Valley
  10: { district: 10, x: 430, y: 285, radius: 36, labelX: 430, labelY: 285 }, // Bukit Timah / Holland
  11: { district: 11, x: 485, y: 265, radius: 26, labelX: 485, labelY: 265 }, // Novena / Newton
  
  // City Fringe (RCR)
  3: { district: 3, x: 440, y: 350, radius: 30, labelX: 440, labelY: 350 }, // Queenstown / Alexandra
  5: { district: 5, x: 330, y: 335, radius: 36, labelX: 330, labelY: 335 }, // Buona Vista / Clementi
  7: { district: 7, x: 555, y: 315, radius: 20, labelX: 555, labelY: 315 }, // Bugis / Rochor
  8: { district: 8, x: 530, y: 280, radius: 20, labelX: 530, labelY: 280 }, // Little India / Farrer Park
  12: { district: 12, x: 535, y: 240, radius: 24, labelX: 535, labelY: 240 }, // Balestier / Toa Payoh
  13: { district: 13, x: 580, y: 245, radius: 22, labelX: 580, labelY: 245 }, // Potong Pasir / Bidadari
  14: { district: 14, x: 625, y: 285, radius: 28, labelX: 625, labelY: 285 }, // Geylang / Paya Lebar
  15: { district: 15, x: 675, y: 325, radius: 38, labelX: 675, labelY: 325 }, // Katong / Marine Parade / Amber
  20: { district: 20, x: 475, y: 215, radius: 32, labelX: 475, labelY: 215 }, // Bishan / Ang Mo Kio
  21: { district: 21, x: 345, y: 275, radius: 28, labelX: 345, labelY: 275 }, // Upper Bukit Timah

  // Outside Central (OCR)
  16: { district: 16, x: 745, y: 290, radius: 36, labelX: 745, labelY: 290 }, // Bedok / Bayshore
  17: { district: 17, x: 840, y: 235, radius: 34, labelX: 840, labelY: 235 }, // Changi / Loyang
  18: { district: 18, x: 775, y: 225, radius: 36, labelX: 775, labelY: 225 }, // Tampines / Pasir Ris
  19: { district: 19, x: 630, y: 170, radius: 46, labelX: 630, labelY: 170 }, // Serangoon / Hougang / Sengkang / Punggol
  22: { district: 22, x: 180, y: 295, radius: 48, labelX: 180, labelY: 295 }, // Jurong / Boon Lay / Tuas
  23: { district: 23, x: 280, y: 210, radius: 38, labelX: 280, labelY: 210 }, // Bukit Panjang / Hillview
  24: { district: 24, x: 170, y: 175, radius: 44, labelX: 170, labelY: 175 }, // Lim Chu Kang / Tengah
  25: { district: 25, x: 305, y: 105, radius: 40, labelX: 305, labelY: 105 }, // Woodlands / Kranji
  26: { district: 26, x: 410, y: 160, radius: 32, labelX: 410, labelY: 160 }, // Upper Thomson / Springleaf
  27: { district: 27, x: 450, y: 100, radius: 38, labelX: 450, labelY: 100 }, // Yishun / Sembawang
  28: { district: 28, x: 540, y: 155, radius: 30, labelX: 540, labelY: 155 }, // Seletar / Yio Chu Kang
};

export const DistrictMapExplorer: React.FC<DistrictMapExplorerProps> = ({
  onSelectDistrictToFilter,
  transactions = [],
}) => {
  const [selectedDistrictNum, setSelectedDistrictNum] = useState<number>(15); // Default D15 East Coast
  const [heatmapMode, setHeatmapMode] = useState<'volume' | 'psf' | 'region'>('volume');
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictMetricItem | null>(null);

  // Compute live district metrics merged with POSTAL_DISTRICTS baseline
  const districtMetrics = useMemo(() => {
    return POSTAL_DISTRICTS.map((dist) => {
      const liveForDist = transactions.filter((t) => t.postalDistrict === dist.district);
      const liveCount = liveForDist.length;

      let medianLivePsf = dist.medianPsf;
      if (liveCount > 0) {
        const sorted = [...liveForDist].map((t) => t.unitPricePsf).sort((a, b) => a - b);
        medianLivePsf = sorted[Math.floor(sorted.length / 2)];
      }

      // 30d transaction volume benchmark
      const transVolume = liveCount > 0 ? liveCount : dist.totalTransactions30d;

      return {
        ...dist,
        activeVolume: transVolume,
        displayMedianPsf: medianLivePsf,
      };
    });
  }, [transactions]);

  // Max volume for heatmap scale
  const maxVolume = useMemo(() => {
    return Math.max(...districtMetrics.map((d) => d.activeVolume), 1);
  }, [districtMetrics]);

  // Top 5 Highest Transacted Areas Leaderboard
  const topTransactedAreas = useMemo(() => {
    return [...districtMetrics]
      .sort((a, b) => b.activeVolume - a.activeVolume)
      .slice(0, 6);
  }, [districtMetrics]);

  const selectedDistrictInfo = useMemo(() => {
    return districtMetrics.find((d) => d.district === selectedDistrictNum) || districtMetrics[14];
  }, [districtMetrics, selectedDistrictNum]);

  // Projects in selected district
  const districtProjects = useMemo(() => {
    return PROJECTS_DATABASE.filter((p) => p.district === selectedDistrictNum);
  }, [selectedDistrictNum]);

  // Helper to get heatmap color & opacity for each district
  const getDistrictHeatStyle = (dist: (typeof districtMetrics)[0]) => {
    if (heatmapMode === 'volume') {
      const intensity = dist.activeVolume / maxVolume; // 0 to 1
      if (intensity >= 0.85) return { fill: '#d32f2f', glow: 'rgba(211, 47, 47, 0.45)', intensity, level: 'Peak Hotspot' };
      if (intensity >= 0.60) return { fill: '#f57c00', glow: 'rgba(245, 124, 0, 0.35)', intensity, level: 'High Activity' };
      if (intensity >= 0.35) return { fill: '#1976d2', glow: 'rgba(25, 118, 210, 0.25)', intensity, level: 'Moderate Activity' };
      return { fill: '#455a64', glow: 'rgba(69, 90, 100, 0.15)', intensity, level: 'Low Activity' };
    } else if (heatmapMode === 'psf') {
      // PSF range ~ 1450 to 3200
      const intensity = Math.min(1, Math.max(0, (dist.displayMedianPsf - 1450) / (3180 - 1450)));
      if (intensity >= 0.75) return { fill: '#b6171e', glow: 'rgba(182, 23, 30, 0.45)', intensity, level: 'Prime CCR (> S$2,800 psf)' };
      if (intensity >= 0.45) return { fill: '#00695c', glow: 'rgba(0, 105, 92, 0.35)', intensity, level: 'Mid-Tier RCR (S$2,100 - S$2,800)' };
      return { fill: '#546e7a', glow: 'rgba(84, 110, 122, 0.20)', intensity, level: 'Suburban OCR (< S$2,100 psf)' };
    } else {
      // Region mode
      if (dist.region === 'CCR') return { fill: '#004d99', glow: 'rgba(0, 77, 153, 0.35)', intensity: 1, level: 'Core Central Region (CCR)' };
      if (dist.region === 'RCR') return { fill: '#00695c', glow: 'rgba(0, 105, 92, 0.35)', intensity: 0.6, level: 'Rest of Central Region (RCR)' };
      return { fill: '#546e7a', glow: 'rgba(84, 110, 122, 0.20)', intensity: 0.3, level: 'Outside Central Region (OCR)' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Heatmap Mode Switcher */}
      <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#b6171e] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Spatial Telemetry
              </span>
              <h2 className="text-base font-bold text-[#1b1c1c]">
                Singapore Residential Transaction Heatmap
              </h2>
            </div>
            <p className="text-xs text-[#555a64] mt-1 leading-relaxed">
              Spatial density of Singapore's 28 postal districts. Identifies highest transacted caveat volume hotspots and benchmark median unit price distributions.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center space-x-1.5 text-xs bg-[#f0f2f5] p-1 rounded-xs border border-[#e2e4e8]">
            <button
              onClick={() => setHeatmapMode('volume')}
              className={`px-3 py-1.5 rounded-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                heatmapMode === 'volume'
                  ? 'bg-[#b6171e] text-white shadow-xs'
                  : 'text-[#424752] hover:text-[#1b1c1c]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Transaction Volume Hotspots</span>
            </button>

            <button
              onClick={() => setHeatmapMode('psf')}
              className={`px-3 py-1.5 rounded-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                heatmapMode === 'psf'
                  ? 'bg-[#004d99] text-white shadow-xs'
                  : 'text-[#424752] hover:text-[#1b1c1c]'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Unit Price ($ PSF) Heatmap</span>
            </button>

            <button
              onClick={() => setHeatmapMode('region')}
              className={`px-3 py-1.5 rounded-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                heatmapMode === 'region'
                  ? 'bg-[#00695c] text-white shadow-xs'
                  : 'text-[#424752] hover:text-[#1b1c1c]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Planning Regions</span>
            </button>
          </div>
        </div>

        {/* Heatmap Legend Bar */}
        <div className="mt-4 pt-3 border-t border-[#f0eded] flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-[#727783] uppercase tracking-wide">
              {heatmapMode === 'volume'
                ? 'Volume Intensity Scale:'
                : heatmapMode === 'psf'
                ? 'Median Price Scale:'
                : 'Market Region Legend:'}
            </span>

            {heatmapMode === 'volume' && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#455a64]" />
                  <span className="text-[11px] text-[#555a64]">Low (&lt; 50)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#1976d2]" />
                  <span className="text-[11px] text-[#555a64]">Moderate (50-80)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#f57c00]" />
                  <span className="text-[11px] text-[#555a64]">High (80-120)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#d32f2f] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#b6171e]">Peak Hotspot (&gt; 120)</span>
                </div>
              </div>
            )}

            {heatmapMode === 'psf' && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#546e7a]" />
                  <span className="text-[11px] text-[#555a64]">&lt; S$2,000 psf</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#00695c]" />
                  <span className="text-[11px] text-[#555a64]">S$2,000 - S$2,800</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#b6171e]" />
                  <span className="text-[11px] font-bold text-[#b6171e]">&gt; S$2,800 psf (Prime CCR)</span>
                </div>
              </div>
            )}

            {heatmapMode === 'region' && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#004d99]" />
                  <span className="text-[11px] font-semibold text-[#004d99]">CCR Prime</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#00695c]" />
                  <span className="text-[11px] font-semibold text-[#00695c]">RCR Fringe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-[#546e7a]" />
                  <span className="text-[11px] font-semibold text-[#424752]">OCR Suburbs</span>
                </div>
              </div>
            )}
          </div>

          <span className="text-[11px] text-[#727783] italic">
            *Hover or click on any district marker on the map to inspect
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Leaderboard & Telemetry Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Singapore Map Canvas (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-[#e2e4e8] rounded-xs shadow-xs p-4 sm:p-5 relative flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wide">
              Singapore Spatial Postal District Grid
            </span>
            <span className="text-[11px] text-[#004d99] font-mono">
              Selected: D{selectedDistrictNum < 10 ? '0' : ''}{selectedDistrictNum}
            </span>
          </div>

          {/* Interactive SVG Map */}
          <div className="relative w-full aspect-[900/460] bg-[#f8fafc] border border-[#e2e4e8] rounded-xs overflow-hidden select-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 900 460"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Radial Glow Filters for Heatmap */}
                <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f57c00" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f57c00" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="midGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1976d2" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#0288d1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0288d1" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Singapore Mainland Coastline Vector Silhouette */}
              <path
                d="M 140 280 
                   Q 160 220, 200 170 
                   Q 260 130, 310 95 
                   Q 370 70, 440 75 
                   Q 510 80, 560 120 
                   Q 620 140, 680 155 
                   Q 750 170, 810 200 
                   Q 870 220, 880 250 
                   Q 865 290, 800 320 
                   Q 750 340, 690 355 
                   Q 640 375, 590 385 
                   Q 545 400, 500 405 
                   Q 460 410, 420 395 
                   Q 370 385, 310 370 
                   Q 240 360, 180 340 
                   Q 140 325, 120 300 Z"
                fill="#eef2f6"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Surrounding Major Islands: Sentosa */}
              <path
                d="M 430 425 Q 460 418, 480 430 Q 460 442, 430 435 Z"
                fill="#e2e8f0"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              <text x="445" y="445" fontSize="9" fill="#64748b" fontWeight="600">Sentosa</text>

              {/* Jurong Island */}
              <path
                d="M 200 350 Q 250 340, 260 370 Q 220 390, 190 370 Z"
                fill="#e2e8f0"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              <text x="210" y="380" fontSize="9" fill="#64748b" fontWeight="600">Jurong Island</text>

              {/* Pulau Ubin & Tekong */}
              <path
                d="M 770 145 Q 820 140, 830 160 Q 790 175, 765 160 Z"
                fill="#e2e8f0"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              <text x="780" y="155" fontSize="8" fill="#64748b" fontWeight="600">Pulau Ubin</text>

              {/* Heatmap Radiation Discs (Rendered Behind District Circles) */}
              {districtMetrics.map((dist) => {
                const geo = DISTRICT_GEO_COORDS[dist.district];
                if (!geo) return null;
                const heat = getDistrictHeatStyle(dist);
                if (heat.intensity < 0.3) return null;

                const glowRadius = geo.radius * (1.2 + heat.intensity * 0.8);

                return (
                  <circle
                    key={`glow-${dist.district}`}
                    cx={geo.x}
                    cy={geo.y}
                    r={glowRadius}
                    fill={heat.fill}
                    opacity={heat.intensity * 0.35}
                    className={heat.intensity >= 0.85 ? 'animate-pulse' : ''}
                  />
                );
              })}

              {/* District Node Markers */}
              {districtMetrics.map((dist) => {
                const geo = DISTRICT_GEO_COORDS[dist.district];
                if (!geo) return null;
                const isSelected = selectedDistrictNum === dist.district;
                const heat = getDistrictHeatStyle(dist);

                return (
                  <g
                    key={`node-${dist.district}`}
                    className="cursor-pointer transition-transform duration-150"
                    onClick={() => setSelectedDistrictNum(dist.district)}
                    onMouseEnter={() => setHoveredDistrict(dist)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  >
                    {/* Outer selection ring */}
                    {isSelected && (
                      <circle
                        cx={geo.x}
                        cy={geo.y}
                        r={geo.radius + 5}
                        fill="none"
                        stroke="#004d99"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                      />
                    )}

                    {/* Main district bubble */}
                    <circle
                      cx={geo.x}
                      cy={geo.y}
                      r={geo.radius}
                      fill={heat.fill}
                      stroke={isSelected ? '#ffffff' : '#ffffff'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      opacity={isSelected ? 1 : 0.92}
                    />

                    {/* District Code Label */}
                    <text
                      x={geo.labelX || geo.x}
                      y={(geo.labelY || geo.y) + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={geo.radius > 28 ? '12' : '10'}
                      fontWeight="bold"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {dist.code}
                    </text>

                    {/* Volume sub-badge for peak hotspots */}
                    {dist.activeVolume >= 100 && (
                      <g>
                        <circle
                          cx={geo.x + geo.radius - 4}
                          cy={geo.y - geo.radius + 4}
                          r="7"
                          fill="#ffffff"
                          stroke="#d32f2f"
                          strokeWidth="1.5"
                        />
                        <text
                          x={geo.x + geo.radius - 4}
                          y={geo.y - geo.radius + 6.5}
                          textAnchor="middle"
                          fill="#d32f2f"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          🔥
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredDistrict && (
              <div className="absolute bottom-3 left-3 bg-[#1b1c1c]/90 text-white p-3 rounded-xs text-xs backdrop-blur-xs border border-white/20 pointer-events-none shadow-lg animate-in fade-in duration-100 max-w-xs z-20">
                <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1 mb-1.5">
                  <span className="font-extrabold font-mono text-sm">{hoveredDistrict.code}</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-xs font-semibold">
                    {hoveredDistrict.region}
                  </span>
                </div>
                <div className="text-[11px] text-white/90 font-medium mb-1 line-clamp-1">
                  {hoveredDistrict.generalLocation}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-white/60 block">30d Transactions:</span>
                    <strong className="text-sm font-mono text-[#ffb3ac]">{hoveredDistrict.activeVolume} caveats</strong>
                  </div>
                  <div>
                    <span className="text-white/60 block">Median PSF:</span>
                    <strong className="text-sm font-mono text-[#a3f5e4]">S${hoveredDistrict.displayMedianPsf} psf</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#555a64]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d32f2f]" />
              <strong>Hotspot Highlights:</strong> D15 (Katong), D19 (Serangoon/Hougang), D18 (Tampines), D09 (Orchard)
            </span>
            <span className="font-mono text-[#727783]">Total Districts: 28</span>
          </div>
        </div>

        {/* Sidebar: Leaderboard & Selected District Profile (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top 6 Highest Transacted Areas Leaderboard */}
          <div className="bg-white border border-[#e2e4e8] p-4 rounded-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e2e4e8] pb-2 mb-3">
              <div className="flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-[#d32f2f]" />
                <h3 className="font-bold text-xs text-[#1b1c1c] uppercase tracking-wide">
                  Highest Transacted Hotspots
                </h3>
              </div>
              <span className="text-[10px] text-[#727783] font-medium">Ranked by Caveats</span>
            </div>

            <div className="space-y-2">
              {topTransactedAreas.map((item, idx) => {
                const isSelected = selectedDistrictNum === item.district;
                const percentage = Math.round((item.activeVolume / maxVolume) * 100);

                return (
                  <div
                    key={item.district}
                    onClick={() => setSelectedDistrictNum(item.district)}
                    className={`p-2 rounded-xs border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#004d99] bg-[#eef4fc]'
                        : 'border-[#f0eded] hover:border-[#c2c6d4] bg-[#fbf9f8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          idx === 0 ? 'bg-[#d32f2f] text-white' : idx === 1 ? 'bg-[#f57c00] text-white' : idx === 2 ? 'bg-[#1976d2] text-white' : 'bg-[#e2e4e8] text-[#1b1c1c]'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-extrabold font-mono text-xs">{item.code}</span>
                        <span className="text-[10px] text-[#555a64] truncate max-w-[110px]">
                          {item.generalLocation.split(',')[0]}
                        </span>
                      </div>

                      <div className="font-mono text-right">
                        <span className="font-bold text-xs text-[#1b1c1c]">{item.activeVolume}</span>
                        <span className="text-[10px] text-[#727783] ml-0.5">txns</span>
                      </div>
                    </div>

                    {/* Volume Bar */}
                    <div className="w-full bg-[#e2e4e8] h-1.5 rounded-xs overflow-hidden">
                      <div
                        className={`h-full ${idx === 0 ? 'bg-[#d32f2f]' : idx === 1 ? 'bg-[#f57c00]' : 'bg-[#1976d2]'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected District Telemetry Details Card */}
          <div className="bg-white border border-[#e2e4e8] p-4 rounded-xs shadow-xs space-y-3">
            <div className="border-b border-[#e2e4e8] pb-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#004d99] uppercase tracking-wider">
                  District Telemetry
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                    selectedDistrictInfo.region === 'CCR'
                      ? 'bg-[#eef4fc] text-[#004d99]'
                      : selectedDistrictInfo.region === 'RCR'
                      ? 'bg-[#e0f2f1] text-[#00695c]'
                      : 'bg-[#f0eded] text-[#424752]'
                  }`}
                >
                  {selectedDistrictInfo.region} Region
                </span>
              </div>
              <h4 className="text-xl font-bold font-mono text-[#1b1c1c] mt-0.5">
                {selectedDistrictInfo.code}
              </h4>
              <p className="text-[11px] text-[#555a64] line-clamp-2 mt-0.5">
                {selectedDistrictInfo.generalLocation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
                <span className="text-[10px] text-[#727783] block">Transacted Volume</span>
                <span className="font-mono text-base font-bold text-[#004d99] tabular-nums">
                  {selectedDistrictInfo.activeVolume}
                </span>
                <span className="text-[9px] text-[#555a64] block">caveats lodged</span>
              </div>

              <div className="p-2.5 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
                <span className="text-[10px] text-[#727783] block">Median Unit Price</span>
                <span className="font-mono text-base font-bold text-[#1b1c1c] tabular-nums">
                  S${selectedDistrictInfo.displayMedianPsf}
                </span>
                <span className="text-[9px] text-[#555a64] block">per sq ft</span>
              </div>
            </div>

            {districtProjects.length > 0 && (
              <div>
                <span className="text-[11px] text-[#727783] font-semibold block mb-1">
                  Notable Projects in {selectedDistrictInfo.code}:
                </span>
                <div className="space-y-1">
                  {districtProjects.slice(0, 2).map((p) => (
                    <div key={p.name} className="flex justify-between items-center text-[11px] bg-[#fbf9f8] p-1.5 rounded-xs border border-[#f0eded]">
                      <span className="font-semibold text-[#1b1c1c]">{p.name}</span>
                      <span className="font-mono text-[#004d99]">S${p.medianPsf} psf</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Action Filter Button */}
            <button
              onClick={() => onSelectDistrictToFilter(selectedDistrictInfo.district)}
              className="w-full py-2 px-3 bg-[#004d99] hover:bg-[#003870] text-white text-xs font-semibold rounded-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs mt-2"
            >
              <span>Filter All Transactions in {selectedDistrictInfo.code}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
