import React from 'react';
import { ExternalLink, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const UraFooter: React.FC = () => {
  return (
    <footer className="bg-[#1b1c1c] text-[#dcd9d9] text-xs mt-12 border-t-4 border-[#b6171e]">
      {/* Upper Footer: Agency Information */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: URA Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-[#b6171e] text-white flex items-center justify-center font-bold text-xs rounded-xs">
                URA
              </div>
              <div>
                <span className="font-bold text-white text-sm block uppercase tracking-wider">
                  Urban Redevelopment Authority
                </span>
                <span className="text-[11px] text-[#a0a4b0]">A Statutory Board under MND</span>
              </div>
            </div>
            <p className="text-[11px] text-[#a0a4b0] leading-relaxed">
              Singapore's national land use planning and conservation agency, shaping a distinctive, delightful, and sustainable city.
            </p>
          </div>

          {/* Col 2: Property Market Information */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Property Market Data
            </h4>
            <ul className="space-y-2 text-[11px] text-[#a0a4b0]">
              <li>
                <span className="text-white hover:underline cursor-pointer">Private Residential Transactions</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Private Residential Rental Contracts</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Commercial & Office Rental Statistics</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Industrial Real Estate Data</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">REALIS Subscription System</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Related Portals */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Partner Government Portals
            </h4>
            <ul className="space-y-2 text-[11px] text-[#a0a4b0]">
              <li>
                <a
                  href="https://www.sla.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  <span>Singapore Land Authority (SLA)</span>
                  <ExternalLink className="w-3 h-3 text-[#727783]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.inlis.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  <span>SLA INLIS Land Title Searches</span>
                  <ExternalLink className="w-3 h-3 text-[#727783]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.iras.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  <span>Inland Revenue Authority (IRAS)</span>
                  <ExternalLink className="w-3 h-3 text-[#727783]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mnd.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  <span>Ministry of National Development (MND)</span>
                  <ExternalLink className="w-3 h-3 text-[#727783]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Agency Location & Feedback */}
          <div>
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              The URA Centre
            </h4>
            <div className="space-y-2 text-[11px] text-[#a0a4b0]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#727783] mt-0.5 flex-shrink-0" />
                <span>45 Maxwell Road, The URA Centre, Singapore 069118</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#727783] flex-shrink-0" />
                <span>Enquiry Hotline: (65) 6221 6666</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#727783] flex-shrink-0" />
                <span>Online Feedback Form via REACH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Statutory Bar */}
      <div className="bg-[#111111] border-t border-[#303030] py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#727783]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="hover:text-[#dcd9d9] cursor-pointer">Report Vulnerability ↗</span>
            <span>·</span>
            <span className="hover:text-[#dcd9d9] cursor-pointer">Privacy Statement</span>
            <span>·</span>
            <span className="hover:text-[#dcd9d9] cursor-pointer">Terms of Use</span>
            <span>·</span>
            <span className="hover:text-[#dcd9d9] cursor-pointer">Rate this E-Service</span>
          </div>

          <div>
            © 2026 Government of Singapore. Urban Redevelopment Authority. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
