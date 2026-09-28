import React from 'react';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { analyticsData } from '../../data/analyticsData';

/**
 * EventIQ AnalyticsPageHeader Component
 * Context label, main title, subtitle, DEMO ANALYTICS badge, and Date Range selector.
 */
export const AnalyticsPageHeader = ({ dateRange, onDateRangeChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-outfit pb-2">
      {/* Left Column: Context Label & Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy">
            Analytics & Insights
          </span>
          <Badge variant="neutral" size="sm">
            DEMO ANALYTICS
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight">
          Understand Your Event Performance
        </h1>
        <p className="text-sm text-brand-warm-gray">
          Track attendance, engagement, planning efficiency, and event performance in one place.
        </p>
      </div>

      {/* Right Column: Date Range Selector */}
      <div className="w-full sm:w-48 shrink-0">
        <Select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="h-10 text-xs font-bold bg-brand-ivory border-brand-beige"
        >
          {analyticsData.dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default AnalyticsPageHeader;
