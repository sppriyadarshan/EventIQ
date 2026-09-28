import React from 'react';
import { UserCheck, Users, Building, ShieldCheck, Boxes, Wallet } from 'lucide-react';

export default function LiveMetricCards({ event }) {
  if (!event) return null;

  const attendanceRate = Math.min((event.currentCheckIns / event.expectedAttendance) * 100, 100).toFixed(1);
  const venueOccupancy = Math.min((event.currentCheckIns / event.venueCapacity) * 100, 100).toFixed(1);
  const staffPct = Math.min((event.staffActive / event.staffAssigned) * 100, 100).toFixed(0);
  const equipPct = Math.min((event.equipmentOperational / event.equipmentTotal) * 100, 100).toFixed(0);
  const budgetPct = Math.min((event.budgetSpent / event.budgetAllocated) * 100, 100).toFixed(0);

  const cards = [
    {
      id: 'm-chk',
      label: 'Current Check-Ins',
      value: event.currentCheckIns.toLocaleString(),
      subText: `of ${event.expectedAttendance.toLocaleString()} expected`,
      status: parseFloat(attendanceRate) >= 80 ? 'Optimal' : 'In Progress',
      icon: UserCheck,
      color: 'text-burgundy',
      bg: 'bg-burgundy/10',
    },
    {
      id: 'm-rate',
      label: 'Attendance Rate',
      value: `${attendanceRate}%`,
      subText: `${event.currentCheckIns} checked in`,
      status: parseFloat(attendanceRate) >= 85 ? 'Strong' : 'On Track',
      icon: Users,
      color: 'text-burgundy',
      bg: 'bg-burgundy/10',
    },
    {
      id: 'm-occ',
      label: 'Venue Occupancy',
      value: `${venueOccupancy}%`,
      subText: `Capacity: ${event.venueCapacity}`,
      status: parseFloat(venueOccupancy) >= 90 ? 'Near Full' : 'Healthy',
      icon: Building,
      color: 'text-burgundy',
      bg: 'bg-burgundy/10',
    },
    {
      id: 'm-stf',
      label: 'Active Staff',
      value: `${event.staffActive} / ${event.staffAssigned}`,
      subText: `${staffPct}% active on floor`,
      status: parseInt(staffPct) >= 85 ? 'Healthy' : 'Needs Attention',
      icon: ShieldCheck,
      color: 'text-muted-olive',
      bg: 'bg-muted-olive/10',
    },
    {
      id: 'm-eqp',
      label: 'Equipment Readiness',
      value: `${equipPct}%`,
      subText: `${event.equipmentOperational} of ${event.equipmentTotal} units`,
      status: parseInt(equipPct) >= 85 ? 'Optimal' : 'Needs Review',
      icon: Boxes,
      color: 'text-muted-olive',
      bg: 'bg-muted-olive/10',
    },
    {
      id: 'm-bdg',
      label: 'Budget Usage',
      value: `${budgetPct}%`,
      subText: `₹${event.budgetSpent.toLocaleString('en-IN')} spent`,
      status: parseInt(budgetPct) <= 85 ? 'On Track' : 'Review Needed',
      icon: Wallet,
      color: 'text-warm-ochre',
      bg: 'bg-warm-ochre/10',
    },
  ];

  const getStatusBadge = (statusText) => {
    switch (statusText) {
      case 'Optimal':
      case 'Strong':
      case 'Healthy':
      case 'On Track':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'In Progress':
        return 'bg-burgundy/10 text-burgundy border-burgundy/20';
      case 'Near Full':
      case 'Needs Attention':
      case 'Needs Review':
      case 'Review Needed':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-sand text-espresso/80 border-espresso/10';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const IconComp = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-espresso/10 p-4 shadow-sm flex flex-col justify-between space-y-3 hover:border-burgundy/20 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-espresso/70 font-outfit">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                <IconComp className="w-4 h-4" />
              </div>
            </div>

            <div>
              <span className="font-space-grotesk text-2xl font-bold text-espresso tracking-tight">
                {card.value}
              </span>
              <p className="text-[11px] text-espresso/50 font-outfit mt-0.5">
                {card.subText}
              </p>
            </div>

            <div className="pt-2 border-t border-espresso/5 flex items-center justify-between text-xs">
              <span className="text-espresso/40 text-[10px] uppercase tracking-wider font-outfit">Status</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border font-outfit ${getStatusBadge(card.status)}`}>
                {card.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
