import React from 'react';
import { Layers, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function SimulationScenarioSummary({ eventName, simValues, healthStatus }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Healthy':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'Healthy Scenario',
          icon: ShieldCheck,
        };
      case 'Balanced':
        return {
          bg: 'bg-burgundy/10 text-burgundy border-burgundy/20',
          label: 'Balanced Scenario',
          icon: Layers,
        };
      case 'Needs Attention':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'Needs Attention',
          icon: AlertTriangle,
        };
      case 'High Risk':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'High Operational Risk',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'bg-sand text-espresso border-espresso/10',
          label: 'Active Scenario',
          icon: Layers,
        };
    }
  };

  const statusStyle = getStatusBadge(healthStatus);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-espresso/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-espresso/60 uppercase tracking-wider font-outfit">
            Active Simulation Scenario
          </span>
          <span className="text-sm font-bold text-burgundy font-outfit">
            — {eventName}
          </span>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-outfit ${statusStyle.bg}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusStyle.label}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Attendance</span>
          <span className="font-space-grotesk font-bold text-espresso text-sm">
            {simValues.attendance}
          </span>
        </div>

        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Budget</span>
          <span className="font-space-grotesk font-bold text-espresso text-sm">
            ₹{simValues.budget?.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Staff Assigned</span>
          <span className="font-space-grotesk font-bold text-espresso text-sm">
            {simValues.staff} members
          </span>
        </div>

        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Venue Capacity</span>
          <span className="font-space-grotesk font-bold text-espresso text-sm">
            {simValues.capacity} seats
          </span>
        </div>

        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Equipment</span>
          <span className="font-space-grotesk font-bold text-espresso text-sm">
            {simValues.equipment}%
          </span>
        </div>

        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Engagement</span>
          <span className="font-outfit font-bold text-burgundy text-sm">
            {simValues.engagement}
          </span>
        </div>
      </div>
    </div>
  );
}
