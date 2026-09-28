import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function ResetSimulationButton({ onReset }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="px-4 py-2 bg-warm-cream hover:bg-sand text-espresso/80 border border-espresso/15 text-xs font-semibold rounded-lg font-outfit flex items-center gap-2 transition-colors shadow-sm"
    >
      <RotateCcw className="w-4 h-4 text-burgundy" />
      <span>Reset Simulation</span>
    </button>
  );
}
