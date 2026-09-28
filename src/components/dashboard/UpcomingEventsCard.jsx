import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useEventIQ } from '../../context/EventIQContext';

/**
 * EventIQ UpcomingEventsCard Component
 * Displays upcoming events from centralized application state with status badges and "View All" link.
 */
export const UpcomingEventsCard = () => {
  const { events } = useEventIQ();

  const upcomingEvents = events.slice(0, 3);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Active':
      case 'LIVE':
        return 'emerald';
      case 'Planning':
      case 'Scheduled':
        return 'ochre';
      case 'Draft':
        return 'burgundy';
      default:
        return 'olive';
    }
  };

  return (
    <Card variant="standard" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">Upcoming Events</CardTitle>
          <CardDescription>Scheduled events requiring resource monitoring</CardDescription>
        </div>
        <Link to="/events">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All ({events.length})
          </Button>
        </Link>
      </div>

      <div className="space-y-3 pt-1">
        {upcomingEvents.length === 0 ? (
          <p className="text-xs text-brand-warm-gray py-4 text-center">No upcoming events scheduled.</p>
        ) : (
          upcomingEvents.map((event) => {
            const dateParts = (event.dateDisplay || event.date || 'OCT 12').split(' ');
            const month = dateParts[0] || 'TBD';
            const day = dateParts[1] || '1';

            return (
              <div
                key={event.id}
                className="p-3.5 bg-brand-cream/50 rounded-[12px] border border-brand-beige flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-burgundy/30 transition-all"
              >
                {/* Date & Event Details */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[10px] bg-brand-burgundy-soft/40 text-brand-burgundy flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold uppercase">{month}</span>
                    <span className="font-space-grotesk font-extrabold text-sm leading-none">{day}</span>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="font-outfit font-bold text-sm text-brand-espresso">
                      {event.name || event.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-brand-warm-gray">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="font-space-grotesk font-semibold">{event.expectedAttendance}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 self-start sm:self-center">
                  <Badge variant={getStatusVariant(event.status)} size="sm" dot>
                    {event.status}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default UpcomingEventsCard;

