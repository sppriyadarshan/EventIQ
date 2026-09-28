import React from 'react';
import PageContainer from '../ui/PageContainer';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { Lightbulb, Layers, UserCheck, Presentation, PartyPopper } from 'lucide-react';

/**
 * SmartRecommendationFlowSection Component
 * 5-step AI-guided event planning workflow section showcasing idea concept, format selection, guest registration, auditorium keynotes, and festival celebration.
 */
export const SmartRecommendationFlowSection = () => {
  const steps = [
    {
      num: '1',
      phase: 'Concept Phase',
      icon: Lightbulb,
      title: 'Step 1: Smart Concept & Idea',
      description: 'Input event goals and parameters to generate automated demand forecasts and AI concept recommendations.',
      image: '/illustrations/flow-step-1.png',
      alt: 'Student working at laptop with illuminated lightbulb concept pop-up and UI window',
    },
    {
      num: '2',
      phase: 'Format Alignment',
      icon: Layers,
      title: 'Step 2: Pick Event Format',
      description: 'Compare workshops, keynotes, and hackathons to select the optimal format, venue size, and budget threshold.',
      image: '/illustrations/flow-step-2.png',
      alt: 'Student evaluating event format cards between music, trophy, and microphone',
    },
    {
      num: '3',
      phase: 'Guest Registration',
      icon: UserCheck,
      title: 'Step 3: Registration & Check-In',
      description: 'Streamline attendee registration, issue digital badges, and track real-time venue check-ins seamlessly.',
      image: '/illustrations/flow-step-3.png',
      alt: 'Staff managing registration desk with badges and tablet check-in',
    },
    {
      num: '4',
      phase: 'Auditorium Execution',
      icon: Presentation,
      title: 'Step 4: Main Stage & Keynotes',
      description: 'Monitor hall capacity, stage lighting, and auditorium seating for keynote addresses and main presentations.',
      image: '/illustrations/flow-step-4.png',
      alt: 'Auditorium filled with audience watching speaker on stage under spotlight',
    },
    {
      num: '5',
      phase: 'Campus Festivities',
      icon: PartyPopper,
      title: 'Step 5: Festival & Engagement',
      description: 'Drive post-session networking, student celebrations, and live telemetry tracking across outdoor campus festivals.',
      image: '/illustrations/flow-step-5.png',
      alt: 'Students enjoying an outdoor campus fest with string lights, flags, and photos',
    },
  ];

  return (
    <section className="scroll-mt-[72px] py-16 sm:py-24 bg-brand-ivory border-b border-brand-beige font-outfit">
      <PageContainer maxWidth="7xl" className="space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="burgundy" size="sm" className="mx-auto uppercase tracking-wider font-bold">
            Smart Recommendations
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-espresso tracking-tight">
            AI-Guided Event Planning Workflow
          </h2>
          <p className="text-base sm:text-lg text-brand-warm-gray leading-relaxed">
            A comprehensive 5-step lifecycle — from smart idea generation to campus festival celebrations.
          </p>
        </div>

        {/* 5-Step Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.num}
                className="p-5 bg-brand-cream/80 border-brand-beige rounded-[16px] shadow-md flex flex-col justify-between space-y-5 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="space-y-2.5 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-burgundy text-brand-ivory flex items-center justify-center font-space font-bold text-xs shrink-0">
                      {step.num}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-burgundy flex items-center gap-1 shrink-0">
                      <Icon className="w-3.5 h-3.5 text-brand-burgundy" />
                      {step.phase}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-espresso tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-brand-warm-gray leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Image Container with padding and rounded corners */}
                <div className="p-3 bg-brand-ivory/90 rounded-[12px] border border-brand-beige/60 flex items-center justify-center">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-auto max-h-[170px] object-contain rounded-[8px]"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
};

export default SmartRecommendationFlowSection;
