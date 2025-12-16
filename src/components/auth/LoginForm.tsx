'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OAuthButtons } from './OAuthButtons';

export function LoginForm() {
  const router = useRouter();
  const { login, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (error: any) {
      setApiError(error.message || 'Login failed. Please check your credentials.');
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
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={errors.password}
        leftIcon={<Lock className="w-5 h-5" />}
        disabled={isLoading}
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))}
            className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-0"
            disabled={isLoading}
          />
          <span className="text-sm text-white/70">Remember me</span>
        </label>
        <a
          href="#forgot-password"
          className="text-sm text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('show-forgot-password'));
          }}
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Sign In
      </Button>

      {/* OAuth Buttons */}
      <OAuthButtons isLoading={isLoading} />
    </form>
  );
}

