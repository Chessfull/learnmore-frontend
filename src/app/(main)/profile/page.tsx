'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Award, Calendar, Code, Flame, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ActivityData {
  date: string;
  count: number;
}

interface UserStats {
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  completed_lessons: number;
  completed_challenges: number;
  achievements_count: number;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user stats
        const statsRes = await api.get('/progress/stats');
        const statsData = statsRes.data.data;

        setStats({
          total_xp: statsData.total_xp || 0,
          level: statsData.level || 1,
          current_streak: statsData.current_streak || 0,
          longest_streak: statsData.longest_streak || 0,
          completed_lessons: statsData.lessons_completed || 0,
          completed_challenges: 0, // TODO: Add this to backend
          achievements_count: 0, // TODO: Add this to backend
        });

        // Generate mock activity data for now (TODO: implement backend endpoint)
        const mockActivity: ActivityData[] = [];
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          // Random activity count (0-15)
          const count = Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0;
          mockActivity.push({ date: dateStr, count });
        }
        setActivityData(mockActivity);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Generate last 365 days activity calendar
  const generateActivityCalendar = () => {
    const weeks: ActivityData[][] = [];
    const today = new Date();
    const days: ActivityData[] = [];

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const activity = activityData.find((a) => a.date === dateStr);
      days.push({
        date: dateStr,
        count: activity?.count || 0,
      });
    }

    // Group by weeks
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-white/5';
    if (count <= 2) return 'bg-[#00d4ff]/20';
    if (count <= 5) return 'bg-[#00d4ff]/40';
    if (count <= 10) return 'bg-[#00d4ff]/60';
    return 'bg-[#00d4ff]/80';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const weeks = generateActivityCalendar();

  return (
    <div className="relative min-h-screen bg-[#0a0f1c] p-6 lg:p-8 overflow-hidden">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-6">
        {/* Profile Header */}
        <GlassCard padding="lg" glow="cyan">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {user?.display_name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.display_name}
              </h1>
              <p className="text-white/60">@{user?.username}</p>
              <p className="text-white/60">{user?.email}</p>
            </div>

            {/* Level Badge */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#00d4ff]/10 border-2 border-[#00d4ff] flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#00d4ff]">
                  {stats?.level || 1}
                </span>
                <span className="text-xs text-white/60">Level</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard padding="md" glow="purple">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats?.total_xp.toLocaleString() || 0}
                </div>
                <div className="text-sm text-white/60">Total XP</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard padding="md" glow="green">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#00ff88]/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats?.current_streak || 0} 🔥
                </div>
                <div className="text-sm text-white/60">Day Streak</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard padding="md" glow="cyan">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                <Code className="w-6 h-6 text-[#00d4ff]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats?.completed_challenges || 0}
                </div>
                <div className="text-sm text-white/60">Challenges</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard padding="md" glow="purple">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#ffd700]/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#ffd700]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats?.achievements_count || 0}
                </div>
                <div className="text-sm text-white/60">Achievements</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Activity Calendar */}
        <GlassCard padding="lg" glow="purple">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#8b5cf6]" />
              <h2 className="text-xl font-bold text-white">Activity Calendar</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${
                      level === 0 ? 'bg-white/5' :
                      level === 1 ? 'bg-[#00d4ff]/20' :
                      level === 2 ? 'bg-[#00d4ff]/40' :
                      level === 3 ? 'bg-[#00d4ff]/60' :
                      'bg-[#00d4ff]/80'
                    }`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(day.count)} hover:ring-2 hover:ring-[#00d4ff] transition-all cursor-pointer`}
                      title={`${day.date}: ${day.count} activities`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-white/60">
            {stats?.completed_lessons || 0} lessons completed in the last year
          </div>
        </GlassCard>

        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <GlassCard padding="lg" glow="cyan">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#00d4ff]" />
              <h2 className="text-xl font-bold text-white">Recent Achievements</h2>
            </div>
            <div className="space-y-3">
              {[
                { icon: '🎯', title: 'First Steps', description: 'Complete your first lesson' },
                { icon: '🔥', title: '7-Day Streak', description: 'Learn for 7 days in a row' },
                { icon: '💯', title: 'Perfect Score', description: 'Get 100% on a challenge' },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <div className="text-white font-medium">{achievement.title}</div>
                    <div className="text-sm text-white/60">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Learning Progress */}
          <GlassCard padding="lg" glow="purple">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-[#8b5cf6]" />
              <h2 className="text-xl font-bold text-white">Learning Progress</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Go</span>
                  <span className="text-white">65%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00d4ff] rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Python</span>
                  <span className="text-white">45%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">JavaScript</span>
                  <span className="text-white">30%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00ff88] rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* CSS Stars */}
      <style jsx>{`
        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent);
          background-size: 250px 250px;
          animation: twinkle 5s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

