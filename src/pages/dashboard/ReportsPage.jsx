import React, { useState } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FileText, Download, CalendarDays, Users } from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';
import EventReportModal from '../../components/reports/EventReportModal';

export const ReportsPage = () => {
  const { events } = useEventIQ();
  const [selectedEventId, setSelectedEventId] = useState(null);

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
      <div>
        <Badge variant="burgundy" size="sm">
          Executive Reports
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight mt-1">
          Event Intelligence & Analytics Reports
        </h1>
        <p className="text-sm text-brand-warm-gray">
          Generate comprehensive PDF executive reports containing turnout prediction, OR-Tools resource allocation, and turnout metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <Card key={evt.id} className="p-5 bg-brand-ivory space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="burgundy" size="xs">{evt.type || 'Conference'}</Badge>
                <Badge variant="soft" size="xs">{evt.status || 'Planning'}</Badge>
              </div>
              <h3 className="font-bold text-brand-espresso text-base">{evt.name}</h3>
              <p className="text-xs text-brand-warm-gray line-clamp-2">{evt.description || 'Institutional event'}</p>
            </div>

            <div className="pt-2 border-t border-brand-beige/80 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs text-brand-warm-gray">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-burgundy">Expected</span>
                  <span className="font-bold text-brand-espresso font-space-grotesk">{evt.expectedAttendance || 100}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-brand-burgundy">Readiness</span>
                  <span className="font-bold text-brand-espresso font-space-grotesk">{evt.readiness || 85}%</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedEventId(evt.backendId || evt.id)}
                className="w-full text-xs font-bold"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                View & Export Report
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedEventId && (
        <EventReportModal
          isOpen={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
          eventId={selectedEventId}
        />
      )}
    </PageContainer>
  );
};

export default ReportsPage;
