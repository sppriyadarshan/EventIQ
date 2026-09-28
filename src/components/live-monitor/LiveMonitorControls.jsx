import React from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

export default function LiveMonitorControls({
  isLiveUpdating = true,
  onPause,
  onResume,
  onReset,
}) {
  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-outfit ${
            isLiveUpdating
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveUpdating ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
            }`}
          />
          {isLiveUpdating ? '● LIVE DEMO STREAM' : '● PAUSED'}
        </span>
        <span className="text-xs text-espresso/60 font-outfit hidden md:inline">
          {isLiveUpdating
            ? 'Deterministic live telemetry interval active.'
            : 'Live stream frozen. Current state preserved.'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isLiveUpdating ? (
          <button
            type="button"
            onClick={onPause}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded-lg font-outfit flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Pause className="w-3.5 h-3.5 text-amber-700" />
            <span>Pause Demo Updates</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onResume}
            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold rounded-lg font-outfit flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 text-emerald-700" />
            <span>Resume Demo Updates</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-1.5 bg-warm-cream hover:bg-sand text-espresso/80 border border-espresso/15 text-xs font-semibold rounded-lg font-outfit flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-burgundy" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
}
