import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, Search, ShieldCheck, Calendar, MapPin, Building2, User, FileText, Download, ArrowLeft } from 'lucide-react';
import apiClient from '../../services/apiClient';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const CertificateVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || searchParams.get('certificate_id') || '';

  const [certIdInput, setCertIdInput] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (idToVerify) => {
    const targetId = (idToVerify || certIdInput).trim();
    if (!targetId) return;

    setLoading(true);
    setSearched(true);
    setVerificationResult(null);

    try {
      const res = await apiClient.certificates.verify(targetId);
      setVerificationResult(res);
    } catch (err) {
      setVerificationResult({
        valid: false,
        message: err.message || 'Certificate not found or verification failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="min-h-screen bg-brand-cream/30 py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-burgundy hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to EventIQ Home
          </Link>
          <Badge variant="burgundy" size="sm">
            EventIQ Credential Service
          </Badge>
        </div>

        {/* Hero Card */}
        <div className="bg-brand-ivory border border-brand-beige rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-burgundy/10 text-brand-burgundy flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight">
              Certificate Verification
            </h1>
            <p className="text-sm text-brand-warm-gray leading-relaxed">
              Verify the authenticity of EventIQ participation credentials issued by partner academic institutions and event organizers.
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 pt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. EVIQ-2026-000124)"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                className="w-full pl-11 pr-24 py-3.5 bg-brand-cream/40 border border-brand-beige rounded-xl text-sm font-semibold text-brand-espresso placeholder:text-brand-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-burgundy focus:border-transparent transition-all"
                required
              />
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-warm-gray" />
              <button
                type="submit"
                disabled={loading || !certIdInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'VERIFYING...' : 'VERIFY'}
              </button>
            </div>
          </form>
        </div>

        {/* Verification Result Display */}
        {loading && (
          <div className="bg-brand-ivory border border-brand-beige rounded-2xl p-8 text-center space-y-3 shadow-md">
            <div className="w-8 h-8 border-3 border-brand-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider">
              Verifying credential against PostgreSQL database...
            </p>
          </div>
        )}

        {!loading && searched && verificationResult && (
          <div>
            {verificationResult.valid ? (
              /* VALID CERTIFICATE CARD */
              <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

                {/* Status Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-brand-beige/60">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-emerald-700 tracking-wide">
                          ✓ VALID CERTIFICATE
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                          Authentic
                        </span>
                      </div>
                      <p className="text-xs text-brand-warm-gray font-medium">
                        Verified by EventIQ Academic Credential System
                      </p>
                    </div>
                  </div>

                  <a
                    href={apiClient.certificates.getDownloadUrl(verificationResult.certificate_id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white rounded-xl font-bold text-xs transition-all shadow-md shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download Official PDF
                  </a>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-outfit">
                  <div className="p-4 bg-brand-cream/30 rounded-2xl border border-brand-beige/50 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-burgundy" />
                      Certificate ID
                    </span>
                    <p className="font-extrabold text-brand-espresso text-base font-mono">
                      {verificationResult.certificate_id}
                    </p>
                  </div>

                  <div className="p-4 bg-brand-cream/30 rounded-2xl border border-brand-beige/50 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-burgundy" />
                      Participant Student
                    </span>
                    <p className="font-extrabold text-brand-espresso text-base">
                      {verificationResult.student_name}
                    </p>
                  </div>

                  <div className="p-4 bg-brand-cream/30 rounded-2xl border border-brand-beige/50 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-brand-burgundy" />
                      Event Title
                    </span>
                    <p className="font-bold text-brand-espresso text-sm">
                      {verificationResult.event_name}
                    </p>
                  </div>

                  <div className="p-4 bg-brand-cream/30 rounded-2xl border border-brand-beige/50 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-brand-burgundy" />
                      Institution
                    </span>
                    <p className="font-bold text-brand-espresso text-sm">
                      {verificationResult.institution}
                    </p>
                  </div>

                  <div className="p-4 bg-brand-cream/30 rounded-2xl border border-brand-beige/50 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-burgundy" />
                      Event Date
                    </span>
                    <p className="font-semibold text-brand-espresso">
                      {verificationResult.event_date}
                    </p>
                  </div>

                  <div className="p-4 bg-brand-cream/30 rounded-2xl border border-brand-beige/50 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-burgundy" />
                      Venue Location
                    </span>
                    <p className="font-semibold text-brand-espresso">
                      {verificationResult.venue}
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 border-t border-brand-beige/40 flex flex-wrap items-center justify-between text-[11px] text-brand-warm-gray">
                  <span>Registration: <strong className="text-brand-espresso">{verificationResult.registration_id_display}</strong></span>
                  <span>Organizer: <strong className="text-brand-espresso">{verificationResult.organizer_name}</strong></span>
                  {verificationResult.issued_at && (
                    <span>Issued Date: <strong className="text-brand-espresso">{new Date(verificationResult.issued_at).toLocaleDateString()}</strong></span>
                  )}
                </div>
              </div>
            ) : (
              /* INVALID CERTIFICATE CARD */
              <div className="bg-white border-2 border-rose-500/30 rounded-3xl p-8 shadow-xl text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-rose-700 tracking-wide">
                    ✕ INVALID CERTIFICATE
                  </h3>
                  <p className="text-sm font-medium text-brand-warm-gray">
                    {verificationResult.message || 'Certificate not found or verification failed.'}
                  </p>
                </div>
                <p className="text-xs text-brand-warm-gray max-w-sm mx-auto">
                  Please verify that the Certificate ID was entered correctly (e.g. <code className="font-mono font-bold">EVIQ-2026-000124</code>). If you believe this is an error, contact the event organizer.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerifyPage;
