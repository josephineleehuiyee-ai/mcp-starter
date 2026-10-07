import React, { useState, useRef, useEffect } from 'react';
import { Search, RotateCcw, Filter, Building, MapPin, Layers, Calendar, ChevronDown, Check, X } from 'lucide-react';
import { FilterState, PropertyType, SaleType, TenureType, MarketSegment } from '../types/ura';
import { POSTAL_DISTRICTS, PROJECTS_DATABASE } from '../data/mockUraData';

interface SearchFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  totalResults: number;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilters,
  onReset,
  totalResults,
}) => {
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close project dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePropertyTypeToggle = (type: PropertyType) => {
    setFilters((prev) => {
      const exists = prev.propertyTypes.includes(type);
      return {
        ...prev,
        propertyTypes: exists
          ? prev.propertyTypes.filter((t) => t !== type)
          : [...prev.propertyTypes, type],
      };
    });
  };

  const handleSaleTypeToggle = (sale: SaleType) => {
    setFilters((prev) => {
      const exists = prev.saleTypes.includes(sale);
      return {
        ...prev,
        saleTypes: exists
          ? prev.saleTypes.filter((s) => s !== sale)
          : [...prev.saleTypes, sale],
      };
    });
  };

  const handleTenureToggle = (tenure: TenureType) => {
    setFilters((prev) => {
      const exists = prev.tenures.includes(tenure);
      return {
        ...prev,
        tenures: exists
          ? prev.tenures.filter((t) => t !== tenure)
          : [...prev.tenures, tenure],
      };
    });
  };

  const handleDistrictToggle = (districtNumber: number) => {
    setFilters((prev) => {
      const exists = prev.selectedDistricts.includes(districtNumber);
      return {
        ...prev,
        selectedDistricts: exists
          ? prev.selectedDistricts.filter((d) => d !== districtNumber)
          : [...prev.selectedDistricts, districtNumber],
      };
    });
  };

  const handleSelectRegion = (region: MarketSegment) => {
    const districtsInRegion = POSTAL_DISTRICTS.filter((d) => d.region === region).map((d) => d.district);
    setFilters((prev) => {
      const allSelected = districtsInRegion.every((d) => prev.selectedDistricts.includes(d));
      if (allSelected) {
        return {
          ...prev,
          selectedDistricts: prev.selectedDistricts.filter((d) => !districtsInRegion.includes(d)),
        };
      } else {
        const set = new Set([...prev.selectedDistricts, ...districtsInRegion]);
        return {
          ...prev,
          selectedDistricts: Array.from(set),
        };
      }
    });
  };

  const applyPreset = (preset: 'all' | 'ccr' | 'freehold' | 'new-sales' | 'sub-2000-psf' | 'east-coast') => {
    if (preset === 'all') {
      onReset();
      return;
    }

    if (preset === 'ccr') {
      const ccrDistricts = POSTAL_DISTRICTS.filter((d) => d.region === 'CCR').map((d) => d.district);
      setFilters((prev) => ({
        ...prev,
        selectedDistricts: ccrDistricts,
        searchQuery: '',
      }));
    } else if (preset === 'freehold') {
      setFilters((prev) => ({
        ...prev,
        tenures: ['Freehold'],
      }));
    } else if (preset === 'new-sales') {
      setFilters((prev) => ({
        ...prev,
        saleTypes: ['New Sale'],
      }));
    } else if (preset === 'sub-2000-psf') {
      setFilters((prev) => ({
        ...prev,
        maxPsf: 2000,
      }));
    } else if (preset === 'east-coast') {
      setFilters((prev) => ({
        ...prev,
        selectedDistricts: [15, 16],
      }));
    }
  };

  // Autocomplete project suggestions
  const filteredProjectSuggestions = PROJECTS_DATABASE.filter((p) =>
    p.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
  );

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.selectedDistricts.length > 0 ? 1 : 0) +
    (filters.propertyTypes.length > 0 ? 1 : 0) +
    (filters.saleTypes.length > 0 ? 1 : 0) +
    (filters.tenures.length > 0 ? 1 : 0) +
    (filters.dateRange !== 'all' ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 20000000 ? 1 : 0) +
    (filters.minPsf > 0 || filters.maxPsf < 6000 ? 1 : 0);

  return (
    <div className="bg-white border border-[#e2e4e8] rounded-xs shadow-xs p-4 sm:p-5">
      {/* Top Search Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#e2e4e8] pb-3 mb-4 gap-2">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wide mr-2">
            Search Mode:
          </span>
          <button
            onClick={() => setFilters((p) => ({ ...p, searchMode: 'project' }))}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
              filters.searchMode === 'project'
                ? 'bg-[#004d99] text-white font-semibold'
                : 'bg-[#f5f3f3] text-[#424752] hover:bg-[#e4e2e1]'
            }`}
          >
            Project Name
          </button>
          <button
            onClick={() => setFilters((p) => ({ ...p, searchMode: 'district' }))}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
              filters.searchMode === 'district'
                ? 'bg-[#004d99] text-white font-semibold'
                : 'bg-[#f5f3f3] text-[#424752] hover:bg-[#e4e2e1]'
            }`}
          >
            Postal District
          </button>
          <button
            onClick={() => setFilters((p) => ({ ...p, searchMode: 'street' }))}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
              filters.searchMode === 'street'
                ? 'bg-[#004d99] text-white font-semibold'
                : 'bg-[#f5f3f3] text-[#424752] hover:bg-[#e4e2e1]'
            }`}
          >
            Street / Area
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <span className="text-[11px] font-semibold text-[#004d99] bg-[#eef4fc] px-2 py-0.5 rounded-xs">
              {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''} Active
            </span>
          )}
          <button
            onClick={onReset}
            className="text-xs text-[#727783] hover:text-[#b6171e] inline-flex items-center gap-1 cursor-pointer font-medium"
            title="Reset all search parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Search Input based on mode */}
      <div className="relative mb-4" ref={dropdownRef}>
        {filters.searchMode === 'project' && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#727783]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters((p) => ({ ...p, searchQuery: e.target.value }));
                setProjectDropdownOpen(true);
              }}
              onFocus={() => setProjectDropdownOpen(true)}
              placeholder="e.g. Canninghill Piers, Grand Dunman, Leedon Green, The Tre Ver, Normanton Park..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#727783] rounded-xs text-sm text-[#1b1c1c] placeholder-[#727783] focus:border-[#004d99] focus:outline-none focus:ring-3 focus:ring-[#004d99]/20"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#727783] hover:text-[#1b1c1c]"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {projectDropdownOpen && filteredProjectSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#c2c6d4] shadow-lg rounded-xs max-h-60 overflow-y-auto">
                <div className="px-3 py-1.5 bg-[#f5f3f3] text-[11px] font-semibold text-[#555a64] uppercase border-b border-[#e2e4e8]">
                  Matching Residential Projects ({filteredProjectSuggestions.length})
                </div>
                {filteredProjectSuggestions.map((project) => (
                  <button
                    key={project.name}
                    onClick={() => {
                      setFilters((p) => ({ ...p, searchQuery: project.name }));
                      setProjectDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#eef4fc] flex items-center justify-between border-b border-[#f0eded] last:border-b-0 cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-[#1b1c1c]">{project.name}</span>
                      <span className="text-[#727783] ml-2 font-normal">
                        · {project.street} (D{project.district < 10 ? '0' : ''}{project.district})
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#004d99] bg-[#eef4fc] px-1.5 py-0.5 rounded-xs">
                      {project.region} · S${project.medianPsf} psf
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {filters.searchMode === 'district' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-[#1b1c1c]">Select Region:</span>
              <button
                onClick={() => handleSelectRegion('CCR')}
                className="px-2.5 py-1 text-xs border border-[#004d99] text-[#004d99] hover:bg-[#eef4fc] rounded-xs font-semibold"
              >
                Toggle CCR (Prime Central)
              </button>
              <button
                onClick={() => handleSelectRegion('RCR')}
                className="px-2.5 py-1 text-xs border border-[#00695c] text-[#00695c] hover:bg-[#e0f2f1] rounded-xs font-semibold"
              >
                Toggle RCR (City Fringe)
              </button>
              <button
                onClick={() => handleSelectRegion('OCR')}
                className="px-2.5 py-1 text-xs border border-[#727783] text-[#424752] hover:bg-[#f0eded] rounded-xs font-semibold"
              >
                Toggle OCR (Suburbs)
              </button>
            </div>

            {/* District Quick Badges Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 max-h-48 overflow-y-auto p-1 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
              {POSTAL_DISTRICTS.map((dist) => {
                const isSelected = filters.selectedDistricts.includes(dist.district);
                const regionColor =
                  dist.region === 'CCR'
                    ? 'text-[#004d99]'
                    : dist.region === 'RCR'
                    ? 'text-[#00695c]'
                    : 'text-[#555a64]';
                return (
                  <button
                    key={dist.district}
                    onClick={() => handleDistrictToggle(dist.district)}
                    className={`p-1.5 text-left rounded-xs text-[11px] border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#004d99] text-white border-[#004d99] shadow-xs'
                        : 'bg-white border-[#c2c6d4] hover:bg-[#f5f3f3] text-[#1b1c1c]'
                    }`}
                    title={`${dist.code}: ${dist.generalLocation}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{dist.code}</span>
                      <span className={`text-[9px] font-semibold ${isSelected ? 'text-white' : regionColor}`}>
                        {dist.region}
                      </span>
                    </div>
                    <div className="truncate text-[10px] opacity-80">{dist.generalLocation.split(',')[0]}</div>
                  </button>
                );
              })}
            </div>
            {filters.selectedDistricts.length > 0 && (
              <div className="text-xs text-[#004d99] font-medium flex items-center justify-between">
                <span>Selected: {filters.selectedDistricts.map((d) => `D${d < 10 ? '0' : ''}${d}`).join(', ')}</span>
                <button
                  onClick={() => setFilters((p) => ({ ...p, selectedDistricts: [] }))}
                  className="text-[#b6171e] hover:underline text-[11px]"
                >
                  Clear all districts
                </button>
              </div>
            )}
          </div>
        )}

        {filters.searchMode === 'street' && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#727783]">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
              placeholder="e.g. Orchard Road, Dunman, Tanjong Rhu, Potong Pasir, River Valley..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#727783] rounded-xs text-sm text-[#1b1c1c] placeholder-[#727783] focus:border-[#004d99] focus:outline-none focus:ring-3 focus:ring-[#004d99]/20"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#727783] hover:text-[#1b1c1c]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Primary Criteria Filter Rows (Property Type, Sale Type, Date Range) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Property Type */}
        <div>
          <label className="block text-xs font-semibold text-[#1b1c1c] mb-1.5">
            Property Type
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(['Condominium', 'Apartment', 'Executive Condominium', 'Terrace House', 'Detached House'] as PropertyType[]).map(
              (type) => {
                const isSelected = filters.propertyTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => handlePropertyTypeToggle(type)}
                    className={`px-2.5 py-1 text-xs rounded-xs border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#004d99] text-white border-[#004d99] font-medium'
                        : 'bg-[#f5f3f3] text-[#424752] border-transparent hover:bg-[#e4e2e1]'
                    }`}
                  >
                    {type === 'Executive Condominium' ? 'EC' : type}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Type of Sale */}
        <div>
          <label className="block text-xs font-semibold text-[#1b1c1c] mb-1.5">
            Type of Sale
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(['New Sale', 'Resale', 'Sub-Sale'] as SaleType[]).map((sale) => {
              const isSelected = filters.saleTypes.includes(sale);
              return (
                <button
                  key={sale}
                  onClick={() => handleSaleTypeToggle(sale)}
                  className={`px-2.5 py-1 text-xs rounded-xs border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#004d99] text-white border-[#004d99] font-medium'
                      : 'bg-[#f5f3f3] text-[#424752] border-transparent hover:bg-[#e4e2e1]'
                  }`}
                >
                  {sale}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transaction Period */}
        <div>
          <label className="block text-xs font-semibold text-[#1b1c1c] mb-1.5">
            Transaction Period
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: '3m', label: 'Last 3 Mths' },
              { id: '6m', label: 'Last 6 Mths' },
              { id: '1y', label: 'Last 1 Yr' },
              { id: 'all', label: 'All Records' },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setFilters((p) => ({ ...p, dateRange: period.id as any }))}
                className={`px-2.5 py-1 text-xs rounded-xs border transition-colors cursor-pointer ${
                  filters.dateRange === period.id
                    ? 'bg-[#004d99] text-white border-[#004d99] font-medium'
                    : 'bg-[#f5f3f3] text-[#424752] border-transparent hover:bg-[#e4e2e1]'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filter Collapse Toggle */}
      <div className="mt-4 pt-3 border-t border-[#e2e4e8] flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
          className="text-xs font-semibold text-[#004d99] hover:text-[#003870] inline-flex items-center gap-1 cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{isAdvancedExpanded ? 'Hide Advanced Filters' : 'More Filters (Tenure, Price PSF, Nett Price)'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isAdvancedExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[#727783] text-[11px] font-medium">Quick Presets:</span>
          <button
            onClick={() => applyPreset('ccr')}
            className="text-[11px] px-2 py-0.5 bg-[#f5f3f3] hover:bg-[#dae5ff] hover:text-[#004d99] rounded-xs text-[#424752] transition-colors"
          >
            CCR Prime
          </button>
          <button
            onClick={() => applyPreset('freehold')}
            className="text-[11px] px-2 py-0.5 bg-[#f5f3f3] hover:bg-[#dae5ff] hover:text-[#004d99] rounded-xs text-[#424752] transition-colors"
          >
            Freehold Only
          </button>
          <button
            onClick={() => applyPreset('sub-2000-psf')}
            className="text-[11px] px-2 py-0.5 bg-[#f5f3f3] hover:bg-[#dae5ff] hover:text-[#004d99] rounded-xs text-[#424752] transition-colors"
          >
            ≤ $2,000 PSF
          </button>
          <button
            onClick={() => applyPreset('east-coast')}
            className="text-[11px] px-2 py-0.5 bg-[#f5f3f3] hover:bg-[#dae5ff] hover:text-[#004d99] rounded-xs text-[#424752] transition-colors"
          >
            East Coast (D15/16)
          </button>
        </div>
      </div>

      {/* Advanced Filter Body */}
      {isAdvancedExpanded && (
        <div className="mt-4 pt-4 border-t border-[#f0eded] grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-150 text-xs">
          {/* Tenure */}
          <div>
            <label className="block text-xs font-semibold text-[#1b1c1c] mb-2">
              Tenure Classification
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['Freehold', '99-year Leasehold', '999-year Leasehold'] as TenureType[]).map((tenure) => {
                const isSelected = filters.tenures.includes(tenure);
                return (
                  <button
                    key={tenure}
                    onClick={() => handleTenureToggle(tenure)}
                    className={`px-2.5 py-1 text-xs rounded-xs border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#004d99] text-white border-[#004d99] font-medium'
                        : 'bg-[#f5f3f3] text-[#424752] border-transparent hover:bg-[#e4e2e1]'
                    }`}
                  >
                    {tenure}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unit Price PSF Filter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#1b1c1c]">
                Max Unit Price ($ PSF)
              </label>
              <span className="font-mono text-[#004d99] font-bold text-xs">
                {filters.maxPsf >= 5000 ? 'Any PSF' : `≤ S$${filters.maxPsf.toLocaleString()} psf`}
              </span>
            </div>
            <input
              type="range"
              min={1200}
              max={5000}
              step={100}
              value={filters.maxPsf}
              onChange={(e) => setFilters((p) => ({ ...p, maxPsf: Number(e.target.value) }))}
              className="w-full accent-[#004d99] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#727783] mt-1 font-mono">
              <span>S$1,200</span>
              <span>S$2,500</span>
              <span>S$3,500</span>
              <span>S$5,000+</span>
            </div>
          </div>

          {/* Nett Total Price Filter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#1b1c1c]">
                Max Transacted Nett Price
              </label>
              <span className="font-mono text-[#004d99] font-bold text-xs">
                {filters.maxPrice >= 15000000 ? 'Any Price' : `≤ S$${(filters.maxPrice / 1000000).toFixed(1)}M`}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={15000000}
              step={500000}
              value={filters.maxPrice}
              onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
              className="w-full accent-[#004d99] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#727783] mt-1 font-mono">
              <span>S$1M</span>
              <span>S$4M</span>
              <span>S$8M</span>
              <span>S$15M+</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
