import React from 'react';
import { Search, Filter, LayoutGrid, List, X } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import { cn } from '../../utils/cn';

/**
 * EventIQ EventToolbar Component
 * Search input, Status filter, Type filter, Clear filters button, and Grid/Table view toggles.
 */
export const EventToolbar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(searchQuery || statusFilter || typeFilter);

  return (
    <div className="bg-brand-ivory border border-brand-beige rounded-card p-4 space-y-3 font-outfit shadow-subtle">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Search Bar */}
        <div className="w-full lg:w-80">
          <Input
            placeholder="Search events by name, location, organizer..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-brand-warm-gray" />}
            className="h-10 text-xs sm:text-sm"
          />
        </div>

        {/* Right Side: Filters & View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Dropdown */}
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

          {/* Type Filter Dropdown */}
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

          {/* Clear Filters Button (Visible when filters are active) */}
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

          {/* View Mode Toggle Icon Buttons */}
          <div className="flex items-center bg-brand-cream border border-brand-beige rounded-[10px] p-1 gap-1">
            <IconButton
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              ariaLabel="Grid View"
              className="w-8 h-8 rounded-[8px]"
            >
              <LayoutGrid className="w-4 h-4" />
            </IconButton>

            <IconButton
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              ariaLabel="Table View"
              className="w-8 h-8 rounded-[8px]"
            >
              <List className="w-4 h-4" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventToolbar;
