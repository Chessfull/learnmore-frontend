'use client';

import { SpaceLoading } from '@/components/ui/SpaceLoading';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <SpaceLoading fullScreen message="Loading lesson..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="lesson-layout">
      {children}
    </div>
  );
}

