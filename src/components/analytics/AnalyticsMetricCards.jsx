import React from 'react';
import { Users, TrendingUp, Zap, Boxes } from 'lucide-react';
import Card from '../ui/Card';

/**
 * EventIQ AnalyticsMetricCards Component
 * 4 KPI cards for Average Attendance, Engagement, Planning Efficiency, and Resource Utilization.
 * Uses Space Grotesk font for numerical values and Outfit for labels.
 */
export const AnalyticsMetricCards = ({ kpiMetrics = [] }) => {
  const getIcon = (id) => {
    switch (id) {
      case 'att':
        return <Users className="w-5 h-5 text-brand-burgundy" />;
      case 'eng':
        return <TrendingUp className="w-5 h-5 text-brand-olive" />;
      case 'eff':
        return <Zap className="w-5 h-5 text-brand-burgundy" />;
      case 'util':
      default:
        return <Boxes className="w-5 h-5 text-brand-ochre" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-outfit">
      {kpiMetrics.map((metric) => (
        <Card key={metric.id} variant="metric" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-warm-gray">{metric.title}</span>
            <div className="p-2 rounded-[8px] bg-brand-burgundy-soft/30 shrink-0">
              {getIcon(metric.id)}
            </div>
          </div>

          <div className="space-y-1">
            {/* Space Grotesk Font for Numerical Values */}
            <div className="font-space font-extrabold text-3xl sm:text-4xl text-brand-espresso tracking-tight">
              {metric.value}
            </div>
            <div className="text-xs text-brand-warm-gray flex items-center justify-between">
              <span>{metric.subText}</span>
              <span className="font-semibold text-brand-olive">{metric.trend}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsMetricCards;
