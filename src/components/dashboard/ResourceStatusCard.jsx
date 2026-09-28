import React from 'react';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import { useEventIQ } from '../../context/EventIQContext';

/**
 * EventIQ ResourceStatusCard Component
 * Displays resource categories with dynamically calculated percentage progress bars.
 */
export const ResourceStatusCard = () => {
  const { resources } = useEventIQ();

  const categories = ['Staff', 'Venue', 'Equipment', 'Transport'];

  const resourceStatus = categories.map((cat) => {
    const catResources = resources.filter((r) => r.category === cat);
    if (catResources.length === 0) {
      return { name: `${cat} Allocation`, percentage: 100, status: 'Healthy', variant: 'success' };
    }

    const totalAllocated = catResources.reduce((acc, r) => acc + (r.allocated || 0), 0);
    const totalCapacity = catResources.reduce((acc, r) => acc + (r.total || 1), 0);
    const percentage = Math.min(100, Math.round((totalAllocated / totalCapacity) * 100));

    let status = 'Healthy';
    let variant = 'success';
    if (percentage > 90) {
      status = 'Critical';
      variant = 'critical';
    } else if (percentage > 75) {
      status = 'Warning';
      variant = 'warning';
    }

    return { name: `${cat} Allocation`, percentage, status, variant };
  });

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
    <Card variant="standard" className="space-y-4">
      <div>
        <CardTitle className="text-xl">Resource Status</CardTitle>
        <CardDescription>Overall readiness across active resource categories</CardDescription>
      </div>

      <div className="space-y-4 pt-1 font-outfit">
        {resourceStatus.map((item) => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-brand-espresso">{item.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant={item.variant} size="sm">
                  {item.status}
                </Badge>
                <span className="font-space-grotesk font-bold text-brand-espresso text-sm">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Accessible Progress Bar Container */}
            <div
              className="h-2 w-full bg-brand-cream rounded-full overflow-hidden border border-brand-beige/60"
              role="progressbar"
              aria-valuenow={item.percentage}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`${item.name} readiness ${item.percentage}%`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${getBarColor(item.variant)}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResourceStatusCard;

