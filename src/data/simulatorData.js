/**
 * EventIQ What-If Event Simulator Baseline Dataset
 * Baseline simulation metrics for 4 upcoming events.
 */

export const simulatorEventsBaseline = [
  {
    id: 'sim-evt-1',
    name: 'Tech Innovators Summit 2026',
    eventType: 'Conference',
    date: 'Oct 24, 2026',
    location: 'Grand Convention Hall',

    // Baseline variables
    currentExpectedAttendance: 1400,
    venueCapacity: 1500,
    currentBudget: 450000,
    currentBudgetSpent: 360000,
    staffAssigned: 18,
    staffRequired: 22,
    equipmentAvailability: 85,
    currentEngagement: 'Standard', // Basic, Standard, Enhanced
    resourceUtilization: 78,
    eventReadiness: 76,
    currentOptimizationScore: 74,

    // Min/Max Limits for Controls
    limits: {
      attendance: { min: 200, max: 2500, step: 25 },
      budget: { min: 100000, max: 1000000, step: 10000 },
      staff: { min: 5, max: 50, step: 1 },
      capacity: { min: 300, max: 3000, step: 50 },
      equipment: { min: 20, max: 100, step: 5 },
    },
  },

  {
    id: 'sim-evt-2',
    name: 'Startup Connect 2026',
    eventType: 'Networking',
    date: 'Nov 12, 2026',
    location: 'Innovation Center',

    currentExpectedAttendance: 450,
    venueCapacity: 500,
    currentBudget: 280000,
    currentBudgetSpent: 195000,
    staffAssigned: 12,
    staffRequired: 12,
    equipmentAvailability: 75,
    currentEngagement: 'Standard',
    resourceUtilization: 75,
    eventReadiness: 81,
    currentOptimizationScore: 81,

    limits: {
      attendance: { min: 100, max: 1000, step: 10 },
      budget: { min: 50000, max: 600000, step: 5000 },
      staff: { min: 4, max: 30, step: 1 },
      capacity: { min: 150, max: 1200, step: 25 },
      equipment: { min: 30, max: 100, step: 5 },
    },
  },

  {
    id: 'sim-evt-3',
    name: 'Leadership Forum 2026',
    eventType: 'Conference',
    date: 'Dec 05, 2026',
    location: 'Riverside Auditorium',

    currentExpectedAttendance: 600,
    venueCapacity: 650,
    currentBudget: 600000,
    currentBudgetSpent: 480000,
    staffAssigned: 12,
    staffRequired: 16,
    equipmentAvailability: 70,
    currentEngagement: 'Basic',
    resourceUtilization: 70,
    eventReadiness: 68,
    currentOptimizationScore: 68,

    limits: {
      attendance: { min: 100, max: 1200, step: 20 },
      budget: { min: 150000, max: 1200000, step: 10000 },
      staff: { min: 4, max: 35, step: 1 },
      capacity: { min: 200, max: 1500, step: 25 },
      equipment: { min: 20, max: 100, step: 5 },
    },
  },

  {
    id: 'sim-evt-4',
    name: 'Innovation Workshop 2026',
    eventType: 'Workshop',
    date: 'Jan 18, 2027',
    location: 'Business Conference Room',

    currentExpectedAttendance: 120,
    venueCapacity: 150,
    currentBudget: 120000,
    currentBudgetSpent: 85000,
    staffAssigned: 6,
    staffRequired: 6,
    equipmentAvailability: 92,
    currentEngagement: 'Enhanced',
    resourceUtilization: 92,
    eventReadiness: 89,
    currentOptimizationScore: 89,

    limits: {
      attendance: { min: 20, max: 300, step: 5 },
      budget: { min: 30000, max: 300000, step: 5000 },
      staff: { min: 2, max: 15, step: 1 },
      capacity: { min: 40, max: 400, step: 10 },
      equipment: { min: 40, max: 100, step: 5 },
    },
  },
];

export default simulatorEventsBaseline;
