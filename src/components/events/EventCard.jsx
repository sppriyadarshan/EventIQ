import React from 'react';
import { MapPin, User, Users } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import EventOptionsMenu from './EventOptionsMenu';

/**
 * EventIQ EventCard Component
 * Grid card representation of an event with Space Grotesk attendance numbers and status indicators.
 */
export const EventCard = ({
  event,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onViewQrPass,
  onScanAttendance,
  onGenerateReport,
}) => {
  return (
    <Card
      variant="standard"
      className="flex flex-col justify-between space-y-4 p-5 hover:border-brand-burgundy/40 transition-all shadow-subtle group"
    >
      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          {/* Date Block */}
          <div className="w-12 h-12 rounded-[10px] bg-brand-burgundy-soft/40 text-brand-burgundy flex flex-col items-center justify-center shrink-0 font-space-grotesk">
            <span className="text-[10px] font-bold uppercase tracking-wider">{event.month || 'SEP'}</span>
            <span className="font-extrabold text-base leading-none">{event.day || '12'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={event.statusVariant || 'neutral'} size="sm" dot>
              {event.status}
            </Badge>
            <EventOptionsMenu
              onView={() => onView(event)}
              onEdit={() => onEdit(event)}
              onDuplicate={() => onDuplicate(event)}
              onDelete={() => onDelete && onDelete(event)}
              onViewQrPass={onViewQrPass ? () => onViewQrPass(event) : undefined}
              onScanAttendance={onScanAttendance ? () => onScanAttendance(event) : undefined}
              onGenerateReport={onGenerateReport ? () => onGenerateReport(event) : undefined}
            />
          </div>
        </div>


        {/* Title & Type */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm" className="text-[10px]">
              {event.type}
            </Badge>
          </div>
          <h3
            onClick={() => onView(event)}
            className="font-outfit font-bold text-base sm:text-lg text-brand-espresso group-hover:text-brand-burgundy transition-colors cursor-pointer leading-snug line-clamp-2"
          >
            {event.name}
          </h3>
        </div>

        {/* Details: Location & Organizer */}
        <div className="space-y-1.5 text-xs text-brand-warm-gray pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-brand-burgundy/80 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-brand-warm-gray shrink-0" />
            <span className="truncate">{event.organizer}</span>
          </div>
        </div>
      </div>

      {/* Footer Row: Attendance (Space Grotesk) & Readiness Progress */}
      <div className="pt-3 border-t border-brand-beige/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-brand-warm-gray flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-brand-espresso" />
            Attendance / Capacity
          </span>
          {/* Space Grotesk Font for Numerical Values */}
          <span className="font-space font-bold text-brand-espresso">
            {event.expectedAttendance?.toLocaleString() || 0}{' '}
            <span className="text-brand-warm-gray text-[11px] font-normal">
              / {event.capacity?.toLocaleString() || 0}
            </span>
          </span>
        </div>

        {/* Readiness Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-brand-warm-gray">
            <span>Readiness</span>
            <span className="font-space font-bold">{event.readiness || 80}%</span>
          </div>
          <div className="h-1.5 w-full bg-brand-cream rounded-full overflow-hidden border border-brand-beige/50">
            <div
              className={`h-full rounded-full ${
                (event.readiness || 80) >= 90
                  ? 'bg-brand-olive'
                  : (event.readiness || 80) >= 70
                  ? 'bg-brand-ochre'
                  : 'bg-brand-red'
              }`}
              style={{ width: `${event.readiness || 80}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
