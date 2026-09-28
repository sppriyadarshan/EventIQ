import React, { useState, useEffect } from 'react';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Calendar, Clock, MapPin, GraduationCap, AlertTriangle, CheckCircle2, Cpu, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

/**
 * EventIQ AcademicScheduleSection Component
 * Integrates Academic Timetable & Calendar constraints with Google OR-Tools.
 * Allows coordinators to evaluate schedule conflicts and compute conflict-free event allocations.
 */
export const AcademicScheduleSection = ({ eventId, isBackendConnected, onScheduleApplied }) => {
  const [departmentCode, setDepartmentCode] = useState('CSE');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [selectedVenueId, setSelectedVenueId] = useState(1);

  const [schedules, setSchedules] = useState([]);
  const [conflictResult, setConflictResult] = useState(null);
  const [ortoolsResult, setOrtoolsResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const defaultVenuesList = [
    { id: 1, name: 'Main Auditorium', capacity: 500 },
    { id: 2, name: 'Tech Hall A', capacity: 150 },
    { id: 3, name: 'Tech Hall B', capacity: 120 },
    { id: 4, name: 'Seminar Hall 1', capacity: 100 },
    { id: 5, name: 'Seminar Hall 2', capacity: 100 },
    { id: 6, name: 'Computer Lab 1', capacity: 60 },
    { id: 7, name: 'Computer Lab 2', capacity: 60 },
    { id: 8, name: 'Computer Lab 3', capacity: 60 },
    { id: 9, name: 'AI & ML Lab', capacity: 50 },
    { id: 10, name: 'IoT / Embedded Lab', capacity: 50 },
    { id: 11, name: 'Innovation Lab', capacity: 80 },
    { id: 12, name: 'Conference Hall', capacity: 40 },
    { id: 13, name: 'Placement Hall', capacity: 250 },
    { id: 14, name: 'Workshop Hall', capacity: 200 },
    { id: 15, name: 'Multipurpose Hall', capacity: 350 },
  ];

  const [venuesList, setVenuesList] = useState(defaultVenuesList);

  // Fetch all 15 venues dynamically if backend connected
  useEffect(() => {
    const fetchVenues = async () => {
      if (isBackendConnected) {
        try {
          const res = await apiClient.venues.getAll();
          if (Array.isArray(res) && res.length > 0) {
            setVenuesList(res);
          }
        } catch (err) {
          console.warn('Failed to fetch venues from backend:', err);
        }
      }
    };
    fetchVenues();
  }, [isBackendConnected]);

  // Fetch academic timetable feed
  const fetchSchedules = async () => {
    try {
      if (isBackendConnected) {
        const data = await apiClient.academicSchedule.getSchedules(departmentCode, dayOfWeek);
        if (Array.isArray(data)) setSchedules(data);
      } else {
        // Fallback demo dataset
        setSchedules([
          {
            id: 1,
            department_code: 'CSE',
            day_of_week: 'Monday',
            start_time: '10:00:00',
            end_time: '12:00:00',
            semester: 5,
            subject_activity: 'CSE Sem 5 - Data Structures & Algorithms Lab',
            venue_id: 1,
            is_mandatory: true,
          },
          {
            id: 2,
            department_code: 'AIDS',
            day_of_week: 'Monday',
            start_time: '10:00:00',
            end_time: '12:00:00',
            semester: 3,
            subject_activity: 'AIDS Sem 3 - Applied Data Science & Analytics Lab',
            venue_id: 9,
            is_mandatory: true,
          },
        ]);
      }
    } catch (err) {
      console.warn('Failed to load academic schedule:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [departmentCode, dayOfWeek, isBackendConnected]);

  const departmentDefaultSlots = {
    CSE: { day: 'Monday', start: '09:00', end: '11:00' },
    ECE: { day: 'Tuesday', start: '10:30', end: '12:30' },
    MECH: { day: 'Wednesday', start: '13:00', end: '15:00' },
    CIVIL: { day: 'Thursday', start: '09:30', end: '11:30' },
    AIDS: { day: 'Friday', start: '11:00', end: '13:00' },
    AIML: { day: 'Monday', start: '14:00', end: '16:00' },
    CSBS: { day: 'Tuesday', start: '13:30', end: '15:30' },
    EEE: { day: 'Wednesday', start: '10:00', end: '12:00' },
    IT: { day: 'Thursday', start: '14:00', end: '16:00' },
    ICE: { day: 'Friday', start: '09:00', end: '11:00' },
  };

  const handleDepartmentChange = (code) => {
    setDepartmentCode(code);
    const defaults = departmentDefaultSlots[code];
    if (defaults) {
      setDayOfWeek(defaults.day);
      setStartTime(defaults.start);
      setEndTime(defaults.end);
    }
  };

  // Reset conflict/optimization results whenever inputs change
  useEffect(() => {
    setConflictResult(null);
    setOrtoolsResult(null);
  }, [departmentCode, dayOfWeek, startTime, endTime, selectedVenueId]);

  // Handle Conflict Check
  const handleCheckConflict = async () => {
    setIsEvaluating(true);
    setConflictResult(null);
    try {
      if (isBackendConnected) {
        const res = await apiClient.academicSchedule.checkConflict({
          event_id: Number(eventId) || 1,
          department_code: departmentCode,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          venue_id: Number(selectedVenueId) || 1,
        });
        setConflictResult(res);
      } else {
        // Fallback demo result
        const targetDefaults = departmentDefaultSlots[departmentCode];
        const isConflictSlot = targetDefaults && dayOfWeek === targetDefaults.day && startTime === targetDefaults.start;
        setConflictResult({
          has_conflict: isConflictSlot,
          status: isConflictSlot ? 'CONFLICT_DETECTED' : 'AVAILABLE',
          message: isConflictSlot
            ? `Academic schedule conflict detected! Department ${departmentCode} has mandatory class/lab in session.`
            : 'No academic schedule conflicts. Slot and venue are available.',
          conflict_reasons: isConflictSlot
            ? [`Department ${departmentCode} has mandatory class on ${dayOfWeek} from ${startTime} to ${endTime}.`]
            : [],
          alternative_slots: [
            { day: 'Monday', start_time: '14:00', end_time: '16:00', status: 'AVAILABLE' },
            { day: 'Wednesday', start_time: '10:00', end_time: '12:00', status: 'AVAILABLE' },
          ],
          alternative_venues: [
            { venue_id: 3, venue_name: 'Tech Hall B', capacity: 120, status: 'AVAILABLE' },
            { venue_id: 15, venue_name: 'Multipurpose Hall', capacity: 350, status: 'AVAILABLE' },
          ],
        });
      }
    } catch (err) {
      console.error('Check conflict failed:', err);
      setConflictResult({
        has_conflict: false,
        is_error: true,
        status: 'ERROR',
        message: 'Unable to check conflict. Please verify the backend connection.',
        conflict_reasons: [err.message || 'API request failed'],
        alternative_slots: [],
        alternative_venues: [],
      });
    } finally {
      setIsEvaluating(false);
    }
  };


  // Handle OR-Tools Academic Solver
  const handleRunAcademicSolver = async () => {
    setIsOptimizing(true);
    setOrtoolsResult(null);
    try {
      if (isBackendConnected) {
        const res = await apiClient.academicSchedule.optimizeAcademic({
          event_id: Number(eventId) || 1,
          department_code: departmentCode,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          venue_id: Number(selectedVenueId) || 1,
        });
        setOrtoolsResult(res);
      } else {
        // Mock OR-Tools solver output
        setOrtoolsResult({
          status: 'OPTIMAL',
          solver_engine: 'Google OR-Tools Academic Integer Programming Solver',
          selected_venue_name: 'Tech Hall B',
          venue_capacity: 120,
          selected_slot: { day: dayOfWeek === 'Monday' ? 'Monday' : 'Wednesday', start_time: '14:00', end_time: '16:00' },
          is_conflict_free: true,
          explanation: `Selected 'Tech Hall B' (Cap: 120) on 14:00-16:00 which is 100% free of academic department class conflicts.`,
          rejection_summary: [
            `Slot ${dayOfWeek} ${startTime} at requested venue rejected: Department class in session.`,
          ],
        });
      }
    } catch (err) {
      console.error('Academic solver failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Card variant="standard" className="space-y-6 font-outfit border-brand-beige/80">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-beige">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-burgundy" />
            <CardTitle className="text-xl">Academic Planner-wise Allocation</CardTitle>
          </div>
          <CardDescription>
            Considers department class schedules & academic timetables across 10 departments and 15 institutional venues in Google OR-Tools.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm" className="font-mono">
            <Cpu className="w-3 h-3 text-brand-burgundy inline mr-1" />
            OR-Tools Solver Integrated
          </Badge>
        </div>
      </div>

      {/* Grid Layout: Control Panel & Timetable Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Conflict Evaluator Form */}
        <div className="lg:col-span-5 space-y-4 bg-brand-cream/30 p-4 rounded-[12px] border border-brand-beige">
          <h4 className="font-bold text-sm text-brand-espresso flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-burgundy" />
            Event Allocation Form
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-brand-espresso block mb-1">Department</label>
              <select
                value={departmentCode}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full p-2 bg-brand-ivory border border-brand-beige rounded-[8px] focus:outline-none focus:border-brand-burgundy font-medium"
              >
                <option value="CSE">CSE (Computer Science)</option>
                <option value="ECE">ECE (Electronics)</option>
                <option value="MECH">MECH (Mechanical)</option>
                <option value="CIVIL">CIVIL (Civil Eng)</option>
                <option value="AIDS">AIDS (AI & Data Science)</option>
                <option value="AIML">AIML (AI & Machine Learning)</option>
                <option value="CSBS">CSBS (CS & Business Systems)</option>
                <option value="EEE">EEE (Electrical & Electronics)</option>
                <option value="IT">IT (Information Tech)</option>
                <option value="ICE">ICE (Instrumentation & Control)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-brand-espresso block mb-1">Day of Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full p-2 bg-brand-ivory border border-brand-beige rounded-[8px] focus:outline-none focus:border-brand-burgundy font-medium"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-brand-espresso block mb-1">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00"
                className="w-full p-2 bg-brand-ivory border border-brand-beige rounded-[8px] focus:outline-none focus:border-brand-burgundy font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-brand-espresso block mb-1">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="12:00"
                className="w-full p-2 bg-brand-ivory border border-brand-beige rounded-[8px] focus:outline-none focus:border-brand-burgundy font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-brand-espresso block mb-1 text-xs">Proposed Venue (15 Venues Available)</label>
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className="w-full p-2 text-xs bg-brand-ivory border border-brand-beige rounded-[8px] focus:outline-none focus:border-brand-burgundy font-medium"
            >
              {venuesList.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (Cap: {v.capacity})
                </option>
              ))}
            </select>
          </div>


          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCheckConflict}
              disabled={isEvaluating}
              className="flex-1 text-xs"
            >
              {isEvaluating ? 'Checking...' : 'Check Conflict'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleRunAcademicSolver}
              disabled={isOptimizing}
              leftIcon={<Cpu className="w-3.5 h-3.5" />}
              className="flex-1 text-xs"
            >
              {isOptimizing ? 'Solving...' : 'OR-Tools Allocation'}
            </Button>
          </div>
        </div>

        {/* Right Column (7 Cols): Timetable & Solved Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Conflict Analysis Badge Result */}
          {conflictResult && (
            <div
              className={`p-4 rounded-[12px] border ${
                conflictResult.is_error
                  ? 'bg-amber-50/80 border-amber-200'
                  : conflictResult.has_conflict
                  ? 'bg-red-50/80 border-red-200'
                  : 'bg-emerald-50/80 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {conflictResult.is_error ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : conflictResult.has_conflict ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span className={conflictResult.is_error ? 'text-amber-900' : conflictResult.has_conflict ? 'text-red-900' : 'text-emerald-900'}>
                    {conflictResult.is_error ? 'CONNECTION ERROR' : conflictResult.has_conflict ? 'CONFLICT DETECTED' : 'AVAILABLE'}
                  </span>
                </div>
                <Badge variant={conflictResult.is_error ? 'warning' : conflictResult.has_conflict ? 'critical' : 'success'} size="sm">
                  {conflictResult.is_error
                    ? '🟠 Unable to check conflict. Please verify the backend connection.'
                    : conflictResult.has_conflict
                    ? '🔴 CONFLICT DETECTED'
                    : '🟢 NO CONFLICT / AVAILABLE'}
                </Badge>
              </div>

              <p className="text-xs text-brand-warm-gray leading-relaxed mb-3">
                {conflictResult.message}
              </p>

              {/* Conflict Reasons */}
              {conflictResult.conflict_reasons.length > 0 && (
                <div className="space-y-1 bg-white/60 p-2.5 rounded-[8px] border border-red-200 text-xs text-red-800">
                  <span className="font-bold">Reasons:</span>
                  {conflictResult.conflict_reasons.map((r, i) => (
                    <p key={i}>• {r}</p>
                  ))}
                </div>
              )}

              {/* Alternative Recommendations */}
              {conflictResult.has_conflict && (
                <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                  {conflictResult.alternative_slots.length > 0 && (
                    <div className="bg-white/70 p-2.5 rounded-[8px] border border-brand-beige">
                      <span className="font-bold text-brand-burgundy block mb-1">ALTERNATIVE SLOT</span>
                      {conflictResult.alternative_slots.slice(0, 2).map((s, idx) => (
                        <p key={idx} className="text-[11px] text-brand-espresso">
                          {s.day} ({s.start_time}-{s.end_time})
                        </p>
                      ))}
                    </div>
                  )}

                  {conflictResult.alternative_venues.length > 0 && (
                    <div className="bg-white/70 p-2.5 rounded-[8px] border border-brand-beige">
                      <span className="font-bold text-brand-burgundy block mb-1">ALTERNATIVE VENUE</span>
                      {conflictResult.alternative_venues.slice(0, 2).map((v, idx) => (
                        <p key={idx} className="text-[11px] text-brand-espresso">
                          {v.venue_name} (Cap: {v.capacity})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* OR-Tools Optimization Output */}
          {ortoolsResult && (
            <div className="p-4 bg-brand-cream/80 border border-brand-burgundy/30 rounded-[12px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-brand-burgundy flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Google OR-Tools Recommended Allocation
                </span>
                <Badge variant="burgundy" size="sm">
                  {ortoolsResult.status}
                </Badge>
              </div>

              <div className="p-3 bg-brand-ivory rounded-[8px] border border-brand-beige space-y-1.5 text-xs text-brand-espresso">
                <div className="flex items-center justify-between font-bold">
                  <span>Selected Venue: {ortoolsResult.selected_venue_name}</span>
                  <span className="font-space font-extrabold text-brand-burgundy">
                    {ortoolsResult.selected_slot?.day || 'Monday'} ({ortoolsResult.selected_slot?.start_time || '14:00'}-{ortoolsResult.selected_slot?.end_time || '16:00'})
                  </span>
                </div>
                <p className="text-brand-warm-gray text-[11px] leading-relaxed">
                  {ortoolsResult.explanation}
                </p>
              </div>

              {ortoolsResult.rejection_summary && ortoolsResult.rejection_summary.length > 0 && (
                <div className="text-[11px] text-brand-warm-gray space-y-0.5">
                  <span className="font-semibold text-brand-espresso">Evaluated & Rejected Slots:</span>
                  {ortoolsResult.rejection_summary.map((rej, i) => (
                    <p key={i} className="truncate">
                      • {rej}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Academic Schedule Feed Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-brand-espresso uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-burgundy" /> Active Academic Schedule ({departmentCode} • {dayOfWeek})
            </h4>

            <div className="border border-brand-beige rounded-[10px] overflow-hidden bg-brand-ivory text-xs">
              {schedules.length === 0 ? (
                <p className="p-4 text-center text-brand-warm-gray">No class schedules found for {departmentCode} on {dayOfWeek}.</p>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-brand-cream/60 border-b border-brand-beige text-[11px] font-bold text-brand-espresso uppercase">
                    <tr>
                      <th className="py-2 px-3">Time</th>
                      <th className="py-2 px-3">Subject / Activity</th>
                      <th className="py-2 px-3">Semester</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige/50 text-brand-espresso">
                    {schedules.map((s) => (
                      <tr key={s.id} className="hover:bg-brand-cream/30">
                        <td className="py-2 px-3 font-mono font-bold text-brand-burgundy shrink-0">
                          {s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)}
                        </td>
                        <td className="py-2 px-3 font-semibold">{s.subject_activity}</td>
                        <td className="py-2 px-3 font-mono">Sem {s.semester || 5} ({s.section || 'A'})</td>
                        <td className="py-2 px-3">
                          <Badge variant="warning" size="sm">
                            Class In Session
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AcademicScheduleSection;
