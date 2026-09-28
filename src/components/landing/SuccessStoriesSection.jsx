import React from 'react';
import PageContainer from '../ui/PageContainer';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { Quote, Star, Trophy, Building } from 'lucide-react';

/**
 * SuccessStoriesSection Component
 * Highlights institutional success and testimonials anchored by image-6.png celebrating students illustration.
 */
export const SuccessStoriesSection = () => {
  const testimonials = [
    {
      quote: "EventIQ's attendance prediction eliminated our food waste by 35% and guaranteed perfect auditorium sizing for our annual tech summit.",
      author: "Dr. Eleanor Vance",
      title: "Director of Institutional Events",
      org: "State University Operations",
    },
    {
      quote: "The What-If Simulator allowed our student council to re-assign venues 3 weeks before launch without logistics chaos.",
      author: "Marcus Brody",
      title: "Faculty Event Coordinator",
      org: "Department of Computer Science",
    },
  ];

  return (
    <section className="scroll-mt-[72px] py-16 sm:py-24 bg-brand-ivory border-b border-brand-beige font-outfit">
      <PageContainer maxWidth="7xl" className="space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="burgundy" size="sm" className="mx-auto uppercase tracking-wider font-bold">
            Success Stories
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-espresso tracking-tight">
            Trusted by Campuses & Event Managers
          </h2>
          <p className="text-base sm:text-lg text-brand-warm-gray leading-relaxed">
            See how universities optimize logistics, reduce equipment bottlenecks, and run seamless student & academic events.
          </p>
        </div>

        {/* Main Content Grid: Image-6 Visual + Testimonial Quotes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Visual: Image-6 Celebrating Students */}
          <div className="lg:col-span-6 animate-illustration-fade">
            <Card className="p-6 sm:p-8 bg-brand-cream/80 border-brand-beige rounded-[16px] shadow-md hover:shadow-lg transition-transform space-y-4">
              <div className="flex items-center justify-between border-b border-brand-beige pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-brand-ochre" />
                  Campus Impact Milestone
                </span>
                <Badge variant="success" size="sm">500+ Campuses</Badge>
              </div>

              <div className="p-4 bg-brand-ivory rounded-[12px] border border-brand-beige/60 flex items-center justify-center">
                <img
                  src="/illustrations/image-6.png"
                  alt="Celebrating students holding a trophy and institutional banner"
                  className="w-full h-auto max-h-[300px] object-contain rounded-[12px]"
                />
              </div>

              <div className="p-4 bg-brand-burgundy text-brand-ivory rounded-[12px] flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-ochre" />
                  <span>500+ Partner Colleges & Universities</span>
                </div>
                <div className="flex items-center gap-1 text-brand-ochre">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Testimonial Quote Cards */}
          <div className="lg:col-span-6 space-y-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="p-6 bg-brand-cream/60 border-brand-beige rounded-[16px] shadow-sm space-y-4 relative">
                <Quote className="w-8 h-8 text-brand-burgundy/20 absolute top-4 right-4" />
                <p className="text-base text-brand-espresso italic leading-relaxed pr-6">
                  "{t.quote}"
                </p>
                <div className="border-t border-brand-beige/60 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-sm text-brand-espresso">{t.author}</h4>
                    <span className="text-brand-warm-gray">{t.title} • {t.org}</span>
                  </div>
                  <Badge variant="neutral" size="sm">Verified Review</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default SuccessStoriesSection;
