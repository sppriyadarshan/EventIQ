import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * EventIQ HeroSection Component
 * Full-width soft/light background image hero design using existing /illustrations/image-1.png asset.
 * Preserves natural bright cream aesthetic with dark EventIQ brand typography in left safe area.
 */
export const HeroSection = () => {
  return (
    <section id="home" className="scroll-mt-[72px] relative min-h-[75vh] min-h-[600px] flex items-center bg-brand-cream border-b border-brand-beige overflow-hidden font-outfit">
      
      {/* 1. FULL HERO BACKGROUND IMAGE - SOFT & BRIGHT (image-1.png) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/illustrations/image-1.png"
          alt="Team of students and faculty collaborating around a table with tablet, laptop, and Event Management banner"
          className="w-full h-full object-cover object-[95%_center] lg:object-[95%_top] transition-transform duration-1000 scale-[1.01]"
        />
      </div>

      {/* 2. VERY SUBTLE LIGHT CREAM SCRIM - NO HEAVY DARK OVERLAY */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-ivory/95 via-brand-ivory/80 to-transparent sm:from-brand-ivory/90 sm:via-brand-ivory/60 sm:to-transparent pointer-events-none" />

      {/* 3. HERO CONTENT LAYERED ON TOP IN LEFT SAFE AREA */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-xl lg:max-w-[520px] space-y-6 text-left">
          
          {/* Institutional Badge */}
          <Badge variant="burgundy" size="md" dot>
            Institutional Event Intelligence Platform
          </Badge>

          {/* Heading - Dark Espresso & Maroon Brand Colors */}
          <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-espresso tracking-tight leading-[1.12]">
            Plan Smarter.<br />
            <span className="text-brand-burgundy">Run Better Events.</span>
          </h1>

          {/* Supporting Description Text - Fine-Tuned Balanced Width */}
          <p className="font-outfit text-base sm:text-lg text-brand-warm-gray leading-relaxed font-normal max-w-md lg:max-w-[450px]">
            EventIQ helps organizations plan, manage, analyze, and optimize events with intelligent insights and real-time visibility.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/signup">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-brand-burgundy text-white hover:bg-brand-burgundy/90 shadow-md px-7"
              >
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                className="bg-brand-ivory hover:bg-brand-cream border-brand-beige text-brand-espresso shadow-sm px-7"
              >
                Explore Dashboard
              </Button>
            </Link>
          </div>

          {/* Feature Highlights - Left Column Alignment */}
          <div className="pt-6 border-t border-brand-beige/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-brand-espresso max-w-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-olive shrink-0" />
              <span>Attendance Prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-olive shrink-0" />
              <span>Resource Optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-olive shrink-0" />
              <span>Live Telemetry</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

