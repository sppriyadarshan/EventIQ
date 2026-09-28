import React from 'react';
import { Eye, Edit, MapPin, Copy, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import IconButton from '../ui/IconButton';

/**
 * EventIQ EventTable Component
 * Responsive table view of events with Space Grotesk numerical styling and actions.
 */
export const EventTable = ({
  events = [],
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  return (
    <Card variant="standard" className="p-0 overflow-hidden shadow-subtle border-brand-beige font-outfit">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream border-b border-brand-beige text-xs font-bold uppercase tracking-wider text-brand-espresso">
            <tr>
              <th className="py-3.5 px-4">Event Name</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Date</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Type</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Location</th>
              <th className="py-3.5 px-4">Attendance</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-beige/60 bg-brand-ivory text-brand-espresso">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-brand-cream/40 transition-colors">
                {/* Event Name */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <span
                      onClick={() => onView(event)}
                      className="font-bold text-brand-espresso hover:text-brand-burgundy cursor-pointer transition-colors block"
                    >
                      {event.name}
                    </span>
                    <span className="text-xs text-brand-warm-gray md:hidden block font-space-grotesk">
                      {event.dateDisplay} • {event.type}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap text-xs font-semibold text-brand-warm-gray font-space-grotesk">
                  {event.dateDisplay}
                </td>

                {/* Type */}
                <td className="py-3.5 px-4 hidden sm:table-cell">
                  <Badge variant="neutral" size="sm">
                    {event.type}
                  </Badge>
                </td>

                {/* Location */}
                <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-brand-warm-gray truncate max-w-[180px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-burgundy shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>
                </td>

                {/* Attendance (Space Grotesk Font) */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-space-grotesk font-bold text-xs text-brand-espresso">
                    {event.expectedAttendance?.toLocaleString()}{' '}
                    <span className="text-brand-warm-gray text-[11px] font-normal">
                      / {event.capacity?.toLocaleString()}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge variant={event.statusVariant || 'neutral'} size="sm" dot>
                    {event.status}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(event)}
                      ariaLabel="View event details"
                      className="w-8 h-8"
                    >
                      <Eye className="w-4 h-4 text-brand-burgundy" />
                    </IconButton>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(event)}
                      ariaLabel="Edit event"
                      className="w-8 h-8"
                    >
                      <Edit className="w-4 h-4 text-brand-warm-gray hover:text-brand-burgundy" />
                    </IconButton>
                    {onDuplicate && (
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(event)}
                        ariaLabel="Duplicate event"
                        className="w-8 h-8"
                      >
                        <Copy className="w-4 h-4 text-brand-warm-gray hover:text-brand-burgundy" />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(event)}
                        ariaLabel="Delete event"
                        className="w-8 h-8 text-brand-red hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default EventTable;

