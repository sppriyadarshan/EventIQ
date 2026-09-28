import React from 'react';
import { Filter, X } from 'lucide-react';
import Select from '../ui/Select';
import Button from '../ui/Button';

/**
 * EventIQ AnalyticsFilters Component
 * Event Type and Status dropdown filters for analytics visualizations.
 */
export const AnalyticsFilters = ({
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(typeFilter || statusFilter);

  return (
    <div className="bg-brand-ivory border border-brand-beige rounded-card p-4 flex flex-wrap items-center justify-between gap-4 font-outfit shadow-subtle">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-burgundy">
        <Filter className="w-4 h-4" />
        <span>Analytics Controls</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Event Type Filter */}
        <div className="w-40">
          <Select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-10 text-xs font-semibold"
            placeholder="All Types"
          >
            <option value="">All Types</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Networking">Networking</option>
            <option value="Seminar">Seminar</option>
          </Select>
        </div>

        {/* Event Status Filter */}
        <div className="w-40">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 text-xs font-semibold"
            placeholder="All Statuses"
          >
            <option value="">All Statuses</option>
            <option value="Ready">Ready</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
            <option value="Needs Attention">Needs Attention</option>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            leftIcon={<X className="w-4 h-4" />}
            className="h-10 text-xs font-semibold text-brand-red hover:text-brand-red hover:bg-brand-red/10"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnalyticsFilters;
