import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/ui/PageContainer';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useEventIQ } from '../../context/EventIQContext';
import { User, Shield, HardDrive, RotateCcw, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SettingsPage = () => {
  const { auth, logout, resetDemoData, events, resources, notifications } = useEventIQ();
  const navigate = useNavigate();
  const [showResetModal, setShowResetModal] = useState(false);

  const user = auth?.user || {
    name: 'Event Organizer',
    email: 'admin@eventiq.edu',
    role: 'ADMIN',
    organization: 'State University Operations',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setShowResetModal(false);
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12">
      <SectionHeading
        title="Workspace Settings & Account"
        subtitle="Manage your institutional profile, frontend demo session, role permissions, and dataset persistence."
        badge={<Badge variant="burgundy" size="sm">System Configuration</Badge>}
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: User Profile & Role Privileges */}
        <div className="lg:col-span-7 space-y-6">
          {/* User Profile Card */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-brand-beige">
              <div className="p-2.5 rounded-xl bg-brand-burgundy/10 text-brand-burgundy">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit text-lg font-bold text-brand-espresso">
                  Institutional Profile
                </h3>
                <p className="text-xs text-brand-warm-gray">
                  Current active session details stored in demo authentication state.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-outfit">
              <div className="p-3.5 bg-brand-cream/60 rounded-xl border border-brand-beige/80 space-y-1">
                <span className="text-brand-warm-gray font-medium block">Full Name</span>
                <span className="font-bold text-brand-espresso text-sm">{user.name}</span>
              </div>

              <div className="p-3.5 bg-brand-cream/60 rounded-xl border border-brand-beige/80 space-y-1">
                <span className="text-brand-warm-gray font-medium block">Institutional Email</span>
                <span className="font-bold text-brand-espresso text-sm">{user.email}</span>
              </div>

              <div className="p-3.5 bg-brand-cream/60 rounded-xl border border-brand-beige/80 space-y-1">
                <span className="text-brand-warm-gray font-medium block">Organization / Dept</span>
                <span className="font-bold text-brand-espresso text-sm">{user.organization}</span>
              </div>

              <div className="p-3.5 bg-brand-cream/60 rounded-xl border border-brand-beige/80 space-y-1">
                <span className="text-brand-warm-gray font-medium block">Current Role</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-brand-burgundy text-sm">
                  <Badge variant="burgundy" size="sm">{user.role}</Badge>
                </span>
              </div>
            </div>
          </Card>

          {/* Role Permissions Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-beige">
              <div className="p-2.5 rounded-xl bg-brand-olive/10 text-brand-olive">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit text-lg font-bold text-brand-espresso">
                  Role Capabilities & Access Control
                </h3>
                <p className="text-xs text-brand-warm-gray">
                  Permissions enforced based on your assigned role.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-outfit">
              <div className="p-3 rounded-lg bg-brand-cream/40 border border-brand-beige flex items-center justify-between">
                <span className="font-bold text-brand-espresso">ADMIN</span>
                <span className="text-brand-warm-gray">Full CRUD on Events, Resources, Optimizer, Simulator, Settings</span>
              </div>
              <div className="p-3 rounded-lg bg-brand-cream/40 border border-brand-beige flex items-center justify-between">
                <span className="font-bold text-brand-espresso">FACULTY</span>
                <span className="text-brand-warm-gray">View events, attendance telemetry, analytics, and assigned operations</span>
              </div>
              <div className="p-3 rounded-lg bg-brand-cream/40 border border-brand-beige flex items-center justify-between">
                <span className="font-bold text-brand-espresso">PARTICIPANT</span>
                <span className="text-brand-warm-gray">View published event schedule, registration details, and announcements</span>
              </div>
              <div className="p-3 rounded-lg bg-brand-cream/40 border border-brand-beige flex items-center justify-between">
                <span className="font-bold text-brand-espresso">LOGISTICS_STAFF</span>
                <span className="text-brand-warm-gray">View and update resource inventory, equipment operational status, live telemetry</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Local Persistence & Reset Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Storage & Persistence Info */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-beige">
              <div className="p-2.5 rounded-xl bg-brand-burgundy/10 text-brand-burgundy">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit text-lg font-bold text-brand-espresso">
                  Frontend Data Persistence
                </h3>
                <p className="text-xs text-brand-warm-gray">
                  Single namespace storage: <code className="text-brand-burgundy font-bold">eventiq_app_state</code>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-outfit">
              <div className="flex items-center justify-between p-3 bg-brand-cream/50 rounded-lg border border-brand-beige">
                <span className="text-brand-warm-gray">Active Events Stored:</span>
                <span className="font-space-grotesk font-bold text-brand-espresso text-sm">{events.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-cream/50 rounded-lg border border-brand-beige">
                <span className="text-brand-warm-gray">Resources Managed:</span>
                <span className="font-space-grotesk font-bold text-brand-espresso text-sm">{resources.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-cream/50 rounded-lg border border-brand-beige">
                <span className="text-brand-warm-gray">System Notifications:</span>
                <span className="font-space-grotesk font-bold text-brand-espresso text-sm">{notifications.length}</span>
              </div>
            </div>

            <div className="p-3 bg-brand-olive/10 border border-brand-olive/20 rounded-xl flex items-start gap-2.5 text-xs text-brand-espresso">
              <CheckCircle2 className="w-4 h-4 text-brand-olive shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Your changes to events, resources, optimizer, and live telemetry persist automatically across browser refreshes.
              </p>
            </div>
          </Card>

          {/* Reset Demo Data & Sign Out Actions */}
          <Card className="p-6 space-y-4 border-brand-burgundy/20">
            <h3 className="font-outfit text-base font-bold text-brand-espresso">
              Demo Actions
            </h3>

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowResetModal(true)}
                className="w-full justify-center text-brand-burgundy border-brand-burgundy/30 hover:bg-brand-burgundy/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Demo Data to Default
              </Button>

              <Button
                variant="secondary"
                onClick={handleLogout}
                className="w-full justify-center text-brand-red border-brand-red/30 hover:bg-brand-red/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out of Workspace
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Data */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/60 backdrop-blur-xs">
          <div className="bg-brand-ivory border border-brand-beige rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl font-outfit animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-red/15 text-brand-red flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-brand-espresso text-base">Reset Demo Data?</h4>
                <p className="text-xs text-brand-warm-gray">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-brand-espresso/80 leading-relaxed">
              Resetting will restore all 10 baseline events, resource inventories, and notification records to their default state. All custom created or edited demo items will be cleared.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowResetModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmReset}>
                Confirm Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default SettingsPage;
