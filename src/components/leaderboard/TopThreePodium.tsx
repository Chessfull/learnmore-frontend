'use client';

import api from '@/lib/api';
import { Crown } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PodiumUser {
  rank: number;
  display_name: string;
  avatar?: string;
  total_xp: number;
  level: number;
}

export function TopThreePodium() {
  const [topThree, setTopThree] = useState<PodiumUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopThree = async () => {
      try {
        const response = await api.get('/leaderboard/global?limit=3');
        setTopThree(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch top 3:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopThree();
  }, []);

  if (isLoading) {
    return (
      <div className="podium-container">
        <div className="text-white/50">Loading podium...</div>
      </div>
    );
  }

  if (topThree.length === 0) {
    return (
      <div className="podium-container">
        <div className="text-white/50">No rankings yet</div>
      </div>
    );
  }

  const [first, second, third] = topThree;

  return (
    <div className="podium-container">
      <h2 className="podium-title">🎖️ Hall of Fame</h2>
      
      <div className="podium">
        {/* Second Place */}
        {second && (
          <div className="podium-place podium-2nd">
            <div className="podium-avatar-wrapper">
              <span className="podium-medal">🥈</span>
              {second.avatar ? (
                <Image
                  src={second.avatar}
                  alt={second.display_name}
                  width={80}
                  height={80}
                  className="podium-avatar"
                />
              ) : (
                <div className="podium-avatar bg-[#c0c0c0]/20 flex items-center justify-center text-2xl font-bold">
                  {second.display_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="podium-platform">
              <div className="podium-name">{second.display_name}</div>
              <div className="podium-level">Level {second.level}</div>
              <div className="podium-xp">{second.total_xp.toLocaleString()} XP</div>
            </div>
          </div>
        )}

        {/* First Place */}
        {first && (
          <div className="podium-place podium-1st">
            <div className="podium-avatar-wrapper">
              <Crown className="podium-crown" />
              {first.avatar ? (
                <Image
                  src={first.avatar}
                  alt={first.display_name}
                  width={100}
                  height={100}
                  className="podium-avatar"
                />
              ) : (
                <div className="podium-avatar bg-[#ffd700]/20 flex items-center justify-center text-3xl font-bold">
                  {first.display_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="podium-platform">
              <div className="podium-name">{first.display_name}</div>
              <div className="podium-level">Level {first.level}</div>
              <div className="podium-xp">{first.total_xp.toLocaleString()} XP</div>
            </div>
          </div>
        )}

        {/* Third Place */}
        {third && (
          <div className="podium-place podium-3rd">
            <div className="podium-avatar-wrapper">
              <span className="podium-medal">🥉</span>
              {third.avatar ? (
                <Image
                  src={third.avatar}
                  alt={third.display_name}
                  width={80}
                  height={80}
                  className="podium-avatar"
                />
              ) : (
                <div className="podium-avatar bg-[#cd7f32]/20 flex items-center justify-center text-2xl font-bold">
                  {third.display_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="podium-platform">
              <div className="podium-name">{third.display_name}</div>
              <div className="podium-level">Level {third.level}</div>
              <div className="podium-xp">{third.total_xp.toLocaleString()} XP</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

