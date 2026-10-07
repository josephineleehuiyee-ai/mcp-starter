import React from 'react';
import { ShieldCheck, HelpCircle, FileCheck, AlertTriangle, ExternalLink, Calculator, Landmark } from 'lucide-react';

export const CaveatAndStampDutyGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
        <div className="flex items-start space-x-3">
          <Landmark className="w-6 h-6 text-[#004d99] mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-base font-bold text-[#1b1c1c]">
              Singapore Land Conveyancing & Caveat Lodgement Guide
            </h2>
            <p className="text-xs text-[#555a64] mt-0.5 leading-relaxed">
              Understand how caveats protect prospective property buyers, the statutory reporting cadence of URA, and current Singapore stamp duty tax frameworks (BSD & ABSD).
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Info Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Caveat Mechanics */}
        <div className="bg-white border border-[#e2e4e8] p-5 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#e2e4e8] pb-2 text-[#004d99]">
            <FileCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#1b1c1c]">What is a Caveat in Singapore?</h3>
          </div>

          <p className="text-xs text-[#424752] leading-relaxed">
            A <strong>caveat</strong> is an official legal notice lodged by a purchaser (or their conveyancing lawyer) with the <strong>Singapore Land Authority (SLA)</strong> to notify the public that they have a legal or equitable interest in a property.
          </p>

          <div className="space-y-2.5 text-xs text-[#424752]">
            <div className="p-3 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
              <strong className="text-[#1b1c1c] block mb-0.5">Priority Claim Protection</strong>
              It establishes legal priority over any subsequent competing claims or attempted double-sales by the seller before formal legal completion.
            </div>

            <div className="p-3 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
              <strong className="text-[#1b1c1c] block mb-0.5">Voluntary Conveyancing Step</strong>
              While lodging a caveat is technically voluntary, it is standard practice required by all Singapore commercial mortgage lenders and the Law Society.
            </div>

            <div className="p-3 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
              <strong className="text-[#1b1c1c] block mb-0.5">Caveat Date vs Sale Date</strong>
              The <strong>Sale Date</strong> reflects the date the Option to Purchase (OTP) was exercised or Sales & Purchase Agreement signed. The <strong>Caveat Date</strong> is the date the lawyer officially filed the paperwork with the SLA Land Titles Registry.
            </div>
          </div>
        </div>

        {/* Column 2: Stamp Duties Breakdown */}
        <div className="bg-white border border-[#e2e4e8] p-5 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#e2e4e8] pb-2 text-[#004d99]">
            <Calculator className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#1b1c1c]">Buyer's Stamp Duty (BSD) Tax Schedule</h3>
          </div>

          <p className="text-xs text-[#424752] leading-relaxed">
            Every purchaser of Singapore residential property is liable to pay BSD to the Inland Revenue Authority of Singapore (IRAS) based on the transacted purchase price:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#e2e4e8]">
              <thead>
                <tr className="bg-[#f0f2f5] text-[#1b1c1c] font-semibold border-b border-[#e2e4e8]">
                  <th className="p-2">Transacted Purchase Price Tier</th>
                  <th className="p-2 text-right">Marginal BSD Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e4e8] font-mono tabular-nums text-xs">
                <tr>
                  <td className="p-2">First S$180,000</td>
                  <td className="p-2 text-right font-bold text-[#004d99]">1%</td>
                </tr>
                <tr>
                  <td className="p-2">Next S$180,000 (S$180,001 to S$360,000)</td>
                  <td className="p-2 text-right font-bold text-[#004d99]">2%</td>
                </tr>
                <tr>
                  <td className="p-2">Next S$640,000 (S$360,001 to S$1,000,000)</td>
                  <td className="p-2 text-right font-bold text-[#004d99]">3%</td>
                </tr>
                <tr>
                  <td className="p-2">Next S$500,000 (S$1,000,001 to S$1,500,000)</td>
                  <td className="p-2 text-right font-bold text-[#004d99]">4%</td>
                </tr>
                <tr>
                  <td className="p-2">Next S$1,500,000 (S$1,500,001 to S$3,000,000)</td>
                  <td className="p-2 text-right font-bold text-[#004d99]">5%</td>
                </tr>
                <tr className="bg-[#eef4fc]">
                  <td className="p-2 font-bold text-[#1b1c1c]">Amount exceeding S$3,000,000</td>
                  <td className="p-2 text-right font-bold text-[#b6171e]">6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Buyer's Stamp Duty (ABSD) Reference Box */}
      <div className="bg-white border border-[#e2e4e8] p-5 rounded-xs shadow-xs">
        <h3 className="font-bold text-sm text-[#1b1c1c] border-b border-[#e2e4e8] pb-2 mb-3">
          Additional Buyer's Stamp Duty (ABSD) Reference Matrix
        </h3>
        <p className="text-xs text-[#555a64] mb-4">
          ABSD is levied on residential property acquisitions based on buyer citizenship profile and existing property count:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
            <span className="font-bold text-[#1b1c1c] block mb-1">Singapore Citizens (SC)</span>
            <ul className="space-y-1 text-[#424752]">
              <li>• 1st Residential: <strong>0% (None)</strong></li>
              <li>• 2nd Residential: <strong>20%</strong></li>
              <li>• 3rd & Subsequent: <strong>30%</strong></li>
            </ul>
          </div>

          <div className="p-3.5 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
            <span className="font-bold text-[#1b1c1c] block mb-1">Permanent Residents (SPR)</span>
            <ul className="space-y-1 text-[#424752]">
              <li>• 1st Residential: <strong>5%</strong></li>
              <li>• 2nd Residential: <strong>30%</strong></li>
              <li>• 3rd & Subsequent: <strong>35%</strong></li>
            </ul>
          </div>

          <div className="p-3.5 bg-[#fbf9f8] border border-[#e2e4e8] rounded-xs">
            <span className="font-bold text-[#b6171e] block mb-1">Foreigners & Entities</span>
            <ul className="space-y-1 text-[#424752]">
              <li>• Foreigners (Any): <strong>60%</strong></li>
              <li>• Entities / Companies: <strong>65%</strong></li>
              <li>• Housing Developers: <strong>35% + 5% non-remittable</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Verification on SLA INLIS */}
      <div className="bg-[#f0f2f5] border border-[#c2c6d4] p-4 rounded-xs text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold text-[#1b1c1c] block">
            Official Land Title Searches (SLA INLIS)
          </span>
          <span className="text-[#555a64]">
            For certified historical legal deeds, title ownership extracts, and strata title plans, visit the Singapore Land Authority Integrated Land Information Service.
          </span>
        </div>

        <a
          href="https://www.inlis.gov.sg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#004d99] text-[#004d99] hover:bg-[#eef4fc] rounded-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
        >
          <span>Open SLA INLIS Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
