import React from 'react';
import { Target, ArrowUpRight } from 'lucide-react';

export default function OptimizationScoreCard({
  score = 74,
  maxScore = 100,
  status = 'Good',
  description = '',
  appliedCount = 0,
}) {
  const getStatusColor = (statusName) => {
    switch (statusName) {
      case 'Excellent':
        return {
          stroke: '#66745A', // Muted Olive
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          text: 'text-muted-olive',
        };
      case 'Good':
        return {
          stroke: '#6E1F2A', // Burgundy
          bg: 'bg-burgundy/10 text-burgundy border-burgundy/20',
          text: 'text-burgundy',
        };
      case 'Needs Improvement':
        return {
          stroke: '#B68132', // Warm Ochre
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          text: 'text-warm-ochre',
        };
      case 'Needs Attention':
        return {
          stroke: '#A63D40', // Muted Red
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          text: 'text-muted-red',
        };
      default:
        return {
          stroke: '#6E1F2A',
          bg: 'bg-burgundy/10 text-burgundy border-burgundy/20',
          text: 'text-burgundy',
        };
    };
  };

  const statusStyle = getStatusColor(status);
  const percentage = Math.min(Math.max(score, 0), 100);
  const radius = 52;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-espresso/60 font-outfit">
            Overall Event Readiness
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border font-outfit ${statusStyle.bg}`}>
            {status}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-espresso font-outfit">
          Optimization Performance Score
        </h2>

        <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed font-outfit max-w-xl">
          {description}
        </p>

        {appliedCount > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-md border border-emerald-200 mt-1">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>Score increased by applying {appliedCount} recommendation{appliedCount > 1 ? 's' : ''}!</span>
          </div>
        )}
      </div>

      {/* SVG Circular Progress Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#F5EBE6"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={statusStyle.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.6s ease-in-out, stroke 0.4s ease' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-space-grotesk text-3xl font-extrabold text-espresso leading-none">
            {score}
          </span>
          <span className="font-space-grotesk text-[10px] text-espresso/50 uppercase tracking-widest font-semibold mt-0.5">
            / {maxScore}
          </span>
        </div>
      </div>
    </div>
  );
}
