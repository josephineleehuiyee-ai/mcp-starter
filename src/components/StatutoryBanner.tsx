import React, { useState } from 'react';
import { AlertCircle, Info, ChevronDown, CheckCircle2, ShieldAlert } from 'lucide-react';

export const StatutoryBanner: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-[#eef4fc] border-l-4 border-[#004d99] p-4 text-[#1b1c1c] text-xs shadow-xs rounded-r-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-[#004d99] flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#004d99] tracking-tight uppercase text-[11px]">
                Statutory Data Notice
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#727783]" />
              <span className="font-semibold text-[#1b1c1c]">
                Last Data Refresh: Tuesday, 06 October 2026 (16:00 SGT)
              </span>
            </div>
            <p className="text-[#424752] mt-0.5 leading-relaxed">
              Information on private residential transactions is updated twice weekly on Tuesdays and Fridays. Data reflects legal caveats voluntarily lodged with the <strong>Singapore Land Authority (SLA)</strong> and direct monthly developer returns.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="self-start md:self-center text-[#004d99] hover:text-[#003870] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#004d99]"
        >
          <span>{showDetails ? 'Hide Legal Notes' : 'Caveat & Pricing Notes'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showDetails ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-[#c2c6d4]/50 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-[#424752] animate-in fade-in duration-150">
          <div className="bg-white/80 p-3 rounded-xs border border-[#c2c6d4]/40">
            <div className="flex items-center gap-1.5 font-bold text-[#1b1c1c] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00695c]" />
              <span>Nett Price vs Gross Price</span>
            </div>
            <p className="leading-normal">
              For new developer sales, the transacted price reported reflects the <strong>nett price</strong> after subtracting any developer discounts, early-bird incentives, or absorbed buyer stamp duties.
            </p>
          </div>

          <div className="bg-white/80 p-3 rounded-xs border border-[#c2c6d4]/40">
            <div className="flex items-center gap-1.5 font-bold text-[#1b1c1c] mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#004d99]" />
              <span>Voluntary Lodgement</span>
            </div>
            <p className="leading-normal">
              Lodging a caveat with SLA is voluntary but standard legal conveyancing practice in Singapore. Resale transactions where no caveat was lodged are not captured in this register.
            </p>
          </div>

          <div className="bg-white/80 p-3 rounded-xs border border-[#c2c6d4]/40">
            <div className="flex items-center gap-1.5 font-bold text-[#1b1c1c] mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#b6171e]" />
              <span>Strata vs Land Area</span>
            </div>
            <p className="leading-normal">
              For non-landed properties (condominiums & apartments), unit area is strata floor area in sq metres (converted to sq feet). For landed properties, area corresponds to total land plot size.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
