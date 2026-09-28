import React from 'react';
import { FilePlus, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import PageContainer from '../ui/PageContainer';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * EventIQ HowItWorksSection Component
 * 4-step workflow process with Space Grotesk step numbers.
 */
export const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Create Your Event',
      description: 'Set up your event details, schedule, and basic requirements.',
      icon: FilePlus,
    },
    {
      num: '02',
      title: 'Plan Your Resources',
      description: 'Organize the people, spaces, budget, and resources needed.',
      icon: Layers,
    },
    {
      num: '03',
      title: 'Get Smart Insights',
      description: 'Use analytics and predictions to understand what may happen.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'Run and Improve',
      description: 'Monitor your event and use insights to make future events better.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-[72px] py-16 sm:py-24 bg-brand-ivory border-b border-brand-beige font-outfit">
      <PageContainer maxWidth="7xl" className="space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="neutral" size="sm" className="mx-auto uppercase tracking-wider font-bold">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-espresso tracking-tight">
            From Planning to Better Decisions
          </h2>
          <p className="text-base sm:text-lg text-brand-warm-gray leading-relaxed">
            A structured four-step workflow designed for institutional efficiency.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.num} className="relative space-y-4 p-6 bg-brand-cream/50 border-brand-beige">
                <div className="flex items-center justify-between">
                  {/* Step Number in Space Grotesk Font */}
                  <span className="font-space font-extrabold text-3xl text-brand-burgundy/40">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-[10px] bg-brand-burgundy text-brand-ivory flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <h3 className="text-lg font-bold text-brand-espresso tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-warm-gray leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
};

export default HowItWorksSection;
