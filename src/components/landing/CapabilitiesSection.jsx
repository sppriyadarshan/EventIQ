import React from 'react';
import PageContainer from '../ui/PageContainer';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Users, ShieldCheck, Zap, Activity } from 'lucide-react';

/**
 * EventIQ CapabilitiesSection Component
 * Displays sample data-oriented metrics using Space Grotesk numerical font.
 */
export const CapabilitiesSection = () => {
  const sampleMetrics = [
    {
      label: 'Expected Attendance',
      value: '82%',
      subText: 'Historical accuracy 96%',
      icon: Users,
      badge: 'burgundy',
    },
    {
      label: 'Resource Readiness',
      value: '94%',
      subText: 'Venue & staff confirmed',
      icon: ShieldCheck,
      badge: 'success',
    },
    {
      label: 'Planning Efficiency',
      value: '+28%',
      subText: 'Time saved on scheduling',
      icon: Zap,
      badge: 'burgundy',
    },
    {
      label: 'Live Check-Ins',
      value: '248',
      subText: 'Real-time entry telemetry',
      icon: Activity,
      badge: 'warning',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-brand-ivory border-b border-brand-beige font-outfit">
      <PageContainer maxWidth="7xl" className="space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="neutral" size="sm" className="mx-auto uppercase tracking-wider font-bold">
            Sample Event Overview
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-espresso tracking-tight">
            One Event. A Complete Picture.
          </h2>
          <p className="text-base sm:text-lg text-brand-warm-gray leading-relaxed">
            Real-time analytics and predictive metrics synthesized into a single intuitive view.
          </p>
        </div>

        {/* 4 Metric Cards Grid with Space Grotesk font */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} variant="metric" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-warm-gray">{metric.label}</span>
                  <div className="p-2 rounded-[8px] bg-brand-burgundy-soft/30 text-brand-burgundy">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  {/* Space Grotesk Numerical Font */}
                  <div className="font-space font-extrabold text-4xl text-brand-espresso tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-xs text-brand-warm-gray mt-1">
                    {metric.subText}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-xs text-brand-warm-gray">
          * Note: Values displayed above are sample product demonstration metrics.
        </p>
      </PageContainer>
    </section>
  );
};

export default CapabilitiesSection;
