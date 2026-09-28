import React, { useMemo, useState } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { CalendarDays, MapPin, User, Clock3, Sparkles } from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';

const isEventOpen = (event) => {
  return event && !['Completed', 'Cancelled'].includes(event.status);
};

export const ParticipantEventsList = () => {
  const { auth, events, toggleParticipantEventMembership } = useEventIQ();
  const currentUser = auth?.user;
  const userRole = currentUser?.role;
  const [activeTab, setActiveTab] = useState('all');

  if (userRole !== 'PARTICIPANT') {
    return null;
  }

  const participatingIds = Array.isArray(currentUser?.participatingEventIds)
    ? currentUser.participatingEventIds
    : [];

  const eventCatalog = useMemo(() => {
    return events.filter((event) => isEventOpen(event));
  }, [events]);

  const upcomingEvents = useMemo(() => {
    return eventCatalog.filter((event) => ['Upcoming', 'Planning', 'Ready', 'Scheduled'].includes(event.status));
  }, [eventCatalog]);

  const joinedEvents = useMemo(() => {
    return eventCatalog.filter((event) => participatingIds.includes(event.id));
  }, [eventCatalog, participatingIds]);

  const tabMap = {
    all: eventCatalog,
    upcoming: upcomingEvents,
    joined: joinedEvents,
  };

  const visibleEvents = tabMap[activeTab] || eventCatalog;

  const handleJoin = (eventId) => {
    toggleParticipantEventMembership(eventId, true);
  };

  const handleOptOut = (eventId) => {
    toggleParticipantEventMembership(eventId, false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-warm-gray">
            Browse Events
          </p>
          <h3 className="text-xl font-bold text-brand-espresso">Discover and register</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-brand-beige bg-brand-ivory p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'joined', label: 'My Events' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-brand-burgundy text-brand-ivory shadow-subtle'
                  : 'text-brand-warm-gray hover:bg-brand-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-beige bg-brand-ivory p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-brand-espresso">
            <Sparkles className="h-4 w-4 text-brand-burgundy" />
            <span className="text-sm font-semibold">
              {activeTab === 'all' ? 'All open events' : activeTab === 'upcoming' ? 'Upcoming events' : 'Your registered events'}
            </span>
          </div>
          <Badge variant="soft" size="sm">
            {visibleEvents.length} shown
          </Badge>
        </div>
      </div>

      {visibleEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-beige bg-brand-ivory p-8 text-center text-brand-warm-gray">
          No events match this view right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleEvents.map((event) => {
            const isJoined = participatingIds.includes(event.id);

            return (
              <div
                key={event.id}
                className="rounded-2xl border border-brand-beige bg-brand-ivory p-4 shadow-subtle"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={event.statusVariant || 'neutral'} size="sm">
                    {event.status}
                  </Badge>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-brand-warm-gray">
                    {event.type}
                  </span>
                </div>

                <h4 className="mt-3 text-lg font-bold text-brand-espresso leading-snug">
                  {event.name}
                </h4>

                <div className="mt-3 space-y-2 text-sm text-brand-warm-gray">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-brand-burgundy" />
                    <span>{event.dateDisplay || event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-burgundy" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-brand-burgundy" />
                    <span>{event.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-brand-burgundy" />
                    <span>
                      {event.startTime || '09:00 AM'} - {event.endTime || '05:00 PM'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant={isJoined ? 'secondary' : 'primary'}
                    size="sm"
                    className="flex-1"
                    onClick={() => (isJoined ? handleOptOut(event.id) : handleJoin(event.id))}
                  >
                    {isJoined ? 'Opt Out' : 'Join'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParticipantEventsList;
