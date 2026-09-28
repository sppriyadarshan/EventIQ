import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import apiClient from '../../services/apiClient';
import {
  QrCode,
  User,
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building,
  Tag,
  Award,
  Lock,
  Download,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

/**
 * PersonalizedEventPass Component
 * Reusable visual pass card for EventIQ Personalized QR Event Pass + Attendance + Automatic Certificate Generator.
 */
export const PersonalizedEventPass = ({
  passData: initialPassData,
  registrationId,
  onMarkAttendance = null,
  isMarking = false,
  showMarkButton = true,
  className = '',
}) => {
  const [resolvedPassData, setResolvedPassData] = useState(initialPassData || null);
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    if (initialPassData) {
      setResolvedPassData(initialPassData);
      return;
    }

    if (!registrationId) {
      setResolvedPassData(null);
      return;
    }

    let isMounted = true;
    const fetchPass = async () => {
      try {
        setLoadingPass(true);
        const { apiClient } = await import('../../services/apiClient');
        const pass = await apiClient.registrations.getPass(registrationId);
        if (isMounted) setResolvedPassData(pass);
      } catch (err) {
        console.warn('[PersonalizedEventPass] Failed to fetch pass data:', err.message);
        if (isMounted) setResolvedPassData(null);
      } finally {
        if (isMounted) setLoadingPass(false);
      }
    };

    fetchPass();
    return () => {
      isMounted = false;
    };
  }, [initialPassData, registrationId]);

  const passData = resolvedPassData;

  if (!passData) {
    return (
      <div className={`bg-brand-ivory border-2 border-brand-burgundy/20 rounded-[18px] p-6 text-left font-outfit ${className}`}>
        <div className="flex items-center justify-center text-sm text-brand-warm-gray">
          {loadingPass ? 'Loading your event pass...' : 'No event pass available for this registration.'}
        </div>
      </div>
    );
  }

  const isCheckedIn = passData.attendance?.checked_in || passData.checked_in || passData.registration_status === 'ATTENDED' || passData.registration_status === 'COMPLETED';
  const checkedInAt = passData.attendance?.checked_in_at || passData.checked_in_at;

  const eventName = passData.event?.name || passData.event?.title || passData.event_title || 'EventIQ Campus Event';
  const eventTheme = passData.event?.theme || 'AI & Intelligent Future';
  const themeId = passData.event?.theme_id || 'AI-07';
  const venueName = passData.venue?.name || 'Main Auditorium';
  
  const eventDate = passData.schedule?.date || '2026-10-15';
  const startTime = passData.schedule?.start_time || '09:30';
  const endTime = passData.schedule?.end_time || '17:00';
  const foodDetails = passData.food?.details || 'Lunch + Refreshments';
  const regIdDisplay = passData.registration_id || `REG-${passData.id || 1}`;

  // Certificate State Management
  const [certState, setCertState] = useState(null);
  const [loadingCert, setLoadingCert] = useState(false);
  const [generatingCert, setGeneratingCert] = useState(false);
  const [certError, setCertError] = useState(null);

  const rawRegId = passData.raw_registration_id || passData.id || (typeof passData.registration_id === 'string' ? passData.registration_id.replace('REG-', '') : passData.registration_id);

  // Fetch certificate eligibility from Backend Source of Truth
  const fetchEligibility = async () => {
    if (!rawRegId) return;
    setLoadingCert(true);
    setCertError(null);
    try {
      const res = await apiClient.certificates.getEligibility(rawRegId);
      setCertState(res);
    } catch (err) {
      console.warn('[PersonalizedEventPass] Failed to fetch certificate eligibility:', err.message);
      setCertState({
        eligible: isCheckedIn,
        participation_status: isCheckedIn ? 'COMPLETED' : 'REGISTERED',
        reason: isCheckedIn ? '' : 'Participant has not checked in.',
      });
    } finally {
      setLoadingCert(false);
    }
  };

  useEffect(() => {
    fetchEligibility();
  }, [rawRegId, isCheckedIn]);

  // Handle Certificate Generation
  const handleGenerateCertificate = async () => {
    if (!rawRegId) return;
    setGeneratingCert(true);
    setCertError(null);
    try {
      const res = await apiClient.certificates.generate(rawRegId);
      if (res && res.certificate_id) {
        setCertState({
          eligible: true,
          participation_status: 'COMPLETED',
          certificate_exists: true,
          certificate_id: res.certificate_id,
          download_url: res.download_url || apiClient.certificates.getDownloadUrl(res.certificate_id),
          verification_url: res.verification_url,
          issued_at: res.issued_at,
        });
      } else if (res && res.certificate) {
        setCertState({
          eligible: true,
          participation_status: 'COMPLETED',
          certificate_exists: true,
          certificate_id: res.certificate.certificate_id,
          download_url: res.certificate.download_url || apiClient.certificates.getDownloadUrl(res.certificate.certificate_id),
          verification_url: res.certificate.verification_url,
          issued_at: res.certificate.issued_at,
        });
      }
    } catch (err) {
      console.error('Certificate generation failed:', err);
      setCertError(err.message || 'Failed to generate certificate.');
    } finally {
      setGeneratingCert(false);
    }
  };

  const isEligible = certState ? certState.eligible : isCheckedIn;
  const certId = certState?.certificate_id;
  const downloadUrl = certId ? apiClient.certificates.getDownloadUrl(certId) : certState?.download_url;

  return (
    <div className={`bg-brand-ivory border-2 border-brand-burgundy/20 rounded-[18px] shadow-card overflow-hidden text-left font-outfit ${className}`}>
      
      {/* Header Banner */}
      <div className="bg-brand-burgundy px-5 py-3 text-brand-ivory flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-brand-beige" />
          <span className="font-extrabold text-xs tracking-wider uppercase font-space text-brand-beige">
            EVENTIQ PERSONALIZED QR PASS
          </span>
        </div>
        <Badge
          variant={isCheckedIn ? 'olive' : 'burgundy'}
          size="sm"
          className="uppercase tracking-wider font-bold text-[10px]"
          dot
        >
          {isCheckedIn ? 'ATTENDED' : passData.registration_status || 'REGISTERED'}
        </Badge>
      </div>

      {/* Main Pass Content */}
      <div className="p-5 space-y-4">
        
        {/* Student Information Block */}
        <div className="p-3.5 bg-brand-cream/80 border border-brand-beige rounded-[12px] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1">
              <User className="w-3 h-3 text-brand-burgundy" /> Student Name
            </span>
            <h4 className="text-base font-extrabold text-brand-espresso tracking-tight">
              {passData.student_name || passData.participant_name || 'Participant Name'}
            </h4>
            {passData.department && (
              <p className="text-[11px] text-brand-warm-gray flex items-center gap-1 pt-0.5">
                <Building className="w-3 h-3 text-brand-warm-gray shrink-0" />
                <span>Dept: {passData.department} {passData.register_number ? `(${passData.register_number})` : ''}</span>
              </p>
            )}
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray block">
              Pass ID
            </span>
            <span className="font-space font-extrabold text-xs px-2.5 py-1 bg-white border border-brand-beige rounded-md text-brand-burgundy block shadow-2xs">
              {regIdDisplay}
            </span>
          </div>
        </div>

        {/* Event & Theme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Event / Theme Card */}
          <div className="p-3 bg-white border border-brand-beige/80 rounded-[12px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-ochre" /> Event / Theme
            </span>
            <p className="font-bold text-brand-espresso leading-snug line-clamp-1">
              {eventName}
            </p>
            <p className="text-[11px] text-brand-burgundy font-medium truncate">
              {eventTheme}
            </p>
          </div>

          {/* Theme ID Card */}
          <div className="p-3 bg-white border border-brand-beige/80 rounded-[12px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1">
              <Tag className="w-3 h-3 text-brand-burgundy" /> Theme ID
            </span>
            <p className="font-space font-extrabold text-sm text-brand-espresso">
              {themeId}
            </p>
            <p className="text-[10px] text-brand-warm-gray">Allocation Tag</p>
          </div>
        </div>

        {/* Venue & Time Allocation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Assigned Venue */}
          <div className="p-3 bg-white border border-brand-beige/80 rounded-[12px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-burgundy" /> Assigned Venue
            </span>
            <p className="font-bold text-brand-espresso">
              {venueName}
            </p>
          </div>

          {/* Schedule */}
          <div className="p-3 bg-white border border-brand-beige/80 rounded-[12px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-burgundy" /> Date & Time
            </span>
            <p className="font-bold text-brand-espresso">
              {eventDate}
            </p>
            <p className="text-[11px] text-brand-warm-gray font-space">
              {startTime} – {endTime}
            </p>
          </div>
        </div>

        {/* Food Details */}
        <div className="p-3 bg-brand-cream/50 border border-brand-beige/70 rounded-[12px] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-brand-ochre shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray block">Food Details</span>
              <span className="font-semibold text-brand-espresso">{foodDetails}</span>
            </div>
          </div>
          <Badge variant="neutral" size="sm" className="text-[10px]">Included</Badge>
        </div>

        {/* Attendance Status */}
        {isCheckedIn ? (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-[12px] text-emerald-900 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1.5 font-extrabold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✓ ATTENDANCE MARKED (CHECKED IN)</span>
            </div>
            {checkedInAt && (
              <p className="text-[10px] text-emerald-700 font-medium font-space">
                Timestamp: {new Date(checkedInAt).toLocaleTimeString()} ({new Date(checkedInAt).toLocaleDateString()})
              </p>
            )}
          </div>
        ) : showMarkButton && onMarkAttendance ? (
          <div className="pt-1">
            <Button
              variant="primary"
              size="lg"
              onClick={onMarkAttendance}
              disabled={isMarking}
              className="w-full bg-brand-burgundy text-white font-extrabold text-sm py-3 tracking-wide rounded-[12px] shadow-sm hover:bg-brand-burgundy-dark transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              {isMarking ? 'Marking Attendance...' : 'MARK ATTENDANCE'}
            </Button>
          </div>
        ) : null}

        {/* ============================================================ */}
        {/* AUTOMATIC CERTIFICATE GENERATOR & ELIGIBILITY SECTION       */}
        {/* ============================================================ */}
        <div className="p-4 bg-brand-cream/60 border border-brand-beige rounded-[14px] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-burgundy flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-burgundy" />
              Certificate Status
            </span>
            <Badge
              variant={isEligible ? 'olive' : 'burgundy'}
              size="sm"
              className="font-bold text-[10px] uppercase"
            >
              {isEligible ? '✓ ELIGIBLE' : '🔒 LOCKED'}
            </Badge>
          </div>

          {/* Status Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 bg-white/80 rounded-lg border border-brand-beige/60">
              <span className="text-brand-warm-gray font-medium block">Participation Status</span>
              <strong className={`font-extrabold ${isEligible ? 'text-emerald-700' : 'text-brand-espresso'}`}>
                {isEligible ? '✓ COMPLETED' : 'REGISTERED'}
              </strong>
            </div>
            <div className="p-2 bg-white/80 rounded-lg border border-brand-beige/60">
              <span className="text-brand-warm-gray font-medium block">Certificate Eligibility</span>
              <strong className={`font-extrabold ${isEligible ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isEligible ? '✓ ELIGIBLE' : 'NOT ELIGIBLE'}
              </strong>
            </div>
          </div>

          {/* Certificate Error Banner */}
          {certError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{certError}</span>
            </div>
          )}

          {/* Case 1: Participant is ELIGIBLE */}
          {isEligible ? (
            <div className="space-y-3 pt-1">
              {certId ? (
                /* Certificate Already Generated -> Show Certificate ID & Download PDF */
                <div className="p-3 bg-white border border-emerald-300 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-espresso flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Certificate Issued
                    </span>
                    <span className="font-mono font-extrabold text-brand-burgundy text-xs px-2 py-0.5 bg-brand-burgundy/10 rounded">
                      {certId}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-lg font-bold text-xs transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      DOWNLOAD CERTIFICATE (PDF)
                    </a>
                    <Link
                      to={`/certificate/verify?id=${certId}`}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand-cream border border-brand-beige hover:border-brand-burgundy text-brand-espresso rounded-lg font-bold text-xs transition-colors"
                    >
                      Verify
                    </Link>
                  </div>
                </div>
              ) : (
                /* Eligible but not generated yet -> Show Generate Certificate Button */
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGenerateCertificate}
                  disabled={generatingCert || loadingCert}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  {generatingCert ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      GENERATING OFFICIAL PDF...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      GENERATE CERTIFICATE
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            /* Case 2: Participant is NOT Checked In (LOCKED STATE) */
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Certificate Locked</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed font-medium">
                Check in to the event to become eligible for the participation certificate.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PersonalizedEventPass;
