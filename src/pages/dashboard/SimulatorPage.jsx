import React, { useState, useMemo, useEffect } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import SimulatorPageHeader from '../../components/simulator/SimulatorPageHeader';
import SimulationScenarioSummary from '../../components/simulator/SimulationScenarioSummary';
import ScenarioControls from '../../components/simulator/ScenarioControls';
import SimulationScoreCard from '../../components/simulator/SimulationScoreCard';
import SimulationResults from '../../components/simulator/SimulationResults';
import ScenarioImpactAnalysis from '../../components/simulator/ScenarioImpactAnalysis';
import ScenarioComparison from '../../components/simulator/ScenarioComparison';
import ScenarioRiskAnalysis from '../../components/simulator/ScenarioRiskAnalysis';
import SimulationRecommendations from '../../components/simulator/SimulationRecommendations';
import Button from '../../components/ui/Button';
import { useEventIQ } from '../../context/EventIQContext';
import { simulatorEventsBaseline } from '../../data/simulatorData';
import { Info, X, Check } from 'lucide-react';

export const SimulatorPage = () => {
  const { updateEvent, addNotification } = useEventIQ();
  const [selectedEventId, setSelectedEventId] = useState(
    simulatorEventsBaseline[0]?.id || 'sim-evt-1'
  );

  // Baseline event object
  const baselineEvent = useMemo(() => {
    return (
      simulatorEventsBaseline.find((e) => e.id === selectedEventId) ||
      simulatorEventsBaseline[0]
    );
  }, [selectedEventId]);

  // Simulation controls state (initialized from baseline)
  const [simValues, setSimValues] = useState({
    attendance: baselineEvent.currentExpectedAttendance,
    budget: baselineEvent.currentBudget,
    staff: baselineEvent.staffAssigned,
    capacity: baselineEvent.venueCapacity,
    equipment: baselineEvent.equipmentAvailability,
    engagement: baselineEvent.currentEngagement,
  });

  const [sessionNotice, setSessionNotice] = useState(
    'Centralized State — Adjust scenario parameters and apply changes to update the event store.'
  );

  // Sync state when event changes
  useEffect(() => {
    setSimValues({
      attendance: baselineEvent.currentExpectedAttendance,
      budget: baselineEvent.currentBudget,
      staff: baselineEvent.staffAssigned,
      capacity: baselineEvent.venueCapacity,
      equipment: baselineEvent.equipmentAvailability,
      engagement: baselineEvent.currentEngagement,
    });
  }, [baselineEvent]);

  // Handle variable state update
  const handleControlChange = (field, value) => {
    setSimValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset simulation handler
  const handleReset = () => {
    setSimValues({
      attendance: baselineEvent.currentExpectedAttendance,
      budget: baselineEvent.currentBudget,
      staff: baselineEvent.staffAssigned,
      capacity: baselineEvent.venueCapacity,
      equipment: baselineEvent.equipmentAvailability,
      engagement: baselineEvent.currentEngagement,
    });
    setSessionNotice('Simulation reset to the original event plan.');
  };

  // Apply simulation scenario to central event store
  const handleApplyScenario = () => {
    updateEvent(baselineEvent.id, {
      expectedAttendance: simValues.attendance,
      capacity: simValues.capacity,
    });
    addNotification({
      title: 'Scenario Committed to Store',
      message: `Updated ${baselineEvent.name} with ${simValues.attendance} attendance and ${simValues.capacity} capacity.`,
      type: 'info',
    });
    setSessionNotice(`Scenario applied! Updated attendance (${simValues.attendance}) and capacity (${simValues.capacity}) in central store.`);
  };

  // --- DETERMINISTIC SIMULATION CALCULATIONS ---

  // 1. Venue Utilization
  const venueUtilization = useMemo(() => {
    if (!simValues.capacity) return 0;
    return (simValues.attendance / simValues.capacity) * 100;
  }, [simValues.attendance, simValues.capacity]);

  const venueStatus = useMemo(() => {
    if (venueUtilization > 100) return 'Capacity Overload';
    if (venueUtilization >= 90) return 'High Capacity';
    if (venueUtilization >= 60) return 'Healthy';
    return 'Underutilized';
  }, [venueUtilization]);

  // 2. Staff Requirements & Readiness
  const staffRequired = useMemo(() => {
    const baseReq = Math.round(simValues.attendance / 65);
    const bonus = simValues.engagement === 'Enhanced' ? 3 : simValues.engagement === 'Standard' ? 1 : 0;
    return Math.max(baseReq + bonus, 2);
  }, [simValues.attendance, simValues.engagement]);

  const staffReadiness = useMemo(() => {
    return Math.min((simValues.staff / staffRequired) * 100, 100);
  }, [simValues.staff, staffRequired]);

  // 3. Budget Efficiency
  const budgetRequired = useMemo(() => {
    const staffCost = staffRequired * 12000;
    const equipCost = (simValues.equipment / 100) * 60000;
    const engCost = simValues.engagement === 'Enhanced' ? 60000 : simValues.engagement === 'Standard' ? 30000 : 10000;
    return staffCost + equipCost + engCost;
  }, [staffRequired, simValues.equipment, simValues.engagement]);

  const budgetEfficiency = useMemo(() => {
    if (!budgetRequired) return 100;
    return Math.min((simValues.budget / budgetRequired) * 100, 100);
  }, [simValues.budget, budgetRequired]);

  // 4. Equipment Readiness
  const equipmentReadiness = useMemo(() => {
    return Math.min(simValues.equipment, 100);
  }, [simValues.equipment]);

  // 5. Predicted Engagement Score
  const predictedEngagement = useMemo(() => {
    let score = 70;
    if (simValues.engagement === 'Enhanced') score += 22;
    else if (simValues.engagement === 'Standard') score += 12;
    else score += 4;

    if (venueUtilization > 95) score -= 8;
    return Math.min(Math.max(score, 0), 100);
  }, [simValues.engagement, venueUtilization]);

  // 6. Overall Event Readiness Score
  const overallScore = useMemo(() => {
    let score = 0;
    score += venueUtilization >= 60 && venueUtilization <= 90 ? 25 : venueUtilization > 90 && venueUtilization <= 100 ? 20 : 10;
    score += (staffReadiness / 100) * 25;
    score += (budgetEfficiency / 100) * 20;
    score += (equipmentReadiness / 100) * 15;
    score += (predictedEngagement / 100) * 15;
    return Math.min(Math.max(Math.round(score), 0), 100);
  }, [venueUtilization, staffReadiness, budgetEfficiency, equipmentReadiness, predictedEngagement]);

  const scoreStatus = useMemo(() => {
    if (overallScore >= 90) return 'Excellent';
    if (overallScore >= 75) return 'Good';
    if (overallScore >= 60) return 'Needs Improvement';
    return 'High Risk';
  }, [overallScore]);

  // Scenario Health Status
  const healthStatus = useMemo(() => {
    if (venueUtilization > 100 || staffReadiness < 60 || budgetEfficiency < 60) return 'High Risk';
    if (venueUtilization > 90 || staffReadiness < 80 || budgetEfficiency < 80) return 'Needs Attention';
    if (overallScore >= 85) return 'Healthy';
    return 'Balanced';
  }, [venueUtilization, staffReadiness, budgetEfficiency, overallScore]);

  // Helper change strings
  const getChangeStr = (simVal, baseVal, isPct = false) => {
    const diff = simVal - baseVal;
    if (diff === 0) return '0%';
    const prefix = diff > 0 ? '+' : '';
    return isPct ? `${prefix}${diff.toFixed(1)}%` : `${prefix}${diff}`;
  };

  // Compiled Results Object
  const simulationResults = useMemo(() => {
    const baseVenueUtil = (baselineEvent.currentExpectedAttendance / baselineEvent.venueCapacity) * 100;
    const baseStaffReadiness = Math.min((baselineEvent.staffAssigned / baselineEvent.staffRequired) * 100, 100);

    return {
      attendance: {
        simulated: simValues.attendance,
        changeStr: getChangeStr(simValues.attendance, baselineEvent.currentExpectedAttendance),
        status: simValues.attendance > baselineEvent.venueCapacity ? 'Exceeds Capacity' : 'Normal',
      },
      venueUtilization: {
        simulated: venueUtilization,
        changeStr: getChangeStr(venueUtilization, baseVenueUtil, true),
        status: venueStatus,
      },
      budgetEfficiency: {
        simulated: budgetEfficiency,
        changeStr: getChangeStr(budgetEfficiency, 80, true),
        status: budgetEfficiency >= 85 ? 'Optimal' : 'Needs Review',
      },
      resourceReadiness: {
        simulated: (staffReadiness + equipmentReadiness) / 2,
        changeStr: getChangeStr((staffReadiness + equipmentReadiness) / 2, (baseStaffReadiness + baselineEvent.equipmentAvailability) / 2, true),
        status: staffReadiness >= 85 ? 'Healthy' : 'Needs Attention',
      },
      engagementScore: {
        simulated: predictedEngagement,
        changeStr: getChangeStr(predictedEngagement, baselineEvent.currentEngagement === 'Enhanced' ? 90 : 78, true),
        status: predictedEngagement >= 85 ? 'Optimal' : 'Good',
      },
      overallScore: {
        simulated: overallScore,
        changeStr: getChangeStr(overallScore, baselineEvent.currentOptimizationScore),
        status: scoreStatus,
      },
    };
  }, [simValues, baselineEvent, venueUtilization, venueStatus, budgetEfficiency, staffReadiness, equipmentReadiness, predictedEngagement, overallScore, scoreStatus]);

  // Dynamic Impact Items
  const impactItems = useMemo(() => {
    const baseVenueUtil = ((baselineEvent.currentExpectedAttendance / baselineEvent.venueCapacity) * 100).toFixed(1);

    return [
      {
        category: 'Attendance & Flow',
        baseline: `${baselineEvent.currentExpectedAttendance} guests`,
        simulated: `${simValues.attendance} guests`,
        status: simValues.attendance > simValues.capacity ? 'High Risk' : 'Healthy',
        explanation: simValues.attendance > simValues.capacity
          ? `Expected attendance exceeds venue seating capacity by ${simValues.attendance - simValues.capacity} guests!`
          : `Attendance is well accommodated within the ${simValues.capacity}-seat venue layout.`,
      },
      {
        category: 'Venue Seating Capacity',
        baseline: `${baseVenueUtil}% capacity`,
        simulated: `${venueUtilization.toFixed(1)}% capacity`,
        status: venueStatus,
        explanation: venueUtilization > 100
          ? 'Venue capacity is overloaded. Additional seating or secondary hall required.'
          : venueUtilization >= 90
          ? 'Venue seating is nearly full (90%+). High crowding probability.'
          : 'Seating density allows comfortable attendee flow and aisle access.',
      },
      {
        category: 'Staffing Sufficiency',
        baseline: `${baselineEvent.staffAssigned} assigned`,
        simulated: `${simValues.staff} assigned (Req: ${staffRequired})`,
        status: staffReadiness >= 90 ? 'Healthy' : 'Needs Attention',
        explanation: simValues.staff < staffRequired
          ? `Staffing is short by ${staffRequired - simValues.staff} members for projected ${simValues.attendance} guests.`
          : `Sufficient staff assigned to maintain check-in and stage operations.`,
      },
      {
        category: 'Budget Allocation',
        baseline: `₹${baselineEvent.currentBudget.toLocaleString('en-IN')}`,
        simulated: `₹${simValues.budget.toLocaleString('en-IN')}`,
        status: budgetEfficiency >= 85 ? 'Optimal' : 'Needs Review',
        explanation: budgetEfficiency < 80
          ? 'Simulated budget is tight relative to resource and staffing requirements.'
          : 'Budget allocation is sufficient for planned operations.',
      },
      {
        category: 'Equipment Readiness',
        baseline: `${baselineEvent.equipmentAvailability}% available`,
        simulated: `${simValues.equipment}% available`,
        status: equipmentReadiness >= 85 ? 'Healthy' : 'Needs Attention',
        explanation: equipmentReadiness < 80
          ? 'Equipment readiness lag detected. Pre-event AV testing recommended.'
          : 'AV projectors and sound systems are fully operational.',
      },
      {
        category: 'Attendee Engagement',
        baseline: baselineEvent.currentEngagement,
        simulated: `${simValues.engagement} (${predictedEngagement.toFixed(0)}%)`,
        status: predictedEngagement >= 85 ? 'Optimal' : 'Good',
        explanation: simValues.engagement === 'Enhanced'
          ? 'Enhanced strategy uses interactive Q&A and matchmaking to drive maximum participation.'
          : 'Standard strategy provides baseline app notifications and live polling.',
      },
    ];
  }, [baselineEvent, simValues, venueUtilization, venueStatus, staffRequired, staffReadiness, budgetEfficiency, equipmentReadiness, predictedEngagement]);

  // Dynamic Comparison Rows
  const comparisonRows = useMemo(() => {
    const baseVenueUtil = ((baselineEvent.currentExpectedAttendance / baselineEvent.venueCapacity) * 100).toFixed(1);
    const baseStaffReadiness = Math.min((baselineEvent.staffAssigned / baselineEvent.staffRequired) * 100, 100).toFixed(0);

    return [
      {
        label: 'Expected Attendance',
        baseline: `${baselineEvent.currentExpectedAttendance}`,
        simulated: `${simValues.attendance}`,
        changeStr: getChangeStr(simValues.attendance, baselineEvent.currentExpectedAttendance),
      },
      {
        label: 'Venue Capacity Utilization',
        baseline: `${baseVenueUtil}%`,
        simulated: `${venueUtilization.toFixed(1)}%`,
        changeStr: getChangeStr(venueUtilization, parseFloat(baseVenueUtil), true),
      },
      {
        label: 'Budget Allocation',
        baseline: `₹${baselineEvent.currentBudget.toLocaleString('en-IN')}`,
        simulated: `₹${simValues.budget.toLocaleString('en-IN')}`,
        changeStr: getChangeStr(simValues.budget, baselineEvent.currentBudget),
      },
      {
        label: 'Staff Readiness',
        baseline: `${baseStaffReadiness}%`,
        simulated: `${staffReadiness.toFixed(0)}%`,
        changeStr: getChangeStr(staffReadiness, parseFloat(baseStaffReadiness), true),
      },
      {
        label: 'Equipment Readiness',
        baseline: `${baselineEvent.equipmentAvailability}%`,
        simulated: `${simValues.equipment}%`,
        changeStr: getChangeStr(simValues.equipment, baselineEvent.equipmentAvailability, true),
      },
      {
        label: 'Engagement Strategy',
        baseline: baselineEvent.currentEngagement,
        simulated: simValues.engagement,
        changeStr: simValues.engagement !== baselineEvent.currentEngagement ? 'Modified' : '0%',
      },
      {
        label: 'Overall Readiness Score',
        baseline: `${baselineEvent.currentOptimizationScore} pts`,
        simulated: `${overallScore} pts`,
        changeStr: getChangeStr(overallScore, baselineEvent.currentOptimizationScore),
      },
    ];
  }, [baselineEvent, simValues, venueUtilization, staffReadiness, overallScore]);

  // Dynamic Risks
  const dynamicRisks = useMemo(() => {
    const list = [];

    if (venueUtilization > 100) {
      list.push({
        title: 'Venue Overcapacity Risk',
        severity: 'High',
        description: `Simulated attendance (${simValues.attendance}) exceeds venue capacity (${simValues.capacity}) by ${simValues.attendance - simValues.capacity} guests.`,
        affectedArea: 'Main Hall & Safety Clearance',
        recommendedAction: 'Increase venue capacity limit or cap ticket registrations immediately.',
      });
    } else if (venueUtilization >= 90) {
      list.push({
        title: 'Near Venue Capacity Warning',
        severity: 'Medium',
        description: `Venue utilization is at ${venueUtilization.toFixed(1)}%. Overflow seating may be required.`,
        affectedArea: 'Seating & Entrance Flow',
        recommendedAction: 'Prepare secondary hall overflow live stream.',
      });
    }

    if (simValues.staff < staffRequired) {
      list.push({
        title: 'Staff Shortage Deficit',
        severity: 'High',
        description: `Assigned staff (${simValues.staff}) is below the required count (${staffRequired}) for ${simValues.attendance} attendees.`,
        affectedArea: 'Registration & Check-In Desk',
        recommendedAction: `Assign ${staffRequired - simValues.staff} additional staff members to registration counters.`,
      });
    }

    if (budgetEfficiency < 75) {
      list.push({
        title: 'Budget Deficit Warning',
        severity: 'Medium',
        description: 'Simulated budget is below projected operational expense requirement.',
        affectedArea: 'Catering & AV Procurement',
        recommendedAction: 'Reallocate surplus promotional funds or increase budget reserve.',
      });
    }

    if (simValues.equipment < 75) {
      list.push({
        title: 'Equipment Readiness Risk',
        severity: 'Medium',
        description: `Equipment availability (${simValues.equipment}%) is below operational threshold.`,
        affectedArea: 'Audio Visual Setup',
        recommendedAction: 'Procure backup AV projectors and micro-switches.',
      });
    }

    return list;
  }, [venueUtilization, simValues, staffRequired, budgetEfficiency]);

  // Dynamic Recommendations
  const dynamicRecommendations = useMemo(() => {
    const list = [];

    if (simValues.staff < staffRequired) {
      list.push({
        priority: 'High',
        category: 'Staffing',
        title: `Assign ${staffRequired - simValues.staff} Additional Staff Members`,
        description: 'Current staff allocation is insufficient for projected attendee volume during peak arrival.',
        action: `Add ${staffRequired - simValues.staff} coordinators from standby staff pool.`,
        benefit: 'Reduces check-in wait time by 8+ minutes.',
      });
    }

    if (venueUtilization > 95) {
      list.push({
        priority: 'High',
        category: 'Venue Space',
        title: 'Expand Seating Capacity or Add Overflow Stream',
        description: 'Seating capacity is nearly full, creating potential crowding during keynote sessions.',
        action: 'Add 50 perimeter chairs or open Room B video feed.',
        benefit: 'Eliminates standing room congestion.',
      });
    }

    if (simValues.engagement === 'Basic' && simValues.attendance > 300) {
      list.push({
        priority: 'Medium',
        category: 'Engagement',
        title: 'Upgrade Engagement Strategy to Standard or Enhanced',
        description: 'Large audience events benefit significantly from automated Q&A and push notifications.',
        action: 'Enable digital live polling and push notifications.',
        benefit: 'Boosts participation rate by +14%.',
      });
    }

    if (simValues.equipment < 85) {
      list.push({
        priority: 'Medium',
        category: 'Resources',
        title: 'Pre-Test Audio Visual Equipment 24 Hours Early',
        description: 'Equipment availability lag requires technical rehearsal prior to doors opening.',
        action: 'Schedule AV testing session on pre-event day.',
        benefit: 'Eliminates live keynote audio glitches.',
      });
    }

    if (list.length === 0) {
      list.push({
        priority: 'Low',
        category: 'Optimization',
        title: 'Maintain Current Healthy Scenario Configuration',
        description: 'Your simulated scenario parameters are well balanced across all operational criteria.',
        action: 'Save current scenario benchmark.',
        benefit: 'Optimal operational readiness score achieved.',
      });
    }

    return list;
  }, [simValues, staffRequired, venueUtilization]);

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

      {/* 1. Simulator Header with Event Selector, Reset & Apply Scenario */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-outfit">
        <SimulatorPageHeader
          events={simulatorEventsBaseline}
          selectedEventId={selectedEventId}
          onSelectEvent={setSelectedEventId}
          onResetSimulation={handleReset}
        />
        <Button
          variant="primary"
          size="md"
          leftIcon={<Check className="w-4 h-4" />}
          onClick={handleApplyScenario}
          className="shrink-0 self-start md:self-auto"
        >
          Apply Scenario
        </Button>
      </div>

      {/* 2. Simulation Scenario Summary Banner */}
      <SimulationScenarioSummary
        eventName={baselineEvent.name}
        simValues={simValues}
        healthStatus={healthStatus}
      />

      {/* 3. Interactive Scenario Controls */}
      <ScenarioControls
        simValues={simValues}
        baseline={baselineEvent}
        limits={baselineEvent.limits}
        onChange={handleControlChange}
      />

      {/* 4. Simulated Readiness Score Card */}
      <SimulationScoreCard
        score={overallScore}
        status={scoreStatus}
      />

      {/* 5. Simulation KPI Metric Cards */}
      <SimulationResults results={simulationResults} />

      {/* 6. Impact Analysis */}
      <ScenarioImpactAnalysis impactItems={impactItems} />

      {/* 7. Current Plan vs Simulated Scenario Comparison */}
      <ScenarioComparison comparisonRows={comparisonRows} />

      {/* 8. Risk Analysis */}
      <ScenarioRiskAnalysis risks={dynamicRisks} />

      {/* 9. Smart Recommendations */}
      <SimulationRecommendations recommendations={dynamicRecommendations} />
    </PageContainer>
  );
};

export default SimulatorPage;
