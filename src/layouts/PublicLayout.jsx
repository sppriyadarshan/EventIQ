import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';

/**
 * PublicLayout Layout Shell (Prompt 3)
 * Full responsive Public Navbar integration, Outlet, and complete polished footer.
 */
export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-espresso font-outfit">
      {/* Full Responsive Public Navbar */}
      <PublicNavbar />

      {/* Main Public Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Complete Polished Footer */}
      <footer className="bg-brand-ivory border-t border-brand-beige py-12 font-outfit">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-between">
            {/* Left Brand Column */}
            <div className="md:col-span-5 space-y-3">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-brand-burgundy text-brand-ivory flex items-center justify-center font-bold text-base">
                  EQ
                </div>
                <span className="font-outfit font-extrabold text-xl tracking-tight text-brand-espresso">
                  Event<span className="text-brand-burgundy">IQ</span>
                </span>
              </Link>
              <p className="text-sm text-brand-warm-gray max-w-sm leading-relaxed">
                Smarter planning for better events. Bringing event intelligence, resource allocation, and real-time telemetry together into a single platform.
              </p>
            </div>

            {/* Right Links Columns */}
            <div className="md:col-span-7 grid grid-cols-3 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-bold text-brand-espresso text-xs uppercase tracking-wider">Product</h4>
                <ul className="space-y-2 text-brand-warm-gray">
                  <li><a href="/#features" className="hover:text-brand-burgundy transition-colors">Features</a></li>
                  <li><a href="/#how-it-works" className="hover:text-brand-burgundy transition-colors">How It Works</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-brand-espresso text-xs uppercase tracking-wider">Platform</h4>
                <ul className="space-y-2 text-brand-warm-gray">
                  <li><Link to="/dashboard" className="hover:text-brand-burgundy transition-colors">Dashboard</Link></li>
                  <li><Link to="/analytics" className="hover:text-brand-burgundy transition-colors">Analytics</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-brand-espresso text-xs uppercase tracking-wider">Company</h4>
                <ul className="space-y-2 text-brand-warm-gray">
                  <li><a href="/#why-eventiq" className="hover:text-brand-burgundy transition-colors">About</a></li>
                  <li><Link to="/login" className="hover:text-brand-burgundy transition-colors">Sign In</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-brand-beige/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-warm-gray">
            <p>© {new Date().getFullYear()} EventIQ. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Institutional Event Intelligence</span>
              <span>•</span>
              <span>Privacy & Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
