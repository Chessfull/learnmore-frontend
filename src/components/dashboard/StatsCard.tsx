'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { Flame, Quote, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserStats {
  total_xp: number;
  level: number;
  lessons_completed: number;
  current_streak: number;
  longest_streak: number;
  success_rate: number;
  global_rank: number;
}

interface DailyQuote {
  quote: string;
  author: string;
}

export function StatsCard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user stats
        const statsResponse = await api.get('/progress/stats');
        setStats(statsResponse.data.data);

        // Fetch daily quote (optional - graceful fallback)
        try {
          const quoteResponse = await api.get('/content/daily-quote');
          setQuote(quoteResponse.data.data);
        } catch (quoteError) {
          console.warn('Daily quote not available:', quoteError);
          // Fallback quote
          setQuote({
            quote: 'The journey of a thousand miles begins with a single step.',
            author: 'Lao Tzu',
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <GlassCard padding="lg" glow="cyan" className="h-full">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="lg" glow="cyan" className="h-full flex flex-col">
      <div className="space-y-4 flex-1">
        {/* Your Current Rank */}
        <StatItem
          icon={<Trophy className="w-5 h-5" />}
          label="Your Current Rank"
          value={stats ? `#${stats.global_rank}` : 'N/A'}
          color="cyan"
        />

        {/* Your Current Score */}
        <StatItem
          icon={<Zap className="w-5 h-5" />}
          label="Your Current Score"
          value={stats ? `${stats.total_xp} XP` : '0 XP'}
          color="purple"
        />

        {/* Current Streak */}
        <StatItem
          icon={<Flame className="w-5 h-5" />}
          label="Current Streak"
          value={stats ? `${stats.current_streak} 🔥 days` : '0 days'}
          color="green"
        />

        {/* Today's Quote */}
        {quote && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-start gap-2 mb-2">
              <Quote className="w-4 h-4 text-[#8b5cf6] shrink-0 mt-1" />
              <span className="text-xs font-medium text-white/70">Today&apos;s Quote</span>
            </div>
            <div className="daily-quote">
              <p className="text-sm italic text-white/80 leading-relaxed">{quote.quote}</p>
              {quote.author && (
                <p className="mt-2 text-xs text-white/50">— {quote.author}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: 'cyan' | 'purple' | 'green';
}

function StatItem({ icon, label, value, color = 'cyan' }: StatItemProps) {
  const colorClasses = {
    cyan: 'bg-[#00d4ff]/10 text-[#00d4ff]',
    purple: 'bg-[#8b5cf6]/10 text-[#8b5cf6]',
    green: 'bg-[#00ff88]/10 text-[#00ff88]',
  };

  return (
    <div className="stat-item">
      <div className={`stat-icon ${colorClasses[color]}`}>{icon}</div>
      <div className="flex-1">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

