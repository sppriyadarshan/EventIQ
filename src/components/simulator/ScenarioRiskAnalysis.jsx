import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ScenarioRiskAnalysis({ risks = [] }) {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-sand text-espresso/80 border-espresso/10';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High':
        return <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />;
      case 'Medium':
        return <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />;
      case 'Low':
        return <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-espresso/60 shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Simulated Risk Analysis
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              Rule-Based Risk Detection
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Automatic risk checks inspecting capacity limits, staffing ratios, budget headroom, and equipment readiness.
          </p>
        </div>
      </div>

      {risks.length === 0 ? (
        <div className="p-8 text-center bg-emerald-50/30 rounded-xl border border-emerald-200 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-espresso text-base font-outfit">
            No Critical Operational Risks Detected
          </h4>
          <p className="text-xs text-espresso/70 max-w-md mx-auto font-outfit">
            The current simulated scenario maintains healthy operational buffers across venue capacity, staffing, budget, and equipment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {risks.map((risk, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 flex flex-col justify-between space-y-3 hover:border-burgundy/20 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {getSeverityIcon(risk.severity)}
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border font-outfit ${getSeverityBadge(risk.severity)}`}>
                      {risk.severity} Severity
                    </span>
                  </div>
                  <span className="text-[11px] text-espresso/50 font-medium font-outfit">
                    {risk.affectedArea}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-espresso font-outfit">
                  {risk.title}
                </h4>

                <p className="text-xs text-espresso/70 leading-relaxed font-outfit">
                  {risk.description}
                </p>
              </div>

              <div className="pt-2 border-t border-espresso/10 text-xs font-outfit space-y-1">
                <span className="text-espresso/50 text-[11px] font-semibold block uppercase tracking-wider">
                  Suggested Action:
                </span>
                <p className="text-burgundy font-medium text-xs leading-snug">
                  {risk.recommendedAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
