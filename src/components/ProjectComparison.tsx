import React, { useState } from 'react';
import { ArrowLeftRight, Check, Plus, Trash2, Building, ShieldCheck, DollarSign } from 'lucide-react';
import { PROJECTS_DATABASE } from '../data/mockUraData';
import { ProjectSummary } from '../types/ura';

interface ProjectComparisonProps {
  onSelectProjectForFilter: (projectName: string) => void;
}

export const ProjectComparison: React.FC<ProjectComparisonProps> = ({
  onSelectProjectForFilter,
}) => {
  const [selectedProjects, setSelectedProjects] = useState<ProjectSummary[]>([
    PROJECTS_DATABASE[0], // CANNINGHILL PIERS
    PROJECTS_DATABASE[1], // GRAND DUNMAN
    PROJECTS_DATABASE[3], // NORMANTON PARK
  ]);

  const addProject = (project: ProjectSummary) => {
    if (selectedProjects.length >= 4) return;
    if (!selectedProjects.some((p) => p.name === project.name)) {
      setSelectedProjects([...selectedProjects, project]);
    }
  };

  const removeProject = (projectName: string) => {
    if (selectedProjects.length <= 1) return;
    setSelectedProjects(selectedProjects.filter((p) => p.name !== projectName));
  };

  const availableToAdd = PROJECTS_DATABASE.filter(
    (p) => !selectedProjects.some((sp) => sp.name === p.name)
  );

  return (
    <div className="space-y-6">
      {/* Overview & Project Selection Toolbar */}
      <div className="bg-white border border-[#e2e4e8] p-4 sm:p-5 rounded-xs shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1b1c1c]">
              Side-by-Side Residential Development Benchmark
            </h2>
            <p className="text-xs text-[#555a64] mt-0.5">
              Compare tenure, developer pedigree, unit density, and caveat unit price trends across up to 4 developments.
            </p>
          </div>

          {availableToAdd.length > 0 && selectedProjects.length < 4 && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#727783] font-medium">Add Project:</span>
              <select
                onChange={(e) => {
                  const found = PROJECTS_DATABASE.find((p) => p.name === e.target.value);
                  if (found) addProject(found);
                }}
                value=""
                className="px-2.5 py-1.5 border border-[#c2c6d4] rounded-xs bg-white text-xs font-semibold text-[#004d99]"
              >
                <option value="" disabled>
                  + Select Project to Compare...
                </option>
                {availableToAdd.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} (D{p.district < 10 ? '0' : ''}{p.district})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white border border-[#e2e4e8] rounded-xs shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f0f2f5] border-b border-[#e2e4e8]">
              <th className="py-4 px-4 w-44 text-[#727783] font-semibold uppercase text-[11px] tracking-wider">
                Comparison Feature
              </th>
              {selectedProjects.map((p) => (
                <th key={p.name} className="py-4 px-4 min-w-[220px] max-w-[280px] align-top">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-sm text-[#1b1c1c]">{p.name}</span>
                    {selectedProjects.length > 1 && (
                      <button
                        onClick={() => removeProject(p.name)}
                        className="text-[#727783] hover:text-[#b6171e] p-0.5 cursor-pointer"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-[#555a64] font-normal block mt-0.5">
                    {p.street} (D{p.district < 10 ? '0' : ''}{p.district})
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e4e8]">
            {/* Median Unit Price ($ PSF) */}
            <tr className="bg-[#f5f8fc]">
              <td className="py-3 px-4 font-bold text-[#004d99]">
                Median Unit Price ($ PSF)
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4 font-mono font-bold text-base text-[#004d99] tabular-nums">
                  S${p.medianPsf.toLocaleString()} <span className="text-xs font-normal text-[#727783]">psf</span>
                </td>
              ))}
            </tr>

            {/* 6-Month Transacted Range */}
            <tr>
              <td className="py-3 px-4 font-semibold text-[#1b1c1c]">
                Transacted PSF Range
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4 font-mono tabular-nums text-xs">
                  S${p.lowestPsf.toLocaleString()} – S${p.highestPsf.toLocaleString()} psf
                </td>
              ))}
            </tr>

            {/* Market Segment / Region */}
            <tr>
              <td className="py-3 px-4 font-semibold text-[#1b1c1c]">
                Market Segment (Region)
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-xs text-[11px] ${
                      p.region === 'CCR'
                        ? 'bg-[#eef4fc] text-[#004d99]'
                        : p.region === 'RCR'
                        ? 'bg-[#e0f2f1] text-[#00695c]'
                        : 'bg-[#f0eded] text-[#424752]'
                    }`}
                  >
                    {p.region} · {p.region === 'CCR' ? 'Core Central' : p.region === 'RCR' ? 'Rest of Central' : 'Outside Central'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Title Tenure */}
            <tr>
              <td className="py-3 px-4 font-semibold text-[#1b1c1c]">
                Title Tenure
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4 font-medium">
                  {p.tenure}
                </td>
              ))}
            </tr>

            {/* Expected / Actual TOP Year */}
            <tr>
              <td className="py-3 px-4 font-semibold text-[#1b1c1c]">
                Completion / TOP Year
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4 font-mono text-[#1b1c1c]">
                  {p.topYear}
                </td>
              ))}
            </tr>

            {/* Total Development Units */}
            <tr>
              <td className="py-3 px-4 font-semibold text-[#1b1c1c]">
                Total Residential Units
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4 font-mono tabular-nums">
                  {p.totalUnits.toLocaleString()} units
                </td>
              ))}
            </tr>

            {/* Master Developer */}
            <tr>
              <td className="py-3 px-4 font-semibold text-[#1b1c1c]">
                Master Developer
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4 text-[#424752]">
                  {p.developer}
                </td>
              ))}
            </tr>

            {/* Architectural & Location Summary */}
            <tr>
              <td className="py-3 px-4 font-semibold text-[#1b1c1c]">
                Development Overview
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4 text-[#555a64] leading-relaxed text-[11px]">
                  {p.description}
                </td>
              ))}
            </tr>

            {/* Quick Action */}
            <tr className="bg-[#fbf9f8]">
              <td className="py-3 px-4 font-semibold text-[#1b1c1c]">
                Direct Caveat Filter
              </td>
              {selectedProjects.map((p) => (
                <td key={p.name} className="py-3 px-4">
                  <button
                    onClick={() => onSelectProjectForFilter(p.name)}
                    className="px-3 py-1.5 bg-[#004d99] hover:bg-[#003870] text-white rounded-xs text-xs font-semibold cursor-pointer"
                  >
                    View All {p.name} Caveats
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
