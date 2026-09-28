import React from 'react';

export default function EventHealthCard({ event }) {
  if (!event) return null;

  // Weighted Health Calculation Engine
  const attScore = Math.min((event.currentCheckIns / event.expectedAttendance) * 100, 100);
  const venueScore = Math.min((event.currentCheckIns / event.venueCapacity) * 100, 100);
  const staffScore = Math.min((event.staffActive / event.staffAssigned) * 100, 100);
  const equipScore = Math.min((event.equipmentOperational / event.equipmentTotal) * 100, 100);
  const budgetScore = 100 - Math.min((event.budgetSpent / event.budgetAllocated) * 100, 100) + 20;

  const rawHealth =
    attScore * 0.25 +
    venueScore * 0.20 +
    staffScore * 0.20 +
    equipScore * 0.20 +
    Math.min(budgetScore, 100) * 0.15;

  const healthScore = Math.min(Math.max(Math.round(rawHealth), 0), 100);

  const getHealthCategory = (score) => {
    if (score >= 90) return { status: 'Excellent', stroke: '#66745A', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (score >= 75) return { status: 'Healthy', stroke: '#6E1F2A', bg: 'bg-burgundy/10 text-burgundy border-burgundy/20' };
    if (score >= 60) return { status: 'Needs Attention', stroke: '#B68132', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { status: 'Critical', stroke: '#A63D40', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  const cat = getHealthCategory(healthScore);
  const radius = 54;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-espresso/60 font-outfit">
            Overall Event Health
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border font-outfit ${cat.bg}`}>
            {cat.status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-espresso font-outfit">
          Telemetry Health Index
        </h3>

        <p className="text-xs text-espresso/70 leading-relaxed font-outfit max-w-md">
          Weighted evaluation combining Attendance (25%), Venue Occupancy (20%), Staff Readiness (20%), Equipment Availability (20%), and Budget Utilization (15%).
        </p>
      </div>

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
            stroke={cat.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-space-grotesk text-3xl font-extrabold text-espresso leading-none">
            {healthScore}
          </span>
          <span className="font-space-grotesk text-[10px] text-espresso/50 uppercase tracking-widest font-semibold mt-0.5">
            / 100
          </span>
        </div>
      </div>
    </div>
  );
}
