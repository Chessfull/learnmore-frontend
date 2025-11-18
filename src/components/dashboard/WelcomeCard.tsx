'use client';

import { useAuthStore } from '@/store/authStore';
import { Sparkles } from 'lucide-react';

export function WelcomeCard() {
  const { user } = useAuthStore();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-[#00d4ff]" />
        <h2 className="text-2xl font-bold bg-linear-to-r from-[#00d4ff] to-[#8b5cf6] bg-clip-text text-transparent">
          Welcome back, {user?.display_name || 'Space Explorer'}!
        </h2>
      </div>
      <p className="text-white/60 text-sm">I hope you have a wonderful day.</p>
    </div>
  );
}

