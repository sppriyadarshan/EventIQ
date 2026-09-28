import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import MobileNavDrawer from './MobileNavDrawer';

/**
 * EventIQ Public Navbar Component
 * Desktop & Mobile navigation header for public pages.
 */
export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', targetId: 'home', href: '#home' },
    { label: 'About', targetId: 'about', href: '#about' },
    { label: 'How It Works', targetId: 'how-it-works', href: '#how-it-works' },
    { label: 'Features', targetId: 'features', href: '#features' },
  ];

  // Auto-scroll on mount or route location hash change
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const isLinkActive = (targetId) => {
    if (location.pathname !== '/') return false;
    const currentHash = location.hash.replace('#', '');
    if (!currentHash && targetId === 'home') return true;
    return currentHash === targetId;
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory border-b border-brand-beige h-[72px] font-outfit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand Wordmark Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-[10px] bg-brand-burgundy text-brand-ivory flex items-center justify-center font-bold text-lg tracking-tight group-hover:bg-brand-burgundy-dark transition-colors">
            EQ
          </div>
          <span className="font-outfit font-extrabold text-2xl tracking-tight text-brand-espresso">
            Event<span className="text-brand-burgundy">IQ</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.targetId);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.targetId)}
                className={`relative text-sm font-semibold transition-colors py-1 ${
                  active
                    ? 'text-brand-burgundy font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-burgundy after:rounded-full'
                    : 'text-brand-warm-gray hover:text-brand-burgundy'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <IconButton
            variant="ghost"
            size="md"
            onClick={() => setMobileMenuOpen(true)}
            ariaLabel="Open navigation menu"
          >
            <Menu className="w-6 h-6 text-brand-espresso" />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer Shell */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="EventIQ Menu"
      >
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.targetId);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.targetId)}
                  className={`px-3 py-2.5 rounded-[8px] text-base font-semibold transition-colors ${
                    active
                      ? 'bg-brand-burgundy-soft/40 text-brand-burgundy font-bold'
                      : 'text-brand-espresso hover:bg-brand-beige/40'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="pt-4 border-t border-brand-beige flex flex-col gap-2.5">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </MobileNavDrawer>
    </header>
  );
};

export default PublicNavbar;

