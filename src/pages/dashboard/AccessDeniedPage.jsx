import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useEventIQ } from '../../context/EventIQContext';

export const AccessDeniedPage = ({ requiredRole = 'administrators' }) => {
  const { auth } = useEventIQ();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-outfit">
      <Card className="max-w-md w-full p-8 text-center space-y-6 bg-brand-ivory border-brand-beige shadow-xl rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="critical" size="sm">
            Access Restricted
          </Badge>
          <h1 className="text-2xl font-extrabold text-brand-espresso tracking-tight">
            Access restricted to {requiredRole}.
          </h1>
          <p className="text-xs sm:text-sm text-brand-warm-gray leading-relaxed">
            Your current role (<strong className="text-brand-burgundy">{auth?.user?.role || 'User'}</strong>) does not have authorization to view this module.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-brand-cream/60 border border-brand-beige text-left text-xs text-brand-warm-gray space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-brand-espresso">
            <Lock className="w-3.5 h-3.5 text-brand-burgundy" />
            Security & Permission Control
          </div>
          <p>
            Role-Based Access Control (RBAC) enforces strict authorization policies across all frontend views and backend REST APIs.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="primary" className="w-full h-11 text-sm font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to My Workspace
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AccessDeniedPage;
