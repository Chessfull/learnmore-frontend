'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState(''); // For development mode

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      const data = response.data.data;
      
      setEmailSent(true);
      toast.success('Password reset instructions sent to your email!');

      // In development, show the token
      if (data.reset_token) {
        setDevToken(data.reset_token);
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to send reset email. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl">
          <p className="text-green-400 text-sm text-center">
            ✅ Check your email for password reset instructions!
          </p>
        </div>

        {devToken && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl">
            <p className="text-yellow-400 text-xs mb-2 font-semibold">🔧 DEV MODE - Reset Token:</p>
            <code className="text-xs text-white/70 break-all block bg-black/20 p-2 rounded">
              {devToken}
            </code>
            <p className="text-xs text-white/50 mt-2">
              Copy this token and use it on the reset password page
            </p>
          </div>
        )}

        <Button 
          variant="secondary" 
          className="w-full" 
          onClick={onBack}
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">Forgot Password?</h3>
        <p className="text-white/60 text-sm">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        error={error}
        leftIcon={<Mail className="w-5 h-5" />}
        disabled={isLoading}
      />

      <div className="flex gap-3">
        <Button 
          type="button"
          variant="secondary" 
          className="flex-1" 
          onClick={onBack}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          className="flex-1" 
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </div>
    </form>
  );
}

