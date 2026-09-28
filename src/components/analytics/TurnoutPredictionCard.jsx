import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Layers, Database, Sparkles } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

const TurnoutPredictionCard = ({ eventData }) => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLivePrediction, setIsLivePrediction] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPrediction = async () => {
      setLoading(true);
      const payload = {
        registered_count: eventData?.registered_count || eventData?.expectedAttendance || 450,
        expected_attendance: eventData?.expected_attendance || eventData?.expectedAttendance || 400,
        venue_capacity: eventData?.venue_capacity || eventData?.capacity || 500,
        event_type: eventData?.event_type || eventData?.type || 'Conference',
        department_code: eventData?.department_code || eventData?.department || 'CSE',
        duration_hours: eventData?.duration_hours || 6.0,
        is_holiday: Boolean(eventData?.is_holiday),
        budget_allocated: eventData?.budget_allocated || 15000.0,
        weather_condition: eventData?.weather_condition || 'Clear',
      };

      try {
        const res = await apiClient.predictions.predictTurnout(payload);
        if (isMounted && res) {
          setPredictionResult(res);
          setIsLivePrediction(true);
        }
      } catch (err) {
        if (isMounted) {
          // Deterministic Demo Fallback
          setIsLivePrediction(false);
          const reg = payload.registered_count;
          const cap = payload.venue_capacity;
          const fallbackAttendance = Math.min(Math.round(reg * 0.88), cap);
          
          setPredictionResult({
            predicted_attendance: fallbackAttendance,
            predicted_turnout_rate: Number((fallbackAttendance / reg).toFixed(4)),
            evaluation_metrics: { mae: 42.6, rmse: 70.7, r2_score: 0.914 },
            dataset_composition: { database_records_used: 0, synthetic_records_used: 120, total_records_used: 120 },
            shap_contributions: [
              { feature: 'registered_count', display_name: 'Registration Volume', shap_value: 48.2, direction: 'positive_contribution', description: 'Registration count positively drives expected attendance.' },
              { feature: 'venue_capacity', display_name: 'Venue Capacity Limit', shap_value: -15.4, direction: 'limiting_factor', description: 'Venue cap acts as an operational boundary.' },
              { feature: 'event_type', display_name: 'Event Category (Conference)', shap_value: 12.1, direction: 'positive_contribution', description: 'Academic conferences show higher average turnout.' },
              { feature: 'duration_hours', display_name: 'Full-Day Duration', shap_value: -6.3, direction: 'negative_contribution', description: 'Longer duration slightly reduces full-session retention.' },
            ],
            model_metadata: { algorithm: 'LightGBM Regressor', explainer: 'SHAP TreeExplainer', notice: 'Demo fallback data (Backend offline)' }
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPrediction();

    return () => {
      isMounted = false;
    };
  }, [eventData]);

  if (loading) {
    return (
      <div className="bg-cream-dark/60 border border-burgundy/15 rounded-xl p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-burgundy/10 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-burgundy/10 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-burgundy/10 rounded w-full"></div>
      </div>
    );
  }

  const { predicted_attendance, predicted_turnout_rate, evaluation_metrics, dataset_composition, shap_contributions } = predictionResult || {};
  const turnoutPercentage = Math.round((predicted_turnout_rate || 0) * 100);

  return (
    <div className="bg-cream-dark border border-burgundy/15 rounded-xl p-6 shadow-sm transition-all hover:border-burgundy/30">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-burgundy/10">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-burgundy" />
          <h3 className="font-outfit font-semibold text-lg text-burgundy">AI Turnout Prediction</h3>
        </div>

        {/* Source Badge */}
        {isLivePrediction ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIGHTGBM ML PREDICTION
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            DEMO FALLBACK DATA
          </span>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 rounded-lg p-4 border border-burgundy/10">
          <span className="text-xs font-outfit uppercase tracking-wider text-muted-slate font-medium">Predicted Attendance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-space-grotesk font-bold text-3xl text-burgundy">{predicted_attendance?.toLocaleString()}</span>
            <span className="text-xs text-muted-slate font-outfit">attendees</span>
          </div>
        </div>

        <div className="bg-white/70 rounded-lg p-4 border border-burgundy/10">
          <span className="text-xs font-outfit uppercase tracking-wider text-muted-slate font-medium">Expected Turnout Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-space-grotesk font-bold text-3xl text-burgundy">{turnoutPercentage}%</span>
            <span className="text-xs text-emerald-700 font-medium font-outfit">of registered</span>
          </div>
        </div>
      </div>

      {/* SHAP Feature Attribution Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-warm-ochre" />
          <h4 className="font-outfit font-medium text-sm text-burgundy uppercase tracking-wider">Top SHAP Feature Contributions</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shap_contributions?.map((item, idx) => {
            const isPos = item.direction === 'positive_contribution';
            const isLimiting = item.direction === 'limiting_factor';
            
            return (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border text-xs font-outfit flex flex-col justify-between ${
                  isPos 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                    : isLimiting 
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-rose-50/70 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    {isPos ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {item.display_name}
                  </span>
                  <span className="font-space-grotesk font-bold">
                    {item.shap_value > 0 ? `+${item.shap_value}` : item.shap_value}
                  </span>
                </div>
                <p className="opacity-90 leading-relaxed text-[11px]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Metadata Footer */}
      <div className="pt-3 border-t border-burgundy/10 flex flex-wrap items-center justify-between text-[11px] text-muted-slate font-outfit gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-burgundy/70" />
            Model: LightGBM Regressor
          </span>
          {evaluation_metrics && (
            <span>
              Test MAE: <strong>{evaluation_metrics.mae}</strong> | R²: <strong>{evaluation_metrics.r2_score}</strong>
            </span>
          )}
        </div>

        {dataset_composition && (
          <div className="flex items-center gap-1.5 bg-burgundy/5 px-2.5 py-1 rounded-md border border-burgundy/10">
            <Database className="w-3 h-3 text-burgundy/70" />
            <span>
              Dataset: {dataset_composition.database_records_used} DB + {dataset_composition.synthetic_records_used} Synthetic ({dataset_composition.total_records_used} total)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TurnoutPredictionCard;
