import React from 'react';
import PageContainer from '../ui/PageContainer';
import AuthBrandPanel from './AuthBrandPanel';

/**
 * EventIQ AuthFormLayout Component
 * Two-column desktop, stacked mobile layout wrapper for Login & Signup pages.
 */
export const AuthFormLayout = ({
  children,
  brandHeadline,
  brandSubtext,
}) => {
  return (
    <PageContainer maxWidth="6xl" className="py-8 sm:py-16 font-outfit">
      <div className="bg-brand-ivory border border-brand-beige rounded-card shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left Column: Brand Panel (Hidden on small mobile, visible on lg) */}
        <div className="hidden lg:block lg:col-span-5 p-3">
          <AuthBrandPanel
            headline={brandHeadline}
            subtext={brandSubtext}
          />
        </div>

        {/* Right Column: Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </PageContainer>
  );
};

export default AuthFormLayout;
