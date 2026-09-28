import React from 'react';
import { CalendarDays, Users, BarChart3, Boxes, SlidersHorizontal, GitCompareArrows } from 'lucide-react';
import PageContainer from '../ui/PageContainer';
import SectionHeading from '../ui/SectionHeading';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * EventIQ FeaturesSection Component
 * Displays the 6 core capabilities of the EventIQ platform using standard Card primitive.
 */
export const FeaturesSection = () => {
  const features = [
    {
      title: 'Event Management',
      description: 'Create, organize, and manage your events from one place.',
      icon: CalendarDays,
    },
    {
      title: 'Attendance Insights',
      description: 'Understand attendance patterns and make better planning decisions.',
      icon: Users,
    },
    {
      title: 'Smart Analytics',
      description: 'Turn event data into clear and useful insights.',
      icon: BarChart3,
    },
    {
      title: 'Resource Planning',
      description: 'Plan venues, staff, equipment, and budgets more efficiently.',
      icon: Boxes,
    },
    {
      title: 'Event Optimizer',
      description: 'Find smarter ways to allocate resources and improve event planning.',
      icon: SlidersHorizontal,
    },
    {
      title: 'What-If Simulator',
      description: 'Explore different event scenarios before making important decisions.',
      icon: GitCompareArrows,
    },
  ];

  return (
    <section id="features" className="scroll-mt-[72px] py-16 sm:py-24 bg-brand-cream border-b border-brand-beige font-outfit">
      <PageContainer maxWidth="7xl" className="space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="burgundy" size="sm" className="mx-auto uppercase tracking-wider font-bold">
            Event Intelligence
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-espresso tracking-tight">
            Everything You Need for Smarter Events
          </h2>
          <p className="text-base sm:text-lg text-brand-warm-gray leading-relaxed">
            A single platform that helps you plan, manage, understand, and improve every stage of your event.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                variant="feature"
                className="space-y-4 hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-[12px] bg-brand-burgundy-soft/40 text-brand-burgundy flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-brand-espresso tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-brand-warm-gray leading-relaxed">
                    {feature.description}
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

export default FeaturesSection;
