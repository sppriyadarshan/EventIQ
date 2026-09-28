import React from 'react';
import { Users, Boxes, Wallet, TrendingUp } from 'lucide-react';

export default function OptimizationMetricCards({ metrics }) {
  if (!metrics) return null;

  const cards = [
    {
      id: 'att-eff',
      label: 'Attendance Efficiency',
      value: metrics.attendanceEfficiency?.value || '88%',
      status: metrics.attendanceEfficiency?.status || 'Optimal',
      trend: metrics.attendanceEfficiency?.trend || '+4%',
      icon: Users,
      color: 'text-burgundy',
      bg: 'bg-burgundy/10',
    },
    {
      id: 'res-eff',
      label: 'Resource Efficiency',
      value: metrics.resourceEfficiency?.value || '79%',
      status: metrics.resourceEfficiency?.status || 'Good',
      trend: metrics.resourceEfficiency?.trend || '+6%',
      icon: Boxes,
      color: 'text-muted-olive',
      bg: 'bg-muted-olive/10',
    },
    {
      id: 'bud-eff',
      label: 'Budget Efficiency',
      value: metrics.budgetEfficiency?.value || '84%',
      status: metrics.budgetEfficiency?.status || 'Good',
      trend: metrics.budgetEfficiency?.trend || '+3%',
      icon: Wallet,
      color: 'text-warm-ochre',
      bg: 'bg-warm-ochre/10',
    },
    {
      id: 'eng-score',
      label: 'Engagement Score',
      value: metrics.engagementScore?.value || '82/100',
      status: metrics.engagementScore?.status || 'Good',
      trend: metrics.engagementScore?.trend || '+5%',
      icon: TrendingUp,
      color: 'text-burgundy',
      bg: 'bg-burgundy/10',
    },
  ];

  const getStatusBadge = (statusText) => {
    switch (statusText) {
      case 'Optimal':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-burgundy/10 text-burgundy border-burgundy/20';
      case 'Needs Improvement':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Needs Attention':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-sand text-espresso/80 border-espresso/10';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
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
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-space-grotesk">
                {card.trend}
              </span>
            </div>

            <div className="pt-2 border-t border-espresso/5 flex items-center justify-between text-xs">
              <span className="text-espresso/50 font-outfit">Status:</span>
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
