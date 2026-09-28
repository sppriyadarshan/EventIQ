import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { apiClient } from '../../services/apiClient';
import { useEventIQ } from '../../context/EventIQContext';
import {
  AlertTriangle,
  Wrench,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Radio,
  Cpu,
} from 'lucide-react';

/**
 * EventIQ EquipmentFailureRecoverySection Component
 * Detects equipment failures, calculates impact on predicted attendance, and runs Google OR-Tools to generate and apply recovery plans.
 */
export const EquipmentFailureRecoverySection = ({
  eventId = 1,
  isBackendConnected = true,
  onRecoveryApplied,
}) => {
  const { addNotification } = useEventIQ();

  const [selectedResourceId, setSelectedResourceId] = useState(5); // Default: HD Projectors & LED Screens
  const [failureType, setFailureType] = useState('PROJECTOR_FAILURE');
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const [failureDetected, setFailureDetected] = useState(false);
  const [recoveryPlan, setRecoveryPlan] = useState(null);
  const [recoveryApplied, setRecoveryApplied] = useState(false);
  const [appliedDetails, setAppliedDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Available equipment choices for simulation
  const equipmentOptions = [
    { id: 5, name: 'HD Projectors & LED Screens (Projector P-02)', type: 'PROJECTOR_FAILURE', category: 'EQUIPMENT' },
    { id: 6, name: 'PA Sound Systems (Sound System S-01)', type: 'SOUND_SYSTEM_FAILURE', category: 'EQUIPMENT' },
    { id: 7, name: 'Wireless Microphones (Mic Set M-04)', type: 'MICROPHONE_FAILURE', category: 'EQUIPMENT' },
    { id: 9, name: 'Campus Shuttle Buses (Shuttle Bus B-02)', type: 'TRANSPORT_FAILURE', category: 'TRANSPORT' },
    { id: 1, name: 'Event Managers & Coordinators', type: 'STAFF_SHORTAGE', category: 'STAFF' },
  ];

  // 1. Simulate Equipment Failure & Fetch Recovery Plan
  const handleSimulateFailure = async () => {
    setIsSimulating(true);
    setErrorMessage(null);
    setRecoveryApplied(false);
    setAppliedDetails(null);

    try {
      if (isBackendConnected) {
        const res = await apiClient.optimization.simulateEquipmentFailure(
          eventId,
          selectedResourceId,
          failureType
        );
        setRecoveryPlan(res);
        setFailureDetected(true);
      } else {
        // Mock fallback if backend disconnected
        const selectedObj = equipmentOptions.find((e) => e.id === Number(selectedResourceId)) || equipmentOptions[0];
        const mockPlan = {
          status: 'RECOVERY_AVAILABLE',
          event_id: Number(eventId),
          predicted_attendance: 350,
          failed_resource: {
            id: selectedObj.id,
            name: selectedObj.name,
            type: 'projector',
            status: 'FAILED',
          },
          impact: {
            required: 2,
            available_before: 2,
            available_after: 1,
            shortage: 1,
          },
          replacement: {
            resource_id: 8,
            name: 'Spare HD Projector P-05 (Backup Unit)',
            category: selectedObj.category,
          },
          before: { equipment_status: 'HEALTHY' },
          after: { equipment_status: 'OPTIMAL_AFTER_RECOVERY' },
          alerts: [
            `🚨 ${selectedObj.name} experienced a critical hardware failure.`,
            '⚠️ Equipment shortage detected: 1 unit required for 350 predicted attendees.',
            '💡 Replacement recommended: Spare HD Projector P-05 is available in inventory.',
          ],
        };
        setRecoveryPlan(mockPlan);
        setFailureDetected(true);
      }
    } catch (err) {
      setErrorMessage(`Failed to simulate equipment failure: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  // 2. Admin Applies Recovery Plan
  const handleApplyRecovery = async () => {
    if (!recoveryPlan) return;
    setIsApplying(true);
    setErrorMessage(null);

    const failedId = recoveryPlan.failed_resource.id;
    const replacementId = recoveryPlan.replacement?.resource_id || null;

    try {
      if (isBackendConnected) {
        const res = await apiClient.optimization.applyEquipmentRecovery(
          eventId,
          failedId,
          replacementId
        );
        setAppliedDetails(res);
        setRecoveryApplied(true);
        if (typeof onRecoveryApplied === 'function') {
          onRecoveryApplied(res);
        }
      } else {
        // Fallback state
        const mockResult = {
          status: 'RECOVERED',
          success: true,
          failed_resource: recoveryPlan.failed_resource,
          replacement_resource: recoveryPlan.replacement,
          notification_created: true,
        };
        setAppliedDetails(mockResult);
        setRecoveryApplied(true);
      }

      if (typeof addNotification === 'function') {
        addNotification({
          title: `Equipment Failure Recovered: Event #${eventId}`,
          message: `${recoveryPlan.failed_resource.name} failed. Replacement ${recoveryPlan.replacement?.name || 'allocated'} applied successfully.`,
          type: 'WARNING',
        });
      }
    } catch (err) {
      setErrorMessage(`Failed to apply equipment recovery: ${err.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  // Reset Failure Simulation
  const handleReset = () => {
    setFailureDetected(false);
    setRecoveryPlan(null);
    setRecoveryApplied(false);
    setAppliedDetails(null);
    setErrorMessage(null);
  };

  const currentEquipmentObj = equipmentOptions.find((e) => e.id === Number(selectedResourceId)) || equipmentOptions[0];

  return (
    <Card className="p-6 bg-brand-cream/80 border-brand-beige rounded-[16px] shadow-md space-y-6 font-outfit">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-beige pb-4">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Badge variant="burgundy" size="sm" className="font-bold uppercase tracking-wider">
              OR-Tools Solver
            </Badge>
            <span className="text-xs font-semibold text-brand-burgundy flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              Equipment Failure & Recovery
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-brand-espresso tracking-tight">
            Equipment Failure & Dynamic Recovery
          </h3>
          <p className="text-xs sm:text-sm text-brand-warm-gray leading-relaxed">
            Monitor equipment health, detect unexpected hardware failures, and run Google OR-Tools to reallocate backup inventory.
          </p>
        </div>

        {failureDetected && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="bg-brand-ivory hover:bg-brand-cream border-brand-beige text-brand-espresso shrink-0"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Reset Equipment Status
          </Button>
        )}
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: INITIAL HEALTHY STATE & SIMULATE FAILURE FORM */}
      {!failureDetected && (
        <div className="bg-brand-ivory p-5 rounded-[12px] border border-brand-beige space-y-5 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                Live Equipment Health Status
              </span>
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-brand-espresso">
                  {currentEquipmentObj.name}
                </h4>
                <Badge variant="olive" size="sm" dot>
                  HEALTHY
                </Badge>
              </div>
              <p className="text-xs text-brand-warm-gray">
                Allocated and operational for Event #{eventId}. All equipment diagnostics reporting normal values.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                value={selectedResourceId}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSelectedResourceId(val);
                  const opt = equipmentOptions.find((o) => o.id === val);
                  if (opt) setFailureType(opt.type);
                }}
                className="bg-brand-cream border border-brand-beige text-brand-espresso text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/30"
              >
                {equipmentOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                size="md"
                onClick={handleSimulateFailure}
                disabled={isSimulating}
                className="bg-red-700 hover:bg-red-800 text-white shadow-sm font-bold shrink-0"
              >
                {isSimulating ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShieldAlert className="w-4 h-4 mr-2" />
                )}
                {isSimulating ? 'Detecting Shortage...' : 'SIMULATE FAILURE'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: FAILURE DETECTED & IMPACT ANALYSIS */}
      {failureDetected && recoveryPlan && (
        <div className="space-y-6 text-left">
          {/* Alerts Banner */}
          <div className="space-y-2">
            {recoveryPlan.alerts.map((alertText, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2.5 ${
                  alertText.includes('🚨') || alertText.includes('CRITICAL')
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : alertText.includes('⚠️')
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <span>{alertText}</span>
              </div>
            ))}
          </div>

          {/* Impact Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Failed Equipment Details */}
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-[12px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Failed Hardware Unit
                </span>
                <Badge variant="burgundy" size="xs">
                  CRITICAL / FAILED
                </Badge>
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-espresso">
                  {recoveryPlan.failed_resource.name}
                </h4>
                <p className="text-xs text-brand-warm-gray">
                  Resource ID: {recoveryPlan.failed_resource.id} | Category: {recoveryPlan.failed_resource.type.toUpperCase()}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-red-200/60 text-center">
                <div className="bg-white/80 p-2 rounded border border-red-100">
                  <span className="text-[10px] font-bold uppercase text-brand-warm-gray block">Required</span>
                  <span className="text-sm font-extrabold text-brand-espresso">{recoveryPlan.impact.required}</span>
                </div>
                <div className="bg-white/80 p-2 rounded border border-red-100">
                  <span className="text-[10px] font-bold uppercase text-brand-warm-gray block">Working</span>
                  <span className="text-sm font-extrabold text-red-700">{recoveryPlan.impact.available_after}</span>
                </div>
                <div className="bg-white/80 p-2 rounded border border-red-100">
                  <span className="text-[10px] font-bold uppercase text-brand-warm-gray block">Shortage</span>
                  <span className="text-sm font-extrabold text-red-800">{recoveryPlan.impact.shortage}</span>
                </div>
              </div>
            </div>

            {/* Recommended Replacement via OR-Tools */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-[12px] space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    OR-Tools Recommended Replacement
                  </span>
                  {recoveryPlan.replacement ? (
                    <Badge variant="olive" size="xs">
                      AVAILABLE
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="xs">
                      NO INVENTORY
                    </Badge>
                  )}
                </div>

                {recoveryPlan.replacement ? (
                  <div>
                    <h4 className="text-base font-bold text-brand-espresso">
                      {recoveryPlan.replacement.name}
                    </h4>
                    <p className="text-xs text-brand-warm-gray">
                      Resource ID: {recoveryPlan.replacement.resource_id} | Available Quantity: {recoveryPlan.replacement.available_quantity} units
                    </p>
                    <p className="text-xs text-emerald-800 mt-2 font-medium bg-emerald-100/60 p-2 rounded">
                      💡 Reason: Compatible hardware available in backup inventory for {recoveryPlan.predicted_attendance} predicted attendees.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-base font-bold text-red-700">
                      No Spare Replacement Found
                    </h4>
                    <p className="text-xs text-brand-warm-gray">
                      OR-Tools search determined no compatible spare equipment is currently available in inventory.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {!recoveryApplied ? (
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleApplyRecovery}
                    disabled={isApplying || !recoveryPlan.replacement}
                    className="w-full bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-bold shadow-md"
                  >
                    {isApplying ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    {isApplying ? 'Applying Recovery...' : 'APPLY RECOVERY PLAN'}
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    ✓ RECOVERY APPLIED — Failed {appliedDetails?.failed_resource?.name || recoveryPlan.failed_resource.name} replaced by {appliedDetails?.replacement_resource?.name || recoveryPlan.replacement?.name}. Notification created.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EquipmentFailureRecoverySection;
