import React from 'react';
import { Activity, Calendar, Clock } from 'lucide-react';

export default function LiveMonitorPageHeader({
  events = [],
  selectedEventId = '',
  onSelectEvent,
  isLiveUpdating = true,
  lastUpdated = 'Just now',
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-espresso/10 shadow-sm">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-bold text-burgundy tracking-wider uppercase font-outfit">
            Live Event Monitor
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-burgundy/10 text-burgundy border border-burgundy/20 uppercase tracking-wider font-outfit">
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveUpdating ? 'bg-muted-olive animate-pulse' : 'bg-warm-ochre'
              }`}
            />
            Live Demo Data
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-espresso font-outfit">
          Monitor Your Event in Real Time
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70 mt-1 max-w-2xl font-outfit leading-relaxed">
          Real-time check-in telemetry, entry gate flow rates, venue occupancy, staff availability, equipment readiness, and live alert monitoring.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start md:self-center shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-espresso/60 font-outfit bg-warm-cream/60 px-3 py-1.5 rounded-lg border border-espresso/10">
          <Clock className="w-3.5 h-3.5 text-burgundy" />
          <span>Last updated: <strong className="text-espresso font-space-grotesk">{lastUpdated}</strong></span>
        </div>

        <div className="relative flex items-center">
          <Calendar className="w-4 h-4 text-espresso/50 absolute left-3 pointer-events-none" />
          <select
            value={selectedEventId}
            onChange={(e) => onSelectEvent(e.target.value)}
            className="pl-9 pr-8 py-2 bg-warm-cream text-espresso text-xs sm:text-sm font-medium font-outfit rounded-lg border border-espresso/15 focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy cursor-pointer appearance-none shadow-sm"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} ({event.date})
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none text-espresso/50 text-xs">▼</div>
        </div>
      </div>
    </div>
  );
}
