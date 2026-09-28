import React from 'react';
import PageContainer from '../ui/PageContainer';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { TrendingUp, Award, Building2, CalendarCheck2 } from 'lucide-react';

/**
 * AnalyticsStatsSection Component
 * Visual metrics section anchored by image-3.png illustration showing 94.6% accuracy growth chart and key stat callouts.
 */
export const AnalyticsStatsSection = () => {
  const stats = [
    {
      stat: '94.6%',
      label: 'Capacity Accuracy',
      desc: 'Predictive turnout model alignment across institutional venues.',
      icon: TrendingUp,
    },
    {
      stat: '1,000+',
      label: 'Events Planned',
      desc: 'Successfully scheduled and optimized academic & campus events.',
      icon: CalendarCheck2,
    },
    {
      stat: '500+',
      label: 'Institutions',
      desc: 'University partners relying on EventIQ for resource management.',
      icon: Building2,
    },
  ];

  return (
    <section className="scroll-mt-[72px] py-16 sm:py-24 bg-brand-cream border-b border-brand-beige font-outfit">
      <PageContainer maxWidth="7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Column: Image-3.png Anchor */}
          <div className="lg:col-span-6 w-full animate-illustration-fade">
            <Card className="p-6 sm:p-8 bg-brand-ivory border-brand-beige rounded-[16px] shadow-md hover:shadow-lg transition-transform">
              <div className="space-y-3 pb-4 border-b border-brand-beige">
                <Badge variant="burgundy" size="sm" className="uppercase tracking-wider font-bold">
                  Predictive Performance
                </Badge>
                <h3 className="text-xl font-bold text-brand-espresso">
                  Validated Turnout Accuracy
                </h3>
              </div>
              
              <div className="pt-6 flex justify-center items-center">
                <img
                  src="/illustrations/image-3.png"
                  alt="Team of event planners pointing at an upward growth chart displaying 94.6% accuracy"
                  className="w-full h-auto rounded-[12px] object-contain max-h-[340px]"
                />
              </div>
            </Card>
          </div>

          {/* Right Column: 3 Stat Callouts in Maroon Accent */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-3">
              <Badge variant="neutral" size="sm" className="uppercase tracking-wider font-bold">
                Proven Impact
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-espresso tracking-tight leading-snug">
                Data-Driven Results Across Every Campus
              </h2>
              <p className="text-base sm:text-lg text-brand-warm-gray leading-relaxed">
                EventIQ transforms raw registration data into high-confidence turnout predictions and optimized logistics.
              </p>
            </div>

            {/* Stat Callouts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="p-4 rounded-[14px] bg-brand-ivory border border-brand-beige space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-space font-extrabold text-3xl sm:text-4xl text-brand-burgundy tracking-tight">
                        {item.stat}
                      </span>
                      <Icon className="w-5 h-5 text-brand-burgundy/60 shrink-0" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-sm text-brand-espresso block">
                        {item.label}
                      </span>
                      <span className="text-xs text-brand-warm-gray leading-tight block">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default AnalyticsStatsSection;
