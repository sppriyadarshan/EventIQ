import React from 'react';
import Badge from '../ui/Badge';
import { useEventIQ } from '../../context/EventIQContext';

/**
 * EventIQ DashboardWelcomeHeader Component
 * Context label, main greeting, current date display, and DEMO DATA indicator.
 */
export const DashboardWelcomeHeader = () => {
  const { user } = useEventIQ();
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-outfit pb-2">
      {/* Left Column: Context Label & Headline */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy">
            Event Overview
          </span>
          <Badge variant="neutral" size="sm">
            FRONTEND DEMO
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight">
          Welcome back, {user?.name || 'Event Organizer'}
        </h1>
        <p className="text-sm text-brand-warm-gray">
          Here's what's happening across your institutional events today.
        </p>
      </div>

      {/* Right Column: Date Context Display */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="px-3.5 py-2 rounded-[10px] bg-brand-ivory border border-brand-beige text-xs font-semibold text-brand-espresso flex items-center gap-2 shadow-subtle font-space-grotesk">
          <span className="w-2 h-2 rounded-full bg-brand-burgundy" />
          <span>{currentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcomeHeader;

