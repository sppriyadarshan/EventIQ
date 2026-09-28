import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageContainer from '../ui/PageContainer';
import Button from '../ui/Button';

/**
 * EventIQ FinalCTASection Component
 * Solid Burgundy CTA section with Ivory typography and action buttons.
 */
export const FinalCTASection = () => {
  return (
    <section className="bg-brand-burgundy text-brand-ivory py-16 sm:py-24 font-outfit">
      <PageContainer maxWidth="5xl" className="text-center space-y-8">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Ready to Plan Smarter?
        </h2>

        <p className="text-base sm:text-xl text-brand-burgundy-soft max-w-2xl mx-auto leading-relaxed">
          Bring your event planning, insights, and decisions together in one place.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/signup">
            <Button
              variant="secondary"
              size="lg"
              className="bg-brand-ivory text-brand-burgundy hover:bg-brand-cream border-none"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant="soft"
              size="lg"
              className="bg-brand-burgundy-dark text-brand-ivory hover:bg-brand-burgundy-dark/80 border border-brand-burgundy-soft/30"
            >
              Explore the Platform
            </Button>
          </Link>
        </div>
      </PageContainer>
    </section>
  );
};

export default FinalCTASection;
