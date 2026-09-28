import React, { useState, useEffect, useRef, useMemo } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import LiveMonitorPageHeader from '../../components/live-monitor/LiveMonitorPageHeader';
import LiveEventStatusBar from '../../components/live-monitor/LiveEventStatusBar';
import LiveMonitorControls from '../../components/live-monitor/LiveMonitorControls';
import LiveMetricCards from '../../components/live-monitor/LiveMetricCards';
import LiveAttendanceChart from '../../components/live-monitor/LiveAttendanceChart';
import AttendanceProgressCard from '../../components/live-monitor/AttendanceProgressCard';
import EventHealthCard from '../../components/live-monitor/EventHealthCard';
import LiveResourceStatus from '../../components/live-monitor/LiveResourceStatus';
import EventPhaseTimeline from '../../components/live-monitor/EventPhaseTimeline';
import LiveAlertsPanel from '../../components/live-monitor/LiveAlertsPanel';
import LiveEventInsights from '../../components/live-monitor/LiveEventInsights';
import EventActivityFeed from '../../components/live-monitor/EventActivityFeed';

import { liveEventsBaseline } from '../../data/liveMonitorData';
import { Info, X } from 'lucide-react';

// Helper to deep clone dataset objects safely without mutating original module exports
const deepCloneEvents = () => {
  const map = {};
  liveEventsBaseline.forEach((evt) => {
    map[evt.id] = JSON.parse(JSON.stringify(evt));
  });
  return map;
};

// Deterministic Pool of Sample Activity Items to append sequentially
const sampleActivityPool = [
  { text: 'Registration Counter 02 scanned 5 delegate QR badges.', category: 'Check-In', icon: 'UserCheck' },
  { text: 'Audio Visual Tech Lead completed secondary room sound check.', category: 'Equipment', icon: 'Boxes' },
  { text: 'Main Auditorium seating capacity reached 82%.', category: 'Venue', icon: 'Building' },
  { text: 'VIP Escort Staff assigned to arrival gate.', category: 'Staff', icon: 'Users' },
  { text: 'Registration Counter 04 badge printer paper refilled.', category: 'Check-In', icon: 'UserCheck' },
  { text: 'Live Q&A mobile app submission count reached 150.', category: 'Session', icon: 'Zap' },
];

export const LiveMonitorPage = () => {
  const [selectedEventId, setSelectedEventId] = useState(
    liveEventsBaseline[0]?.id || 'live-evt-1'
  );

  // Per-Event Independent State Map (cloned from baseline)
  const [eventsStateMap, setEventsStateMap] = useState(() => deepCloneEvents());

  // Acknowledged Alerts state map: { [eventId]: Set<alertId> }
  const [acknowledgedAlertsMap, setAcknowledgedAlertsMap] = useState({});

  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [sessionNotice, setSessionNotice] = useState(
    'Demo Mode — Live monitoring updates are simulated deterministically for this session.'
  );
  const [lastUpdated, setLastUpdated] = useState('Just now');

  // React useRef to safely store single simulation timer reference
  const timerRef = useRef(null);

  // Step counter for deterministic sample activity pool picking
  const stepCountRef = useRef(0);

  // Active event state object
  const currentEvent = useMemo(() => {
    return eventsStateMap[selectedEventId] || liveEventsBaseline[0];
  }, [eventsStateMap, selectedEventId]);

  // Acknowledged alert set for current event
  const currentAckAlerts = useMemo(() => {
    return acknowledgedAlertsMap[selectedEventId] || new Set();
  }, [acknowledgedAlertsMap, selectedEventId]);

  // Safe Interval Teardown Helper
  const stopSimulationTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Deterministic Demo Simulation Engine Effect
  useEffect(() => {
    // 1. Always clear any previous timer first
    stopSimulationTimer();

    // 2. Start new timer if updating is active
    if (isLiveUpdating) {
      timerRef.current = setInterval(() => {
        setEventsStateMap((prevMap) => {
          const targetEvt = prevMap[selectedEventId];
          if (!targetEvt) return prevMap;

          // Deterministic check-in increment (+3 per tick until reaching max expected)
          const newCheckIns = Math.min(
            targetEvt.currentCheckIns + 3,
            targetEvt.expectedAttendance
          );

          // Format timestamp string
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });

          // Deterministic activity pool selection
          const poolIdx = stepCountRef.current % sampleActivityPool.length;
          stepCountRef.current += 1;
          const poolItem = sampleActivityPool[poolIdx];

          const newActivity = {
            id: `act-live-${Date.now()}-${stepCountRef.current}`,
            time: timeString,
            text: poolItem.text,
            category: poolItem.category,
            icon: poolItem.icon,
          };

          // Maintain max 15 items in activity feed FIFO queue
          const updatedFeed = [newActivity, ...(targetEvt.activityFeed || [])].slice(0, 15);

          // Update timeline last point
          const updatedTimeline = [...(targetEvt.attendanceTimeline || [])];
          if (updatedTimeline.length > 0) {
            updatedTimeline[updatedTimeline.length - 1] = {
              ...updatedTimeline[updatedTimeline.length - 1],
              checkIns: newCheckIns,
            };
          }

          setLastUpdated(timeString);

          return {
            ...prevMap,
            [selectedEventId]: {
              ...targetEvt,
              currentCheckIns: newCheckIns,
              activityFeed: updatedFeed,
              attendanceTimeline: updatedTimeline,
              lastUpdated: timeString,
            },
          };
        });
      }, 4000); // 4-second tick
    }

    // Cleanup on unmount, pause, or event change
    return () => {
      stopSimulationTimer();
    };
  }, [selectedEventId, isLiveUpdating]);

  // Event Selector Handler
  const handleSelectEvent = (newId) => {
    stopSimulationTimer();
    setSelectedEventId(newId);
    setLastUpdated('Just now');
  };

  // Pause Handler
  const handlePause = () => {
    stopSimulationTimer();
    setIsLiveUpdating(false);
    setSessionNotice('Live demo updates paused. Current telemetry state preserved.');
  };

  // Resume Handler
  const handleResume = () => {
    stopSimulationTimer();
    setIsLiveUpdating(true);
    setSessionNotice('Live demo updates resumed.');
  };

  // Reset Handler
  const handleReset = () => {
    stopSimulationTimer();
    const freshMap = deepCloneEvents();
    setEventsStateMap(freshMap);
    setAcknowledgedAlertsMap({});
    stepCountRef.current = 0;
    setLastUpdated('Just now');
    setSessionNotice('Live demo has been reset to the original sample data.');
  };

  // Alert Acknowledge Handler
  const handleAcknowledgeAlert = (alertId) => {
    setAcknowledgedAlertsMap((prev) => {
      const existing = new Set(prev[selectedEventId] || []);
      existing.add(alertId);
      return {
        ...prev,
        [selectedEventId]: existing,
      };
    });
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12">
      {/* Session Toast Notice */}
      {sessionNotice && (
        <div className="bg-sand/80 border border-espresso/15 text-espresso text-xs font-outfit px-4 py-2.5 rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-burgundy shrink-0" />
            <span>{sessionNotice}</span>
          </div>
          <button
            onClick={() => setSessionNotice(null)}
            className="text-espresso/50 hover:text-espresso p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header */}
      <LiveMonitorPageHeader
        events={liveEventsBaseline}
        selectedEventId={selectedEventId}
        onSelectEvent={handleSelectEvent}
        isLiveUpdating={isLiveUpdating}
        lastUpdated={lastUpdated}
      />

      {/* 2. Live Status Bar */}
      <LiveEventStatusBar event={currentEvent} />

      {/* 3. Pause / Resume / Reset Controls */}
      <LiveMonitorControls
        isLiveUpdating={isLiveUpdating}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
      />

      {/* 4. Live KPI Metric Cards */}
      <LiveMetricCards event={currentEvent} />

      {/* 5. Live Attendance Chart & Attendance Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LiveAttendanceChart event={currentEvent} />
        </div>
        <div className="lg:col-span-4">
          <AttendanceProgressCard event={currentEvent} />
        </div>
      </div>

      {/* 6. Overall Event Health & Resource Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <EventHealthCard event={currentEvent} />
        </div>
        <div className="lg:col-span-7">
          <LiveResourceStatus event={currentEvent} />
        </div>
      </div>

      {/* 7. Event Phase Progression Timeline */}
      <EventPhaseTimeline event={currentEvent} />

      {/* 8. Live Alerts Panel */}
      <LiveAlertsPanel
        alerts={currentEvent.alerts || []}
        acknowledgedAlerts={currentAckAlerts}
        onAcknowledgeAlert={handleAcknowledgeAlert}
      />

      {/* 9. Live Event Smart Insights */}
      <LiveEventInsights event={currentEvent} />

      {/* 10. Live Activity Stream Feed */}
      <EventActivityFeed activityFeed={currentEvent.activityFeed || []} />
    </PageContainer>
  );
};

export default LiveMonitorPage;
