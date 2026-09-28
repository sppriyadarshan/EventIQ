import React from 'react';
import { Award, Zap, TrendingUp, DollarSign } from 'lucide-react';

export default function ExpectedImpact({ impactData = [] }) {
  const cards = impactData.length > 0 ? impactData : [
    { label: 'Attendance Efficiency', value: '+12%', sub: 'Higher check-in throughput', icon: TrendingUp },
    { label: 'Resource Utilization', value: '+18%', sub: 'Optimized AV equipment', icon: Zap },
    { label: 'Budget Efficiency', value: '+9%', sub: 'Reallocated surplus funds', icon: DollarSign },
    { label: 'Engagement Improvement', value: '+15%', sub: 'Increased Q&A interaction', icon: Award },
  ];

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Expected Institutional Impact
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              Estimated Demo Results
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Aggregated institutional productivity gains projected upon executing all active optimization recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item, idx) => {
          const IconComp = item.icon || TrendingUp;
          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-warm-cream/50 border border-espresso/10 flex flex-col justify-between space-y-2 hover:border-burgundy/20 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-espresso/70 font-outfit">
                  {item.label}
                </span>
                <div className="p-2 rounded-lg bg-burgundy/10 text-burgundy">
                  <IconComp className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-1">
                <span className="font-space-grotesk text-3xl font-extrabold text-burgundy tracking-tight">
                  {item.value}
                </span>
              </div>

              <p className="text-xs text-espresso/60 font-outfit pt-1 border-t border-espresso/5">
                {item.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
