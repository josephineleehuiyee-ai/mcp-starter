import React, { useState } from 'react';
import { Menu, X, Search, FileText, Map, BarChart3, ArrowLeftRight, HelpCircle, Download, Car } from 'lucide-react';

interface UraHeaderProps {
  activeTab: 'transactions' | 'analytics' | 'map' | 'comparison' | 'carparks' | 'guide';
  setActiveTab: (tab: 'transactions' | 'analytics' | 'map' | 'comparison' | 'carparks' | 'guide') => void;
  onExportCsv?: () => void;
  totalRecordsCount: number;
}

export const UraHeader: React.FC<UraHeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportCsv,
  totalRecordsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'transactions', label: 'Residential Transactions', icon: FileText },
    { id: 'analytics', label: 'Market Trends & Indices', icon: BarChart3 },
    { id: 'map', label: 'District Map Explorer', icon: Map },
    { id: 'comparison', label: 'Compare Projects', icon: ArrowLeftRight },
    { id: 'carparks', label: 'Live Carparks & Rates', icon: Car },
    { id: 'guide', label: 'Caveats & ABSD Guide', icon: HelpCircle },
  ] as const;

  return (
    <header className="bg-white border-b border-[#e2e4e8] sticky top-0 z-30 shadow-xs">
      {/* Upper Brand Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          {/* URA Emblem */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('transactions')}>
            <div className="w-10 h-10 bg-[#b6171e] text-white flex items-center justify-center font-bold tracking-tight rounded-xs shadow-xs text-sm">
              <span className="font-extrabold text-base tracking-tighter">URA</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#1b1c1c] text-base sm:text-lg tracking-tight leading-tight uppercase font-sans">
                  Urban Redevelopment Authority
                </span>
                <span className="hidden md:inline-block text-[11px] font-semibold text-[#b6171e] bg-[#ffdad6] px-2 py-0.5 rounded-xs">
                  REAL ESTATE INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-[#555a64] font-medium hidden sm:block">
                Property Market Information (PMI) · Private Residential Sector
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[11px] text-[#727783] block">Registry Source</span>
            <span className="text-xs font-semibold text-[#1b1c1c]">Singapore Land Authority (SLA)</span>
          </div>

          <div className="h-7 w-px bg-[#e2e4e8]" />

          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-[#004d99] text-[#004d99] hover:bg-[#eef4fc] active:bg-[#dae5ff] rounded-xs text-xs font-semibold transition-colors cursor-pointer"
              title="Export transacted caveats dataset as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({totalRecordsCount})</span>
            </button>
          )}

          <a
            href="https://www.ura.gov.sg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#424752] hover:text-[#004d99] font-medium"
          >
            URA Main Portal ↗
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 lg:hidden">
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="p-2 border border-[#c2c6d4] text-[#004d99] rounded-xs text-xs font-semibold"
              aria-label="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1b1c1c] hover:bg-[#f5f3f3] rounded-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#004d99]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Tab Bar */}
      <div className="bg-[#004d99] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors relative cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-[#ffb3ac] bg-[#003870] text-white shadow-inner'
                      : 'border-transparent text-[#dae5ff] hover:text-white hover:bg-[#004182]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffb3ac]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e2e4e8] shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xs text-sm font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-[#eef4fc] text-[#004d99] border-l-4 border-[#004d99]'
                      : 'text-[#424752] hover:bg-[#f5f3f3]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#004d99]' : 'text-[#727783]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 bg-[#f5f3f3] border-t border-[#e2e4e8] text-xs text-[#555a64] flex justify-between items-center">
            <span>Official URA Singapore E-Service</span>
            <span className="font-semibold text-[#004d99]">Updated Oct 2026</span>
          </div>
        </div>
      )}
    </header>
  );
};
