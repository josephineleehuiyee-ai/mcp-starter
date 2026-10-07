import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Lock, Building2 } from 'lucide-react';

export const SgMasthead: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#f0f2f5] border-b border-[#e2e4e8] text-[#424752] text-xs font-normal">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {/* Singapore Lion Crest SVG */}
          <div className="flex items-center space-x-1.5">
            <svg
              className="w-4 h-4 text-[#d32f2f] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-label="Singapore Lion Symbol"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5l4.5 2.5-4.5 2.5z" />
            </svg>
            <span className="font-medium text-[#1b1c1c]">A Singapore Government Agency Website</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center text-[#004d99] hover:underline hover:text-[#003870] font-medium ml-1 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#004d99]"
            aria-expanded={isExpanded}
          >
            How to identify
            <ChevronDown
              className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-[11px] text-[#555a64]">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00695c]" />
            Official e-Service
          </span>
          <span className="text-[#c2c6d4]">|</span>
          <span>Contact URA: +65 6221 6666</span>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-[#ffffff] border-t border-[#e2e4e8] px-4 sm:px-6 py-4 shadow-sm animate-in fade-in duration-150">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#424752]">
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-[#004d99] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#1b1c1c] mb-1">Official government websites end with .gov.sg</p>
                <p className="leading-relaxed">
                  Government agencies will always communicate using official <strong className="text-[#1b1c1c]">.gov.sg</strong> websites. Look for <span className="font-mono bg-[#f0eded] px-1 py-0.5 rounded text-[#004d99]">.gov.sg</span> in the address bar before sharing any sensitive information.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-[#00695c] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#1b1c1c] mb-1">Secure websites use HTTPS</p>
                <p className="leading-relaxed">
                  Look for a lock icon (<Lock className="w-3 h-3 inline text-[#00695c]" />) or <strong className="text-[#1b1c1c]">https://</strong> at the beginning of the web address. This guarantees that your connection to this government service is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
