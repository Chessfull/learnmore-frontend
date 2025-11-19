'use client';

import { useTypewriter } from '@/hooks/useTypewriter';
import { useAuthStore } from '@/store/authStore';
import { Rocket } from 'lucide-react';

export function WelcomeCard() {
  const { user } = useAuthStore();
  const welcomeText = `Welcome back, ${user?.display_name || 'Space Explorer'}!`;
  const { displayText } = useTypewriter(welcomeText, 60);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-[#00d4ff]" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {displayText}
          <span className="animate-pulse ml-1">|</span>
        </h2>
      </div>
      <p className="text-white/60 text-sm pl-13">Ready to continue your cosmic journey?</p>
    </div>
  );
}

