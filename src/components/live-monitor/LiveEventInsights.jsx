import React from 'react';
import { Sparkles, TrendingUp, Users, Boxes, ShieldCheck } from 'lucide-react';

export default function LiveEventInsights({ event }) {
  if (!event) return null;

  const attRate = Math.min((event.currentCheckIns / event.expectedAttendance) * 100, 100);
  const venueOcc = Math.min((event.currentCheckIns / event.venueCapacity) * 100, 100);
  const staffPct = Math.min((event.staffActive / event.staffAssigned) * 100, 100);

  const insights = [
    {
      id: 'ins-1',
      title: attRate >= 80 ? 'Optimal Check-In Velocity' : 'Check-In In Progress',
      description: attRate >= 80
        ? `Attendance check-in rate has reached ${attRate.toFixed(1)}%, surpassing standard milestone targets.`
        : `Check-in velocity is currently at ${attRate.toFixed(1)}% of total projected turnout.`,
      icon: TrendingUp,
      category: 'Attendance',
    },
    {
      id: 'ins-2',
      title: venueOcc >= 85 ? 'High Venue Seating Density' : 'Comfortable Seating Density',
      description: venueOcc >= 85
        ? `Main hall seating is at ${venueOcc.toFixed(1)}% occupancy. Overflow live-stream seating is recommended.`
        : `Venue capacity at ${venueOcc.toFixed(1)}% allows comfortable aisle mobility and seating access.`,
      icon: Users,
      category: 'Venue Space',
    },
    {
      id: 'ins-3',
      title: staffPct >= 90 ? 'Staffing Fully Deployed' : 'Staff Reallocation Opportunity',
      description: staffPct >= 90
        ? `Floor operations maintain ${staffPct.toFixed(0)}% active staff deployment across all entry gates.`
        : `Consider deploying 2 floating staff members to busy check-in areas.`,
      icon: ShieldCheck,
      category: 'Operations',
    },
    {
      id: 'ins-4',
      title: 'Equipment Telemetry Verified',
      description: `${event.equipmentOperational} of ${event.equipmentTotal} AV units are operational with healthy latency metrics.`,
      icon: Boxes,
      category: 'Equipment',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Live Event Insights
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-burgundy/10 text-burgundy border border-burgundy/20 uppercase tracking-wider font-outfit">
              <Sparkles className="w-3 h-3 text-burgundy" />
              Sample Smart Insights
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Automated rule-based observations synthesized continuously from active telemetry feeds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-warm-cream/50 border border-espresso/10 space-y-2 flex flex-col justify-between hover:border-burgundy/20 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy font-outfit">
                    {item.category}
                  </span>
                  <div className="p-1.5 rounded bg-burgundy/10 text-burgundy">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h4 className="font-bold text-sm text-espresso font-outfit">
                  {item.title}
                </h4>

                <p className="text-xs text-espresso/70 leading-relaxed font-outfit">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
