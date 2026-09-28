import React from 'react';
import { Activity, UserCheck, Building, Boxes, Users, Zap, Award } from 'lucide-react';

export default function EventActivityFeed({ activityFeed = [] }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Check-In':
        return <UserCheck className="w-3.5 h-3.5 text-burgundy" />;
      case 'Venue':
        return <Building className="w-3.5 h-3.5 text-burgundy" />;
      case 'Staff':
        return <Users className="w-3.5 h-3.5 text-muted-olive" />;
      case 'Equipment':
        return <Boxes className="w-3.5 h-3.5 text-warm-ochre" />;
      case 'Session':
        return <Zap className="w-3.5 h-3.5 text-burgundy" />;
      case 'Protocol':
        return <Award className="w-3.5 h-3.5 text-muted-olive" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-burgundy" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Live Activity Stream
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              Live Activity
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Chronological live log of gate check-ins, gate alerts, stage transitions, and staff updates (capped at 15 items).
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {activityFeed.slice(0, 15).map((act, i) => (
          <div
            key={act.id || i}
            className="p-3.5 rounded-lg bg-warm-cream/40 border border-espresso/10 flex items-start justify-between gap-3 hover:border-burgundy/20 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white border border-espresso/10 shrink-0 mt-0.5">
                {getCategoryIcon(act.category)}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-espresso font-outfit leading-relaxed">
                  {act.text}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-espresso/50 font-outfit">
                  <span className="font-bold text-burgundy">{act.category}</span>
                  <span>•</span>
                  <span className="font-space-grotesk">{act.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
