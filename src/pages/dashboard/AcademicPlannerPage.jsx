import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { GraduationCap, Clock, Building, CheckCircle2, AlertTriangle, Search } from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';

const mockAcademicSchedules = {
  CSE: [
    { semester: 5, section: 'A', day_of_week: 'Monday', subject_activity: 'Data Structures Lab', start_time: '09:00', end_time: '11:00', venue_id: 'CSE-201', department_code: 'CSE' },
    { semester: 5, section: 'A', day_of_week: 'Tuesday', subject_activity: 'Operating Systems', start_time: '11:15', end_time: '12:45', venue_id: 'CSE-204', department_code: 'CSE' },
    { semester: 7, section: 'B', day_of_week: 'Wednesday', subject_activity: 'Compiler Design', start_time: '14:00', end_time: '15:30', venue_id: 'CSE-302', department_code: 'CSE' },
    { semester: 7, section: 'B', day_of_week: 'Thursday', subject_activity: 'AI Studio', start_time: '10:00', end_time: '12:00', venue_id: 'CSE-210', department_code: 'CSE' },
  ],
  ECE: [
    { semester: 4, section: 'A', day_of_week: 'Monday', subject_activity: 'Signals & Systems', start_time: '09:30', end_time: '11:00', venue_id: 'ECE-104', department_code: 'ECE' },
    { semester: 4, section: 'A', day_of_week: 'Thursday', subject_activity: 'Embedded Systems Lab', start_time: '13:00', end_time: '15:00', venue_id: 'ECE-110', department_code: 'ECE' },
    { semester: 6, section: 'B', day_of_week: 'Friday', subject_activity: 'Digital Communication', start_time: '11:00', end_time: '12:30', venue_id: 'ECE-205', department_code: 'ECE' },
  ],
  MECH: [
    { semester: 3, section: 'A', day_of_week: 'Tuesday', subject_activity: 'Thermodynamics', start_time: '08:30', end_time: '10:00', venue_id: 'MECH-201', department_code: 'MECH' },
    { semester: 5, section: 'A', day_of_week: 'Wednesday', subject_activity: 'Machine Design Lab', start_time: '12:00', end_time: '14:00', venue_id: 'MECH-305', department_code: 'MECH' },
  ],
  CIVIL: [
    { semester: 4, section: 'A', day_of_week: 'Monday', subject_activity: 'Structural Analysis', start_time: '10:00', end_time: '11:30', venue_id: 'CIVIL-102', department_code: 'CIVIL' },
    { semester: 6, section: 'B', day_of_week: 'Friday', subject_activity: 'Concrete Lab', start_time: '14:00', end_time: '16:00', venue_id: 'CIVIL-220', department_code: 'CIVIL' },
  ],
  AIDS: [
    { semester: 3, section: 'A', day_of_week: 'Tuesday', subject_activity: 'Python for Data Science', start_time: '09:00', end_time: '10:30', venue_id: 'AIDS-208', department_code: 'AIDS' },
    { semester: 5, section: 'A', day_of_week: 'Thursday', subject_activity: 'Machine Learning Lab', start_time: '13:00', end_time: '15:00', venue_id: 'AIDS-320', department_code: 'AIDS' },
  ],
  AIML: [
    { semester: 5, section: 'A', day_of_week: 'Monday', subject_activity: 'Deep Learning', start_time: '11:15', end_time: '12:45', venue_id: 'AIML-112', department_code: 'AIML' },
    { semester: 7, section: 'B', day_of_week: 'Friday', subject_activity: 'AI Ethics & Governance', start_time: '10:00', end_time: '11:30', venue_id: 'AIML-215', department_code: 'AIML' },
  ],
  CSBS: [
    { semester: 4, section: 'A', day_of_week: 'Wednesday', subject_activity: 'Business Analytics', start_time: '09:00', end_time: '10:30', venue_id: 'CSBS-204', department_code: 'CSBS' },
    { semester: 6, section: 'B', day_of_week: 'Thursday', subject_activity: 'UX Research Studio', start_time: '14:00', end_time: '16:00', venue_id: 'CSBS-118', department_code: 'CSBS' },
  ],
  EEE: [
    { semester: 3, section: 'A', day_of_week: 'Tuesday', subject_activity: 'Power Systems', start_time: '10:00', end_time: '11:30', venue_id: 'EEE-205', department_code: 'EEE' },
    { semester: 5, section: 'A', day_of_week: 'Friday', subject_activity: 'Control Lab', start_time: '13:00', end_time: '15:00', venue_id: 'EEE-310', department_code: 'EEE' },
  ],
  IT: [
    { semester: 4, section: 'A', day_of_week: 'Monday', subject_activity: 'Web Technologies', start_time: '09:30', end_time: '11:00', venue_id: 'IT-118', department_code: 'IT' },
    { semester: 6, section: 'B', day_of_week: 'Thursday', subject_activity: 'Cloud Systems', start_time: '12:00', end_time: '13:30', venue_id: 'IT-214', department_code: 'IT' },
  ],
  ICE: [
    { semester: 3, section: 'A', day_of_week: 'Wednesday', subject_activity: 'Embedded Control', start_time: '09:00', end_time: '10:30', venue_id: 'ICE-102', department_code: 'ICE' },
    { semester: 5, section: 'B', day_of_week: 'Friday', subject_activity: 'Industrial Automation Lab', start_time: '14:00', end_time: '16:00', venue_id: 'ICE-230', department_code: 'ICE' },
  ],
};

export const AcademicPlannerPage = () => {
  const { auth } = useEventIQ();
  const [schedules, setSchedules] = useState([]);
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const { apiClient } = await import('../../services/apiClient');
        const res = await apiClient.academicSchedule.getSchedules(selectedDept);
        if (Array.isArray(res) && res.length > 0) {
          setSchedules(res);
        } else {
          setSchedules(mockAcademicSchedules[selectedDept] || mockAcademicSchedules.CSE);
        }
      } catch (err) {
        console.warn('Schedule fetch failed, using fallback mock schedules:', err);
        setSchedules(mockAcademicSchedules[selectedDept] || mockAcademicSchedules.CSE);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [selectedDept]);

  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'AIDS', 'AIML', 'CSBS', 'EEE', 'IT', 'ICE'];

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="burgundy" size="sm">
            Institutional Academic Planner
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight mt-1">
            Academic Schedule & Timetable Inspector
          </h1>
          <p className="text-sm text-brand-warm-gray">
            Verify academic timetable slots to prevent event scheduling conflicts.
          </p>
        </div>
      </div>

      {/* Department Tabs */}
      <Card className="p-4 bg-brand-ivory flex items-center gap-2 overflow-x-auto scrollbar-thin">
        {departments.map((code) => (
          <button
            key={code}
            onClick={() => setSelectedDept(code)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedDept === code
                ? 'bg-brand-burgundy text-brand-ivory shadow-sm'
                : 'bg-brand-cream/60 text-brand-warm-gray hover:text-brand-burgundy hover:bg-brand-cream'
            }`}
          >
            {code} Dept
          </button>
        ))}
      </Card>

      {/* Schedule Table / List */}
      <Card className="p-6 bg-brand-ivory space-y-4">
        <h3 className="font-bold text-brand-espresso text-base flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-burgundy" />
          Scheduled Timetable Slots for {selectedDept} Department
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-brand-warm-gray">Loading schedules...</div>
        ) : schedules.length === 0 ? (
          <div className="py-8 text-center text-xs text-brand-warm-gray">No academic schedules recorded for this department.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-brand-cream/50 border border-brand-beige space-y-2">
                <div className="flex items-center justify-between font-bold text-brand-espresso">
                  <span>Semester {s.semester} ({s.section})</span>
                  <Badge variant="soft" size="xs">{s.day_of_week}</Badge>
                </div>
                <p className="text-xs font-medium text-brand-burgundy">{s.subject_activity}</p>
                <div className="flex items-center gap-4 text-xs text-brand-warm-gray pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {s.start_time} - {s.end_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    Venue ID: {s.venue_id || 'Lab'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default AcademicPlannerPage;
