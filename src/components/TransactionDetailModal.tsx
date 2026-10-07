import React from 'react';
import { X, Building2, MapPin, Calendar, FileText, CheckCircle2, Printer, Shield, ArrowUpRight, DollarSign } from 'lucide-react';
import { TransactionRecord } from '../types/ura';
import { RAW_TRANSACTIONS } from '../data/mockUraData';

interface TransactionDetailModalProps {
  transaction: TransactionRecord | null;
  onClose: () => void;
  onSelectOtherTransaction: (record: TransactionRecord) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onSelectOtherTransaction,
}) => {
  if (!transaction) return null;

  // Calculate Singapore Buyer Stamp Duty (BSD) estimate based on current IRAS schedule:
  // First $180k: 1%
  // Next $180k ($180k-$360k): 2%
  // Next $640k ($360k-$1M): 3%
  // Next $500k ($1M-$1.5M): 4%
  // Next $1.5M ($1.5M-$3M): 5%
  // Above $3M: 6%
  const calculateBsd = (price: number) => {
    let tax = 0;
    if (price > 3000000) {
      tax += (price - 3000000) * 0.06;
      tax += 1500000 * 0.05;
      tax += 500000 * 0.04;
      tax += 640000 * 0.03;
      tax += 180000 * 0.02;
      tax += 180000 * 0.01;
    } else if (price > 1500000) {
      tax += (price - 1500000) * 0.05;
      tax += 500000 * 0.04;
      tax += 640000 * 0.03;
      tax += 180000 * 0.02;
      tax += 180000 * 0.01;
    } else if (price > 1000000) {
      tax += (price - 1000000) * 0.04;
      tax += 640000 * 0.03;
      tax += 180000 * 0.02;
      tax += 180000 * 0.01;
    } else if (price > 360000) {
      tax += (price - 360000) * 0.03;
      tax += 180000 * 0.02;
      tax += 180000 * 0.01;
    } else if (price > 180000) {
      tax += (price - 180000) * 0.02;
      tax += 180000 * 0.01;
    } else {
      tax += price * 0.01;
    }
    return Math.round(tax);
  };

  const bsdAmount = calculateBsd(transaction.nettPrice);

  // Find other transactions in the same project
  const siblingTransactions = RAW_TRANSACTIONS.filter(
    (t) => t.project === transaction.project && t.id !== transaction.id
  ).slice(0, 3);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white border border-[#c2c6d4] rounded-xs shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Masthead Header */}
        <div className="bg-[#004d99] text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#b6171e] text-white flex items-center justify-center font-bold text-xs rounded-xs">
              URA
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#dae5ff] font-semibold">
                Official Transaction Extract
              </div>
              <h3 className="font-bold text-base sm:text-lg leading-tight text-white font-sans">
                {transaction.project}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-1.5 hover:bg-[#003870] text-[#dae5ff] hover:text-white rounded-xs transition-colors cursor-pointer"
              title="Print transaction summary"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#003870] text-[#dae5ff] hover:text-white rounded-xs transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 text-xs text-[#1b1c1c]">
          {/* Key Stat Cards Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f5f8fc] border border-[#c2c6d4] p-4 rounded-xs">
            <div>
              <span className="text-[11px] text-[#727783] block">Transacted Price</span>
              <span className="font-mono tabular-nums text-lg font-bold text-[#004d99]">
                {formatPrice(transaction.nettPrice)}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#727783] block">Unit Price (PSF)</span>
              <span className="font-mono tabular-nums text-base font-bold text-[#1b1c1c]">
                S${transaction.unitPricePsf.toLocaleString()}
                <span className="text-xs font-normal text-[#727783] ml-0.5">psf</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#727783] block">Unit Floor Area</span>
              <span className="font-mono tabular-nums text-base font-semibold text-[#1b1c1c]">
                {transaction.areaSqft.toLocaleString()} sqft
              </span>
              <span className="text-[10px] text-[#727783] block">({transaction.areaSqm} sqm)</span>
            </div>

            <div>
              <span className="text-[11px] text-[#727783] block">Floor Level Range</span>
              <span className="font-mono text-base font-bold text-[#1b1c1c]">
                {transaction.floorRange}
              </span>
            </div>
          </div>

          {/* Legal Caveat Certification Details */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004d99] uppercase tracking-wide border-b border-[#e2e4e8] pb-1 mb-3">
              <Shield className="w-4 h-4 text-[#004d99]" />
              <span>Singapore Land Authority (SLA) Lodgement Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#fbf9f8] p-3.5 border border-[#e2e4e8] rounded-xs text-xs">
              <div>
                <span className="text-[#727783] block text-[11px]">SLA Caveat Lodgement No.</span>
                <span className="font-mono font-bold text-[#1b1c1c] text-sm">{transaction.slaCaveatNumber}</span>
              </div>
              <div>
                <span className="text-[#727783] block text-[11px]">Date of Contract / OTP</span>
                <span className="font-mono font-semibold text-[#1b1c1c]">{transaction.saleDate}</span>
              </div>
              <div>
                <span className="text-[#727783] block text-[11px]">SLA Caveat Lodged Date</span>
                <span className="font-mono font-semibold text-[#1b1c1c]">{transaction.caveatDate}</span>
              </div>
            </div>
          </div>

          {/* Property Specifications Matrix */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004d99] uppercase tracking-wide border-b border-[#e2e4e8] pb-1 mb-3">
              <Building2 className="w-4 h-4 text-[#004d99]" />
              <span>Development Attributes & Tenure</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[#727783] text-[11px] block">Postal District</span>
                <span className="font-semibold text-xs">
                  {transaction.districtCode} ({transaction.marketSegment})
                </span>
                <span className="text-[10px] text-[#555a64] block">Sector {transaction.postalSector}</span>
              </div>

              <div>
                <span className="text-[#727783] text-[11px] block">Property Classification</span>
                <span className="font-semibold text-xs">{transaction.propertyType}</span>
                <span className="text-[10px] text-[#555a64] block">{transaction.saleType}</span>
              </div>

              <div>
                <span className="text-[#727783] text-[11px] block">Title Tenure</span>
                <span className="font-semibold text-xs">{transaction.tenure}</span>
                {transaction.tenureDetails && (
                  <span className="text-[10px] text-[#727783] block">{transaction.tenureDetails}</span>
                )}
              </div>

              <div>
                <span className="text-[#727783] text-[11px] block">Completion Status (TOP)</span>
                <span className="font-semibold text-xs">{transaction.completionDate}</span>
              </div>
            </div>

            {transaction.developer && (
              <div className="mt-3 text-xs bg-[#f5f3f3] p-2.5 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-[#727783] text-[11px]">Master Developer: </span>
                  <span className="font-semibold text-[#1b1c1c]">{transaction.developer}</span>
                </div>
                <span className="text-[11px] text-[#00695c] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  URA Verified
                </span>
              </div>
            )}
          </div>

          {/* Stamp Duty Guide Box */}
          <div className="bg-[#fff8e1] border border-[#ffe082] p-4 rounded-xs text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#b78103] mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Estimated Buyer's Stamp Duty (IRAS BSD Schedule)</span>
            </div>
            <p className="text-[#5d4037] leading-relaxed text-[11px]">
              For a transacted residential purchase price of <strong>{formatPrice(transaction.nettPrice)}</strong>, standard Buyer's Stamp Duty (BSD) payable to the Inland Revenue Authority of Singapore (IRAS) is approximately:
            </p>
            <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-base font-bold text-[#b78103] tabular-nums">
                {formatPrice(bsdAmount)}
              </span>
              <span className="text-[11px] text-[#795548]">
                *Does not include Additional Buyer's Stamp Duty (ABSD) for 2nd+ properties or foreigners.
              </span>
            </div>
          </div>

          {/* Sibling Historical Caveats in Same Development */}
          {siblingTransactions.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b border-[#e2e4e8] pb-1 mb-3">
                <span className="text-xs font-bold text-[#004d99] uppercase tracking-wide">
                  Recent Caveats in {transaction.project} ({siblingTransactions.length})
                </span>
                <span className="text-[11px] text-[#727783]">Click to switch transaction</span>
              </div>

              <div className="space-y-1.5">
                {siblingTransactions.map((sibling) => (
                  <div
                    key={sibling.id}
                    onClick={() => onSelectOtherTransaction(sibling)}
                    className="p-2.5 border border-[#e2e4e8] hover:border-[#004d99] hover:bg-[#eef4fc] rounded-xs flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#1b1c1c] text-xs">
                        Floor {sibling.floorRange} · {sibling.areaSqft} sqft
                      </div>
                      <div className="text-[11px] text-[#727783] font-mono">
                        Date: {sibling.saleDate} · {sibling.saleType}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-[#004d99] font-mono tabular-nums">
                        {formatPrice(sibling.nettPrice)}
                      </div>
                      <div className="text-[10px] text-[#727783] font-mono">
                        S${sibling.unitPricePsf.toLocaleString()} psf
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#f0f2f5] border-t border-[#e2e4e8] p-4 flex items-center justify-between text-xs">
          <div className="text-[#727783]">
            Record source: Singapore Land Authority Caveats Register via URA
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#004d99] hover:bg-[#003870] text-white font-semibold rounded-xs transition-colors cursor-pointer"
          >
            Close Extract
          </button>
        </div>
      </div>
    </div>
  );
};
