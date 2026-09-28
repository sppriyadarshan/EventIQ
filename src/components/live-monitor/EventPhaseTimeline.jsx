import React from 'react';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

export default function EventPhaseTimeline({ event }) {
  if (!event) return null;

  const phases = event.phases || [];

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Event Progression Timeline
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              <Clock className="w-3 h-3 text-burgundy" />
              Phase Tracking
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Sequential phase progression tracking completed milestones, the active session, and upcoming schedule windows.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {phases.map((phase, idx) => {
          const isActive = phase.name === event.currentEventPhase || phase.status === 'Active';
          const isCompleted = phase.status === 'Completed';

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border space-y-2 flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-burgundy text-white border-burgundy shadow-sm'
                  : isCompleted
                  ? 'bg-warm-cream/60 text-espresso border-espresso/10'
                  : 'bg-white text-espresso/60 border-espresso/10 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider font-outfit">
                  Phase 0{idx + 1}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-espresso/30 shrink-0" />
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm font-outfit">{phase.name}</h4>
                <p
                  className={`text-[11px] font-space-grotesk mt-0.5 ${
                    isActive ? 'text-white/80' : 'text-espresso/50'
                  }`}
                >
                  {phase.time}
                </p>
              </div>

              <div className="pt-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-outfit ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-sand text-espresso/60 border border-espresso/10'
                  }`}
                >
                  {isActive ? 'Active Phase' : phase.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
