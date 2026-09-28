import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthFormLayout from '../../components/auth/AuthFormLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useEventIQ } from '../../context/EventIQContext';
import { CheckCircle2 } from 'lucide-react';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useEventIQ();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    role: 'PARTICIPANT',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Institutional email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization/Institution name is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup({
        fullName: formData.fullName,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        password: formData.password,
      });
      setSubmittedSuccess(true);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <AuthFormLayout
      brandHeadline="Join EventIQ Workspace"
      brandSubtext="Start planning, managing, and optimizing smarter institutional events."
    >
      <div className="space-y-6 max-w-md mx-auto w-full font-outfit">
        <div className="space-y-2">
          <Badge variant="burgundy" size="sm">
            Institutional Registration
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight">
            Create your Account
          </h1>
          <p className="text-sm text-brand-warm-gray leading-relaxed">
            Register your organization for EventIQ workspace access.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="p-6 bg-brand-olive/15 border border-brand-olive/30 rounded-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-olive/20 text-brand-olive flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-brand-espresso text-base">
                Demo Account Created Successfully
              </h3>
              <p className="text-xs text-brand-warm-gray leading-relaxed">
                Your demo registration for <strong className="text-brand-espresso">{formData.organization}</strong> is active.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="w-full h-11"
              >
                Go to EventIQ Dashboard →
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2" noValidate>
            <Input
              label="Full Name"
              placeholder="Dr. Eleanor Vance"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              error={errors.fullName}
              required
            />

            <Input
              label="Institutional Email"
              type="email"
              placeholder="eleanor.vance@university.edu"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-brand-espresso">
                I am joining as
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full rounded-xl border border-brand-beige bg-brand-ivory px-3 py-2.5 text-sm text-brand-espresso outline-none ring-0 transition focus:border-brand-burgundy"
              >
                <option value="PARTICIPANT">Participant</option>
                <option value="FACULTY">Faculty / Staff</option>
                <option value="ADMIN">Admin</option>
                <option value="LOGISTICS">Logistics</option>
              </select>
            </div>

            <Input
              label="Organization / Institution"
              placeholder="State University Department"
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              error={errors.organization}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-brand-warm-gray cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                  className="rounded border-brand-beige text-brand-burgundy focus:ring-brand-burgundy"
                />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs font-medium text-brand-red">{errors.agreeTerms}</p>
              )}
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 text-base">
              Create Demo Account
            </Button>
          </form>
        )}

        <div className="text-center text-sm text-brand-warm-gray pt-4 border-t border-brand-beige">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-burgundy hover:underline ml-1">
            Sign In
          </Link>
        </div>
      </div>
    </AuthFormLayout>
  );
};

export default SignupPage;
