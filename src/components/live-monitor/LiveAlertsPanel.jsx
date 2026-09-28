import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Check } from 'lucide-react';

export default function LiveAlertsPanel({
  alerts = [],
  acknowledgedAlerts = new Set(),
  onAcknowledgeAlert,
}) {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Information':
        return 'bg-burgundy/10 text-burgundy border-burgundy/20';
      default:
        return 'bg-sand text-espresso/80 border-espresso/10';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical':
        return <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />;
      case 'Warning':
        return <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />;
      case 'Information':
        return <CheckCircle2 className="w-4 h-4 text-burgundy shrink-0" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-espresso/60 shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Live Alerts & Notifications
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              Live Alerts
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Real-time operational alerts requiring supervisor attention or protocol adjustments.
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="p-6 text-center bg-emerald-50/30 rounded-xl border border-emerald-200 space-y-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
          <p className="text-xs font-semibold text-espresso font-outfit">
            No active unhandled operational alerts for this event.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const isAcked = acknowledgedAlerts.has(alert.id);

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  isAcked
                    ? 'bg-warm-cream/30 border-espresso/10 opacity-70'
                    : 'bg-warm-cream/50 border-espresso/15 hover:border-burgundy/30 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {getSeverityIcon(alert.severity)}
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border font-outfit ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-outfit">
                      <span className="text-espresso/50 font-space-grotesk">{alert.timestamp}</span>
                      <span className="text-espresso/40">•</span>
                      <span className="text-espresso/60 font-medium">{alert.affectedArea}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-espresso font-outfit">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-espresso/70 leading-relaxed font-outfit">
                    {alert.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-espresso/10 flex items-center justify-between text-xs font-outfit">
                  <span className="text-burgundy font-medium text-xs leading-snug">
                    Action: {alert.recommendedAction}
                  </span>

                  <button
                    type="button"
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    disabled={isAcked}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg font-outfit transition-all flex items-center gap-1 shrink-0 ${
                      isAcked
                        ? 'bg-sand text-espresso/50 border border-espresso/10 cursor-default'
                        : 'bg-burgundy text-white hover:bg-dark-burgundy border border-transparent shadow-sm'
                    }`}
                  >
                    {isAcked ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Acknowledged
                      </>
                    ) : (
                      'Acknowledge'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
