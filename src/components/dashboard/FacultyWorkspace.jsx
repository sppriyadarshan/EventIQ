import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Building,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bell,
  Sparkles,
  Search,
} from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';
import EventReportModal from '../reports/EventReportModal';

export const FacultyWorkspace = () => {
  const { auth, events, notifications } = useEventIQ();
  const [academicSchedules, setAcademicSchedules] = useState([]);
  const [selectedReportEvent, setSelectedReportEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const deptCode = auth?.user?.department_code || 'CSE';
  const facultyDeptName = auth?.user?.organization || 'Department of Computer Science & Engineering';
  const facultyEventIds = Array.isArray(auth?.user?.facultyEventIds) ? auth.user.facultyEventIds : [];
  const facultyTrackedEvents = (events || []).filter((event) => {
    const idTokens = [event.id, `ev-${event.backendId}`, String(event.backendId), String(event.id)];
    return facultyEventIds.some((requestedId) => idTokens.includes(requestedId));
  });

  // Fetch academic schedules for faculty department
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const { apiClient } = await import('../../services/apiClient');
        const res = await apiClient.academicSchedule.getSchedules(deptCode);
        if (Array.isArray(res)) {
          setAcademicSchedules(res);
        }
      } catch (err) {
        console.warn('Academic schedule fetch error:', err);
      }
    };
    fetchSchedules();
  }, [deptCode]);

  // Filter department events
  const deptEvents = events.filter((e) =>
    e.organizer?.toLowerCase().includes('computer science') ||
    e.organizer?.toLowerCase().includes('cse') ||
    e.name?.toLowerCase().includes('tech') ||
    e.name?.toLowerCase().includes('ai')
  );

  const filteredEvents = (deptEvents.length > 0 ? deptEvents : events).filter((e) =>
    e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingEvents = filteredEvents.filter((e) => e.status !== 'Completed');

  return (
    <div className="space-y-8 font-outfit">
      {/* Faculty Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-burgundy via-brand-burgundy-dark to-brand-espresso p-6 sm:p-8 text-brand-ivory shadow-lg">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge variant="soft" size="sm" className="bg-brand-ivory/15 text-brand-ivory border-brand-ivory/20">
              Faculty Workspace
            </Badge>
            <span className="text-xs text-brand-cream/80 font-mono">Department of {deptCode}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {auth?.user?.name || 'Prof. Marcus Brody'}
          </h1>
          <p className="text-sm text-brand-cream/90 leading-relaxed">
            Manage your department's upcoming events, view academic schedule info, track attendance summaries, and access official event reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-burgundy/10 text-brand-burgundy shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Dept Events
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {filteredEvents.length}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-olive/10 text-brand-olive shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Expected Turnout
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {filteredEvents.reduce((acc, e) => acc + (Number(e.expectedAttendance) || 0), 0)}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-ochre/10 text-brand-ochre shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Academic Slots
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {academicSchedules.length || 10}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-burgundy/10 text-brand-burgundy shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Reports Ready
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {filteredEvents.length}
            </span>
          </div>
        </Card>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Department Events */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 bg-brand-ivory space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-brand-espresso flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-burgundy" />
                  My Faculty Event Attendance
                </h3>
                <p className="text-xs text-brand-warm-gray">Events you’ve marked as attended for this term.</p>
              </div>
              <Badge variant="soft" size="sm">{facultyTrackedEvents.length} tracked</Badge>
            </div>

            {facultyTrackedEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-beige bg-brand-cream/40 p-5 text-sm text-brand-warm-gray">
                No faculty attendance entries yet. Use the Attend button in the event list to add an event to your dashboard.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {facultyTrackedEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="rounded-xl border border-brand-beige bg-brand-cream/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="success" size="xs">Attended</Badge>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-brand-warm-gray">{event.type || 'Event'}</span>
                    </div>
                    <h4 className="mt-2 font-bold text-brand-espresso text-sm">{event.name}</h4>
                    <p className="mt-1 text-[11px] text-brand-warm-gray">{event.dateDisplay || event.date}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-brand-ivory space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-brand-espresso flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-brand-burgundy" />
                  Upcoming Department & Campus Events
                </h3>
                <p className="text-xs text-brand-warm-gray">
                  Schedule details, venues, and attendance tracking
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-warm-gray" />
                <input
                  type="text"
                  placeholder="Filter events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-brand-cream/80 border border-brand-beige focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl bg-brand-cream/40 border border-brand-beige hover:border-brand-burgundy/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="burgundy" size="xs">
                        {evt.type || 'Conference'}
                      </Badge>
                      <Badge variant="soft" size="xs">
                        {evt.status || 'Planning'}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-brand-espresso text-base">{evt.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-brand-warm-gray flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-burgundy" />
                        {evt.dateDisplay || evt.date || 'Oct 15, 2026'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-burgundy" />
                        {evt.location || 'Main Auditorium'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-brand-burgundy" />
                        {evt.expectedAttendance || 100} Expected
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReportEvent(evt)}
                      className="text-xs w-full sm:w-auto"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      View Report
                    </Button>
                    <Link to="/attendance">
                      <Button variant="primary" size="sm" className="text-xs w-full sm:w-auto">
                        Attendance
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Academic Schedule & Conflict Summary */}
          <Card className="p-6 bg-brand-ivory space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-espresso flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-burgundy" />
                  Department Academic Schedule Overview
                </h3>
                <p className="text-xs text-brand-warm-gray">
                  Classroom timetable & conflict-free slots for {deptCode} department
                </p>
              </div>
              <Link to="/academic-planner">
                <Button variant="ghost" size="sm" className="text-xs text-brand-burgundy">
                  Full Schedule &rarr;
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {academicSchedules.slice(0, 4).map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-brand-cream/60 border border-brand-beige space-y-1">
                  <div className="flex items-center justify-between font-bold text-brand-espresso">
                    <span>{s.department_code} - Sem {s.semester} ({s.section})</span>
                    <Badge variant="soft" size="xs">{s.day_of_week}</Badge>
                  </div>
                  <p className="text-brand-warm-gray text-[11px] truncate">{s.subject_activity}</p>
                  <p className="text-brand-espresso/80 text-[11px] font-mono">
                    ⏰ {s.start_time} - {s.end_time}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Notifications & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <Card className="p-5 bg-brand-ivory space-y-3">
            <h4 className="font-bold text-brand-espresso text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-burgundy" />
              Faculty Quick Tools
            </h4>
            <div className="space-y-2">
              <Link to="/events" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <CalendarDays className="w-4 h-4 mr-2 text-brand-burgundy" />
                  View All Master Events
                </Button>
              </Link>
              <Link to="/academic-planner" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <GraduationCap className="w-4 h-4 mr-2 text-brand-burgundy" />
                  Inspect Academic Planner
                </Button>
              </Link>
              <Link to="/attendance" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <Users className="w-4 h-4 mr-2 text-brand-burgundy" />
                  Live Attendance Scanner
                </Button>
              </Link>
              <Link to="/reports" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <FileText className="w-4 h-4 mr-2 text-brand-burgundy" />
                  Export Event Reports
                </Button>
              </Link>
            </div>
          </Card>

          {/* Department Notifications */}
          <Card className="p-5 bg-brand-ivory space-y-4">
            <h4 className="font-bold text-brand-espresso text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-burgundy" />
              Recent Event Alerts
            </h4>
            <div className="space-y-3 text-xs">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-brand-cream/50 border border-brand-beige/80 space-y-1">
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

      {/* Event Report Modal */}
      {selectedReportEvent && (
        <EventReportModal
          isOpen={!!selectedReportEvent}
          onClose={() => setSelectedReportEvent(null)}
          eventId={selectedReportEvent.backendId || selectedReportEvent.id}
        />
      )}
    </div>
  );
};

export default FacultyWorkspace;
