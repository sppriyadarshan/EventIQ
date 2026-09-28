import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Award, Download, CheckCircle2, AlertCircle, Link as LinkIcon, Search } from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';

export const CertificatesPage = () => {
  const { auth } = useEventIQ();
  const [registrations, setRegistrations] = useState([]);
  const [eligibilityMap, setEligibilityMap] = useState({});
  const [loadingRegId, setLoadingRegId] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const { apiClient } = await import('../../services/apiClient');
        const res = await apiClient.registrations.getAll();
        if (Array.isArray(res)) {
          setRegistrations(res);
        }
      } catch (err) {
        console.warn('Registrations fetch failed:', err);
      }
    };
    fetchRegistrations();
  }, []);

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
            map[reg.id] = { eligible: false, reason: 'Checked' };
          }
        }
        setEligibilityMap(map);
      } catch (err) {
        console.warn('Eligibility fetch failed:', err);
      }
    };
    checkEligibilities();
  }, [registrations]);

  const handleGenerate = async (regId) => {
    setLoadingRegId(regId);
    try {
      const { apiClient } = await import('../../services/apiClient');
      const res = await apiClient.certificates.generate(regId);
      if (res && res.download_url) {
        window.open(res.download_url, '_blank');
      }
      const updatedElig = await apiClient.certificates.getEligibility(regId);
      setEligibilityMap((prev) => ({ ...prev, [regId]: updatedElig }));
    } catch (err) {
      alert(err.message || 'Generation failed.');
    } finally {
      setLoadingRegId(null);
    }
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
      <div>
        <Badge variant="burgundy" size="sm">
          Certificate Vault
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight mt-1">
          Certificates of Participation
        </h1>
        <p className="text-sm text-brand-warm-gray">
          Check eligibility, generate official PDF certificates, and verify authenticity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registrations.map((reg) => {
          const elig = eligibilityMap[reg.id] || {};
          return (
            <Card key={reg.id} className="p-6 bg-brand-ivory space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-brand-burgundy/10 text-brand-burgundy">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-espresso text-base">Registration REG-{reg.id}</h3>
                    <span className="text-xs text-brand-warm-gray">{reg.participant_name} ({reg.department || 'Student'})</span>
                  </div>
                </div>

                <Badge variant={elig.eligible ? 'success' : 'soft'} size="sm">
                  {elig.eligible ? 'Eligible' : 'Check-in Required'}
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-brand-cream/60 border border-brand-beige text-xs text-brand-warm-gray leading-relaxed">
                {elig.eligible ? (
                  <span className="text-brand-olive font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Attendance verified! Official PDF certificate is ready for download.
                  </span>
                ) : (
                  <span className="text-brand-warm-gray flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-brand-ochre" />
                    Attendance check-in is required before generating the certificate.
                  </span>
                )}
              </div>

              {elig.eligible && (
                <Button
                  variant="primary"
                  disabled={loadingRegId === reg.id}
                  onClick={() => handleGenerate(reg.id)}
                  className="w-full h-11 text-xs font-bold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {loadingRegId === reg.id ? 'Generating PDF...' : 'Download Official Certificate (PDF)'}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default CertificatesPage;
