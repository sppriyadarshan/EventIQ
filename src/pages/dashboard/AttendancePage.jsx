import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { QrCode, CheckCircle2, AlertCircle, Scan, Users, Clock, Shield } from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';
import PersonalizedEventPass from '../../components/attendance/PersonalizedEventPass';

export const AttendancePage = () => {
  const { auth, events, attendanceRecords, markFacultyAttendance } = useEventIQ();
  const [selectedEventId, setSelectedEventId] = useState(1);
  const [scanInput, setScanInput] = useState('');
  const [quickMarkInput, setQuickMarkInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [quickMarkResult, setQuickMarkResult] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);

  const isStaff = ['ADMIN', 'FACULTY', 'LOGISTICS'].includes(auth?.user?.role);

  const fetchSummary = async (evtId) => {
    try {
      const { apiClient } = await import('../../services/apiClient');
      const res = await apiClient.attendance.getSummary(evtId);
      if (res && res.event_id) {
        setSummary(res);
      }
    } catch (err) {
      console.warn('Summary fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchSummary(selectedEventId);
  }, [selectedEventId]);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    setLoading(true);
    setScanResult(null);

    try {
      const { apiClient } = await import('../../services/apiClient');
      const res = await apiClient.attendance.scanQr(scanInput.trim(), selectedEventId);
      setScanResult(res);
      if (res.success) {
        fetchSummary(selectedEventId);
        setScanInput('');
      }
    } catch (err) {
      setScanResult({
        success: false,
        status: 'ERROR',
        message: err.message || 'Scan verification failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMarkAttendance = (e) => {
    e.preventDefault();
    if (!quickMarkInput.trim()) return;

    setQuickLoading(true);
    setQuickMarkResult(null);

    try {
      markFacultyAttendance(selectedEventId, quickMarkInput.trim(), 'Faculty Quick Check-In');
      setQuickMarkResult({
        success: true,
        message: `${quickMarkInput.trim()} was marked present for this event.`,
      });
      setQuickMarkInput('');
      fetchSummary(selectedEventId);
    } catch (err) {
      setQuickMarkResult({
        success: false,
        message: err.message || 'Unable to mark this participant present.',
      });
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="burgundy" size="sm">
            Real-Time Attendance Intelligence
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight mt-1">
            QR Attendance Scanner & Verification
          </h1>
          <p className="text-sm text-brand-warm-gray">
            Instant QR code verification and live turnout tracking.
          </p>
        </div>

        {/* Event Selector */}
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(Number(e.target.value))}
          className="px-3 py-2 rounded-xl bg-brand-ivory border border-brand-beige text-xs font-bold text-brand-espresso focus:outline-none focus:border-brand-burgundy shadow-sm"
        >
          {events.map((evt) => (
            <option key={evt.id} value={evt.backendId || evt.id}>
              {evt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 bg-brand-ivory">
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">Registered</span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-espresso">{summary.registered}</span>
          </Card>
          <Card className="p-5 bg-brand-ivory">
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">Present (Checked-In)</span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-olive">{summary.present}</span>
          </Card>
          <Card className="p-5 bg-brand-ivory">
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">Absent</span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-red">{summary.absent}</span>
          </Card>
          <Card className="p-5 bg-brand-ivory">
            <span className="text-xs font-semibold text-brand-warm-gray uppercase tracking-wider block">Turnout Rate</span>
            <span className="text-2xl font-bold font-space-grotesk text-brand-burgundy">{summary.attendance_percentage}%</span>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scanner Panel for Staff / Admin / Faculty */}
        {isStaff && (
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-6 bg-brand-ivory space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-burgundy/10 text-brand-burgundy">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-espresso text-base">Quick Faculty Check-In</h3>
                  <p className="text-xs text-brand-warm-gray">Fast manual attendance for any participant</p>
                </div>
              </div>

              <form onSubmit={handleQuickMarkAttendance} className="space-y-3">
                <Input
                  label="Participant Name or Registration ID"
                  placeholder="e.g. Siddharth Sharma or REG-102"
                  value={quickMarkInput}
                  onChange={(e) => setQuickMarkInput(e.target.value)}
                />
                <Button type="submit" variant="primary" disabled={quickLoading} className="w-full h-11 text-sm font-bold">
                  {quickLoading ? 'Marking...' : 'Mark Present'}
                </Button>
              </form>

              {quickMarkResult && (
                <div
                  className={`p-4 rounded-xl border text-xs ${
                    quickMarkResult.success
                      ? 'bg-brand-olive/10 border-brand-olive/30 text-brand-olive'
                      : 'bg-brand-red/10 border-brand-red/30 text-brand-red'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {quickMarkResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{quickMarkResult.message}</span>
                  </div>
                </div>
              )}

              {Array.isArray(attendanceRecords?.[String(selectedEventId)]) && attendanceRecords[String(selectedEventId)].length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-brand-warm-gray">Recent check-ins</p>
                  {attendanceRecords[String(selectedEventId)].slice(0, 4).map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-brand-beige bg-brand-cream/40 p-3 text-xs text-brand-warm-gray">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-brand-espresso">{entry.participant}</span>
                        <Badge variant="success" size="xs">Present</Badge>
                      </div>
                      <p className="mt-1">Marked by {entry.markedBy}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 bg-brand-ivory space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-burgundy/10 text-brand-burgundy">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-espresso text-base">QR Scanner Terminal</h3>
                  <p className="text-xs text-brand-warm-gray">Authorized Staff Entrance Scan</p>
                </div>
              </div>

              <form onSubmit={handleScanSubmit} className="space-y-3">
                <Input
                  label="Scan QR Code Payload or Enter Reg ID"
                  placeholder="e.g. EVENTIQ:REG-1:a1b2c3d4e5f6 or 1"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                />
                <Button type="submit" variant="primary" disabled={loading} className="w-full h-11 text-sm font-bold">
                  {loading ? 'Verifying...' : 'Verify & Mark Attendance'}
                </Button>
              </form>

              {scanResult && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    scanResult.success
                      ? 'bg-brand-olive/10 border-brand-olive/30 text-brand-olive'
                      : scanResult.status === 'DUPLICATE'
                      ? 'bg-brand-ochre/10 border-brand-ochre/30 text-brand-ochre'
                      : 'bg-brand-red/10 border-brand-red/30 text-brand-red'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {scanResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{scanResult.message}</span>
                  </div>
                  {scanResult.participant && (
                    <div className="space-y-1 font-mono pt-1">
                      <p>Name: {scanResult.participant.name}</p>
                      <p>Email: {scanResult.participant.email}</p>
                      <p>Department: {scanResult.participant.department}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Participant Event Pass Preview */}
        <div className={isStaff ? 'lg:col-span-6 space-y-6' : 'lg:col-span-12 space-y-6'}>
          <Card className="p-6 bg-brand-ivory space-y-4">
            <h3 className="font-bold text-brand-espresso text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-brand-burgundy" />
              Event Pass Preview
            </h3>
            <PersonalizedEventPass registrationId={1} />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default AttendancePage;
