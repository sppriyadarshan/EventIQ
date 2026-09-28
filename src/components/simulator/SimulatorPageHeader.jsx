import React from 'react';
import { Sliders, Calendar, RotateCcw } from 'lucide-react';

export default function SimulatorPageHeader({
  events = [],
  selectedEventId = '',
  onSelectEvent,
  onResetSimulation,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-espresso/10 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-burgundy tracking-wider uppercase font-outfit">
            What-If Simulator
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/80 border border-espresso/10 uppercase tracking-wider">
            <Sliders className="w-3 h-3 text-burgundy" />
            Demo Simulation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-espresso font-outfit">
          Explore Different Event Scenarios
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70 mt-1 max-w-2xl font-outfit leading-relaxed">
          Adjust attendance, budget, staffing, capacity, equipment, and engagement strategy variables to model real-time operational outcomes.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-start md:self-center shrink-0">
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

        <button
          type="button"
          onClick={onResetSimulation}
          className="px-3.5 py-2 bg-warm-cream hover:bg-sand text-espresso/80 border border-espresso/15 text-xs font-semibold rounded-lg font-outfit flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-burgundy" />
          <span>Reset Simulation</span>
        </button>
      </div>
    </div>
  );
}
