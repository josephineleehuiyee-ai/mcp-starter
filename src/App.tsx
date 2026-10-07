import React, { useState, useMemo } from 'react';
import { SgMasthead } from './components/SgMasthead';
import { UraHeader } from './components/UraHeader';
import { StatutoryBanner } from './components/StatutoryBanner';
import { SearchFilters } from './components/SearchFilters';
import { TransactionsTable } from './components/TransactionsTable';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { MarketAnalytics } from './components/MarketAnalytics';
import { DistrictMapExplorer } from './components/DistrictMapExplorer';
import { ProjectComparison } from './components/ProjectComparison';
import { CaveatAndStampDutyGuide } from './components/CaveatAndStampDutyGuide';
import { UraFooter } from './components/UraFooter';
import { RAW_TRANSACTIONS, POSTAL_DISTRICTS } from './data/mockUraData';
import { FilterState, TransactionRecord } from './types/ura';
import { Building, TrendingUp, DollarSign, Layers, ChevronRight, FileSpreadsheet } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchMode: 'project',
  searchQuery: '',
  selectedDistricts: [],
  propertyTypes: [],
  saleTypes: [],
  tenures: [],
  marketSegments: [],
  dateRange: 'all',
  minPrice: 0,
  maxPrice: 20000000,
  minPsf: 0,
  maxPsf: 6000,
  floorRanges: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'analytics' | 'map' | 'comparison' | 'guide'>('transactions');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const [areaUnit, setAreaUnit] = useState<'sqft' | 'sqm'>('sqft');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return RAW_TRANSACTIONS.filter((record) => {
      // Search query (Project name or Street)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        if (filters.searchMode === 'project') {
          if (!record.project.toLowerCase().includes(query)) return false;
        } else if (filters.searchMode === 'street') {
          if (!record.street.toLowerCase().includes(query)) return false;
        } else {
          // generic fallback
          const match =
            record.project.toLowerCase().includes(query) ||
            record.street.toLowerCase().includes(query) ||
            record.districtCode.toLowerCase().includes(query);
          if (!match) return false;
        }
      }

      // District Filter
      if (filters.selectedDistricts.length > 0) {
        if (!filters.selectedDistricts.includes(record.postalDistrict)) return false;
      }

      // Property Type Filter
      if (filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(record.propertyType)) return false;
      }

      // Sale Type Filter
      if (filters.saleTypes.length > 0) {
        if (!filters.saleTypes.includes(record.saleType)) return false;
      }

      // Tenure Filter
      if (filters.tenures.length > 0) {
        if (!filters.tenures.includes(record.tenure)) return false;
      }

      // Price Filters
      if (record.nettPrice < filters.minPrice || record.nettPrice > filters.maxPrice) {
        return false;
      }

      // Unit Price PSF Filter
      if (record.unitPricePsf < filters.minPsf || record.unitPricePsf > filters.maxPsf) {
        return false;
      }

      // Date Range Filter
      if (filters.dateRange !== 'all') {
        const txnDate = new Date(record.saleDate).getTime();
        const now = new Date('2026-10-06').getTime();
        const daysAgo = (now - txnDate) / (1000 * 3600 * 24);
        if (filters.dateRange === '3m' && daysAgo > 92) return false;
        if (filters.dateRange === '6m' && daysAgo > 184) return false;
        if (filters.dateRange === '1y' && daysAgo > 365) return false;
      }

      return true;
    });
  }, [filters]);

  // Overall Statistics for current active dataset
  const datasetStats = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return { totalCount: 0, medianPsf: 0, avgPrice: 0, newSaleRatio: 0 };
    }
    const count = filteredTransactions.length;
    const sortedPsf = [...filteredTransactions].map((t) => t.unitPricePsf).sort((a, b) => a - b);
    const medianPsf = sortedPsf[Math.floor(count / 2)];
    const avgPrice = Math.round(
      filteredTransactions.reduce((acc, cur) => acc + cur.nettPrice, 0) / count
    );
    const newSales = filteredTransactions.filter((t) => t.saleType === 'New Sale').length;
    const newSaleRatio = Math.round((newSales / count) * 100);

    return { totalCount: count, medianPsf, avgPrice, newSaleRatio };
  }, [filteredTransactions]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Switch to Transactions tab and filter to selected district
  const handleFilterByDistrict = (districtNum: number) => {
    setFilters({
      ...INITIAL_FILTERS,
      selectedDistricts: [districtNum],
    });
    setActiveTab('transactions');
  };

  // Switch to Transactions tab and filter to selected project
  const handleFilterByProject = (projectName: string) => {
    setFilters({
      ...INITIAL_FILTERS,
      searchMode: 'project',
      searchQuery: projectName,
    });
    setActiveTab('transactions');
  };

  // Export dataset to CSV
  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) return;

    const headers = [
      'Project Name',
      'Street Name',
      'Postal District',
      'Market Segment',
      'Property Type',
      'Sale Type',
      'Floor Level',
      'Area (sq ft)',
      'Area (sq m)',
      'Unit Price ($ PSF)',
      'Unit Price ($ PSM)',
      'Transacted Nett Price (SGD)',
      'Date of Sale',
      'Caveat Lodged Date',
      'Tenure',
      'SLA Caveat Reference',
    ];

    const rows = filteredTransactions.map((t) => [
      `"${t.project.replace(/"/g, '""')}"`,
      `"${t.street.replace(/"/g, '""')}"`,
      `"${t.districtCode}"`,
      `"${t.marketSegment}"`,
      `"${t.propertyType}"`,
      `"${t.saleType}"`,
      `"${t.floorRange}"`,
      t.areaSqft,
      t.areaSqm,
      t.unitPricePsf,
      t.unitPricePsm,
      t.nettPrice,
      `"${t.saleDate}"`,
      `"${t.caveatDate}"`,
      `"${t.tenure}"`,
      `"${t.slaCaveatNumber}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `URA_Residential_Transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col font-sans text-[#1b1c1c]">
      {/* 1. Singapore Government Masthead */}
      <SgMasthead />

      {/* 2. URA Brand Header & Navigation */}
      <UraHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportCsv={handleExportCsv}
        totalRecordsCount={filteredTransactions.length}
      />

      {/* 3. Main Portal Body Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center space-x-1.5 text-xs text-[#555a64]" aria-label="Breadcrumb">
          <span className="hover:text-[#004d99] cursor-pointer">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#727783]" />
          <span className="hover:text-[#004d99] cursor-pointer">Property Market Information</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#727783]" />
          <span className="hover:text-[#004d99] cursor-pointer">Private Residential</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#727783]" />
          <span className="font-semibold text-[#1b1c1c]">Transactions</span>
        </nav>

        {/* Section Title Header */}
        <div className="border-b border-[#e2e4e8] pb-3 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1c] tracking-tight font-sans">
              Private Residential Property Transactions
            </h1>
            <p className="text-xs sm:text-sm text-[#555a64] mt-0.5">
              Official caveats lodged with the Singapore Land Authority (SLA) & developer transaction returns
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-[#727783] block">Registry Coverage</span>
            <span className="text-xs font-semibold text-[#004d99]">
              Condominiums, Apartments & Landed Properties
            </span>
          </div>
        </div>

        {/* Official Statutory Update Banner */}
        <StatutoryBanner />

        {/* Tab 1: Transactions View */}
        {activeTab === 'transactions' && (
          <div className="space-y-5">
            {/* Real-time Summary Scorecards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-[#e2e4e8] p-3.5 sm:p-4 rounded-xs shadow-xs">
                <span className="text-[11px] text-[#727783] block">Transacted Caveats Found</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#004d99] tabular-nums">
                  {datasetStats.totalCount}
                </span>
                <span className="text-[10px] text-[#555a64] block mt-0.5">
                  Across 28 postal districts
                </span>
              </div>

              <div className="bg-white border border-[#e2e4e8] p-3.5 sm:p-4 rounded-xs shadow-xs">
                <span className="text-[11px] text-[#727783] block">Median Unit Price</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#1b1c1c] tabular-nums">
                  {datasetStats.medianPsf ? `S$${datasetStats.medianPsf.toLocaleString()}` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-[#727783]">psf</span>
                </span>
                <span className="text-[10px] text-[#00695c] font-semibold block mt-0.5">
                  Filtered Cohort
                </span>
              </div>

              <div className="bg-white border border-[#e2e4e8] p-3.5 sm:p-4 rounded-xs shadow-xs">
                <span className="text-[11px] text-[#727783] block">Average Transacted Price</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#1b1c1c] tabular-nums">
                  {datasetStats.avgPrice ? formatPrice(datasetStats.avgPrice) : 'N/A'}
                </span>
                <span className="text-[10px] text-[#555a64] block mt-0.5">
                  Per dwelling unit
                </span>
              </div>

              <div className="bg-white border border-[#e2e4e8] p-3.5 sm:p-4 rounded-xs shadow-xs">
                <span className="text-[11px] text-[#727783] block">New Developer Sales</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#b6171e] tabular-nums">
                  {datasetStats.newSaleRatio}%
                </span>
                <span className="text-[10px] text-[#555a64] block mt-0.5">
                  Direct primary market
                </span>
              </div>
            </div>

            {/* Interactive Search & Multi-Dimensional Filters */}
            <SearchFilters
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
              totalResults={filteredTransactions.length}
            />

            {/* Statutory Transactions Table */}
            <TransactionsTable
              transactions={filteredTransactions}
              onSelectTransaction={setSelectedTransaction}
              areaUnit={areaUnit}
              setAreaUnit={setAreaUnit}
            />
          </div>
        )}

        {/* Tab 2: Market Analytics & Price Indices */}
        {activeTab === 'analytics' && (
          <MarketAnalytics transactions={filteredTransactions} />
        )}

        {/* Tab 3: Interactive District Map Explorer */}
        {activeTab === 'map' && (
          <DistrictMapExplorer onSelectDistrictToFilter={handleFilterByDistrict} />
        )}

        {/* Tab 4: Project Side-by-Side Comparison Matrix */}
        {activeTab === 'comparison' && (
          <ProjectComparison onSelectProjectForFilter={handleFilterByProject} />
        )}

        {/* Tab 5: Caveats & Stamp Duty Legal Guide */}
        {activeTab === 'guide' && <CaveatAndStampDutyGuide />}
      </main>

      {/* 4. Transaction Extract Detail Modal / Caveat Certificate */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onSelectOtherTransaction={(record) => setSelectedTransaction(record)}
        />
      )}

      {/* 5. Singapore Government Agency Footer */}
      <UraFooter />
    </div>
  );
}
