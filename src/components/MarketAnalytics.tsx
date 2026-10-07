import React, { useState } from 'react';
import { TrendingUp, BarChart2, PieChart, Activity, Info, Award } from 'lucide-react';
import { PRICE_INDEX_HISTORY, POSTAL_DISTRICTS } from '../data/mockUraData';
import { TransactionRecord } from '../types/ura';

interface MarketAnalyticsProps {
  transactions: TransactionRecord[];
}

export const MarketAnalytics: React.FC<MarketAnalyticsProps> = ({ transactions }) => {
  const [indexMetric, setIndexMetric] = useState<'overall' | 'ccr' | 'rcr' | 'ocr'>('overall');

  // Compute metrics from current transactions
  const totalVolume = transactions.length;
  const newSalesCount = transactions.filter((t) => t.saleType === 'New Sale').length;
  const resaleCount = transactions.filter((t) => t.saleType === 'Resale').length;
  const subSaleCount = transactions.filter((t) => t.saleType === 'Sub-Sale').length;

  // Region medians
  const ccrTxns = transactions.filter((t) => t.marketSegment === 'CCR');
  const rcrTxns = transactions.filter((t) => t.marketSegment === 'RCR');
  const ocrTxns = transactions.filter((t) => t.marketSegment === 'OCR');

  const getMedianPsf = (list: TransactionRecord[]) => {
    if (list.length === 0) return 0;
    const sorted = [...list].sort((a, b) => a.unitPricePsf - b.unitPricePsf);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid].unitPricePsf : Math.round((sorted[mid - 1].unitPricePsf + sorted[mid].unitPricePsf) / 2);
  };

  const ccrMedian = getMedianPsf(ccrTxns);
  const rcrMedian = getMedianPsf(rcrTxns);
  const ocrMedian = getMedianPsf(ocrTxns);

  // Price Distribution Buckets
  const bucketUnder1800 = transactions.filter((t) => t.unitPricePsf < 1800).length;
  const bucket1800to2200 = transactions.filter((t) => t.unitPricePsf >= 1800 && t.unitPricePsf < 2200).length;
  const bucket2200to2600 = transactions.filter((t) => t.unitPricePsf >= 2200 && t.unitPricePsf < 2600).length;
  const bucket2600to3000 = transactions.filter((t) => t.unitPricePsf >= 2600 && t.unitPricePsf < 3000).length;
  const bucketAbove3000 = transactions.filter((t) => t.unitPricePsf >= 3000).length;

  const maxBucket = Math.max(bucketUnder1800, bucket1800to2200, bucket2200to2600, bucket2600to3000, bucketAbove3000, 1);

  // Price index min/max for SVG scaling
  const minVal = 145;
  const maxVal = 185;
  const range = maxVal - minVal;

  return (
    <div className="space-y-6">
      {/* Top Flash Summary Banner */}
      <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#b6171e] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase">
                Flash Release
              </span>
              <span className="text-xs font-bold text-[#1b1c1c]">
                URA 3rd Quarter 2026 Private Residential Property Price Index
              </span>
            </div>
            <p className="text-xs text-[#555a64] mt-1">
              Private home prices rose by <strong>1.4% quarter-on-quarter</strong> in Q3 2026, accelerating from 0.5% in Q2 2026. The increase was anchored by new project launches in the Rest of Central Region (RCR) and Outside Central Region (OCR).
            </p>
          </div>

          <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-[#e2e4e8] pt-3 md:pt-0 md:pl-4">
            <div>
              <span className="text-[11px] text-[#727783] block">Overall PPI</span>
              <span className="text-xl font-bold font-mono text-[#004d99] tabular-nums">172.4</span>
              <span className="text-[10px] text-[#00695c] font-semibold block">+1.4% q-o-q</span>
            </div>
            <div>
              <span className="text-[11px] text-[#727783] block">Transaction Caveats</span>
              <span className="text-xl font-bold font-mono text-[#1b1c1c] tabular-nums">
                {totalVolume}
              </span>
              <span className="text-[10px] text-[#555a64] block">In Active Filter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Price Index Chart & Regional Median PSFs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Index Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
          <div className="flex flex-wrap items-center justify-between mb-4 pb-2 border-b border-[#e2e4e8] gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#1b1c1c]">
                Private Residential Property Price Index (PPI) Trend
              </h3>
              <p className="text-[11px] text-[#727783]">Base Year 2009-Q1 = 100 points</p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setIndexMetric('overall')}
                className={`px-2 py-1 rounded-xs font-semibold cursor-pointer ${
                  indexMetric === 'overall'
                    ? 'bg-[#004d99] text-white'
                    : 'bg-[#f5f3f3] text-[#424752] hover:bg-[#e4e2e1]'
                }`}
              >
                All Residential
              </button>
              <button
                onClick={() => setIndexMetric('ccr')}
                className={`px-2 py-1 rounded-xs font-semibold cursor-pointer ${
                  indexMetric === 'ccr'
                    ? 'bg-[#004d99] text-white'
                    : 'bg-[#f5f3f3] text-[#424752] hover:bg-[#e4e2e1]'
                }`}
              >
                CCR
              </button>
              <button
                onClick={() => setIndexMetric('rcr')}
                className={`px-2 py-1 rounded-xs font-semibold cursor-pointer ${
                  indexMetric === 'rcr'
                    ? 'bg-[#004d99] text-white'
                    : 'bg-[#f5f3f3] text-[#424752] hover:bg-[#e4e2e1]'
                }`}
              >
                RCR
              </button>
              <button
                onClick={() => setIndexMetric('ocr')}
                className={`px-2 py-1 rounded-xs font-semibold cursor-pointer ${
                  indexMetric === 'ocr'
                    ? 'bg-[#004d99] text-white'
                    : 'bg-[#f5f3f3] text-[#424752] hover:bg-[#e4e2e1]'
                }`}
              >
                OCR
              </button>
            </div>
          </div>

          {/* SVG Trend Chart */}
          <div className="h-64 relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="#f0eded" strokeWidth="1" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="#f0eded" strokeWidth="1" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f0eded" strokeWidth="1" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#f0eded" strokeWidth="1" />

              {/* Connecting line */}
              <path
                d={PRICE_INDEX_HISTORY.map((pt, i) => {
                  const val =
                    indexMetric === 'overall'
                      ? pt.overallIndex
                      : indexMetric === 'ccr'
                      ? pt.ccrIndex
                      : indexMetric === 'rcr'
                      ? pt.rcrIndex
                      : pt.ocrIndex;
                  const x = (i / (PRICE_INDEX_HISTORY.length - 1)) * 580 + 10;
                  const y = 190 - ((val - minVal) / range) * 170;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#004d99"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {PRICE_INDEX_HISTORY.map((pt, i) => {
                const val =
                  indexMetric === 'overall'
                    ? pt.overallIndex
                    : indexMetric === 'ccr'
                    ? pt.ccrIndex
                    : indexMetric === 'rcr'
                    ? pt.rcrIndex
                    : pt.ocrIndex;
                const x = (i / (PRICE_INDEX_HISTORY.length - 1)) * 580 + 10;
                const y = 190 - ((val - minVal) / range) * 170;
                return (
                  <g key={pt.period}>
                    <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#004d99" strokeWidth="2.5" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-[#727783] font-mono mt-2 pt-2 border-t border-[#f0eded]">
            {PRICE_INDEX_HISTORY.filter((_, i) => i % 2 === 0).map((pt) => (
              <span key={pt.period}>{pt.period.replace(' (Flash)', '')}</span>
            ))}
          </div>
        </div>

        {/* Regional Median Comparison (1 Col) */}
        <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#1b1c1c] border-b border-[#e2e4e8] pb-2 mb-3">
              Median Price per Sq Ft by Region
            </h3>
            <p className="text-[11px] text-[#555a64] mb-4">
              Realized caveat prices over the selected filter cohort:
            </p>

            <div className="space-y-4">
              {/* CCR */}
              <div className="p-3 bg-[#eef4fc] border-l-4 border-[#004d99] rounded-r-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#004d99]">CCR (Core Central)</span>
                  <span className="text-[10px] text-[#555a64]">{ccrTxns.length} txns</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#1b1c1c] mt-0.5 tabular-nums">
                  {ccrMedian ? `S$${ccrMedian.toLocaleString()}` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-[#727783]">psf</span>
                </div>
                <p className="text-[10px] text-[#555a64] mt-0.5">D01, D02, D04, D06, D09, D10, D11</p>
              </div>

              {/* RCR */}
              <div className="p-3 bg-[#e0f2f1] border-l-4 border-[#00695c] rounded-r-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#00695c]">RCR (Rest of Central)</span>
                  <span className="text-[10px] text-[#555a64]">{rcrTxns.length} txns</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#1b1c1c] mt-0.5 tabular-nums">
                  {rcrMedian ? `S$${rcrMedian.toLocaleString()}` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-[#727783]">psf</span>
                </div>
                <p className="text-[10px] text-[#555a64] mt-0.5">D03, D05, D07, D08, D12, D13, D14, D15, D20</p>
              </div>

              {/* OCR */}
              <div className="p-3 bg-[#f5f3f3] border-l-4 border-[#727783] rounded-r-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#1b1c1c]">OCR (Outside Central)</span>
                  <span className="text-[10px] text-[#555a64]">{ocrTxns.length} txns</span>
                </div>
                <div className="text-xl font-bold font-mono text-[#1b1c1c] mt-0.5 tabular-nums">
                  {ocrMedian ? `S$${ocrMedian.toLocaleString()}` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-[#727783]">psf</span>
                </div>
                <p className="text-[10px] text-[#555a64] mt-0.5">D16-D19, D22-D28</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#727783] mt-4 pt-3 border-t border-[#f0eded]">
            *Calculated from caveats lodged with SLA
          </div>
        </div>
      </div>

      {/* Secondary Row: Transaction Types & PSF Distribution Histogram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sale Type Breakdown */}
        <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
          <h3 className="font-bold text-sm text-[#1b1c1c] border-b border-[#e2e4e8] pb-2 mb-3">
            Transaction Volume by Type of Sale
          </h3>

          <div className="space-y-3 pt-1">
            {/* New Sale */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#1b1c1c]">New Sale (Direct Developer)</span>
                <span className="font-mono tabular-nums text-[#004d99] font-bold">
                  {newSalesCount} ({totalVolume > 0 ? Math.round((newSalesCount / totalVolume) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-[#f0eded] h-3 rounded-xs overflow-hidden">
                <div
                  className="bg-[#004d99] h-full"
                  style={{ width: `${totalVolume > 0 ? (newSalesCount / totalVolume) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Resale */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#1b1c1c]">Resale (Secondary Market)</span>
                <span className="font-mono tabular-nums text-[#00695c] font-bold">
                  {resaleCount} ({totalVolume > 0 ? Math.round((resaleCount / totalVolume) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-[#f0eded] h-3 rounded-xs overflow-hidden">
                <div
                  className="bg-[#00695c] h-full"
                  style={{ width: `${totalVolume > 0 ? (resaleCount / totalVolume) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Sub-Sale */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#1b1c1c]">Sub-Sale (Prior to TOP)</span>
                <span className="font-mono tabular-nums text-[#b6171e] font-bold">
                  {subSaleCount} ({totalVolume > 0 ? Math.round((subSaleCount / totalVolume) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-[#f0eded] h-3 rounded-xs overflow-hidden">
                <div
                  className="bg-[#b6171e] h-full"
                  style={{ width: `${totalVolume > 0 ? (subSaleCount / totalVolume) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Unit Price PSF Distribution */}
        <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
          <h3 className="font-bold text-sm text-[#1b1c1c] border-b border-[#e2e4e8] pb-2 mb-3">
            Unit Price ($ PSF) Distribution Spectrum
          </h3>

          <div className="space-y-2 pt-1">
            {[
              { label: '< S$1,800 psf', count: bucketUnder1800 },
              { label: 'S$1,800 - S$2,199 psf', count: bucket1800to2200 },
              { label: 'S$2,200 - S$2,599 psf', count: bucket2200to2600 },
              { label: 'S$2,600 - S$2,999 psf', count: bucket2600to3000 },
              { label: '≥ S$3,000 psf', count: bucketAbove3000 },
            ].map((b) => (
              <div key={b.label} className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-[#424752] font-medium">{b.label}</span>
                  <span className="font-mono font-bold text-[#1b1c1c] tabular-nums">
                    {b.count} caveat{b.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="w-full bg-[#f0eded] h-2.5 rounded-xs overflow-hidden">
                  <div
                    className="bg-[#1565c0] h-full transition-all duration-300"
                    style={{ width: `${(b.count / maxBucket) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
