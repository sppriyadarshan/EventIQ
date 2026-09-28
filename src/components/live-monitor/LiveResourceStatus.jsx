import React from 'react';
import { Layers, ShieldCheck, Building, Boxes, Wallet } from 'lucide-react';

export default function LiveResourceStatus({ event }) {
  if (!event) return null;

  const staffPct = Math.min((event.staffActive / event.staffAssigned) * 100, 100);
  const venuePct = Math.min((event.currentCheckIns / event.venueCapacity) * 100, 100);
  const equipPct = Math.min((event.equipmentOperational / event.equipmentTotal) * 100, 100);
  const budgetPct = Math.min((event.budgetSpent / event.budgetAllocated) * 100, 100);

  const resources = [
    {
      label: 'Staff Availability',
      value: `${event.staffActive} of ${event.staffAssigned} active`,
      percentage: staffPct,
      status: staffPct >= 85 ? 'Healthy' : 'Needs Attention',
      badgeStyle: staffPct >= 85 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200',
      icon: ShieldCheck,
    },
    {
      label: 'Venue Occupancy',
      value: `${venuePct.toFixed(1)}% occupied (${event.currentCheckIns}/${event.venueCapacity})`,
      percentage: venuePct,
      status: venuePct >= 90 ? 'Near Full' : 'Optimal',
      badgeStyle: venuePct >= 90 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Building,
    },
    {
      label: 'Equipment Readiness',
      value: `${event.equipmentOperational} of ${event.equipmentTotal} operational`,
      percentage: equipPct,
      status: equipPct >= 85 ? 'Optimal' : 'Needs Review',
      badgeStyle: equipPct >= 85 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Boxes,
    },
    {
      label: 'Budget Usage',
      value: `${budgetPct.toFixed(0)}% used (₹${event.budgetSpent.toLocaleString('en-IN')})`,
      percentage: budgetPct,
      status: budgetPct <= 85 ? 'On Track' : 'Review Needed',
      badgeStyle: budgetPct <= 85 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Wallet,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Live Resource Status
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              <Layers className="w-3 h-3 text-burgundy" />
              Resource Telemetry
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Operational status bars monitoring active staff, seating capacity, equipment readiness, and budget consumption.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((res, i) => {
          const IconComp = res.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-3 hover:border-burgundy/20 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <IconComp className="w-4 h-4 text-burgundy" />
                  <span className="font-bold text-sm text-espresso font-outfit">
                    {res.label}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border font-outfit ${res.badgeStyle}`}>
                  {res.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-between text-xs font-outfit">
                  <span className="text-espresso/60">{res.value}</span>
                  <span className="font-space-grotesk font-bold text-espresso">
                    {res.percentage.toFixed(0)}%
                  </span>
                </div>

                <div className="h-2 w-full bg-espresso/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-burgundy rounded-full transition-all duration-500"
                    style={{ width: `${res.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
