import React from 'react';
import { Users, Building, Wallet, Boxes, Sparkles, Activity } from 'lucide-react';

export default function SimulationResults({ results }) {
  if (!results) return null;

  const cards = [
    {
      id: 'res-att',
      label: 'Predicted Attendance',
      value: `${results.attendance.simulated}`,
      change: results.attendance.changeStr,
      status: results.attendance.status,
      icon: Users,
      color: 'text-burgundy',
      bg: 'bg-burgundy/10',
    },
    {
      id: 'res-util',
      label: 'Venue Utilization',
      value: `${results.venueUtilization.simulated.toFixed(1)}%`,
      change: results.venueUtilization.changeStr,
      status: results.venueUtilization.status,
      icon: Building,
      color: 'text-burgundy',
      bg: 'bg-burgundy/10',
    },
    {
      id: 'res-bud',
      label: 'Budget Efficiency',
      value: `${results.budgetEfficiency.simulated.toFixed(0)}%`,
      change: results.budgetEfficiency.changeStr,
      status: results.budgetEfficiency.status,
      icon: Wallet,
      color: 'text-warm-ochre',
      bg: 'bg-warm-ochre/10',
    },
    {
      id: 'res-ready',
      label: 'Resource Readiness',
      value: `${results.resourceReadiness.simulated.toFixed(0)}%`,
      change: results.resourceReadiness.changeStr,
      status: results.resourceReadiness.status,
      icon: Boxes,
      color: 'text-muted-olive',
      bg: 'bg-muted-olive/10',
    },
    {
      id: 'res-eng',
      label: 'Predicted Engagement',
      value: `${results.engagementScore.simulated.toFixed(0)}%`,
      change: results.engagementScore.changeStr,
      status: results.engagementScore.status,
      icon: Sparkles,
      color: 'text-burgundy',
      bg: 'bg-burgundy/10',
    },
    {
      id: 'res-score',
      label: 'Event Readiness Score',
      value: `${results.overallScore.simulated} / 100`,
      change: results.overallScore.changeStr,
      status: results.overallScore.status,
      icon: Activity,
      color: 'text-muted-olive',
      bg: 'bg-muted-olive/10',
    },
  ];

  const getStatusBadge = (statusText) => {
    switch (statusText) {
      case 'Healthy':
      case 'Optimal':
      case 'Excellent':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Balanced':
      case 'Good':
        return 'bg-burgundy/10 text-burgundy border-burgundy/20';
      case 'Needs Attention':
      case 'Underutilized':
      case 'High Capacity':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'High Risk':
      case 'Capacity Overload':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-sand text-espresso/80 border-espresso/10';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isPositiveChange = card.change.startsWith('+');
        const isNegativeChange = card.change.startsWith('-');

        return (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-espresso/10 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-burgundy/20 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-espresso/70 font-outfit">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2 pt-1">
              <span className="font-space-grotesk text-2xl sm:text-3xl font-bold text-espresso tracking-tight">
                {card.value}
              </span>
              {card.change && card.change !== '0%' && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border font-space-grotesk ${
                    isPositiveChange
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : isNegativeChange
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-sand text-espresso/70 border-espresso/10'
                  }`}
                >
                  {card.change} vs baseline
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-espresso/5 flex items-center justify-between text-xs">
              <span className="text-espresso/50 font-outfit">Scenario Status:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border font-outfit ${getStatusBadge(card.status)}`}>
                {card.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
