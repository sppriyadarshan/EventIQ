import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  Boxes,
  Truck,
  Wrench,
  Users,
  AlertTriangle,
  Activity,
  CheckCircle2,
  CalendarDays,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';
import ResourceStatusCard from './ResourceStatusCard';

export const LogisticsWorkspace = () => {
  const { auth, events, resources, notifications } = useEventIQ();

  // Categories
  const staffResources = resources.filter((r) => r.category === 'Staff' || r.category === 'STAFF');
  const equipmentResources = resources.filter((r) => r.category === 'Equipment' || r.category === 'EQUIPMENT');
  const transportResources = resources.filter((r) => r.category === 'Transport' || r.category === 'TRANSPORT');

  return (
    <div className="space-y-8 font-outfit">
      {/* Logistics Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-espresso via-brand-burgundy-dark to-brand-burgundy p-6 sm:p-8 text-brand-ivory shadow-lg">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge variant="soft" size="sm" className="bg-brand-ivory/15 text-brand-ivory border-brand-ivory/20">
              Logistics Workspace
            </Badge>
            <span className="text-xs text-brand-cream/80 font-mono">Operations & AV Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {auth?.user?.name || 'Rajesh Kumar'}
          </h1>
          <p className="text-sm text-brand-cream/90 leading-relaxed">
            Monitor real-time equipment availability, transport fleets, manpower allocations, venue readiness, and dynamic reallocation alerts across all campus events.
          </p>
        </div>
      </div>

      {/* Resource Allocation Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-burgundy/10 text-brand-burgundy shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Equipment Items
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {equipmentResources.length} Types
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-olive/10 text-brand-olive shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Transport Shuttles
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {transportResources.reduce((acc, r) => acc + (r.totalQuantity || r.total || 0), 0)} Vehicles
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-ochre/10 text-brand-ochre shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Manpower Crew
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {staffResources.reduce((acc, r) => acc + (r.allocatedQuantity || r.allocated || 0), 0)} On Duty
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-burgundy/10 text-brand-burgundy shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Critical Resources
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {resources.filter((r) => r.status === 'Critical' || r.status === 'CRITICAL').length}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Resource Status & Live Logistics Plan */}
        <div className="lg:col-span-8 space-y-6">
          <ResourceStatusCard />

          {/* Operational Events Logistics Plan */}
          <Card className="p-6 bg-brand-ivory space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-espresso flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-brand-burgundy" />
                  Upcoming Operational Events & Allocation Plan
                </h3>
                <p className="text-xs text-brand-warm-gray">
                  Venue, equipment, and turnout forecasts for operations team
                </p>
              </div>
              <Link to="/resources">
                <Button variant="outline" size="sm" className="text-xs">
                  Inventory &rarr;
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {events.slice(0, 4).map((evt) => (
                <div key={evt.id} className="p-4 rounded-xl bg-brand-cream/50 border border-brand-beige space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-brand-espresso text-sm">{evt.name}</h4>
                    <Badge variant="soft" size="xs">
                      {evt.status || 'Planning'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-brand-warm-gray pt-1">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-brand-burgundy">Venue</span>
                      <span className="font-medium text-brand-espresso">{evt.location || 'Main Auditorium'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-brand-burgundy">Expected Turnout</span>
                      <span className="font-medium text-brand-espresso font-space-grotesk">{evt.expectedAttendance || 100}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-brand-burgundy">Capacity</span>
                      <span className="font-medium text-brand-espresso font-space-grotesk">{evt.capacity || 150}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-brand-burgundy">Readiness</span>
                      <span className="font-medium text-brand-espresso font-space-grotesk">{evt.readiness || 85}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Live Operations Monitor & Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 bg-brand-ivory space-y-3">
            <h4 className="font-bold text-brand-espresso text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-burgundy" />
              Logistics Quick Actions
            </h4>
            <div className="space-y-2">
              <Link to="/resources" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <Boxes className="w-4 h-4 mr-2 text-brand-burgundy" />
                  View Resource Inventory
                </Button>
              </Link>
              <Link to="/live-monitor" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <Activity className="w-4 h-4 mr-2 text-brand-burgundy" />
                  Live Operational Monitor
                </Button>
              </Link>
              <Link to="/optimizer" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <SlidersHorizontal className="w-4 h-4 mr-2 text-brand-burgundy" />
                  Inspect Logistics Plan
                </Button>
              </Link>
            </div>
          </Card>

          {/* Operational Alerts */}
          <Card className="p-5 bg-brand-ivory space-y-4">
            <h4 className="font-bold text-brand-espresso text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-brand-ochre" />
              Logistics & Equipment Alerts
            </h4>
            <div className="space-y-3 text-xs">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-brand-cream/50 border border-brand-beige space-y-1">
                  <div className="flex items-center justify-between font-bold text-brand-espresso">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-brand-warm-gray font-normal">{n.time}</span>
                  </div>
                  <p className="text-brand-warm-gray leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogisticsWorkspace;
