import React from 'react';
import { Building2, Target, Lightbulb, Zap, BarChart3 } from 'lucide-react';
import PageContainer from '../ui/PageContainer';

/**
 * EventIQ IntroStrip Component
 * Horizontal feature strip displaying key institutional standards with icon boxes matching feature cards.
 */
export const IntroStrip = () => {
  const items = [
    { label: 'INSTITUTIONAL STANDARDS', icon: Building2 },
    { label: 'SMARTER PLANNING', icon: Target },
    { label: 'BETTER DECISIONS', icon: Lightbulb },
    { label: 'SMOOTHER EVENTS', icon: Zap },
    { label: 'REAL-TIME VISIBILITY', icon: BarChart3 },
  ];

  return (
    <div className="bg-brand-cream border-b border-brand-beige py-4 sm:py-4.5 font-outfit">
      <PageContainer maxWidth="7xl">
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-left">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-burgundy-soft/40 border border-brand-burgundy/10 text-brand-burgundy flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-burgundy stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-espresso">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </div>
  );
};

export default IntroStrip;
