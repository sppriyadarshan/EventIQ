import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, SlidersHorizontal, Boxes, ArrowRight } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useEventIQ } from '../../context/EventIQContext';

/**
 * EventIQ SmartRecommendations Component
 * Displays AI recommendations derived from current state with direct action to optimizer.
 */
export const SmartRecommendations = () => {
  const navigate = useNavigate();
  const { optimizerState, applyRecommendation } = useEventIQ();
  const recommendations = optimizerState?.recommendations || [];

  const getIcon = (category) => {
    switch (category) {
      case 'Staffing':
        return <Users className="w-5 h-5 text-brand-burgundy" />;
      case 'Equipment':
        return <SlidersHorizontal className="w-5 h-5 text-brand-ochre" />;
      case 'Venue':
      default:
        return <Boxes className="w-5 h-5 text-brand-olive" />;
    }
  };

  return (
    <Card variant="standard" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-burgundy" />
              Smart Recommendations
            </CardTitle>
            <Badge variant="burgundy" size="sm">AI Optimizer Insights</Badge>
          </div>
          <CardDescription>Suggested optimization actions synthesized from event & resource data</CardDescription>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 font-outfit">
        {recommendations.slice(0, 3).map((rec) => (
          <Card
            key={rec.id}
            variant="recommendation"
            className="flex flex-col justify-between space-y-3 p-4 bg-brand-cream/40"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-[8px] bg-brand-ivory border border-brand-beige">
                  {getIcon(rec.category)}
                </div>
                <Badge
                  variant={rec.priority === 'High' ? 'red' : rec.priority === 'Medium' ? 'ochre' : 'olive'}
                  size="sm"
                >
                  {rec.priority} Priority
                </Badge>
              </div>

              <h4 className="font-bold text-sm text-brand-espresso">
                {rec.title}
              </h4>
              <p className="text-xs text-brand-warm-gray leading-relaxed">
                {rec.description}
              </p>
            </div>

            <div className="pt-2 border-t border-brand-beige/60 flex items-center justify-between">
              <span className="text-[11px] font-space-grotesk text-brand-burgundy font-bold">
                Impact: {rec.impact}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!rec.applied) {
                    applyRecommendation(rec.id);
                  }
                  navigate('/optimizer');
                }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs font-semibold"
              >
                {rec.applied ? 'Viewed' : 'Apply'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default SmartRecommendations;

