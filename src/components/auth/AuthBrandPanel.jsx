import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import CollaborativeTeamIllustration from '../illustrations/CollaborativeTeamIllustration';

/**
 * EventIQ AuthBrandPanel Component
 * Left-hand brand showcase panel for Login & Signup pages featuring a duotone maroon-tinted team illustration.
 */
export const AuthBrandPanel = ({
  headline = 'Welcome Back to EventIQ',
  subtext = 'Continue planning smarter events with institutional intelligence.',
}) => {
  return (
    <div className="h-full bg-brand-burgundy text-brand-ivory p-8 sm:p-10 flex flex-col justify-between font-outfit rounded-card relative overflow-hidden">
      
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-burgundy via-brand-burgundy/95 to-brand-burgundy-dark opacity-90 -z-10" />

      {/* Brand Header Logo & Text Content */}
      <div className="space-y-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-[10px] bg-brand-ivory text-brand-burgundy flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            EQ
          </div>
          <span className="font-outfit font-extrabold text-2xl tracking-tight text-brand-ivory">
            EventIQ
          </span>
        </Link>

        {/* Narrative Headline & Bullets */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-brand-ivory">
            {headline}
          </h2>
          <p className="text-sm text-brand-burgundy-soft leading-relaxed">
            {subtext}
          </p>

          <div className="space-y-2.5 pt-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-burgundy-soft shrink-0" />
              <span>Real-time event intelligence & telemetry</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-burgundy-soft shrink-0" />
              <span>Predictive attendance models</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-burgundy-soft shrink-0" />
              <span>Resource allocation optimization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Duotone Maroon Team Illustration (Positioned as brand graphic) */}
      <div className="my-4 relative z-0 animate-illustration-fade">
        <CollaborativeTeamIllustration 
          variant="maroon-duotone"
          className="w-full h-auto max-h-[190px] object-contain opacity-95 filter drop-shadow-sm"
          alt="Duotone illustration of a team collaborating on event management"
        />
      </div>

      {/* Product Preview Card */}
      <div className="pt-2 relative z-10">
        <Card className="bg-brand-burgundy-dark/80 backdrop-blur-xs border-brand-burgundy-soft/20 text-brand-ivory p-4 space-y-2 rounded-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-burgundy-soft" />
              Institutional Workspace
            </span>
            <Badge variant="success" size="sm">Active</Badge>
          </div>
          <p className="text-xs text-brand-burgundy-soft/90 leading-relaxed">
            Manage your organization's events and resource allocation securely.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AuthBrandPanel;

