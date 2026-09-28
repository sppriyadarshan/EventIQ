import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import OptimizerPageHeader from '../../components/optimizer/OptimizerPageHeader';
import OptimizationScoreCard from '../../components/optimizer/OptimizationScoreCard';
import OptimizationMetricCards from '../../components/optimizer/OptimizationMetricCards';
import OptimizationAnalysis from '../../components/optimizer/OptimizationAnalysis';
import AIRecommendations from '../../components/optimizer/AIRecommendations';
import OptimizationRisks from '../../components/optimizer/OptimizationRisks';
import OptimizationComparison from '../../components/optimizer/OptimizationComparison';
import ExpectedImpact from '../../components/optimizer/ExpectedImpact';
import DynamicReallocationSection from '../../components/optimizer/DynamicReallocationSection';
import EquipmentFailureRecoverySection from '../../components/optimizer/EquipmentFailureRecoverySection';
import AcademicScheduleSection from '../../components/optimizer/AcademicScheduleSection';


import { optimizerEvents } from '../../data/optimizerData';
import { useEventIQ } from '../../context/EventIQContext';
import { apiClient } from '../../services/apiClient';
import { Info, X, Cpu, CheckCircle } from 'lucide-react';

export const OptimizerPage = () => {
  const { applyRecommendation, isBackendConnected, events: dbEvents } = useEventIQ();
  
  // Format events dropdown list
  const availableEventsList = useMemo(() => {
    if (isBackendConnected && dbEvents && dbEvents.length > 0) {
      return dbEvents.map((ev) => ({
        id: ev.id,
        title: ev.title,
        department: ev.department?.code || ev.department || 'CSE',
        predictedTurnout: ev.expected_participants || 100,
      }));
    }
    return optimizerEvents;
  }, [isBackendConnected, dbEvents]);

  const [selectedEventId, setSelectedEventId] = useState(
    availableEventsList[0]?.id || 1
  );
  
  const [appliedMap, setAppliedMap] = useState({});
  const [ortoolsPlan, setOrtoolsPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [sessionNotice, setSessionNotice] = useState(
    'Centralized State — Applying recommendations mutates actual resource allocation in the store.'
  );

  // Fetch OR-Tools optimization plan when event selection changes
  useEffect(() => {
    let isSubscribed = true;
    const fetchPlan = async () => {
      if (!isBackendConnected) {
        setOrtoolsPlan(null);
        return;
      }

      setIsLoadingPlan(true);
      try {
        const numId = typeof selectedEventId === 'number' ? selectedEventId : (parseInt(selectedEventId, 10) || 1);
        const res = await apiClient.optimization.getPlan(numId);
        if (isSubscribed && res) {
          setOrtoolsPlan(res);
          setSessionNotice(`OR-Tools Optimization loaded for ${res.event_title || 'selected event'} (Status: ${res.overall_status})`);
        }
      } catch (err) {
        console.warn('[OptimizerPage] Backend OR-Tools optimization call failed, using fallback:', err.message);
        if (isSubscribed) setOrtoolsPlan(null);
      } finally {
        if (isSubscribed) setIsLoadingPlan(false);
      }
    };

    fetchPlan();
    return () => { isSubscribed = false; };
  }, [selectedEventId, isBackendConnected]);

  const rawEvent = useMemo(() => {
    const match = optimizerEvents.find((e) => String(e.id) === String(selectedEventId));
    return match || optimizerEvents[0];
  }, [selectedEventId]);

  const activeAppliedSet = useMemo(() => {
    return appliedMap[selectedEventId] || new Set();
  }, [appliedMap, selectedEventId]);

  // Compute recommendations from OR-Tools backend or fallback
  const activeRecommendations = useMemo(() => {
    if (ortoolsPlan && ortoolsPlan.recommendations) {
      return ortoolsPlan.recommendations.map((rec) => ({
        ...rec,
        applied: activeAppliedSet.has(rec.id) || rec.applied,
      }));
    }
    return rawEvent.recommendations.map((rec) => ({
      ...rec,
      applied: activeAppliedSet.has(rec.id),
    }));
  }, [ortoolsPlan, rawEvent, activeAppliedSet]);

  const scoreGainTotal = useMemo(() => {
    return activeRecommendations
      .filter((rec) => activeAppliedSet.has(rec.id))
      .reduce((sum, rec) => sum + (rec.scoreGain || 5), 0);
  }, [activeRecommendations, activeAppliedSet]);

  const dynamicScore = useMemo(() => {
    const base = ortoolsPlan ? ortoolsPlan.optimization_score.current_score : rawEvent.optimizationScore.currentScore;
    return Math.min(base + scoreGainTotal, 100);
  }, [ortoolsPlan, rawEvent, scoreGainTotal]);

  const dynamicStatus = useMemo(() => {
    if (dynamicScore >= 90) return 'Excellent';
    if (dynamicScore >= 80) return 'Good';
    if (dynamicScore >= 70) return 'Needs Improvement';
    return 'Needs Attention';
  }, [dynamicScore]);

  const dynamicDescription = useMemo(() => {
    const appliedCount = activeAppliedSet.size;
    if (appliedCount > 0) {
      return `Score improved to ${dynamicScore} pts after applying ${appliedCount} OR-Tools recommendation${appliedCount > 1 ? 's' : ''}. Actual resource allocations in store updated.`;
    }
    if (ortoolsPlan) {
      return `OR-Tools ${ortoolsPlan.overall_status} solver plan for ${ortoolsPlan.predicted_attendance} predicted attendees. Transport: ${ortoolsPlan.transport.status}, Equipment: ${ortoolsPlan.equipment.status}, Venue: ${ortoolsPlan.venue.status}.`;
    }
    return rawEvent.optimizationScore.scoreDescription;
  }, [rawEvent, activeAppliedSet, dynamicScore, ortoolsPlan]);

  const dynamicCategories = useMemo(() => {
    if (ortoolsPlan) {
      const v = ortoolsPlan.venue;
      const t = ortoolsPlan.transport;
      const e = ortoolsPlan.equipment;
      return [
        {
          id: 'cat-venue',
          name: 'Venue Scheduling',
          currentValue: `${v.selected_venue_name} (${v.utilization_pct}%)`,
          targetValue: '85-95%',
          status: v.status === 'OPTIMAL' ? 'Optimal' : v.status,
          impact: 'High',
          metricLabel: 'Capacity Utilization',
          progressPct: Math.min(v.utilization_pct, 100),
          recommendedAction: `Capacity ${v.venue_capacity} fits ${v.predicted_attendance} predicted attendees.`,
        },
        {
          id: 'cat-transport',
          name: 'Transport Logistics',
          currentValue: `${t.vehicles_selected} Vehicles (${t.fulfillment_pct}%)`,
          targetValue: '100%',
          status: t.status === 'OPTIMAL' ? 'Optimal' : t.status,
          impact: 'Medium',
          metricLabel: 'Passenger Fulfillment',
          progressPct: t.fulfillment_pct,
          recommendedAction: `Total capacity ${t.total_capacity} for ${t.transport_demand_passengers} required passengers.`,
        },
        {
          id: 'cat-equipment',
          name: 'Equipment Allocation',
          currentValue: `${e.total_categories_optimized} Categories (${e.status})`,
          targetValue: 'Optimal',
          status: e.status === 'OPTIMAL' ? 'Optimal' : 'Needs Review',
          impact: 'High',
          metricLabel: 'Resource Availability',
          progressPct: e.status === 'OPTIMAL' ? 95 : 75,
          recommendedAction: 'All requested chairs, sound systems, and projectors allocated from inventory.',
        },
      ];
    }
    return rawEvent.categories;
  }, [ortoolsPlan, rawEvent]);

  const dynamicMetrics = useMemo(() => {
    if (ortoolsPlan) {
      return {
        attendanceEfficiency: {
          value: `${ortoolsPlan.venue.utilization_pct}%`,
          status: ortoolsPlan.venue.utilization_pct >= 80 ? 'Optimal' : 'Good',
          trend: '+8.5%',
        },
        resourceEfficiency: {
          value: ortoolsPlan.equipment.status === 'OPTIMAL' ? '95%' : '82%',
          status: ortoolsPlan.equipment.status === 'OPTIMAL' ? 'Optimal' : 'Good',
          trend: '+12.0%',
        },
        budgetEfficiency: {
          value: '88%',
          status: 'Optimal',
          trend: '+5.2%',
        },
        engagementScore: {
          value: '90/100',
          status: 'Optimal',
          trend: '+7.0%',
        },
      };
    }
    return rawEvent.metrics;
  }, [ortoolsPlan, rawEvent]);

  const dynamicComparison = useMemo(() => {
    if (ortoolsPlan) {
      return {
        score: {
          current: 72,
          optimized: dynamicScore,
          improvement: `+${dynamicScore - 72} pts`,
        },
        attendanceEfficiency: {
          current: '74%',
          optimized: `${ortoolsPlan.venue.utilization_pct}%`,
          improvement: '+11%',
        },
        resourceUtilization: {
          current: '68%',
          optimized: ortoolsPlan.equipment.status === 'OPTIMAL' ? '95%' : '82%',
          improvement: '+24%',
        },
        budgetEfficiency: {
          current: '81%',
          optimized: '88%',
          improvement: '+7%',
        },
        staffAllocation: {
          current: '70%',
          optimized: '100%',
          improvement: '+30%',
        },
        engagementScore: {
          current: '80/100',
          optimized: '90/100',
          improvement: '+10 pts',
        },
      };
    }
    return rawEvent.beforeAfter;
  }, [ortoolsPlan, rawEvent, dynamicScore]);

  // Handle applying a recommendation
  const handleApplyRecommendation = (recId) => {
    applyRecommendation(recId);
    setAppliedMap((prev) => {
      const existingSet = new Set(prev[selectedEventId] || []);
      existingSet.add(recId);
      return {
        ...prev,
        [selectedEventId]: existingSet,
      };
    });
    setSessionNotice(`Recommendation applied! Resource allocations updated in store.`);
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
      {/* Session Toast Notice */}
      {sessionNotice && (
        <div className="bg-brand-cream border border-brand-beige text-brand-espresso text-xs font-outfit px-4 py-2.5 rounded-[10px] flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-2">
            {ortoolsPlan ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-brand-burgundy shrink-0" />
            )}
            <span>{sessionNotice}</span>
          </div>
          <button
            onClick={() => setSessionNotice(null)}
            className="text-brand-warm-gray hover:text-brand-espresso p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Solver Source Status Badge */}
      {ortoolsPlan && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>GOOGLE OR-TOOLS OPTIMIZED ({ortoolsPlan.overall_status})</span>
        </div>
      )}

      {/* 1. Header with Event Selector */}
      <OptimizerPageHeader
        events={availableEventsList}
        selectedEventId={selectedEventId}
        onSelectEvent={setSelectedEventId}
      />

      {/* 2. Overall Optimization Score Card */}
      <OptimizationScoreCard
        score={dynamicScore}
        maxScore={100}
        status={dynamicStatus}
        description={dynamicDescription}
        appliedCount={activeAppliedSet.size}
      />

      {/* 3. Metric Overview Cards */}
      <OptimizationMetricCards metrics={dynamicMetrics} />

      {/* 4. REAL DYNAMIC RESOURCE REALLOCATION SECTION */}
      <DynamicReallocationSection
        eventId={selectedEventId}
        currentPredictedAttendance={ortoolsPlan?.predicted_attendance || rawEvent?.predictedTurnout || 200}
        currentVenueName={ortoolsPlan?.venue?.selected_venue_name || 'Tech Hall A'}
        isBackendConnected={isBackendConnected}
        onReallocationApplied={(res) => {
          setSessionNotice(`Reallocation applied successfully! Updated plan for ${res.new_predicted_attendance} attendees.`);
        }}
      />

      {/* 5. EQUIPMENT FAILURE & RECOVERY SECTION */}
      <EquipmentFailureRecoverySection
        eventId={selectedEventId}
        isBackendConnected={isBackendConnected}
        onRecoveryApplied={(res) => {
          setSessionNotice(`Equipment failure recovery applied successfully! Notification created.`);
        }}
      />

      {/* 6. ACADEMIC PLANNER-WISE ALLOCATION SECTION */}
      <AcademicScheduleSection
        eventId={selectedEventId}
        isBackendConnected={isBackendConnected}
      />

      {/* 5. Optimization Category Analysis */}
      <OptimizationAnalysis categories={dynamicCategories} />


      {/* 5. Smart Recommendations */}
      <AIRecommendations
        recommendations={activeRecommendations}
        onApplyRecommendation={handleApplyRecommendation}
      />

      {/* 6. Risk Analysis */}
      <OptimizationRisks risks={rawEvent.risks} />

      {/* 7. Before vs After Comparison */}
      <OptimizationComparison comparisonData={dynamicComparison} />

      {/* 8. Expected Impact Summary Cards */}
      <ExpectedImpact impactData={rawEvent.expectedImpact} />
    </PageContainer>
  );
};

export default OptimizerPage;


