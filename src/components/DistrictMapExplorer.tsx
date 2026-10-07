import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import { POSTAL_DISTRICTS, PROJECTS_DATABASE } from '../data/mockUraData';
import { PostalDistrictInfo, MarketSegment } from '../types/ura';

interface DistrictMapExplorerProps {
  onSelectDistrictToFilter: (districtNumber: number) => void;
}

export const DistrictMapExplorer: React.FC<DistrictMapExplorerProps> = ({
  onSelectDistrictToFilter,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<PostalDistrictInfo>(POSTAL_DISTRICTS[8]); // Default D09 Orchard
  const [activeRegionFilter, setActiveRegionFilter] = useState<'ALL' | MarketSegment>('ALL');

  const filteredDistricts = POSTAL_DISTRICTS.filter((d) =>
    activeRegionFilter === 'ALL' ? true : d.region === activeRegionFilter
  );

  // Projects in selected district
  const districtProjects = PROJECTS_DATABASE.filter(
    (p) => p.district === selectedDistrict.district
  );

  return (
    <div className="space-y-6">
      {/* Intro & Regional Legend */}
      <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1b1c1c]">
              Singapore 28 Postal Districts Spatial Explorer
            </h2>
            <p className="text-xs text-[#555a64] mt-0.5">
              Select any district to inspect land planning sector boundaries, median transacted prices, and active residential developments.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={() => setActiveRegionFilter('ALL')}
              className={`px-3 py-1.5 rounded-xs font-semibold transition-colors cursor-pointer ${
                activeRegionFilter === 'ALL'
                  ? 'bg-[#004d99] text-white'
                  : 'bg-[#f5f3f3] text-[#424752] hover:bg-[#e4e2e1]'
              }`}
            >
              All 28 Districts
            </button>
            <button
              onClick={() => setActiveRegionFilter('CCR')}
              className={`px-2.5 py-1.5 rounded-xs font-semibold transition-colors cursor-pointer ${
                activeRegionFilter === 'CCR'
                  ? 'bg-[#004d99] text-white'
                  : 'bg-[#eef4fc] text-[#004d99] hover:bg-[#dae5ff]'
              }`}
            >
              CCR Prime
            </button>
            <button
              onClick={() => setActiveRegionFilter('RCR')}
              className={`px-2.5 py-1.5 rounded-xs font-semibold transition-colors cursor-pointer ${
                activeRegionFilter === 'RCR'
                  ? 'bg-[#00695c] text-white'
                  : 'bg-[#e0f2f1] text-[#00695c] hover:bg-[#b2dfdb]'
              }`}
            >
              RCR Fringe
            </button>
            <button
              onClick={() => setActiveRegionFilter('OCR')}
              className={`px-2.5 py-1.5 rounded-xs font-semibold transition-colors cursor-pointer ${
                activeRegionFilter === 'OCR'
                  ? 'bg-[#424752] text-white'
                  : 'bg-[#f0eded] text-[#424752] hover:bg-[#e4e2e1]'
              }`}
            >
              OCR Suburbs
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Districts Matrix & District Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Matrix (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-[#1b1c1c] uppercase tracking-wide">
              District Selector ({filteredDistricts.length} displayed)
            </span>
            <span className="text-[#727783] text-[11px]">Click a postal tile to inspect</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredDistricts.map((item) => {
              const isSelected = selectedDistrict.district === item.district;
              const regionBadgeColor =
                item.region === 'CCR'
                  ? 'bg-[#eef4fc] text-[#004d99] border-[#004d99]/30'
                  : item.region === 'RCR'
                  ? 'bg-[#e0f2f1] text-[#00695c] border-[#00695c]/30'
                  : 'bg-[#f0eded] text-[#424752] border-[#727783]/30';

              return (
                <div
                  key={item.district}
                  onClick={() => setSelectedDistrict(item)}
                  className={`p-3 rounded-xs border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#004d99] bg-[#eef4fc]/60 shadow-md ring-2 ring-[#004d99]/20'
                      : 'border-[#c2c6d4] bg-white hover:border-[#727783] hover:bg-[#fbf9f8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm text-[#1b1c1c]">{item.code}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs border ${regionBadgeColor}`}>
                      {item.region}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#424752] line-clamp-1 font-medium">
                    {item.generalLocation.split(',')[0]}
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#f0eded] flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#727783]">Median:</span>
                    <span className="font-bold text-[#004d99] tabular-nums">
                      S${item.medianPsf.toLocaleString()} psf
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected District Telemetry Card (1 Col) */}
        <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-[#e2e4e8] pb-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#004d99]">
                  Postal District Intelligence
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-xs ${
                    selectedDistrict.region === 'CCR'
                      ? 'bg-[#eef4fc] text-[#004d99]'
                      : selectedDistrict.region === 'RCR'
                      ? 'bg-[#e0f2f1] text-[#00695c]'
                      : 'bg-[#f0eded] text-[#424752]'
                  }`}
                >
                  {selectedDistrict.region} · {selectedDistrict.region === 'CCR' ? 'Core Central' : selectedDistrict.region === 'RCR' ? 'Rest of Central' : 'Outside Central'}
                </span>
              </div>
              <h3 className="text-2xl font-bold font-mono text-[#1b1c1c] mt-1">
                {selectedDistrict.code}
              </h3>
              <p className="text-xs text-[#555a64] mt-0.5">
                {selectedDistrict.generalLocation}
              </p>
            </div>

            {/* Metrics */}
            <div className="space-y-3 mb-5">
              <div className="p-3 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
                <span className="text-[11px] text-[#727783] block">Benchmark Median Unit Price</span>
                <span className="text-xl font-bold font-mono text-[#004d99] tabular-nums">
                  S${selectedDistrict.medianPsf.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-[#727783]">psf</span>
                </span>
              </div>

              <div className="p-3 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
                <span className="text-[11px] text-[#727783] block">Key Urban Planning Areas</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedDistrict.planningAreas.map((area) => (
                    <span key={area} className="text-xs font-medium text-[#1b1c1c] bg-[#e4e2e1] px-2 py-0.5 rounded-xs">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {districtProjects.length > 0 && (
                <div className="p-3 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
                  <span className="text-[11px] text-[#727783] block mb-1">
                    Notable Developments in {selectedDistrict.code}
                  </span>
                  <div className="space-y-1.5">
                    {districtProjects.map((p) => (
                      <div key={p.name} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#1b1c1c]">{p.name}</span>
                        <span className="font-mono text-[#004d99] text-[11px]">S${p.medianPsf} psf</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action to Filter by this District */}
          <button
            onClick={() => onSelectDistrictToFilter(selectedDistrict.district)}
            className="w-full py-2.5 px-4 bg-[#004d99] hover:bg-[#003870] active:bg-[#002b54] text-white font-semibold text-xs rounded-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
          >
            <span>View All Caveats for {selectedDistrict.code}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
