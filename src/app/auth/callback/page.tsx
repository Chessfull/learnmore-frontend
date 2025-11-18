'use client';

import { SpaceLoading } from '@/components/ui/SpaceLoading';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get tokens from URL params
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const userDataParam = searchParams.get('user');

        // Check for error in URL
        const error = searchParams.get('error');
        if (error) {
          console.error('OAuth error:', error);
          router.push('/?error=oauth_failed');
          return;
        }

        // Validate tokens
        if (!accessToken || !refreshToken) {
          console.error('Missing tokens in OAuth callback');
          router.push('/?error=missing_tokens');
          return;
        }

        // Store tokens
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // Parse and store user data if available
        if (userDataParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userDataParam));
            setUser(userData);
          } catch (e) {
            console.error('Failed to parse user data:', e);
          }
        }

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.push('/?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
      <SpaceLoading message="Completing authentication..." />
    </div>
  );
}

