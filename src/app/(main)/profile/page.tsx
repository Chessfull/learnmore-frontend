'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { getAvatarUrl, getUserInitials } from '@/lib/utils/avatar';
import { useAuthStore } from '@/store/authStore';
import { Award, Calendar, Camera, Code, Flame, Trophy, Upload, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ActivityData {
  date: string;
  lessons_completed: number;
  challenges_completed: number;
  xp_earned: number;
  time_spent_minutes: number;
  submissions_count: number;
}

interface Achievement {
  achievement: {
    id: string;
    key: string;
    title: string;
    description: string;
    icon: string;
    type: string;
    rarity: string;
    xp_reward: number;
  };
  progress: number;
  target: number;
  is_completed: boolean;
  completed_at?: string;
  progress_percent: number;
}

interface TechStackProgress {
  tech_stack: string;
  tech_stack_display: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  total_xp: number;
  average_score: number;
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

const TECH_STACK_COLORS: Record<string, string> = {
  GO: '#00d4ff',
  PYTHON: '#8b5cf6',
  JAVASCRIPT: '#00ff88',
  JAVA: '#ffd700',
  CSHARP: '#ff6b9d',
};

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [techStackProgress, setTechStackProgress] = useState<TechStackProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user stats
      const statsRes = await api.get('/progress/stats');
      const statsData = statsRes.data.data;

      // Fetch achievements
      const achievementsRes = await api.get('/achievements/user');
      const achievementsData = achievementsRes.data.data?.achievements || [];

      // Fetch activity history (last 365 days)
      const activityRes = await api.get('/users/activity-history?days=365');
      const activityDataRes = activityRes.data.data || [];

      // Fetch tech stack progress
      const techStackRes = await api.get('/users/tech-stack-progress');
      const techStackData = techStackRes.data.data || [];

      setStats({
        total_xp: statsData.total_xp || 0,
        level: statsData.level || 1,
        current_streak: statsData.current_streak || 0,
        longest_streak: statsData.longest_streak || 0,
        completed_lessons: statsData.lessons_completed || 0,
        completed_challenges: statsData.challenges_completed || 0,
        achievements_count: Array.isArray(achievementsData) 
          ? achievementsData.filter((a: Achievement) => a.is_completed).length 
          : 0,
      });

      setActivityData(Array.isArray(activityDataRes) ? activityDataRes : []);
      setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
      setTechStackProgress(Array.isArray(techStackData) ? techStackData : []);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please upload a JPG or PNG image');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user avatar in store
      if (user) {
        setUser({
          ...user,
          avatar: response.data.data.avatar_url,
        });
      }

      setShowAvatarOptions(false);
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!confirm('Are you sure you want to delete your avatar?')) return;

    try {
      setIsUploadingAvatar(true);
      await api.delete('/users/avatar');

      // Update user avatar in store
      if (user) {
        setUser({
          ...user,
          avatar: '',
        });
      }

      setShowAvatarOptions(false);
      alert('Avatar deleted successfully!');
    } catch (error) {
      console.error('Failed to delete avatar:', error);
      alert('Failed to delete avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Generate activity calendar (last 365 days)
  const generateActivityCalendar = () => {
    const weeks: Array<{date: string; count: number}[]> = [];
    const today = new Date();
    const days: Array<{date: string; count: number}> = [];

    // Create a map for quick lookup
    const activityMap = new Map(
      activityData.map(a => [a.date, a.lessons_completed + a.challenges_completed])
    );

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
      });
    }

    // Group by weeks (7 days)
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
  const recentAchievements = achievements.filter(a => a.is_completed).slice(0, 3);

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
            {/* Avatar with Upload */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center">
                {getAvatarUrl(user?.avatar) ? (
                  <img
                    src={getAvatarUrl(user?.avatar)!}
                    alt={user?.display_name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {getUserInitials(user?.display_name || '')}
                  </span>
                )}
              </div>
              
              {/* Avatar upload button */}
              <button
                onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#00d4ff] rounded-full flex items-center justify-center hover:bg-[#00b8e6] transition-colors shadow-lg"
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Avatar options menu */}
              {showAvatarOptions && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#0a0f1c]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl py-2 z-50">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </button>
                  {user?.avatar && (
                    <button
                      onClick={handleAvatarDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-white/5 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Remove Photo
                    </button>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.display_name}
              </h1>
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

          {activityData.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-2">No activity yet</p>
              <p className="text-sm text-white/40">
                Start learning to see your progress here
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </GlassCard>

        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <GlassCard padding="lg" glow="cyan">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#00d4ff]" />
              <h2 className="text-xl font-bold text-white">Recent Achievements</h2>
            </div>
            
            {recentAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-1">No achievements yet</p>
                <p className="text-sm text-white/40">
                  Complete lessons and challenges to unlock achievements
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAchievements.map((userAchievement) => (
                  <div
                    key={userAchievement.achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-3xl">{userAchievement.achievement.icon}</span>
                    <div className="flex-1">
                      <div className="text-white font-medium">{userAchievement.achievement.title}</div>
                      <div className="text-sm text-white/60">{userAchievement.achievement.description}</div>
                    </div>
                    <div className="text-[#ffd700] text-sm font-medium">
                      +{userAchievement.achievement.xp_reward} XP
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Learning Progress */}
          <GlassCard padding="lg" glow="purple">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-[#8b5cf6]" />
              <h2 className="text-xl font-bold text-white">Learning Progress</h2>
            </div>
            
            {techStackProgress.length === 0 ? (
              <div className="text-center py-8">
                <Code className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-1">No progress yet</p>
                <p className="text-sm text-white/40">
                  Start a course to track your progress
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {techStackProgress.map((progress) => (
                  <div key={progress.tech_stack}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">{progress.tech_stack_display}</span>
                      <span className="text-white">
                        {progress.progress_percent.toFixed(0)}% 
                        <span className="text-white/50 ml-2">
                          ({progress.completed_lessons}/{progress.total_lessons})
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${progress.progress_percent}%`,
                          backgroundColor: TECH_STACK_COLORS[progress.tech_stack] || '#00d4ff'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
