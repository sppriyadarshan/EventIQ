import React from 'react';
import { CheckCircle2, TrendingUp, Cpu, Sparkles } from 'lucide-react';
import PageContainer from '../ui/PageContainer';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * EventIQ WhyEventIQSection Component
 * Two-column section detailing EventIQ value proposition and product visualization cards.
 */
export const WhyEventIQSection = () => {
  const valuePoints = [
    'Better Planning',
    'Clearer Insights',
    'Smarter Resource Decisions',
    'Real-Time Visibility',
  ];

  return (
    <section id="about" className="scroll-mt-[72px] py-16 sm:py-24 bg-brand-cream border-b border-brand-beige font-outfit">
      <PageContainer maxWidth="7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Narrative & Points */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="burgundy" size="sm" className="uppercase tracking-wider font-bold">
              Why EventIQ
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-espresso tracking-tight leading-snug">
              Less Guesswork.<br />
              <span className="text-brand-burgundy">Better Events.</span>
            </h2>

            <p className="text-base sm:text-lg text-brand-warm-gray leading-relaxed">
              Event planning often involves many decisions about attendance, resources, budgets, and timing. EventIQ brings important information together so organizers can plan with more confidence and make smarter decisions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {valuePoints.map((point) => (
                <div key={point} className="flex items-center gap-2.5 p-3 rounded-[10px] bg-brand-ivory border border-brand-beige">
                  <CheckCircle2 className="w-5 h-5 text-brand-olive shrink-0" />
                  <span className="font-semibold text-sm text-brand-espresso">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Visualization Composition Cards */}
          <div className="lg:col-span-6 space-y-4">
            <Card variant="standard" className="space-y-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-brand-beige pb-3">
                <span className="text-xs font-bold text-brand-espresso uppercase tracking-wider">
                  Event Intelligence Preview
                </span>
                <Badge variant="burgundy" size="sm">Active Model</Badge>
              </div>

              {/* Attendance Insight Card */}
              <div className="p-4 bg-brand-cream/60 rounded-[10px] border border-brand-beige flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-brand-warm-gray">Attendance Forecast Confidence</span>
                  <div className="font-space font-bold text-2xl text-brand-espresso">94.8%</div>
                </div>
                <div className="p-2.5 rounded-full bg-brand-olive/15 text-brand-olive">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {/* Resource Status Card */}
              <div className="p-4 bg-brand-cream/60 rounded-[10px] border border-brand-beige flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-brand-warm-gray">Resource Allocation Status</span>
                  <div className="font-outfit font-bold text-base text-brand-espresso">Auditorium & Catering Ready</div>
                </div>
                <Badge variant="success" size="sm" dot>Optimized</Badge>
              </div>

              {/* Recommendation Card */}
              <div className="p-4 bg-brand-ivory border-l-4 border-l-brand-burgundy border-y border-r border-brand-beige rounded-[10px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-burgundy flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Strategic Insight
                  </span>
                  <span className="text-xs font-semibold text-brand-warm-gray">Automated</span>
                </div>
                <p className="text-xs text-brand-espresso leading-relaxed">
                  Allocating +50 overflow seats in Annex Room 2 mitigates peak registration congestion.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default WhyEventIQSection;
