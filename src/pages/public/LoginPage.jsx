import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthFormLayout from '../../components/auth/AuthFormLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useEventIQ } from '../../context/EventIQContext';
import { Shield, Info, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useEventIQ();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Institutional email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          navigate('/dashboard');
        } else {
          setAuthError(res.error || 'Authentication failed.');
        }
      } catch (err) {
        setAuthError(err.message || 'Authentication failed.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleQuickFill = (email, password) => {
    setFormData({
      email,
      password,
      rememberMe: true,
    });
    setErrors({});
    setAuthError(null);
  };

  return (
    <AuthFormLayout
      brandHeadline="Welcome Back to EventIQ"
      brandSubtext="Continue planning smarter events with real-time intelligence."
    >
      <div className="space-y-6 max-w-md mx-auto w-full font-outfit">
        <div className="space-y-2">
          <Badge variant="burgundy" size="sm">
            Institutional Sign In
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight">
            Sign in to your Workspace
          </h1>
          <p className="text-sm text-brand-warm-gray leading-relaxed">
            Enter your institutional credentials or select a demo account role below.
          </p>
        </div>

        {/* Demo Accounts Quick-Select Box */}
        <div className="p-4 bg-brand-cream/70 border border-brand-beige rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Quick Demo Accounts
            </span>
            <span className="text-[11px] text-brand-warm-gray font-medium">Click to Fill</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@eventiq.edu', 'EventIQ@123')}
              className="p-2 rounded-lg bg-brand-ivory border border-brand-beige hover:border-brand-burgundy text-left transition-all"
            >
              <span className="font-bold text-brand-espresso block">ADMIN</span>
              <span className="text-[10px] text-brand-warm-gray block truncate">admin@eventiq.edu</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('faculty@eventiq.edu', 'EventIQ@123')}
              className="p-2 rounded-lg bg-brand-ivory border border-brand-beige hover:border-brand-burgundy text-left transition-all"
            >
              <span className="font-bold text-brand-espresso block">FACULTY</span>
              <span className="text-[10px] text-brand-warm-gray block truncate">faculty@eventiq.edu</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('student@eventiq.edu', 'EventIQ@123')}
              className="p-2 rounded-lg bg-brand-ivory border border-brand-beige hover:border-brand-burgundy text-left transition-all"
            >
              <span className="font-bold text-brand-espresso block">PARTICIPANT</span>
              <span className="text-[10px] text-brand-warm-gray block truncate">student@eventiq.edu</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('logistics@eventiq.edu', 'EventIQ@123')}
              className="p-2 rounded-lg bg-brand-ivory border border-brand-beige hover:border-brand-burgundy text-left transition-all"
            >
              <span className="font-bold text-brand-espresso block">LOGISTICS</span>
              <span className="text-[10px] text-brand-warm-gray block truncate">logistics@eventiq.edu</span>
            </button>
          </div>
        </div>

        {/* Authentication Error Banner */}
        {authError && (
          <div className="p-3.5 bg-brand-red/10 border border-brand-red/30 rounded-xl flex items-start gap-2.5 text-xs text-brand-red font-medium">
            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-brand-red" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1" noValidate>
          <Input
            label="Institutional Email"
            type="email"
            placeholder="admin@eventiq.edu"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
            <label className="flex items-center gap-2 text-brand-warm-gray cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleChange('rememberMe', e.target.checked)}
                className="rounded border-brand-beige text-brand-burgundy focus:ring-brand-burgundy"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="font-semibold text-brand-burgundy hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full h-12 text-base">
            {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}
          </Button>
        </form>

        <div className="text-center text-sm text-brand-warm-gray pt-4 border-t border-brand-beige">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-brand-burgundy hover:underline ml-1">
            Create Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Information Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/60 backdrop-blur-xs font-outfit">
          <div className="bg-brand-ivory border border-brand-beige rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-burgundy/10 text-brand-burgundy">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-brand-espresso text-base">Password Recovery</h4>
            </div>
            <p className="text-xs text-brand-espresso/80 leading-relaxed">
              Use any of the quick demo account credentials (e.g., <code className="font-bold">EventIQ@123</code>) to sign in to your workspace.
            </p>
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setShowForgotModal(false)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthFormLayout>
  );
};

export default LoginPage;
