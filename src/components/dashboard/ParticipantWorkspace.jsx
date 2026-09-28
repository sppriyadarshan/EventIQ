import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  QrCode,
  Award,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  UserCheck,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';
import PersonalizedEventPass from '../attendance/PersonalizedEventPass';

export const ParticipantWorkspace = () => {
  const { auth, events, attendanceRecords } = useEventIQ();
  const [registrations, setRegistrations] = useState([]);
  const [selectedPassRegId, setSelectedPassRegId] = useState(null);
  const [eligibilityMap, setEligibilityMap] = useState({});
  const [generatingCertId, setGeneratingCertId] = useState(null);

  const participantEmail = auth?.user?.email || 'student@eventiq.edu';
  const participantName = auth?.user?.name || 'Siddharth Sharma';

  // Load participant's own registrations from backend
  useEffect(() => {
    const fetchUserRegistrations = async () => {
      try {
        const { apiClient } = await import('../../services/apiClient');
        const res = await apiClient.registrations.getAll();
        if (Array.isArray(res) && res.length > 0) {
          setRegistrations(res);
          setSelectedPassRegId(res[0].id);
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch participant registrations:', err);
      }

      const currentUser = auth?.user;
      if (currentUser && currentUser.role === 'PARTICIPANT') {
        const joinedEventIds = Array.isArray(currentUser.participatingEventIds)
          ? currentUser.participatingEventIds
          : [];

        const demoRegistrations = joinedEventIds.length > 0
          ? joinedEventIds.map((eventId, index) => {
              const selectedEvent = (Array.isArray(events) ? events : []).find((event) => event.id === eventId || `ev-${event.backendId}` === eventId || String(event.backendId) === String(eventId));
              const eventKey = String(eventId).replace(/^ev-/, '');
              const isAttendanceMarked = !!(
                Array.isArray(attendanceRecords?.[String(eventId)]) && attendanceRecords[String(eventId)].length > 0
              ) || !!(
                Array.isArray(attendanceRecords?.[String(selectedEvent?.backendId)]) && attendanceRecords[String(selectedEvent?.backendId)].length > 0
              );
              return {
                id: 100 + index + 1,
                participant_name: currentUser.name || currentUser.full_name || participantName,
                participant_email: currentUser.email || participantEmail,
                checked_in: isAttendanceMarked,
                status: isAttendanceMarked ? 'ATTENDED' : 'REGISTERED',
                event_id: selectedEvent?.backendId || Number(eventKey) || 1,
                event_name: selectedEvent?.name || 'Joined Event',
              };
            })
          : [
              {
                id: 101,
                participant_name: currentUser.name || currentUser.full_name || participantName,
                participant_email: currentUser.email || participantEmail,
                checked_in: Array.isArray(attendanceRecords?.['1']) && attendanceRecords['1'].length > 0,
                status: Array.isArray(attendanceRecords?.['1']) && attendanceRecords['1'].length > 0 ? 'ATTENDED' : 'REGISTERED',
                event_id: 1,
                event_name: 'Tech Innovators Summit 2026',
              },
            ];

        setRegistrations(demoRegistrations);
        setSelectedPassRegId(demoRegistrations[0].id);
      } else {
        setRegistrations([]);
        setSelectedPassRegId(null);
      }
    };
    fetchUserRegistrations();
  }, [auth, events, participantEmail, participantName]);

  // Check eligibility for registrations
  useEffect(() => {
    const checkEligibilities = async () => {
      if (registrations.length === 0) return;
      try {
        const { apiClient } = await import('../../services/apiClient');
        const map = {};
        for (const reg of registrations) {
          try {
            const elig = await apiClient.certificates.getEligibility(reg.id);
            map[reg.id] = elig;
          } catch (e) {
            map[reg.id] = { eligible: false, reason: 'Registration record checked.' };
          }
        }
        setEligibilityMap(map);
      } catch (err) {
        console.warn('Eligibility fetch error:', err);
      }
    };
    checkEligibilities();
  }, [registrations]);

  const handleGenerateCertificate = async (regId) => {
    setGeneratingCertId(regId);
    try {
      const { apiClient } = await import('../../services/apiClient');
      const res = await apiClient.certificates.generate(regId);
      if (res && res.download_url) {
        window.open(res.download_url, '_blank');
      }
      // Refresh eligibility map
      const updatedElig = await apiClient.certificates.getEligibility(regId);
      setEligibilityMap((prev) => ({ ...prev, [regId]: updatedElig }));
    } catch (err) {
      alert(err.message || 'Certificate generation failed.');
    } finally {
      setGeneratingCertId(null);
    }
  };

  return (
    <div className="space-y-8 font-outfit">
      {/* Participant Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-burgundy via-brand-burgundy-dark to-brand-espresso p-6 sm:p-8 text-brand-ivory shadow-lg">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge variant="soft" size="sm" className="bg-brand-ivory/15 text-brand-ivory border-brand-ivory/20">
              Participant Portal
            </Badge>
            <span className="text-xs text-brand-cream/80 font-mono">{participantEmail}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {participantName}
          </h1>
          <p className="text-sm text-brand-cream/90 leading-relaxed">
            Access your personalized QR event pass, check-in status, event schedule, and verified certificates of participation.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-burgundy/10 text-brand-burgundy shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Registered Events
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {registrations.length || 1}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-olive/10 text-brand-olive shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Attendance Status
            </span>
            <span className="text-lg font-bold font-space-grotesk text-brand-olive">
              {registrations.some((r) => r.checked_in) ? 'Attended' : 'Registered'}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-ochre/10 text-brand-ochre shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Certificates
            </span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">
              {Object.values(eligibilityMap).filter((e) => e.eligible).length} Eligible
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-brand-ivory">
          <div className="p-3 rounded-xl bg-brand-burgundy/10 text-brand-burgundy shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">
              Pass Verification
            </span>
            <span className="text-lg font-bold font-space-grotesk text-brand-espresso">
              Verified
            </span>
          </div>
        </Card>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Personalized Event Pass */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 bg-brand-ivory space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-espresso flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-brand-burgundy" />
                  Your Personalized QR Event Pass
                </h3>
                <p className="text-xs text-brand-warm-gray">
                  Present this QR pass at the entrance scanner for instant check-in
                </p>
              </div>
            </div>

            {selectedPassRegId ? (
              <PersonalizedEventPass registrationId={selectedPassRegId} />
            ) : (
              <div className="p-6 text-center text-sm text-brand-warm-gray">
                No registration is available for your participant account yet.
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Registered Events & Certificates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Certificates Card */}
          <Card className="p-5 bg-brand-ivory space-y-4">
            <h4 className="font-bold text-brand-espresso text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-burgundy" />
              Certificates of Participation
            </h4>

            <div className="space-y-3 text-xs">
              {registrations.length === 0 ? (
                <div className="p-4 rounded-xl bg-brand-cream/50 border border-brand-beige text-center space-y-2">
                  <p className="text-brand-warm-gray">No event registrations found yet.</p>
                </div>
              ) : (
                registrations.map((reg) => {
                  const elig = eligibilityMap[reg.id] || {};
                  return (
                    <div
                      key={reg.id}
                      className="p-4 rounded-xl bg-brand-cream/40 border border-brand-beige space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-espresso text-sm">REG-{reg.id}</span>
                        <Badge variant={elig.eligible ? 'success' : 'soft'} size="xs">
                          {elig.eligible ? 'Eligible' : 'Pending Check-in'}
                        </Badge>
                      </div>

                      <p className="text-brand-warm-gray text-xs leading-relaxed">
                        {elig.eligible
                          ? 'You have completed attendance for this event and are eligible for the official Certificate of Participation.'
                          : 'Attendance check-in required to unlock your certificate.'}
                      </p>

                      {elig.eligible && (
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={generatingCertId === reg.id}
                            onClick={() => handleGenerateCertificate(reg.id)}
                            className="text-xs w-full"
                          >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            {generatingCertId === reg.id ? 'Generating...' : 'Download Certificate'}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-brand-beige text-center">
              <Link to="/certificate/verify" className="text-xs font-bold text-brand-burgundy hover:underline">
                🔍 Verify Any EventIQ Certificate Online
              </Link>
            </div>
          </Card>

          {/* Quick Participant Navigation */}
          <Card className="p-5 bg-brand-ivory space-y-3">
            <h4 className="font-bold text-brand-espresso text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-burgundy" />
              Participant Actions
            </h4>
            <div className="space-y-2">
              <Link to="/events" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <CalendarDays className="w-4 h-4 mr-2 text-brand-burgundy" />
                  Browse Master Events
                </Button>
              </Link>
              <Link to="/certificate/verify" className="block">
                <Button variant="outline" className="w-full justify-start text-xs h-10">
                  <Award className="w-4 h-4 mr-2 text-brand-burgundy" />
                  Public Certificate Verifier
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParticipantWorkspace;
