import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown, Eye, FileText, Check, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { TransactionRecord } from '../types/ura';

interface TransactionsTableProps {
  transactions: TransactionRecord[];
  onSelectTransaction: (record: TransactionRecord) => void;
  areaUnit: 'sqft' | 'sqm';
  setAreaUnit: (unit: 'sqft' | 'sqm') => void;
}

type SortField = 'date' | 'price' | 'psf' | 'area' | 'project';
type SortOrder = 'asc' | 'desc';

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onSelectTransaction,
  areaUnit,
  setAreaUnit,
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [tableSearch, setTableSearch] = useState('');

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter by inline table search
  const filteredList = useMemo(() => {
    if (!tableSearch.trim()) return transactions;
    const term = tableSearch.toLowerCase();
    return transactions.filter(
      (t) =>
        t.project.toLowerCase().includes(term) ||
        t.street.toLowerCase().includes(term) ||
        t.districtCode.toLowerCase().includes(term) ||
        t.slaCaveatNumber.toLowerCase().includes(term) ||
        t.propertyType.toLowerCase().includes(term)
    );
  }, [transactions, tableSearch]);

  // Sort list
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
          break;
        case 'price':
          comparison = a.nettPrice - b.nettPrice;
          break;
        case 'psf':
          comparison = a.unitPricePsf - b.unitPricePsf;
          break;
        case 'area':
          comparison = a.areaSqft - b.areaSqft;
          break;
        case 'project':
          comparison = a.project.localeCompare(b.project);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredList, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedList.slice(start, start + pageSize);
  }, [sortedList, currentPage, pageSize]);

  // Reset page when dataset or page size changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [transactions.length, pageSize, tableSearch]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white border border-[#e2e4e8] rounded-xs shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#e2e4e8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbf9f8]">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wide">
            Transacted Records ({sortedList.length})
          </span>
          <span className="text-[#c2c6d4]">|</span>
          {/* Unit Toggle */}
          <div className="inline-flex items-center border border-[#c2c6d4] rounded-xs overflow-hidden text-xs bg-white">
            <button
              onClick={() => setAreaUnit('sqft')}
              className={`px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                areaUnit === 'sqft'
                  ? 'bg-[#004d99] text-white font-semibold'
                  : 'text-[#424752] hover:bg-[#f5f3f3]'
              }`}
            >
              Sq Ft ($ PSF)
            </button>
            <button
              onClick={() => setAreaUnit('sqm')}
              className={`px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                areaUnit === 'sqm'
                  ? 'bg-[#004d99] text-white font-semibold'
                  : 'text-[#424752] hover:bg-[#f5f3f3]'
              }`}
            >
              Sq Metre ($ PSM)
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick filter within results */}
          <input
            type="text"
            placeholder="Quick search within results..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="text-xs px-3 py-1.5 border border-[#727783] rounded-xs w-48 sm:w-60 focus:outline-none focus:border-[#004d99] focus:ring-2 focus:ring-[#004d99]/20"
          />

          {/* Page size dropdown */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="text-xs px-2.5 py-1.5 border border-[#c2c6d4] rounded-xs bg-white text-[#1b1c1c] focus:outline-none focus:border-[#004d99]"
          >
            <option value={10}>10 / page</option>
            <option value={15}>15 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f0f2f5] border-b border-[#e2e4e8] text-[#1b1c1c] font-semibold select-none">
              <th
                onClick={() => handleSort('project')}
                className="py-3 px-3.5 hover:bg-[#e4e2e1] cursor-pointer whitespace-nowrap"
              >
                <div className="flex items-center space-x-1">
                  <span>Project & Location</span>
                  {sortField === 'project' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#004d99]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#004d99]" />
                  )}
                </div>
              </th>

              <th className="py-3 px-3 whitespace-nowrap">Property Type</th>

              <th className="py-3 px-3 whitespace-nowrap">Sale Type</th>

              <th className="py-3 px-3 whitespace-nowrap">Floor Level</th>

              <th
                onClick={() => handleSort('area')}
                className="py-3 px-3 hover:bg-[#e4e2e1] cursor-pointer whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Area ({areaUnit === 'sqft' ? 'sq ft' : 'sq m'})</span>
                  {sortField === 'area' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#004d99]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#004d99]" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('psf')}
                className="py-3 px-3 hover:bg-[#e4e2e1] cursor-pointer whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Unit Price ({areaUnit === 'sqft' ? '$ PSF' : '$ PSM'})</span>
                  {sortField === 'psf' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#004d99]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#004d99]" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('price')}
                className="py-3 px-3 hover:bg-[#e4e2e1] cursor-pointer whitespace-nowrap text-right font-bold"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Nett Price (S$)</span>
                  {sortField === 'price' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#004d99]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#004d99]" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('date')}
                className="py-3 px-3.5 hover:bg-[#e4e2e1] cursor-pointer whitespace-nowrap"
              >
                <div className="flex items-center space-x-1">
                  <span>Date of Sale</span>
                  {sortField === 'date' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#004d99]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#004d99]" />
                  )}
                </div>
              </th>

              <th className="py-3 px-3.5 text-center whitespace-nowrap">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e4e8]">
            {paginatedList.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[#727783] bg-[#fbf9f8]">
                  <FileText className="w-8 h-8 mx-auto text-[#c2c6d4] mb-2" />
                  <p className="font-semibold text-sm text-[#1b1c1c]">No transactions found matching your criteria</p>
                  <p className="text-xs text-[#727783] mt-1">Try widening your filters or selecting additional postal districts.</p>
                </td>
              </tr>
            ) : (
              paginatedList.map((item) => {
                const regionColor =
                  item.marketSegment === 'CCR'
                    ? 'text-[#004d99] bg-[#eef4fc]'
                    : item.marketSegment === 'RCR'
                    ? 'text-[#00695c] bg-[#e0f2f1]'
                    : 'text-[#424752] bg-[#f0eded]';

                const saleTypeBadge =
                  item.saleType === 'New Sale'
                    ? 'text-[#b6171e] font-semibold'
                    : item.saleType === 'Resale'
                    ? 'text-[#1b1c1c]'
                    : 'text-[#00695c] font-medium';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectTransaction(item)}
                    className="hover:bg-[#f5f8fc] cursor-pointer transition-colors group"
                  >
                    {/* Project & Location */}
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-[#1b1c1c] group-hover:text-[#004d99] transition-colors">
                        {item.project}
                      </div>
                      <div className="text-[11px] text-[#555a64] mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>{item.street}</span>
                        <span className="text-[#c2c6d4]">·</span>
                        <span className="font-semibold">{item.districtCode}</span>
                        <span className={`text-[10px] px-1 py-0.2 rounded-xs font-semibold ${regionColor}`}>
                          {item.marketSegment}
                        </span>
                      </div>
                    </td>

                    {/* Property Type */}
                    <td className="py-3 px-3 text-[#424752]">
                      <span className="font-medium">{item.propertyType}</span>
                      <span className="block text-[10px] text-[#727783]">{item.tenure}</span>
                    </td>

                    {/* Sale Type */}
                    <td className="py-3 px-3">
                      <span className={`text-xs ${saleTypeBadge}`}>{item.saleType}</span>
                    </td>

                    {/* Floor Level */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[#1b1c1c]">
                      {item.floorRange}
                    </td>

                    {/* Area */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#1b1c1c]">
                      {areaUnit === 'sqft' ? (
                        <>
                          <div className="font-semibold">{item.areaSqft.toLocaleString()} sqft</div>
                          <div className="text-[10px] text-[#727783]">{item.areaSqm} sqm</div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold">{item.areaSqm.toLocaleString()} sqm</div>
                          <div className="text-[10px] text-[#727783]">{item.areaSqft.toLocaleString()} sqft</div>
                        </>
                      )}
                    </td>

                    {/* Unit Price PSF / PSM */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      {areaUnit === 'sqft' ? (
                        <>
                          <div className="font-bold text-[#004d99]">S${item.unitPricePsf.toLocaleString()}</div>
                          <div className="text-[10px] text-[#727783]">psf</div>
                        </>
                      ) : (
                        <>
                          <div className="font-bold text-[#004d99]">S${item.unitPricePsm.toLocaleString()}</div>
                          <div className="text-[10px] text-[#727783]">psm</div>
                        </>
                      )}
                    </td>

                    {/* Nett Price */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-sm text-[#1b1c1c]">
                      {formatPrice(item.nettPrice)}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-mono text-[#1b1c1c] text-xs">{item.saleDate}</div>
                      <div className="text-[10px] text-[#727783]">Caveat: {item.caveatDate}</div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(item);
                        }}
                        className="p-1 text-[#004d99] hover:bg-[#eef4fc] rounded-xs transition-colors"
                        title="View Official Caveat Certificate"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout for Phone Screens (< 768px) */}
      <div className="md:hidden divide-y divide-[#e2e4e8]">
        {paginatedList.length === 0 ? (
          <div className="text-center py-10 px-4 text-[#727783]">
            <p className="font-semibold text-sm text-[#1b1c1c]">No transactions found</p>
            <p className="text-xs text-[#727783] mt-1">Adjust search filters above.</p>
          </div>
        ) : (
          paginatedList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectTransaction(item)}
              className="p-4 active:bg-[#f5f8fc] transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <div>
                  <h4 className="font-bold text-sm text-[#1b1c1c] leading-tight">{item.project}</h4>
                  <div className="text-xs text-[#555a64] mt-0.5">
                    {item.street} · {item.districtCode} ({item.marketSegment})
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base text-[#004d99] font-mono tabular-nums">
                    {formatPrice(item.nettPrice)}
                  </div>
                  <div className="text-[11px] text-[#727783] font-mono">
                    S${item.unitPricePsf.toLocaleString()} psf
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 my-2 border-y border-[#f0eded] text-xs text-[#424752]">
                <div>
                  <span className="text-[10px] text-[#727783] block">Type</span>
                  <span className="font-medium text-[#1b1c1c]">{item.propertyType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#727783] block">Sale</span>
                  <span className="font-medium text-[#1b1c1c]">{item.saleType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#727783] block">Floor</span>
                  <span className="font-medium font-mono text-[#1b1c1c]">{item.floorRange}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-[#555a64] pt-1">
                <span className="font-mono">
                  {item.areaSqft} sqft ({item.areaSqm} sqm)
                </span>
                <span className="text-[11px] text-[#727783]">
                  Date: {item.saleDate}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-[#e2e4e8] bg-[#fbf9f8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555a64]">
        <div className="tabular-nums">
          Showing <strong>{sortedList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
          <strong>{Math.min(currentPage * pageSize, sortedList.length)}</strong> of{' '}
          <strong>{sortedList.length}</strong> caveat records
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 border border-[#c2c6d4] rounded-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-[#1b1c1c] cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-[#c2c6d4] rounded-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-[#1b1c1c] cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
