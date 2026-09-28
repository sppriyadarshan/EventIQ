import React from 'react';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * EventIQ ResourceUtilizationChart Component
 * Visualizes resource utilization across Staff, Venue, Equipment, and Budget.
 */
export const ResourceUtilizationChart = ({ data = [] }) => {
  const getBarColor = (variant) => {
    switch (variant) {
      case 'success':
        return 'bg-brand-olive';
      case 'critical':
        return 'bg-brand-red';
      case 'warning':
      default:
        return 'bg-brand-ochre';
    }
  };

  return (
    <Card variant="standard" className="p-6 space-y-4">
      <div>
        <CardTitle className="text-xl">Resource Utilization</CardTitle>
        <CardDescription>Average utilization rate across operational categories</CardDescription>
      </div>

      <div className="space-y-4 pt-2 font-outfit">
        {data.map((item) => (
          <div key={item.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-brand-espresso">{item.category}</span>
              <div className="flex items-center gap-2">
                <Badge variant={item.variant} size="sm">
                  {item.status}
                </Badge>
                {/* Space Grotesk Font for Numerical Values */}
                <span className="font-space font-bold text-brand-espresso text-sm">
                  {item.utilization}%
                </span>
              </div>
            </div>

            <div
              className="h-2.5 w-full bg-brand-cream rounded-full overflow-hidden border border-brand-beige/60"
              role="progressbar"
              aria-valuenow={item.utilization}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${getBarColor(item.variant)}`}
                style={{ width: `${item.utilization}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResourceUtilizationChart;
