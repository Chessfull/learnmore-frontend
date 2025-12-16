'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { Lock, Mail, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OAuthButtons } from './OAuthButtons';
import { TermsModal } from './TermsModal';

export function RegisterForm() {
  const router = useRouter();
  const { register, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    clearError();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.displayName);
      router.push('/dashboard');
    } catch (error: any) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (apiError) setApiError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* API Error Message */}
      {apiError && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl">
          <p className="text-sm text-red-400">{apiError}</p>
        </div>
      )}

      {/* Display Name Input */}
      <Input
        label="Display Name"
        type="text"
        placeholder="John Doe"
        value={formData.displayName}
        onChange={(e) => handleInputChange('displayName', e.target.value)}
        error={errors.displayName}
        leftIcon={<User className="w-5 h-5" />}
        disabled={isLoading}
      />

      {/* Email Input */}
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        leftIcon={<Mail className="w-5 h-5" />}
        disabled={isLoading}
      />

      {/* Password Input */}
      <Input
        label="Password"
        type="password"
        placeholder="Minimum 8 characters"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={errors.password}
        leftIcon={<Lock className="w-5 h-5" />}
        disabled={isLoading}
      />

      {/* Confirm Password Input */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        leftIcon={<Lock className="w-5 h-5" />}
        disabled={isLoading}
      />

      {/* Terms Checkbox */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, acceptTerms: e.target.checked }));
              if (errors.acceptTerms) {
                setErrors((prev) => ({ ...prev, acceptTerms: '' }));
              }
            }}
            className="w-4 h-4 mt-0.5 rounded border-white/10 bg-white/5 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-0"
            disabled={isLoading}
          />
          <span className="text-sm text-white/70">
            I agree to the{' '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsTermsModalOpen(true);
              }}
              className="text-[#00d4ff] hover:text-[#00d4ff]/80 underline transition-colors"
            >
              Terms and Conditions
            </button>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1.5 text-sm text-red-500">{errors.acceptTerms}</p>
        )}
      </div>

      {/* Terms Modal */}
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />

      {/* Submit Button */}
      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Create Account
      </Button>

      {/* OAuth Buttons */}
      <OAuthButtons isLoading={isLoading} />
    </form>
  );
}

