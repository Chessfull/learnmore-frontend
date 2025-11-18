'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useAuthStore } from '@/store/authStore';
import { Sparkles } from 'lucide-react';

export function WelcomeMessage() {
  const { user } = useAuthStore();
  const username = user?.display_name || 'Captain';

  const text = `Welcome captain ${username}!\n\nPlease select which language you want to discover from right!\n\nYou can preview your roadmap by hovering on the related planet!`;

  const { displayText, isComplete } = useTypewriter(text, 40);

  return (
    <GlassCard padding="lg" glow="purple" className="h-full">
      <div className="flex items-start gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-[#8b5cf6] shrink-0 mt-1 animate-pulse" />
        <h2 className="text-xl font-bold text-white">Mission Briefing</h2>
      </div>

      <div className="welcome-text">
        {displayText.split('\n').map((line, i) => (
          <p key={i} className="mb-4 last:mb-0 text-white/90 leading-relaxed">
            {line.split(username).map((part, j, arr) => (
              <span key={j}>
                {part}
                {j < arr.length - 1 && (
                  <span className="username-highlight">{username}</span>
                )}
              </span>
            ))}
          </p>
        ))}
        {!isComplete && <span className="typewriter-cursor" />}
      </div>
    </GlassCard>
  );
}

