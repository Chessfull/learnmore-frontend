'use client';

import { useTypewriter } from '@/hooks/useTypewriter';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function WelcomeCard() {
  const { user } = useAuthStore();
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const visitKey = `user_${user.id}_first_visit`;
      const hasVisited = localStorage.getItem(visitKey);
      
      if (!hasVisited) {
        setIsFirstVisit(true);
        localStorage.setItem(visitKey, 'true');
      }
    }
  }, [user?.id]);

  const welcomeText = isFirstVisit
    ? `Welcome to the club, ${user?.display_name || 'Space Explorer'}!`
    : `Welcome back, ${user?.display_name || 'Space Explorer'}!`;
  
  const { displayText } = useTypewriter(welcomeText, 60);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#00d4ff]/10 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/logo/logo.png"
            alt="Learn More Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {displayText}
          <span className="animate-pulse ml-1">|</span>
        </h2>
      </div>
      <p className="text-white/60 text-sm pl-13">
        {isFirstVisit 
          ? "Let's start your adventure in space! 🚀"
          : "Ready to explore your cosmic journey?"}
      </p>
    </div>
  );
}

