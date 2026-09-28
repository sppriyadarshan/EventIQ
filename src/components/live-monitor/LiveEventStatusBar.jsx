import React from 'react';
import { Activity, Clock, MapPin, Tag } from 'lucide-react';

export default function LiveEventStatusBar({ event }) {
  if (!event) return null;

  const getHealthBadge = (health) => {
    switch (health) {
      case 'Excellent':
      case 'Healthy':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Needs Attention':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Critical':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-sand text-espresso/80 border-espresso/10';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-5 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-espresso/10">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-espresso font-outfit">
            {event.name}
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-burgundy/10 text-burgundy border border-burgundy/20 font-outfit">
            <Tag className="w-3 h-3" />
            {event.eventType}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-espresso/60 font-outfit">
            <MapPin className="w-3.5 h-3.5 text-espresso/40" />
            {event.location}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-espresso/70 font-outfit">
            <Clock className="w-3.5 h-3.5 text-burgundy" />
            <span>Schedule: <strong className="font-space-grotesk">{event.eventStartTime} - {event.eventEndTime}</strong></span>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border font-outfit ${getHealthBadge(event.eventHealth)}`}>
            Health: {event.eventHealth}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Current Phase</span>
          <span className="font-outfit font-bold text-burgundy text-sm">
            {event.currentEventPhase}
          </span>
        </div>

        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Event Status</span>
          <span className="font-outfit font-bold text-espresso text-sm">
            {event.status}
          </span>
        </div>

        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Staff Status</span>
          <span className="font-space-grotesk font-bold text-espresso text-sm">
            {event.staffActive} / {event.staffAssigned} Active
          </span>
        </div>

        <div className="p-3 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block font-outfit">Equipment Operational</span>
          <span className="font-space-grotesk font-bold text-espresso text-sm">
            {event.equipmentOperational} / {event.equipmentTotal} Units
          </span>
        </div>
      </div>
    </div>
  );
}
