import React from 'react';
import HeroSection from '../../components/landing/HeroSection';
import IntroStrip from '../../components/landing/IntroStrip';
import FeaturesSection from '../../components/landing/FeaturesSection';
import SmartRecommendationFlowSection from '../../components/landing/SmartRecommendationFlowSection';
import AnalyticsStatsSection from '../../components/landing/AnalyticsStatsSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import WhyEventIQSection from '../../components/landing/WhyEventIQSection';
import SuccessStoriesSection from '../../components/landing/SuccessStoriesSection';
import CapabilitiesSection from '../../components/landing/CapabilitiesSection';
import FinalCTASection from '../../components/landing/FinalCTASection';

/**
 * EventIQ Public Landing Page
 * Assembles Hero, Intro Strip, Features, AI Recommendations Flow, Analytics Stats, How It Works, Why EventIQ, Success Stories, Capabilities, and Final CTA.
 */
export const HomePage = () => {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* 1. Hero Section (image-1.png) */}
      <HeroSection />

      {/* 2. Introduction Strip */}
      <IntroStrip />

      {/* 3. Event Intelligence Features */}
      <FeaturesSection />

      {/* 4. Smart Recommendations AI Workflow (image-4.png & image-7.png) */}
      <SmartRecommendationFlowSection />

      {/* 5. Analytics Impact & Growth Stats (image-3.png) */}
      <AnalyticsStatsSection />

      {/* 6. How EventIQ Works */}
      <HowItWorksSection />

      {/* 7. Why EventIQ Value Proposition */}
      <WhyEventIQSection />

      {/* 8. Testimonials & Campus Success Stories (image-6.png) */}
      <SuccessStoriesSection />

      {/* 9. Sample Event Overview Capabilities */}
      <CapabilitiesSection />

      {/* 10. Final Call-To-Action */}
      <FinalCTASection />
    </div>
  );
};

export default HomePage;
