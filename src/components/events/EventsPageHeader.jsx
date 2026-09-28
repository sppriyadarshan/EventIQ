import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * EventIQ EventsPageHeader Component
 * Context label, main title, description, DEMO DATA badge, and + Create Event CTA button.
 */
export const EventsPageHeader = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-outfit pb-2">
      {/* Left Column: Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy">
            Event Management
          </span>
          <Badge variant="neutral" size="sm">
            DEMO DATA
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight">
          Manage Your Events
        </h1>
        <p className="text-sm text-brand-warm-gray">
          Create, organize, and track all your events in one place.
        </p>
      </div>

      {/* Right Column: Create Event Primary Button */}
      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="primary"
          size="md"
          onClick={onCreateClick}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Create Event
        </Button>
      </div>
    </div>
  );
};

export default EventsPageHeader;
