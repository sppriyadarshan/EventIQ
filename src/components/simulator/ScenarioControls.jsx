import React from 'react';
import { Sliders, Users, Wallet, Boxes, Building, Sparkles } from 'lucide-react';

export default function ScenarioControls({
  simValues,
  baseline,
  limits,
  onChange,
}) {
  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Simulation Scenario Controls
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-burgundy/10 text-burgundy border border-burgundy/20 uppercase tracking-wider font-outfit">
              <Sliders className="w-3 h-3 text-burgundy" />
              Interactive Variables
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Adjust the sliders or inputs below. The calculation engine will continuously recompute all operational metrics in real time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Expected Attendance Slider & Input */}
        <div className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-burgundy" />
              <label className="text-xs font-bold text-espresso font-outfit">
                Expected Attendance
              </label>
            </div>
            <span className="text-[11px] text-espresso/50 font-outfit">
              Base: <strong className="font-space-grotesk">{baseline.currentExpectedAttendance}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={limits.attendance.min}
              max={limits.attendance.max}
              step={limits.attendance.step}
              value={simValues.attendance}
              onChange={(e) => onChange('attendance', Number(e.target.value))}
              className="w-full accent-burgundy cursor-pointer"
            />
            <input
              type="number"
              value={simValues.attendance}
              onChange={(e) => onChange('attendance', Number(e.target.value))}
              className="w-20 px-2 py-1 bg-white text-espresso font-space-grotesk font-bold text-xs rounded border border-espresso/20 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        {/* 2. Event Budget Slider & Input */}
        <div className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-warm-ochre" />
              <label className="text-xs font-bold text-espresso font-outfit">
                Event Budget (₹)
              </label>
            </div>
            <span className="text-[11px] text-espresso/50 font-outfit">
              Base: <strong className="font-space-grotesk">₹{baseline.currentBudget.toLocaleString('en-IN')}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={limits.budget.min}
              max={limits.budget.max}
              step={limits.budget.step}
              value={simValues.budget}
              onChange={(e) => onChange('budget', Number(e.target.value))}
              className="w-full accent-warm-ochre cursor-pointer"
            />
            <input
              type="number"
              value={simValues.budget}
              onChange={(e) => onChange('budget', Number(e.target.value))}
              className="w-24 px-2 py-1 bg-white text-espresso font-space-grotesk font-bold text-xs rounded border border-espresso/20 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        {/* 3. Staff Assigned Slider & Input */}
        <div className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-olive" />
              <label className="text-xs font-bold text-espresso font-outfit">
                Staff Assigned
              </label>
            </div>
            <span className="text-[11px] text-espresso/50 font-outfit">
              Base: <strong className="font-space-grotesk">{baseline.staffAssigned}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={limits.staff.min}
              max={limits.staff.max}
              step={limits.staff.step}
              value={simValues.staff}
              onChange={(e) => onChange('staff', Number(e.target.value))}
              className="w-full accent-muted-olive cursor-pointer"
            />
            <input
              type="number"
              value={simValues.staff}
              onChange={(e) => onChange('staff', Number(e.target.value))}
              className="w-16 px-2 py-1 bg-white text-espresso font-space-grotesk font-bold text-xs rounded border border-espresso/20 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        {/* 4. Venue Capacity Slider & Input */}
        <div className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-burgundy" />
              <label className="text-xs font-bold text-espresso font-outfit">
                Venue Seating Capacity
              </label>
            </div>
            <span className="text-[11px] text-espresso/50 font-outfit">
              Base: <strong className="font-space-grotesk">{baseline.venueCapacity}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={limits.capacity.min}
              max={limits.capacity.max}
              step={limits.capacity.step}
              value={simValues.capacity}
              onChange={(e) => onChange('capacity', Number(e.target.value))}
              className="w-full accent-burgundy cursor-pointer"
            />
            <input
              type="number"
              value={simValues.capacity}
              onChange={(e) => onChange('capacity', Number(e.target.value))}
              className="w-20 px-2 py-1 bg-white text-espresso font-space-grotesk font-bold text-xs rounded border border-espresso/20 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        {/* 5. Equipment Availability Slider & Input */}
        <div className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-muted-olive" />
              <label className="text-xs font-bold text-espresso font-outfit">
                Equipment Availability (%)
              </label>
            </div>
            <span className="text-[11px] text-espresso/50 font-outfit">
              Base: <strong className="font-space-grotesk">{baseline.equipmentAvailability}%</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={limits.equipment.min}
              max={limits.equipment.max}
              step={limits.equipment.step}
              value={simValues.equipment}
              onChange={(e) => onChange('equipment', Number(e.target.value))}
              className="w-full accent-muted-olive cursor-pointer"
            />
            <input
              type="number"
              value={simValues.equipment}
              onChange={(e) => onChange('equipment', Number(e.target.value))}
              className="w-16 px-2 py-1 bg-white text-espresso font-space-grotesk font-bold text-xs rounded border border-espresso/20 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        {/* 6. Engagement Strategy Level Select */}
        <div className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-burgundy" />
              <label className="text-xs font-bold text-espresso font-outfit">
                Engagement Strategy Level
              </label>
            </div>
            <span className="text-[11px] text-espresso/50 font-outfit">
              Base: <strong className="font-outfit">{baseline.currentEngagement}</strong>
            </span>
          </div>

          <div>
            <select
              value={simValues.engagement}
              onChange={(e) => onChange('engagement', e.target.value)}
              className="w-full px-3 py-2 bg-white text-espresso text-xs font-semibold rounded-lg border border-espresso/20 focus:outline-none focus:border-burgundy cursor-pointer font-outfit"
            >
              <option value="Basic">Basic (Standard Agenda, Manual Q&A)</option>
              <option value="Standard">Standard (App Notifications, Digital Polling)</option>
              <option value="Enhanced">Enhanced (Live Matchmaking, Code Kiosks, VR Booths)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
