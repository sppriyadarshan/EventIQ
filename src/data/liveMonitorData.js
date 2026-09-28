/**
 * EventIQ Enhanced Live Event Monitor Baseline Dataset
 * Baseline live telemetry datasets for active and upcoming events.
 */

export const liveEventsBaseline = [
  {
    id: 'live-evt-1',
    name: 'Tech Innovators Summit 2026',
    eventType: 'Conference',
    date: 'Oct 24, 2026',
    location: 'Grand Convention Hall',
    status: 'In Progress',
    expectedAttendance: 1400,
    currentCheckIns: 1120,
    venueCapacity: 1500,
    eventStartTime: '08:30 AM',
    eventEndTime: '05:30 PM',
    currentEventPhase: 'Check-In', // Pre-Event, Check-In, Main Session, Break, Networking, Closing
    eventHealth: 'Healthy', // Excellent, Healthy, Needs Attention, Critical

    staffAssigned: 20,
    staffActive: 18,
    staffRequired: 20,
    equipmentTotal: 45,
    equipmentOperational: 42,
    budgetAllocated: 450000,
    budgetSpent: 306000,
    lastUpdated: '10:42 AM',

    attendanceTimeline: [
      { time: '08:30 AM', checkIns: 180, expected: 200 },
      { time: '09:00 AM', checkIns: 450, expected: 500 },
      { time: '09:30 AM', checkIns: 780, expected: 850 },
      { time: '10:00 AM', checkIns: 980, expected: 1100 },
      { time: '10:30 AM', checkIns: 1120, expected: 1250 },
    ],

    activityFeed: [
      { id: 'act-101', time: '10:41 AM', text: 'VIP Delegate Group (12 attendees) checked in at Gate A.', category: 'Check-In', icon: 'UserCheck' },
      { id: 'act-102', time: '10:38 AM', text: 'Main Auditorium seating capacity reached 75%.', category: 'Venue', icon: 'Building' },
      { id: 'act-103', time: '10:30 AM', text: 'AV Technician assigned to Stage Left wireless mic testing.', category: 'Staff', icon: 'Users' },
      { id: 'act-104', time: '10:15 AM', text: 'Registration Badge Scanner Unit #03 reconnected.', category: 'Equipment', icon: 'Boxes' },
      { id: 'act-105', time: '09:50 AM', text: 'Keynote Speaker Dr. Aris Vance arrived at Green Room.', category: 'Protocol', icon: 'Award' },
    ],

    alerts: [
      {
        id: 'alt-101',
        title: 'Registration Gate A Queue Warning',
        severity: 'Warning', // Information, Warning, Critical
        description: 'Check-in throughput at Gate A experienced 4-minute delay due to badge printing.',
        affectedArea: 'Main Lobby Entrance',
        recommendedAction: 'Deploy Fast-Track QR Scanner #2.',
        acknowledged: false,
        timestamp: '10:35 AM',
      },
      {
        id: 'alt-102',
        title: 'Audio Frequency Calibration Needed',
        severity: 'Information',
        description: 'Room 2 wireless lapel mic frequency calibration requested by presenter.',
        affectedArea: 'Breakout Room 2',
        recommendedAction: 'Send Tech Support Lead to Room 2.',
        acknowledged: false,
        timestamp: '10:20 AM',
      },
    ],

    phases: [
      { name: 'Pre-Event', status: 'Completed', time: '07:00 AM - 08:30 AM' },
      { name: 'Check-In', status: 'Active', time: '08:30 AM - 10:30 AM' },
      { name: 'Main Session', status: 'Upcoming', time: '10:30 AM - 01:00 PM' },
      { name: 'Break', status: 'Upcoming', time: '01:00 PM - 02:00 PM' },
      { name: 'Networking', status: 'Upcoming', time: '02:00 PM - 04:30 PM' },
      { name: 'Closing', status: 'Upcoming', time: '04:30 PM - 05:30 PM' },
    ],
  },

  {
    id: 'live-evt-2',
    name: 'Startup Connect 2026',
    eventType: 'Networking',
    date: 'Nov 12, 2026',
    location: 'Innovation Center',
    status: 'In Progress',
    expectedAttendance: 450,
    currentCheckIns: 410,
    venueCapacity: 500,
    eventStartTime: '09:00 AM',
    eventEndTime: '04:00 PM',
    currentEventPhase: 'Main Session',
    eventHealth: 'Excellent',

    staffAssigned: 12,
    staffActive: 12,
    staffRequired: 12,
    equipmentTotal: 30,
    equipmentOperational: 29,
    budgetAllocated: 280000,
    budgetSpent: 196000,
    lastUpdated: '11:15 AM',

    attendanceTimeline: [
      { time: '09:00 AM', checkIns: 120, expected: 150 },
      { time: '09:30 AM', checkIns: 280, expected: 300 },
      { time: '10:00 AM', checkIns: 370, expected: 400 },
      { time: '10:30 AM', checkIns: 410, expected: 430 },
    ],

    activityFeed: [
      { id: 'act-201', time: '11:12 AM', text: 'Speed Pitch Session #2 started in Main Arena.', category: 'Session', icon: 'Zap' },
      { id: 'act-202', time: '11:05 AM', text: 'Investor Meeting Room 3 reservations reached 100%.', category: 'Venue', icon: 'Building' },
      { id: 'act-203', time: '10:45 AM', text: 'Digital Founder Feedback Tablet #04 deployed.', category: 'Equipment', icon: 'Boxes' },
    ],

    alerts: [
      {
        id: 'alt-201',
        title: 'Pitch Stage Audio Spillover',
        severity: 'Warning',
        description: 'Main pitch stage speaker volume spilling into quiet meeting booth area.',
        affectedArea: 'Booth Area B',
        recommendedAction: 'Lower main stage equalizer gain by 3dB.',
        acknowledged: false,
        timestamp: '11:00 AM',
      },
    ],

    phases: [
      { name: 'Pre-Event', status: 'Completed', time: '08:00 AM - 09:00 AM' },
      { name: 'Check-In', status: 'Completed', time: '09:00 AM - 10:00 AM' },
      { name: 'Main Session', status: 'Active', time: '10:00 AM - 12:30 PM' },
      { name: 'Break', status: 'Upcoming', time: '12:30 PM - 01:30 PM' },
      { name: 'Networking', status: 'Upcoming', time: '01:30 PM - 03:30 PM' },
      { name: 'Closing', status: 'Upcoming', time: '03:30 PM - 04:00 PM' },
    ],
  },

  {
    id: 'live-evt-3',
    name: 'Leadership Forum 2026',
    eventType: 'Conference',
    date: 'Dec 05, 2026',
    location: 'Riverside Auditorium',
    status: 'Pre-Event',
    expectedAttendance: 600,
    currentCheckIns: 45,
    venueCapacity: 650,
    eventStartTime: '01:00 PM',
    eventEndTime: '06:00 PM',
    currentEventPhase: 'Pre-Event',
    eventHealth: 'Needs Attention',

    staffAssigned: 16,
    staffActive: 10,
    staffRequired: 16,
    equipmentTotal: 35,
    equipmentOperational: 28,
    budgetAllocated: 600000,
    budgetSpent: 420000,
    lastUpdated: '11:30 AM',

    attendanceTimeline: [
      { time: '11:00 AM', checkIns: 15, expected: 20 },
      { time: '11:30 AM', checkIns: 45, expected: 50 },
    ],

    activityFeed: [
      { id: 'act-301', time: '11:28 AM', text: 'Pre-registration desk opened for early executive arrivals.', category: 'Check-In', icon: 'UserCheck' },
      { id: 'act-302', time: '11:15 AM', text: 'VIP Stage microphone testing in progress.', category: 'Equipment', icon: 'Boxes' },
    ],

    alerts: [
      {
        id: 'alt-301',
        title: 'Staffing Deficit at VIP Desk',
        severity: 'Warning',
        description: 'VIP liaison team is short by 6 staff members before main check-in window.',
        affectedArea: 'VIP Reception Desk',
        recommendedAction: 'Reassign 6 Operations Staff from Hall B.',
        acknowledged: false,
        timestamp: '11:20 AM',
      },
      {
        id: 'alt-302',
        title: 'Hybrid Streaming Encoder Buffer Lag',
        severity: 'Critical',
        description: 'Encoder Unit #01 experiencing latency during dry-run stream.',
        affectedArea: 'Technical Audio Setup',
        recommendedAction: 'Switch to backup fiber connection.',
        acknowledged: false,
        timestamp: '11:10 AM',
      },
    ],

    phases: [
      { name: 'Pre-Event', status: 'Active', time: '11:00 AM - 01:00 PM' },
      { name: 'Check-In', status: 'Upcoming', time: '01:00 PM - 02:00 PM' },
      { name: 'Main Session', status: 'Upcoming', time: '02:00 PM - 04:30 PM' },
      { name: 'Break', status: 'Upcoming', time: '04:30 PM - 05:00 PM' },
      { name: 'Networking', status: 'Upcoming', time: '05:00 PM - 05:45 PM' },
      { name: 'Closing', status: 'Upcoming', time: '05:45 PM - 06:00 PM' },
    ],
  },
];

export default liveEventsBaseline;
